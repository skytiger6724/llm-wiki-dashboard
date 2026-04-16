#!/usr/bin/env node
/**
 * 重複實體合併工具
 * 合併命名規範不同的同一實體
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';

// 合併規則：{ 保留名稱: [要合併的名稱, ...] }
const MERGE_RULES = {
    'Index': ['index'],
    'LLM_Wiki': ['LLM Wiki'],
    'Dynasafe_Accenture_AI研究報告摘要': ['Dynasafe_Accenture AI研究報告摘要'],
    'Dynasafe_Nvidia_FSI論壇摘要': ['Dynasafe_Nvidia FSI論壇摘要'],
    'Dynasafe_Cisco_Live_精華摘要': ['Dynasafe_Cisco Live_精華摘要'],
    'LLM_Wiki_V2_戰略結晶': ['LLM_Wiki_v2_戰略結晶', 'LLM Wiki V2 戰略結晶'],
    'Agentic_AI': ['Agentic AI'],
    'Karpathy_Guidelines': ['karpathy-guidelines'],
};

function normalizeName(name) {
    return name.toLowerCase().replace(/[_-\s]+/g, ' ').trim();
}

let stats = { found: 0, merged: 0, skipped: 0, errors: 0 };

function findAndMerge() {
    const merged = [];

    for (const [keepName, mergeNames] of Object.entries(MERGE_RULES)) {
        for (const mergeName of mergeNames) {
            // 查找要合併的檔案
            let mergePath = null;
            let keepPath = null;

            function scanDir(dir) {
                if (!fs.existsSync(dir)) return;
                const items = fs.readdirSync(dir);
                for (const item of items) {
                    if (item === '.DS_Store' || item.startsWith('.') || item === '.obsidian') continue;
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        scanDir(fullPath);
                    } else if (item.endsWith('.md')) {
                        const nameWithoutExt = item.replace('.md', '');
                        if (normalizeName(nameWithoutExt) === normalizeName(mergeName)) {
                            mergePath = fullPath;
                        }
                        if (normalizeName(nameWithoutExt) === normalizeName(keepName)) {
                            keepPath = fullPath;
                        }
                    }
                }
            }

            scanDir(WIKI_ROOT);

            if (!mergePath) {
                stats.skipped++;
                continue;
            }

            stats.found++;

            if (keepPath) {
                // 兩者都存在，合併內容並刪除重複
                try {
                    const keepContent = fs.readFileSync(keepPath, 'utf-8');
                    const mergeContent = fs.readFileSync(mergePath, 'utf-8');

                    // 如果保留檔案已經有 merge 的內容（wikilinks 相同），直接刪除重複
                    const mergeLinks = (mergeContent.match(/\[\[.*?\]\]/g) || []).sort();
                    const keepLinks = (keepContent.match(/\[\[.*?\]\]/g) || []).sort();

                    if (JSON.stringify(mergeLinks) === JSON.stringify(keepLinks) || mergeLinks.every(l => keepLinks.includes(l))) {
                        // 內容重複，直接刪除
                        fs.unlinkSync(mergePath);
                        merged.push({ action: 'deleted', from: mergeName, to: keepName, path: mergePath });
                        stats.merged++;
                    } else {
                        // 內容不同，追加到保留檔案
                        const appendContent = `\n\n---\n\n# 合併自: ${mergeName}\n\n${mergeContent.split('\n').filter(l => !l.startsWith('---') && !l.startsWith('title:') && !l.startsWith('type:') && !l.startsWith('tier:') && !l.startsWith('confidence:') && !l.startsWith('decay:') && !l.startsWith('last_') && !l.startsWith('sources:') && !l.startsWith('contradictions:') && !l.startsWith('tags:') && !l.startsWith('created:') && !l.startsWith('updated:')).join('\n')}`;
                        fs.appendFileSync(keepPath, appendContent, 'utf-8');
                        fs.unlinkSync(mergePath);
                        merged.push({ action: 'merged', from: mergeName, to: keepName, path: mergePath });
                        stats.merged++;
                    }
                } catch (e) {
                    stats.errors++;
                    merged.push({ action: 'error', from: mergeName, to: keepName, error: e.message });
                }
            } else {
                // 只有合併目標存在，直接改名
                const dir = path.dirname(mergePath);
                const ext = path.extname(mergePath);
                const newFileName = keepName.replace(/[_-\s]+/g, '_') + ext;
                const newPath = path.join(dir, newFileName);

                try {
                    fs.renameSync(mergePath, newPath);
                    merged.push({ action: 'renamed', from: mergeName, to: keepName, fromPath: mergePath, toPath: newPath });
                    stats.merged++;
                } catch (e) {
                    stats.errors++;
                    merged.push({ action: 'error', from: mergeName, to: keepName, error: e.message });
                }
            }
        }
    }

    return merged;
}

// 執行
console.log('🔄 開始合併重複實體...');
const merged = findAndMerge();

console.log('\n========================================');
console.log('📊 合併總結');
console.log('========================================');
console.log(`📁 找到重複: ${stats.found}`);
console.log(`✅ 已合併: ${stats.merged}`);
console.log(`⏭️  已跳過: ${stats.skipped}`);
console.log(`❌ 錯誤: ${stats.errors}`);
console.log('========================================');

if (merged.length > 0) {
    console.log('\n📋 合併詳情:');
    merged.forEach((m, i) => {
        console.log(`   ${i + 1}. [${m.action}] ${m.from} → ${m.to}`);
        if (m.path) console.log(`      路徑: ${m.path}`);
    });
}

// 保存報告
const report = {
    timestamp: new Date().toISOString(),
    stats,
    merged
};
const reportPath = path.join(__dirname, 'merge-duplicates-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📝 詳細報告: ${reportPath}`);
console.log('========================================');
