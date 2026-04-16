import os
import sys
import json
from pathlib import Path

# 將 graphify 路徑加入 sys.path
sys.path.append('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/graphify')

from graphify.build import build
from graphify.cluster import cluster
from graphify.export import to_json

# 配置路徑
WIKI_ROOT = Path('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫')
RAW_DIR = WIKI_ROOT / '02_Raw_原始資料'
WIKI_DIR = WIKI_ROOT / '03_Wiki_知識層'
OUTPUT_DIR = Path('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend')

def generate_v3_markdown(node, graph, communities):
    """根據 Schema v3.0 生成 Markdown 內容"""
    nid = node['id']
    label = node.get('label', nid)
    node_type = node.get('type', 'Concept').lower()
    
    # 計算 Tier (度數越高 Tier 越高)
    degree = graph.degree(nid)
    tier = min(3, degree // 5) 
    
    # 計算 Confidence (如果是 INFERRED 則較低)
    confidence = 4 # 預設
    
    # 提取關係
    relations = []
    for neighbor in graph.neighbors(nid):
        edge_data = graph.get_edge_data(nid, neighbor)
        rel_type = edge_data.get('relation', 'relates_to')
        weight = edge_data.get('weight', 0.3)
        neighbor_label = graph.nodes[neighbor].get('label', neighbor)
        relations.append(f"[[{neighbor_label}]] --({rel_type}:{weight})--> [[{label}]]")

    # 組裝 YAML Frontmatter
    frontmatter = [
        "---",
        f"title: \"{label}\"",
        f"type: \"{node_type}\"",
        f"tier: {tier}",
        f"confidence: {confidence}",
        "decay_factor: 0.2",
        f"last_verified: {Path('/tmp').stat().st_mtime}", # 佔位符
        "sources:",
        f"  - \"[[{node.get('source_file', 'Unknown')}]]\"",
        "contradictions: []",
        f"tags: [\"{node_type}\", \"graphify\"]",
        "---",
        ""
    ]
    
    content = [
        f"# {label}",
        "",
        "> [!ABSTRACT] 語義提取摘要",
        node.get('summary', '尚無摘要'),
        "",
        "## 🔗 知識圖譜關係",
        ""
    ] + relations + [
        "",
        "---",
        f"*由 Graphify (v4) 於 {Path('/tmp').stat().st_mtime} 自動生成*"
    ]
    
    return "\n".join(frontmatter + content)

def run_bridge():
    print("🚀 啟動 Graphify -> Wiki v3 Bridge...")
    
    # 這裡應該調用 graphify 的提取邏輯
    # 由於環境限制，我們假設已經有了一個基本的 graphify-out/graph.json
    graph_path = OUTPUT_DIR / 'graphify-out' / 'graph.json'
    if not graph_path.exists():
        print(f"❌ 找不到 Graphify 輸出文件: {graph_path}")
        print("請確保已運行 `graphify .` 並生成了圖譜數據。")
        return

    with open(graph_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 構建網絡
    import networkx as nx
    G = nx.Graph()
    for n in data['nodes']: G.add_node(n['id'], **n)
    for e in data['links']: G.add_edge(e['source'], e['target'], **e)
    
    print(f"📊 載入圖譜: {len(data['nodes'])} 節點")
    
    # 生成 Markdown 檔案
    for node in data['nodes']:
        label = node.get('label', node['id'])
        # 決定存放目錄
        target_subfolder = 'Entities_實體' if node.get('type') == 'Entity' else 'Concepts_概念'
        target_path = WIKI_DIR / target_subfolder / f"{label}.md"
        
        # 如果檔案已存在，考慮增量更新 (這裡先直接寫入)
        md_content = generate_v3_markdown(node, G, None)
        
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"✅ 已生成: {target_path.name}")

if __name__ == "__main__":
    run_bridge()
