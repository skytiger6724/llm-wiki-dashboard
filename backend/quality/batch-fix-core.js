#!/usr/bin/env node
/**
 * Wiki 批量修復 - 輕量版
 * 只修復核心目錄（System + Wiki 層），避免超時
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const BACKUP_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend/wiki-backup';
const REPORT_DIR = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend';

// 直接指定完整路徑（擴展版：包含 Raw 原始資料）
const TARGET_PATHS = [
  '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/01_System_系統層',
  '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/02_Raw_原始資料',
  '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層'
];

const FAKE_PATTERNS = [/^來源\s*\d*$/, /^Entity\s*Name$/i, /^file:/i, /^example\.com/i, /^memory:/i, /^A$/, /^B$/];

const TYPE_KW = {
  entity: ['實體', 'Entity', '人物', '專案', '庫', '檔案'],
  concept: ['概念', 'Concept', '模式', '方法', '策略'],
  summary: ['摘要', 'Summary', '總結', '報告'],
  crystallized: ['結晶', 'Crystallized', '精華', '總綱'],
  raw: ['Raw', '原始', 'Gist', 'Article']
};

let stats = { total: 0, skipped: 0, fixed: 0, fake: 0, error: 0 };
const fixedPages = [];
const fakePages = [];

function isFake(name) { return FAKE_PATTERNS.some(p => p.test(name)); }

function inferType(name, content, relPath) {
  const lp = relPath.toLowerCase();
  if (lp.includes('entity') || lp.includes('實體')) return 'entity';
  if (lp.includes('concept') || lp.includes('概念')) return 'concept';
  if (lp.includes('summary') || lp.includes('摘要')) return 'summary';
  if (lp.includes('crystallized') || lp.includes('結晶')) return 'crystallized';
  const lc = content.toLowerCase();
  for (const [type, kws] of Object.entries(TYPE_KW)) {
    for (const kw of kws) {
      if (lc.includes(kw.toLowerCase()) || name.toLowerCase().includes(kw.toLowerCase())) return type;
    }
  }
  return 'concept';
}

function generateFM(fileName, content, filePath, wlCount) {
  const type = inferType(fileName, content, path.relative(WIKI_ROOT, filePath));
  const decayMap = { entity: 0.2, concept: 0.1, summary: 0.3, crystallized: 0.1, raw: 0.5 };
  const confMap = { entity: 3, concept: 3, summary: 2, crystallized: 4, raw: 2 };
  let conf = confMap[type] || 2;
  if (wlCount >= 5) conf = Math.min(5, conf + 1);
  if (wlCount >= 10) conf = Math.min(5, conf + 1);
  
  const wikilinks = (content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g) || []).map(m => m.replace(/\[\[([^\]|]+).*/, '$1').trim());
  const sources = [...new Set(wikilinks)].slice(0, 3);
  const sourcesYaml = sources.length > 0 ? sources.map(s => `  - "[[${s.replace(/"/g, '\\"')}]]"`).join('\n') : '  - "[[Index]]"';
  const today = new Date().toISOString().split('T')[0];
  const folder = path.relative(WIKI_ROOT, filePath).split('/')[1] || 'Wiki';
  
  return `---
title: "${fileName.replace(/[_-]+/g, ' ')}"
type: "${type}"
tier: 1
confidence: ${conf}
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
    
    if (isFake(fileName)) { stats.fake++; fakePages.push({ name: fileName, path: relPath }); return; }
    
    stats.total++;
    if (content.trim().startsWith('---')) { stats.skipped++; return; }
    
    const wlCount = (content.match(/\[\[.*?\]\]/g) || []).length;
    
    // 備份
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const backupPath = path.join(BACKUP_DIR, relPath.replace(/\//g, '_'));
    if (!fs.existsSync(backupPath)) { fs.writeFileSync(backupPath, content, 'utf-8'); }
    
    // 修復
    const fm = generateFM(fileName, content, filePath, wlCount);
    fs.writeFileSync(filePath, fm + '\n\n' + content, 'utf-8');
    
    stats.fixed++;
    const type = inferType(fileName, content, relPath);
    let conf = type === 'crystallized' ? 4 : type === 'concept' ? 3 : 2;
    if (wlCount >= 5) conf = Math.min(5, conf + 1);
    fixedPages.push({ name: fileName, path: relPath, type, confidence: conf, wikilinks: wlCount });
  } catch (e) { stats.error++; }
}

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
      processFile(fullPath);
    }
  }
}

// 主流程
console.log('🔧 開始批量修復（核心目錄版）...');
console.log(`📂 知識庫: ${WIKI_ROOT}`);
console.log(`🎯 目標目錄: ${TARGET_PATHS.length} 個`);
console.log('');

const startTime = Date.now();

// 直接掃描目標路徑
for (const targetPath of TARGET_PATHS) {
  if (fs.existsSync(targetPath)) {
    console.log(`📁 處理: ${path.basename(targetPath)}`);
    scanDir(targetPath);
  } else {
    console.log(`⚠️  不存在: ${targetPath}`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log('\n========================================');
console.log('📊 批量修復總結');
console.log('========================================');
console.log(`⏱️  總耗時: ${elapsed}秒`);
console.log(`📁 總頁面數: ${stats.total}`);
console.log(`✅ 已有 front matter: ${stats.skipped}`);
console.log(`🔧 已修復: ${stats.fixed}`);
console.log(`🗑️  假節點: ${stats.fake}`);
console.log(`❌ 錯誤: ${stats.error}`);
console.log('========================================');

if (fixedPages.length > 0) {
  console.log('\n📋 修復頁面 Top 20:');
  fixedPages.slice(0, 20).forEach(p => {
    console.log(`   ${p.name} → type: ${p.type}, conf: ${p.confidence}, wl: ${p.wikilinks}`);
  });
  if (fixedPages.length > 20) console.log(`   ... 及其他 ${fixedPages.length - 20} 個`);
}

if (fakePages.length > 0) {
  console.log(`\n⚠️  假節點 (${fakePages.length} 個):`);
  fakePages.slice(0, 10).forEach(p => console.log(`   ${p.name}`));
}

// 保存報告
const report = {
  timestamp: new Date().toISOString(),
  elapsed: parseFloat(elapsed),
  stats,
  fixedPages: fixedPages.slice(0, 100),
  fakePages: fakePages.slice(0, 50)
};
const reportPath = path.join(REPORT_DIR, 'batch-fix-core-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📝 報告: ${reportPath}`);
console.log('========================================');
