#!/usr/bin/env node
/**
 * 預先計算 Wiki 圖譜數據，存為靜態 JSON
 * 避免每次 API 請求都讀取 1000+ 檔案
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫/20_LLM_Wiki';
const OUTPUT_FILE = path.join(__dirname, 'graph-data.json');

const wikilinkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;

function extractWikilinks(dirPath) {
    const result = {};
    let fileCount = 0;
    
    function walk(currentPath) {
        const items = fs.readdirSync(currentPath);
        for (const item of items) {
            if (item === '.DS_Store' || item.startsWith('.')) continue;
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (item.endsWith('.md')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const fileName = item.replace('.md', '');
                    const links = [];
                    let match;
                    const regex = new RegExp(wikilinkRegex.source, 'g');
                    while ((match = regex.exec(content)) !== null) {
                        links.push(match[1].trim());
                    }
                    result[fileName] = [...new Set(links)];
                    fileCount++;
                    if (fileCount % 200 === 0) {
                        process.stderr.write(`\r  處理中: ${fileCount} 檔案...`);
                    }
                } catch (e) {
                    // skip
                }
            }
        }
    }
    
    walk(dirPath);
    process.stderr.write(`\r  完成: ${fileCount} 檔案\n`);
    return result;
}

console.log('🔍 開始掃描 Wiki 知識庫...');
const wikilinks = extractWikilinks(ROOT_DIR);

const data = {
    count: Object.keys(wikilinks).length,
    wikilinks: wikilinks,
    generatedAt: new Date().toISOString()
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data));
const sizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
console.log(`✅ 圖譜數據已儲存: ${OUTPUT_FILE}`);
console.log(`   節點數: ${data.count}`);
console.log(`   檔案大小: ${sizeKB} KB`);
