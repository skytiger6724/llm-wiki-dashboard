const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
const LOCAL_GRAPH_FILE = path.join(__dirname, 'graph-data.json');
const GRAPHIFY_OUT = path.join(__dirname, 'graphify-out/graph.json');

// ============================================================
// 非阻塞重試工具函數 (針對 OneDrive -11 錯誤進行極致優化)
// ============================================================
async function asyncSafeRead(fn, ...args) {
    let retries = 15; // 增加到 15 次
    let delay = 500;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn(...args);
        } catch (e) {
            if (e.errno === -11 || e.code === 'EAGAIN' || e.code === 'EBUSY') {
                console.log(`⏳ OneDrive 鎖定 (${args[0]?.toString().split('/').pop()}), 重試 ${i+1}/${retries}...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay = Math.min(delay * 1.5, 3000); // 最大延遲 3 秒
                continue;
            }
            throw e;
        }
    }
    throw new Error(`無法讀取檔案 (已重試 15 次): ${args[0]}`);
}

let GRAPH_DATA = null;
let TREE_CACHE = null;
let TREE_CACHE_TIME = 0;

// ============================================================
// 初始化：安全加載圖譜數據
// ============================================================
async function initServer() {
    console.log('📦 正在啟動深度數據轉化對接 (Graphify -> Frontend)...');
    try {
        const targetFile = fs.existsSync(GRAPHIFY_OUT) ? GRAPHIFY_OUT : LOCAL_GRAPH_FILE;
        const raw = await asyncSafeRead(fsPromises.readFile, targetFile, 'utf-8');
        let data = JSON.parse(raw);

        // 深度轉化邏輯
        if (data.nodes) {
            console.log('🔧 正在注入節點屬性與連結統計...');
            
            // 1. 確保 links 欄位名稱正確 (相容 edges)
            const links = data.links || data.edges || [];
            
            // 2. 建立連結計數器
            const linkCounts = {};
            links.forEach(l => {
                const src = l.source.id || l.source;
                const tgt = l.target.id || l.target;
                linkCounts[src] = (linkCounts[src] || 0) + 1;
                linkCounts[tgt] = (linkCounts[tgt] || 0) + 1;
            });

            // 3. 轉化節點：id -> name, 注入 links 計數
            const processedNodes = data.nodes.map(n => {
                const nodeId = n.id;
                return {
                    ...n,
                    name: n.label || nodeId, // 前端預期 name
                    id: nodeId,              // 保留 id 供 D3 連結
                    links: linkCounts[nodeId] || 0, // 注入連結數供密度計算
                    category: n.type || 'Concept',
                    layer: n.source_file ? 'Wiki' : 'Unknown'
                };
            });

            // 4. 建立 wikilinks 映射
            const wikilinks = {};
            links.forEach(l => {
                const src = l.source.id || l.source;
                const tgt = l.target.id || l.target;
                if (!wikilinks[src]) wikilinks[src] = [];
                wikilinks[src].push(tgt);
            });

            GRAPH_DATA = {
                nodes: processedNodes,
                links: links.map(l => ({
                    source: l.source.id || l.source,
                    target: l.target.id || l.target,
                    strength: l.weight || 1
                })),
                wikilinks: wikilinks,
                count: processedNodes.length,
                totalWikilinks: links.length
            };
        }

        console.log(`✅ 深度轉化完成: ${GRAPH_DATA.count} 節點, ${GRAPH_DATA.totalWikilinks} 連結`);
    } catch (e) {
        console.error('❌ 數據轉化失敗:', e.message);
    }
}



async function getTree(dirPath) {
    try {
        const items = await asyncSafeRead(fsPromises.readdir, dirPath);
        const result = [];
        for (const item of items) {
            if (item === '.DS_Store' || item.startsWith('.')) continue;
            const fullPath = path.join(dirPath, item);
            try {
                const stat = await asyncSafeRead(fsPromises.stat, fullPath);
                if (stat.isDirectory()) {
                    // 針對大規模目錄，僅掃描 3 層深度以減輕 OneDrive 壓力
                    result.push({
                        name: item,
                        type: 'dir',
                        path: fullPath,
                        children: await getTree(fullPath)
                    });
                } else if (item.endsWith('.md')) {
                    result.push({ name: item, type: 'file', path: fullPath, mtime: stat.mtime });
                }
            } catch (e) { /* 忽略個別鎖定檔案 */ }
        }
        return result.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
    } catch (e) { return []; }
}

// API 路由
app.get('/api/tree', async (req, res) => {
    if (TREE_CACHE && (Date.now() - TREE_CACHE_TIME < 60000)) return res.json(TREE_CACHE);
    TREE_CACHE = await getTree(ROOT_DIR);
    TREE_CACHE_TIME = Date.now();
    res.json(TREE_CACHE);
});

app.get('/api/km-changelog', async (req, res) => {
    try {
        const changelogPath = path.join(ROOT_DIR, '02_Raw_原始資料/Assets/KM_changelog.md');
        if (!fs.existsSync(changelogPath)) {
            return res.json({ entries: [] });
        }
        const content = await asyncSafeRead(fsPromises.readFile, changelogPath, 'utf-8');
        
        const entries = [];
        // 按 ## 分割條目，移除開頭的非 ## 內容
        const sections = content.split('\n## ');
        
        for (let i = 1; i < sections.length; i++) {
            const section = sections[i];
            const lines = section.split('\n');
            const titleLine = lines[0];
            
            // 提取摘要
            let summary = '';
            const summaryIdx = lines.findIndex(l => l.includes('### 摘要'));
            if (summaryIdx !== -1) {
                summary = lines[summaryIdx + 1]?.replace(/^- /, '') || '';
            }
            
            // 提取受影響檔案
            const affectedFiles = [];
            const filesIdx = lines.findIndex(l => l.includes('### 影響檔案'));
            if (filesIdx !== -1) {
                for (let j = filesIdx + 1; j < lines.length && lines[j].trim().startsWith('- `'); j++) {
                    affectedFiles.push(lines[j].replace(/^- `(.*?)`/, '$1').trim());
                }
            }
            
            // 判定類型
            let type = 'update';
            if (titleLine.includes('新增') || section.includes('新增')) type = 'add';
            else if (titleLine.includes('修復') || section.includes('修復')) type = 'fix';
            else if (titleLine.includes('掃描') || section.includes('掃描')) type = 'scan';
            else if (titleLine.includes('刪除') || section.includes('刪除')) type = 'remove';

            entries.push({
                title: titleLine.trim(),
                summary: summary.trim(),
                affectedFiles: affectedFiles,
                type: type,
                body: section
            });
        }
        
        res.json({ entries: entries.slice(0, 20) });
    } catch (e) {
        console.error('Changelog error:', e);
        res.json({ entries: [] });
    }
});

