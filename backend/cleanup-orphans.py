#!/usr/bin/env python3
"""
===================================
孤立節點清理工具
===================================

掃描 graph-data.json，移除沒有任何入連或出連的孤立節點。
同時從這些孤立節點中移除指向不存在目標的連結。

使用方法：
    python3 cleanup-orphans.py [--dry-run] [--remove-files]
"""

import json
import os
import argparse
from collections import Counter

WIKI_BASE = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫'
GRAPH_PATH = '/Users/dwaynejohnson/Documents/llm-wiki-app/backend/graph-data.json'

def main():
    parser = argparse.ArgumentParser(description='清理 LLM Wiki 圖譜中的孤立節點')
    parser.add_argument('--dry-run', action='store_true', help='僅預覽，不實際修改')
    parser.add_argument('--remove-files', action='store_true', help='同時刪除孤立節點的原始檔案（危險！）')
    args = parser.parse_args()

    with open(GRAPH_PATH, 'r') as f:
        data = json.load(f)

    nodes = data.get('nodes', [])
    links = data.get('links', [])

    print(f'📊 原始圖譜: {len(nodes)} 節點, {len(links)} 連結')

    # 計算入連和出連
    incoming = Counter()
    outgoing = Counter()
    for l in links:
        src = l['source'] if isinstance(l['source'], str) else l['source'].get('name', '')
        tgt = l['target'] if isinstance(l['target'], str) else l['target'].get('name', '')
        incoming[tgt] += 1
        outgoing[src] += 1

    # 找出孤立節點（無入連 + 無出連）
    orphan_names = set()
    for n in nodes:
        name = n['name']
        if incoming.get(name, 0) == 0 and outgoing.get(name, 0) == 0:
            orphan_names.add(name)

    print(f'🔍 發現 {len(orphan_names)} 個孤立節點')

    # 分類統計
    cats = Counter()
    for n in nodes:
        if n['name'] in orphan_names:
            cats[n.get('category', 'unknown')] += 1

    print('\n📁 孤立節點按類別分佈:')
    for cat, count in cats.most_common():
        print(f'   {cat}: {count} 個')

    # 找出連結中有指向孤立節點的
    links_to_remove = []
    for i, l in enumerate(links):
        src = l['source'] if isinstance(l['source'], str) else l['source'].get('name', '')
        tgt = l['target'] if isinstance(l['target'], str) else l['target'].get('name', '')
        if src in orphan_names or tgt in orphan_names:
            links_to_remove.append(i)

    if links_to_remove:
        print(f'\n🔗 發現 {len(links_to_remove)} 條連結指向孤立節點（將一併移除）')

    # 檢查孤立節點的實體檔案
    file_paths = []
    for n in nodes:
        if n['name'] in orphan_names:
            path = n.get('path', '')
            if path:
                for prefix in ['02_Raw_原始資料/', '03_Wiki_知識層/', '04_Output_產出層/', '01_System_系統層/']:
                    full = os.path.join(WIKI_BASE, path.replace(prefix, prefix.split('/')[0] + '/'))
                    # Build correct path
                    parts = path.split('/', 1)
                    if len(parts) == 2:
                        full = os.path.join(WIKI_BASE, parts[0], parts[1])
                        if os.path.exists(full):
                            file_paths.append(full)
                            break

    print(f'\n📄 對應實體檔案: {len(file_paths)} 個')

    if args.dry_run:
        print('\n🔎 [Dry Run] 不會實際修改任何檔案')
        return

    # 執行清理
    new_nodes = [n for n in nodes if n['name'] not in orphan_names]
    new_links = [l for i, l in enumerate(links) if i not in links_to_remove]

    # 驗證
    new_names = {n['name'] for n in new_nodes}
    valid_links = [l for l in new_links
                   if (l['source'] if isinstance(l['source'], str) else l['source'].get('name', '')) in new_names
                   and (l['target'] if isinstance(l['target'], str) else l['target'].get('name', '')) in new_names]

    data['nodes'] = new_nodes
    data['links'] = valid_links
    data['count'] = len(new_nodes)

    # 備份
    backup_path = GRAPH_PATH + '.backup'
    with open(backup_path, 'w') as f:
        json.dump({'nodes': nodes, 'links': links, 'count': len(nodes)}, f)
    print(f'\n💾 已備份原始圖譜到: {backup_path}')

    # 寫入
    with open(GRAPH_PATH, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'\n✅ 清理完成:')
    print(f'   節點: {len(nodes)} → {len(new_nodes)} (移除 {len(nodes) - len(new_nodes)})')
    print(f'   連結: {len(links)} → {len(valid_links)} (移除 {len(links) - len(valid_links)})')

    # 如果要求刪除檔案
    if args.remove_files and file_paths:
        print(f'\n⚠️  準備刪除 {len(file_paths)} 個原始檔案...')
        for fp in file_paths:
            try:
                os.remove(fp)
                print(f'   🗑️  已刪除: {fp}')
            except Exception as e:
                print(f'   ❌ 刪除失敗: {fp} ({e})')
    else:
        print(f'\n📄 實體檔案未刪除（共 {len(file_paths)} 個，加 --remove-files 可刪除）')

if __name__ == '__main__':
    main()
