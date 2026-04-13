#!/usr/bin/env python3
"""
掃描 Wiki/Output 目錄變更，自動寫入 KM_changelog.md
"""
import os
import sys
import json
import time
from datetime import datetime

WIKI_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層'
OUTPUT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/04_Output_產出層'
CHANGELOG_PATH = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/02_Raw_原始資料/Assets/KM_changelog.md'
STATE_DIR = '/tmp/llm-wiki-scan-state.json'

def get_state():
    if os.path.exists(STATE_DIR):
        with open(STATE_DIR) as f:
            return json.load(f)
    return {}

def scan_files(base_dir):
    """掃描目錄下所有 .md 檔案，回傳 {path: mtime}"""
    files = {}
    if not os.path.exists(base_dir):
        return files
    for root, dirs, filenames in os.walk(base_dir):
        if '.obsidian' in root or '.git' in root:
            continue
        for f in filenames:
            if f.endswith('.md') and not f.startswith('.'):
                fp = os.path.join(root, f)
                files[fp] = os.path.getmtime(fp)
    return files

def find_changes(state, current):
    """找出新增或修改的檔案"""
    changes = []
    for path, mtime in current.items():
        if path not in state or state[path] < mtime:
            rel_path = path.replace('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/', '')
            # 判斷類型
            if 'Summaries_摘要' in path:
                ftype = '📝 摘要'
            elif 'Entities_實體' in path:
                ftype = '🏛️ 實體'
            elif 'Concepts_概念' in path:
                ftype = '💡 概念'
            elif 'Synthesis_綜合' in path:
                ftype = '🔬 綜合'
            elif 'Output' in path:
                ftype = '📤 產出'
            else:
                ftype = '📄 文件'
            changes.append((ftype, rel_path))
    return changes

def append_changelog(changes):
    """寫入 changelog"""
    if not changes:
        return False
    
    now = datetime.now()
    title = f'{now.strftime("%Y-%m-%d")} — 自動掃描發現 {len(changes)} 個變更'
    
    # 提取摘要
    affected = [c[1] for c in changes]
    type_counts = {}
    for t, _ in changes:
        type_counts[t] = type_counts.get(t, 0) + 1
    summary_parts = [f'{v} {k}' for k, v in type_counts.items()]
    summary = ' · '.join(summary_parts)
    
    entry = f"""
## {title}

### 摘要
- {summary}

### 影響檔案
{chr(10).join(f'- `{a}`' for a in affected[:10])}

### 詳細
- 自動掃描 `03_Wiki_知識層` 與 `04_Output_產出層` 發現變更
- 共 {len(changes)} 個檔案新增或修改

---
"""
    
    if os.path.exists(CHANGELOG_PATH):
        with open(CHANGELOG_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        # 在第一個 --- 之後插入
        parts = content.split('---', 1)
        if len(parts) == 2:
            new_content = parts[0] + '---' + entry + parts[1]
        else:
            new_content = content + entry
    else:
        os.makedirs(os.path.dirname(CHANGELOG_PATH), exist_ok=True)
        new_content = f'# KM Changelog — 知識庫變更記錄\n\n> 此檔案由 LLM Wiki Compiler 自動維護\n\n---\n{entry}\n'
    
    with open(CHANGELOG_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

def update_state(current):
    with open(STATE_DIR, 'w') as f:
        json.dump(current, f)

def main():
    state = get_state()
    wiki_files = scan_files(WIKI_DIR)
    output_files = scan_files(OUTPUT_DIR)
    current = {**wiki_files, **output_files}
    
    changes = find_changes(state, current)
    if changes:
        append_changelog(changes)
        update_state(current)
        print(f'✅ 已寫入 {len(changes)} 個變更到 KM_changelog.md')
        for t, p in changes:
            print(f'  {t} {p}')
    else:
        print('✅ 無新變更')
    
    # 返回 JSON 供 API 使用
    print(json.dumps({
        'changes': len(changes),
        'files': [{'type': t, 'path': p} for t, p in changes]
    }))

if __name__ == '__main__':
    main()