app.get('/api/scan-changes', async (req, res) => {
    const { exec } = require('child_process');
    exec('python3 scan-changes.py', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        // 掃描後清除 Tree 快取，以便前端抓到最新狀態
        TREE_CACHE = null;
        res.json({ success: true, output: stdout });
    });
});

app.get('/api/all-content', (req, res) => {
    if (!GRAPH_DATA) return res.status(503).json({ error: '數據加載中...' });
    res.json(GRAPH_DATA);
});

app.get('/api/content', async (req, res) => {
    try {
        const content = await asyncSafeRead(fsPromises.readFile, req.query.path, 'utf-8');
        res.send(content);
    } catch (e) { res.status(500).send(e.message); }
});

// 靜態文件
if (fs.existsSync(FRONTEND_DIST)) {
    app.use(express.static(FRONTEND_DIST));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    });
}

// 啟動監聽 (強制先初始化數據)
async function start() {
    console.log('📦 正在預載入知識圖譜數據...');
    await initServer();
    
    if (!GRAPH_DATA) {
        console.error('❌ 關鍵錯誤: 無法預載入知識圖譜，請檢查 graph.json 是否存在或被 OneDrive 鎖定。');
        // 即使失敗也啟動，避免 App 徹底打不開，但會記錄錯誤
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('\n========================================');
        console.log(`🚀 LLM Wiki Dashboard: http://localhost:${PORT}`);
        console.log(`📊 數據狀態: ${GRAPH_DATA ? 'READY (' + GRAPH_DATA.count + ' nodes)' : 'FAILED'}`);
        console.log('========================================\n');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            try {
                execSync(`lsof -ti:${PORT} | xargs kill -9`);
                setTimeout(start, 1000);
            } catch (e) { process.exit(1); }
        }
    });
}

start();

