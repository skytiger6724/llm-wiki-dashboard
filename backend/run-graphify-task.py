import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# 將 graphify 路徑加入 sys.path
sys.path.append('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/graphify')

# 加載 .env 配置
load_dotenv('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend/.env')

import networkx as nx

# 配置
WIKI_ROOT = Path('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫')
OUTPUT_DIR = Path('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend')

# 掃描目標
SCAN_PATHS = [
    "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫",
    "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe",
    "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫"
]

def find_all_md_files():
    files = []
    for p in SCAN_PATHS:
        path = Path(p)
        if not path.exists(): continue
        # 遞迴尋找 .md，過濾 .obsidian 和 03_Wiki_知識層 (避免循環編譯)
        for f in path.rglob('*.md'):
            if '.obsidian' in str(f) or '03_Wiki_知識層' in str(f):
                continue
            files.append(str(f))
    return files

def run_full_extraction():
    files = find_all_md_files()
    print(f"🔍 偵測到 {len(files)} 個待編譯 Markdown 檔案...")
    
    extractions = []
    # 這裡我們模擬全量提取邏輯
    # 在實際高併發環境下，這會調用 Ollama 進行批量語義提取
    for f in files:
        path = Path(f)
        nid = path.stem.lower().replace('-', '_').replace(' ', '_')
        
        # 提取核心實體
        node = {
            "id": nid,
            "label": path.stem,
            "type": "Entity" if "Dynasafe" in str(path) or "工作" in str(path) else "Concept",
            "summary": f"自動掃描自: {path.name}",
            "source_file": path.name
        }
        
        # 建立語義連結 (建立與所屬目錄的關係)
        parent_name = path.parent.name
        edge = {
            "source": nid,
            "target": parent_name.lower().replace(' ', '_'),
            "relation": "belongs_to",
            "weight": 0.7
        }
        
        extractions.append({"nodes": [node], "edges": [edge]})
    
    # 構建全域圖譜
    G = nx.Graph()
    for ext in extractions:
        for n in ext['nodes']: G.add_node(n['id'], **n)
        for e in ext['edges']: G.add_edge(e['source'], e['target'], **e)
    
    print(f"📊 全量編譯完成: {len(G.nodes())} 節點, {len(G.edges())} 語義連結")
    
    # 寫入圖譜數據
    out_path = OUTPUT_DIR / 'graphify-out'
    out_path.mkdir(parents=True, exist_ok=True)
    
    graph_data = {
        "nodes": [ { "id": nid, **G.nodes[nid] } for nid in G.nodes ],
        "links": [ { "source": u, "target": v, **G.get_edge_data(u, v) } for u, v in G.edges ]
    }
    
    with open(out_path / 'graph.json', 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 全量圖譜已存入: {out_path / 'graph.json'}")

if __name__ == "__main__":
    run_full_extraction()
