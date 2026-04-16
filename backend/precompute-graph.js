#!/usr/bin/env node
/**
 * 預計算圖譜數據
 * 掃描知識庫中的所有 Markdown 檔案，提取 wikilink 並生成圖譜數據
 * 按照 Karpathy LLM Wiki 邏輯：wikilinks 是知識關聯的核心
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const OUTPUT_FILE = path.join(__dirname, 'graph-data.json');

function scanMarkdownFiles(dirPath) {
    const nodeMap = new Map();    // name -> node info
    const wikilinks = {};          // source -> [targets]
    const linksSet = new Set();    // dedup link pairs
    const links = [];

    // 1. 收集所有存在的檔案節點（跳過 Conversation 對話紀錄）
    function collectFiles(currentPath) {
        const items = fs.readdirSync(currentPath);
        for (const item of items) {
            if (item.startsWith('.') || item === '.DS_Store') continue;
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                collectFiles(fullPath);
            } else if (item.endsWith('.md')) {
                // 永久過濾：跳過 AI 對話紀錄（這些是 Raw 資料，不應該成為圖譜節點）
                if (item.includes('Conversation_')) continue;
                const name = item.replace('.md', '');
                const parts = fullPath.split('/');
                // 找出層級和類別
                let layer = '';
                let category = '';
                for (const p of parts) {
                    if (/^\d+_/.test(p)) layer = p;
                }
                category = parts[parts.length - 2] || '';
                
                // Wiki v2.0: 提取元數據 (Confidence, Decay, Crystallized)
                let confidence = 3;
                let decay_factor = 0.2;
                let isCrystallized = fullPath.includes('05_Crystallized');
                
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const yamlMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
                    if (yamlMatch) {
                        const yamlStr = yamlMatch[1];
                        const confMatch = yamlStr.match(/confidence:\s*(\d+)/);
                        if (confMatch) confidence = parseInt(confMatch[1]);
                        const decayMatch = yamlStr.match(/decay_factor:\s*([\d.]+)/);
                        if (decayMatch) decay_factor = parseFloat(decayMatch[1]);
                    }
                } catch (e) {}

                if (!nodeMap.has(name)) {
                    nodeMap.set(name, {
                        name,
                        path: fullPath,
                        category,
                        layer: layer.replace(/^\d+/, ''),
                        links: 0,
                        confidence,
                        decay_factor,
                        isCrystallized
                    });
                }
            }
        }
    }

    collectFiles(dirPath);

    // 2. 提取所有 wikilinks（同樣跳過 Conversation 檔案）
    function extractWikilinks(currentPath) {
        const items = fs.readdirSync(currentPath);
        for (const item of items) {
            if (item.startsWith('.') || item === '.DS_Store') continue;
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                extractWikilinks(fullPath);
            } else if (item.endsWith('.md')) {
                // 跳過 AI 對話紀錄（不提取 wikilinks）
                if (item.includes('Conversation_')) continue;
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const sourceName = item.replace('.md', '');
                    
                    // 提取 [[...]] wikilinks，支援 Wiki v2.0 的語義權重格式 [[A]] --(關係:權重)--> [[B]]
                    const wikilinkRegex = /\[\[(.+?)\]\]/g;
                    // 同時匹配語義權重標註
                    const weightedLinkRegex = /\[\[(.+?)\]\]\s*--\((.+?):([\d.]+)\)-->\s*\[\[(.+?)\]\]/g;
                    
                    let match;
                    const targets = [];
                    
                    // 先處理語義加權連結
                    while ((match = weightedLinkRegex.exec(content)) !== null) {
                        const source = match[1].trim().split('|')[0];
                        const relation = match[2].trim();
                        const weight = parseFloat(match[3]);
                        const target = match[4].trim().split('|')[0];
                        
                        if (source === sourceName && target) {
                            targets.push(target);
                            const linkKey = `${sourceName}→${target}`;
                            if (!linksSet.has(linkKey)) {
                                linksSet.add(linkKey);
                                links.push({ source: sourceName, target, strength: weight, relation });
                                updateNodeLinks(sourceName, target);
                            }
                        }
                    }

                    // 再處理一般 wikilinks
                    wikilinkRegex.lastIndex = 0;
                    while ((match = wikilinkRegex.exec(content)) !== null) {
                        const raw = match[1].trim();
                        const target = raw.split('|')[0].trim();
                        
                        if (target && target !== sourceName) {
                            const linkKey = `${sourceName}→${target}`;
                            if (!linksSet.has(linkKey)) {
                                targets.push(target);
                                linksSet.add(linkKey);
                                links.push({ source: sourceName, target, strength: 1 });
                                updateNodeLinks(sourceName, target);
                            }
                        }
                    }
                    
                    if (targets.length > 0) {
                        wikilinks[sourceName] = Array.from(new Set(targets));
                    }
                } catch (e) {
                    console.error(`⚠️  讀取檔案失敗: ${fullPath}`, e.message);
                }
            }
        }
    }

    function updateNodeLinks(sourceName, target) {
        if (!nodeMap.has(target)) {
            nodeMap.set(target, {
                name: target,
                path: '',
                category: 'unknown',
                layer: 'unknown',
                links: 0,
                confidence: 1,
                decay_factor: 0.5,
                isCrystallized: false
            });
        }
        const srcNode = nodeMap.get(sourceName);
        const tgtNode = nodeMap.get(target);
        if (srcNode) srcNode.links++;
        if (tgtNode) tgtNode.links++;
    }

    extractWikilinks(dirPath);

    return {
        nodes: Array.from(nodeMap.values()),
        links,
        wikilinks,
        count: nodeMap.size,
        totalWikilinks: Object.values(wikilinks).reduce((sum, arr) => sum + arr.length, 0),
    };
}

console.log('🔍 開始掃描知識庫...');
let graphData = scanMarkdownFiles(ROOT_DIR);

// 自動過濾孤立節點（沒有任何 wikilink 連入或連出的節點）
// 這些通常是 Raw 資料文件，不屬於知識網絡
const linkSources = new Set();
const linkTargets = new Set();
for (const l of graphData.links) {
    linkSources.add(l.source);
    linkTargets.add(l.target);
}
const connected = new Set([...linkSources, ...linkTargets]);
const beforeCount = graphData.count;
graphData.nodes = graphData.nodes.filter(n => connected.has(n.name));
graphData.count = graphData.nodes.length;
const removed = beforeCount - graphData.count;
if (removed > 0) {
    console.log(`🧹 已過濾 ${removed} 個孤立節點（無任何 wikilink 連線）`);
}

console.log(`📊 掃描完成:`);
console.log(`   節點: ${graphData.count}`);
console.log(`   連結: ${graphData.links.length}`);
console.log(`   Wikilinks: ${graphData.totalWikilinks}`);
console.log(`   有連結的檔案: ${Object.keys(graphData.wikilinks).length}`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graphData, null, 2));
console.log(`✅ 圖譜數據已保存到: ${OUTPUT_FILE}`);
