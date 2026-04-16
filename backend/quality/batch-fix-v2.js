#!/usr/bin/env node
/**
 * Wiki 批量修復與質量改進 v2
 * 優化版：跳過大型目錄，避免超時
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const BACKUP_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend/wiki-backup';
const REPORT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend';

// 跳過大型神秘學目錄（這些通常有數百個自動生成的文件）
const SKIP_DIRS = ['神秘學_書籍', '神秘學_PDF', '神秘學_EPUB', '神秘學_塔羅全書', '神秘學_魔法全書', '神秘學_占星全書'];

// 假節點模式
const FAKE_PATTERNS = [/^來源\s*\d*$/, /^Entity\s*Name$/i, /^file:/i, /^example\.com/i, /^memory:/i];

// 類型關鍵字
const TYPE_KW = {
  entity: ['實體', 'Entity', '人物', '專案', '庫', '檔案'],
  concept: ['概念', 'Concept', '模式', '方法', '策略'],
  summary: ['摘要', 'Summary', '總結', '報告'],
  crystallized: ['結晶', 'Crystallized', '精華', '總綱'],
  raw: ['Raw', '原始', 'Gist', 'Article']
};

let stats = { total: 0, skipped: 0, fixed: 0, fake: 0, error: 0, backupCreated: 0 };
const fixedPages = [];
const fakePages = [];
const errors = [];

function shouldSkip(dirName) {
  return SKIP_DIRS.some(skip => dirName.includes(skip));
}

function isFakeNode(name) {
  return FAKE_PATTERNS.some(p => p.test(name));
}

function inferType(name, content, relPath) {
  const lp = relPath.toLowerCase();
  if (lp.includes('entity') || lp.includes('實體')) return 'entity';
  if (lp.includes('concept') || lp.includes('概念')) return 'concept';
  if (lp.includes('summary') || lp.includes('摘要')) return 'summary';
  if (lp.includes('crystallized') || lp.includes('結晶')) return 'crystallized';
  if (lp.includes('raw') || lp.includes('原始')) return 'raw';
  
  const lc = content.toLowerCase();
  for (const [type, kws] of Object.entries(TYPE_KW)) {
    for (const kw of kws) {
      if (lc.includes(kw.toLowerCase()) || name.toLowerCase().includes(kw.toLowerCase())) return type;
    }
  }
  return 'concept';
}

function generateFM(fileName, content, filePath, wikilinkCount) {
  const type = inferType(fileName, content, filePath);
  const decayMap = { entity: 0.2, concept: 0.1, summary: 0.3, crystallized: 0.1, raw: 0.5 };
  const confMap = { entity: 3, concept: 3, summary: 2, crystallized: 4, raw: 2 };
  
  let confidence = confMap[type] || 2;
  if (wikilinkCount >= 5) confidence = Math.min(5, confidence + 1);
  if (wikilinkCount >= 10) confidence = Math.min(5, confidence + 1);
  
  // 提取來源（前3個 wikilinks）
  const wikilinks = (content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g) || []).map(m => m.replace(/\[\[([^\]|]+).*/, '$1').trim());
  const sources = [...new Set(wikilinks)].slice(0, 3);
  const sourcesYaml = sources.length > 0 
    ? sources.map(s => `  - "[[${s.replace(/"/g, '\\"')}]]"`).join('\n')
    : '  - "[[Index]]"';
  
  const today = new Date().toISOString().split('T')[0];
  const relPath = path.relative(WIKI_ROOT, filePath);
  const folder = relPath.split('/')[1] || 'Wiki';
  
  return `---
title: "${fileName.replace(/[_-]+/g, ' ')}"
type: "${type}"
tier: 1
confidence: ${confidence}
decay_factor: ${decayMap[type] || 0.3}
last_verified: ${today}
sources:
${sourcesYaml}
contradictions: []
tags: ["${type}", "${folder}"]
created: ${today}
updated: ${today}
---`;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    const relPath = path.relative(WIKI_ROOT, filePath);
    
    // 假節點
    if (isFakeNode(fileName)) {
      stats.fake++;
      fakePages.push({ name: fileName, path: relPath });
      return;
    }
    
    stats.total++;
    
    // 已有 front matter
    if (content.trim().startsWith('---')) {
      stats.skipped++;
      return;
    }
    
    // 需要修復
    const wikilinkCount = (content.match(/\[\[.*?\]\]/g) || []).length;
    
    // 備份
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const backupPath = path.join(BACKUP_DIR, relPath.replace(/\//g, '_'));
    fs.writeFileSync(backupPath, content, 'utf-8');
    stats.backupCreated++;
    
    // 生成並寫入 front matter
    const fm = generateFM(fileName, content, filePath, wikilinkCount);
    const newContent = fm + '\n\n' + content;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    stats.fixed++;
    const type = inferType(fileName, content, relPath);
    let confidence = type === 'crystallized' ? 4 : type === 'concept' ? 3 : 2;
    if (wikilinkCount >= 5) confidence = Math.min(5, confidence + 1);
    
    fixedPages.push({ name: fileName, path: relPath, type, confidence, wikilinks: wikilinkCount });
    
    if (stats.fixed % 50 === 0) {
      console.log(`  進度: ${stats.total} 頁面處理, ${stats.fixed} 已修復, ${stats.fake} 假節點, ${stats.backupCreated} 備份`);
    }
  } catch (e) {
    stats.error++;
    errors.push({ file: path.basename(filePath), error: e.message });
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === '.DS_Store' || item.startsWith('.') || item === '.obsidian') continue;
    if (shouldSkip(item)) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (item.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

// 主流程
console.log('🔧 開始批量修復 Wiki 頁面...');
console.log(`📂 知識庫: ${WIKI_ROOT}`);
console.log(`⏭️  跳過目錄: ${SKIP_DIRS.join(', ')}`);
console.log('');

const startTime = Date.now();
scanDir(WIKI_ROOT);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

// 總結
console.log('\n========================================');
console.log('📊 批量修復總結');
console.log('========================================');
console.log(`⏱️  總耗時: ${elapsed}秒`);
console.log(`📁 總頁面數: ${stats.total}`);
console.log(`✅ 已有 front matter: ${stats.skipped}`);
console.log(`🔧 已修復: ${stats.fixed}`);
console.log(`🗑️  假節點: ${stats.fake}`);
console.log(`💾 備份創建: ${stats.backupCreated}`);
console.log(`❌ 錯誤: ${stats.error}`);
console.log('========================================');

if (fixedPages.length > 0) {
  console.log('\n📋 修復頁面 Top 10:');
  fixedPages.slice(0, 10).forEach(p => {
    console.log(`   ${p.name} → type: ${p.type}, confidence: ${p.confidence}, wikilinks: ${p.wikilinks}`);
  });
  if (fixedPages.length > 10) console.log(`   ... 及其他 ${fixedPages.length - 10} 個`);
}

if (fakePages.length > 0) {
  console.log(`\n⚠️  假節點 (${fakePages.length} 個):`);
  fakePages.slice(0, 10).forEach(p => console.log(`   ${p.name} (${p.path})`));
  if (fakePages.length > 10) console.log(`   ... 及其他 ${fakePages.length - 10} 個`);
}

// 保存報告
const report = {
  timestamp: new Date().toISOString(),
  elapsed: parseFloat(elapsed),
  stats,
  fixedPages: fixedPages.slice(0, 100),
  fakePages: fakePages.slice(0, 50),
  errors: errors.slice(0, 20),
  summary: {
    totalProcessed: stats.total,
    totalFixed: stats.fixed,
    fixRate: stats.total > 0 ? Math.round(stats.fixed / stats.total * 100) : 0,
    fakeCount: stats.fake,
    backupCount: stats.backupCreated
  }
};

const reportPath = path.join(REPORT_DIR, 'batch-fix-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📝 詳細報告: ${reportPath}`);
console.log(`💾 備份目錄: ${BACKUP_DIR}`);
console.log('========================================');
