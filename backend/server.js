const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫/20_LLM_Wiki';

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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 LLM Wiki 知識庫 API 啟動於 http://localhost:${PORT}`);
});
