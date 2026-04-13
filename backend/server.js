const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const CHANGELOG_PATH = path.join(ROOT_DIR, '02_Raw_原始資料/Assets/KM_changelog.md');

// 啟動時載入圖譜數據到記憶體，避免每次請求都讀取檔案
let GRAPH_DATA = null;
const graphFile = path.join(__dirname, 'graph-data.json');
if (fs.existsSync(graphFile)) {
    try {
        GRAPH_DATA = JSON.parse(fs.readFileSync(graphFile, 'utf-8'));
        console.log(`📊 圖譜數據已載入: ${GRAPH_DATA.count} 節點`);
    } catch (e) {
        console.error('⚠️  圖譜數據載入失敗:', e.message);
    }
}

function getTree(dirPath) {
    const items = fs.readdirSync(dirPath);
    const result = [];
    for (const item of items) {
        if (item === '.DS_Store' || item.startsWith('.')) continue;

        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            result.push({
                name: item,
                type: 'dir',
                path: fullPath,
                mtime: stat.mtime,
                children: getTree(fullPath)
            });
        } else if (item.endsWith('.md') || item.endsWith('.txt')) {
            result.push({
                name: item,
                type: 'file',
                path: fullPath,
                mtime: stat.mtime
            });
        }
    }
    
    // 按時間排序：由新到舊 (Newest First)
    return result.sort((a, b) => b.mtime - a.mtime);
}

