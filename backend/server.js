const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫/20_LLM_Wiki';

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
        // 排除隱藏檔與 Mac 的煩人小怪獸 .DS_Store
        if (item === '.DS_Store' || item.startsWith('.')) continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            result.push({
                name: item,
                type: 'dir',
                path: fullPath,
                children: getTree(fullPath)
            });
        } else if (item.endsWith('.md') || item.endsWith('.txt')) {
            result.push({
                name: item,
                type: 'file',
                path: fullPath
            });
        }
    }
    return result;
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 LLM Wiki 知識庫 API 啟動於 http://localhost:${PORT}`);
});