app.get('/api/tree', (req, res) => {
    try {
        const tree = getTree(ROOT_DIR);
        res.json(tree);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/content', (req, res) => {
    try {
        const reqPath = req.query.path;
        if (!reqPath || !reqPath.startsWith(ROOT_DIR)) {
            return res.status(403).json({ error: '拒絕訪問非 LLM Wiki 目錄' });
        }
        if (!fs.existsSync(reqPath)) {
            return res.status(404).json({ error: '找不到該檔案' });
        }
        const content = fs.readFileSync(reqPath, 'utf-8');
        res.send(content);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 批量獲取所有 Markdown 檔案的 wikilink（用於圖譜分析）
// 直接返回記憶體中預載的數據
app.get('/api/all-content', (req, res) => {
    if (GRAPH_DATA) {
        res.json(GRAPH_DATA);
    } else {
        res.status(503).json({ error: '圖譜數據尚未生成，請執行 precompute-graph.js' });
    }
});

// KM Changelog — 解析 KM_changelog.md 並返回最新 N 筆變更
app.get('/api/km-changelog', (req, res) => {
    try {
        if (!fs.existsSync(CHANGELOG_PATH)) {
            return res.json({ entries: [], fileExists: false });
        }
        const raw = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
        const entries = [];
        // 解析 markdown：每個 ## 標題為一筆記錄
        const sections = raw.split(/^## /m).filter(s => s.trim());
        // 跳過第一段（通常是檔案標題 + 說明）
        const dataSections = sections.slice(1);
        for (const section of dataSections) {
            const lines = section.split('\n');
            const title = lines[0].trim();
            const body = lines.slice(1).join('\n').trim();
            // 提取 type（從標籤判斷）
            let type = 'update';
            if (body.includes('✅') || body.includes('新增')) type = 'add';
            else if (body.includes('修復') || body.includes('優化') || body.includes('優化')) type = 'fix';
            else if (body.includes('刪除') || body.includes('移除')) type = 'remove';
            // 提取影響檔案
            const affectedFiles = [];
            const fileMatches = body.match(/`([^`]+)`/g);
            if (fileMatches) {
                fileMatches.forEach(m => affectedFiles.push(m.replace(/`/g, '')));
            }
            // 提取摘要（從 ### 摘要 區塊提取）
            const summaryMatch = body.match(/### 摘要\n([\s\S]*?)(?=\n### |\n---|$)/);
            let summary = '';
            if (summaryMatch) {
                summary = summaryMatch[1].trim().replace(/\n/g, ' ').substring(0, 150);
            }
            entries.push({
                title,
                body,
                type,
                affectedFiles: affectedFiles.slice(0, 5),
                summary,
            });
        }
        // 返回最新 5 筆
        res.json({ entries: entries.slice(0, 5), total: entries.length, fileExists: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = 3001;

// ============================================================
// 新增 API 端點：相關文章、反向連結、密度熱力圖
// ============================================================

// 輔助：建立節點查找表
function buildNodeMaps() {
    if (!GRAPH_DATA || !GRAPH_DATA.nodes) return { byKey: {}, byPath: {} };
    const byKey = {};
    const byPath = {};
    for (const node of GRAPH_DATA.nodes) {
        const key = (node.id || '').toLowerCase();
        byKey[key] = node;
        if (node.path) byPath[node.path] = node;
    }
    return { byKey, byPath };
}

// 輔助：建立反向連結索引
function buildBacklinkIndex() {
    if (!GRAPH_DATA || !GRAPH_DATA.links) return {};
    const index = {};
    for (const link of GRAPH_DATA.links) {
        const targetKey = (typeof link.target === 'object' ? link.target.id : link.target).toLowerCase();
        const sourceKey = (typeof link.source === 'object' ? link.source.id : link.source).toLowerCase();
        if (!index[targetKey]) index[targetKey] = [];
        index[targetKey].push({ source: sourceKey, strength: link.strength || 1 });
    }
    return index;
}

// API: 相關文章（基於共同連結、同類別、同層級）
app.get('/api/related', (req, res) => {
    try {
        const targetPath = req.query.path;
        if (!targetPath) return res.status(400).json({ error: '缺少 path 參數' });

        const { byKey, byPath } = buildNodeMaps();
        const targetNode = byPath[targetPath] || Object.values(byKey).find(n => n.path === targetPath);
        if (!targetNode) return res.json({ related: [] });

        const targetKey = targetNode.id.toLowerCase();
        const backlinks = buildBacklinkIndex();

        // 計算每個候選節點的相似度分數
        const scores = {};
        for (const node of GRAPH_DATA.nodes) {
            const key = node.id.toLowerCase();
            if (key === targetKey) continue;

            let score = 0;

            // 1. 直接連結（最強訊號）
            const directLink = GRAPH_DATA.links.find(l => {
                const s = (typeof l.source === 'object' ? l.source.id : l.source).toLowerCase();
                const t = (typeof l.target === 'object' ? l.target.id : l.target).toLowerCase();
                return (s === targetKey && t === key) || (t === targetKey && s === key);
            });
            if (directLink) score += 10 * (directLink.strength || 1);

            // 2. 共同反向連結（共同被引用的程度）
            const targetBL = backlinks[targetKey] || [];
            const candidateBL = backlinks[key] || [];
            const targetBLSources = new Set(targetBL.map(b => b.source));
            const sharedBL = candidateBL.filter(b => targetBLSources.has(b.source));
            score += sharedBL.length * 5;

            // 3. 同類別
            if (node.category === targetNode.category) score += 3;

            // 4. 同層級
            if (node.layer === targetNode.layer) score += 2;

            // 5. 名稱詞重疊
            const targetWords = new Set(targetNode.id.toLowerCase().split(/[-_\s]+/));
            const candidateWords = new Set(node.id.toLowerCase().split(/[-_\s]+/));
            let overlap = 0;
            for (const w of candidateWords) {
                if (targetWords.has(w)) overlap++;
            }
            if (overlap > 0) score += overlap * 2;

            if (score > 0) {
                scores[key] = {
                    id: node.id,
                    name: node.id,
                    category: node.category,
                    layer: node.layer,
                    path: node.path,
                    score,
                };
            }
        }

        // 按分數排序，返回 Top 5
        const related = Object.values(scores)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        res.json({ related, total: Object.keys(scores).length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API: 反向連結（誰引用了這個節點）
app.get('/api/backlinks', (req, res) => {
    try {
        const targetPath = req.query.path;
        if (!targetPath) return res.status(400).json({ error: '缺少 path 參數' });

        const { byKey, byPath } = buildNodeMaps();
        const targetNode = byPath[targetPath] || Object.values(byKey).find(n => n.path === targetPath);
        if (!targetNode) return res.json({ backlinks: [] });

        const targetKey = targetNode.id.toLowerCase();
        const backlinks = buildBacklinkIndex();
        const sources = backlinks[targetKey] || [];

        const backlinkList = sources.map(s => {
            const node = byKey[s.source];
            return {
                id: s.source,
                name: node ? node.id : s.source,
                category: node ? node.category : 'unknown',
                layer: node ? node.layer : 'unknown',
                path: node ? node.path : '',
                strength: s.strength,
            };
        });

        res.json({ backlinks: backlinkList, total: backlinkList.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API: 知識密度熱力圖（層級 × 類別的內部連結密度）
app.get('/api/density-heatmap', (req, res) => {
    try {
        if (!GRAPH_DATA || !GRAPH_DATA.nodes || !GRAPH_DATA.links) {
            return res.json({ heatmap: [], crossLinks: 0 });
        }

        const layers = [...new Set(GRAPH_DATA.nodes.map(n => n.layer).filter(Boolean))].sort();
        const categories = [...new Set(GRAPH_DATA.nodes.map(n => n.category).filter(Boolean))].sort();

        // 計算每個層級×類別區塊的節點數和內部連結數
        const matrix = {};
        for (const layer of layers) {
            matrix[layer] = {};
            for (const cat of categories) {
                matrix[layer][cat] = { nodes: 0, internalLinks: 0, totalLinks: 0 };
            }
        }

        // 節點計數
        for (const node of GRAPH_DATA.nodes) {
            if (node.layer && node.category && matrix[node.layer] && matrix[node.layer][node.category]) {
                matrix[node.layer][node.category].nodes++;
            }
        }

        // 連結計數
        let crossLinks = 0;
        for (const link of GRAPH_DATA.links) {
            const src = typeof link.source === 'object' ? link.source : (byKey => byKey[(typeof link.source === 'string' ? link.source : link.source.id)?.toLowerCase()])({});
            const tgt = typeof link.target === 'object' ? link.target : null;

            // 重建節點資訊
            const srcNode = GRAPH_DATA.nodes.find(n => n.id.toLowerCase() === (typeof link.source === 'object' ? link.source.id : link.source).toLowerCase());
            const tgtNode = GRAPH_DATA.nodes.find(n => n.id.toLowerCase() === (typeof link.target === 'object' ? link.target.id : link.target).toLowerCase());

            if (srcNode && tgtNode && srcNode.layer && srcNode.category && tgtNode.layer && tgtNode.category) {
                if (matrix[srcNode.layer] && matrix[srcNode.layer][srcNode.category]) {
                    matrix[srcNode.layer][srcNode.category].totalLinks += (link.strength || 1);
                }
                if (matrix[tgtNode.layer] && matrix[tgtNode.layer][tgtNode.category]) {
                    matrix[tgtNode.layer][tgtNode.category].totalLinks += (link.strength || 1);
                }

                // 是否為內部連結（同一層級且同一類別）
                if (srcNode.layer === tgtNode.layer && srcNode.category === tgtNode.category) {
                    if (matrix[srcNode.layer] && matrix[srcNode.layer][srcNode.category]) {
                        matrix[srcNode.layer][srcNode.category].internalLinks += (link.strength || 1);
                    }
                } else {
                    crossLinks++;
                }
            }
        }

        // 計算密度（内部連結數 / 最大可能連結數）
        const heatmap = [];
        for (const layer of layers) {
            for (const cat of categories) {
                const n = matrix[layer][cat].nodes;
                const maxLinks = n * (n - 1);
                const density = maxLinks > 0 ? matrix[layer][cat].internalLinks / maxLinks : 0;
                heatmap.push({
                    layer,
                    category: cat,
                    nodes: n,
                    internalLinks: matrix[layer][cat].internalLinks,
                    totalLinks: matrix[layer][cat].totalLinks,
                    density: Math.min(1, density),
                });
            }
        }

        res.json({ heatmap, crossLinks, layers, categories });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 掃描 Wiki/Output 變更，自動寫入 changelog
app.get('/api/scan-changes', (req, res) => {
    try {
        const { spawnSync } = require('child_process');
        const result = spawnSync('python3', [path.join(__dirname, 'scan-changes.py')], {
            encoding: 'utf-8',
            timeout: 30000,
        });
        const output = result.stdout.trim().split('\n');
        // 最後一行是 JSON
        const jsonLine = output.pop();
        const data = JSON.parse(jsonLine);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message, changes: 0, files: [] });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 LLM Wiki 知識庫 API 啟動於 http://localhost:${PORT}`);
});
