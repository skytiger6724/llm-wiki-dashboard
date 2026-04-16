#!/usr/bin/env node
/**
 * 極簡筆記知識編譯器
 * 將極簡筆記目錄中的內容編譯到 LLM Wiki 知識層
 * 
 * 流程：
 * 1. 掃描極簡筆記目錄
 * 2. 提取實體（Entity）、概念（Concept）、摘要（Summary）
 * 3. 生成符合 Schema v3.0 的 Wiki 頁面
 * 4. 更新 Index.md
 */

const fs = require('fs');
const path = require('path');

// 路徑配置
const JIANBI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/02_Raw_原始資料/Articles/極簡筆記';
const WIKI_CONCEPTS = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層/Concepts_概念';
const WIKI_SUMMARIES = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層/Summaries_摘要';
const INDEX_PATH = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/01_System_系統層/Index.md';

const today = new Date().toISOString().split('T')[0];

// 統計
let stats = {
  total: 0,
  compiled: 0,
  skipped: 0,
  errors: 0
};

// 概念關鍵字分類
const CONCEPT_CATEGORIES = {
  'prompt': ['Prompt', '提示詞', '提示工程', 'Prompt Engineering'],
  'ai-tool': ['AI', 'LLM', 'GPT', 'Claude', 'Gemini', 'ChatGPT', 'AI 工具'],
  'workflow': ['流程', 'Workflow', 'SOP', '框架', '方法論'],
  'content': ['寫作', '內容', '文案', '文章', '寫作技巧'],
  'image': ['圖片', '圖像', '修圖', '生成', '照片'],
  'business': ['商務', '營銷', '行銷', '業務', '商業'],
  'learning': ['學習', '教學', '教育', '培訓'],
  'technical': ['技術', '代碼', '程式', 'Python', 'JavaScript']
};

/**
 * 判斷內容類型
 */
function inferCategory(fileName, content) {
  const lower = (fileName + ' ' + content).toLowerCase();
  
  for (const [cat, keywords] of Object.entries(CONCEPT_CATEGORIES)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return cat;
      }
    }
  }
  
  return 'general';
}

/**
 * 生成摘要頁面
 */
function generateSummary(fileName, content, sourcePath) {
  const relPath = path.relative(JIANBI_ROOT, sourcePath);
  const category = inferCategory(fileName, content);
  
  // 提取前 5 個關鍵事實
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
  const keyPoints = lines.slice(0, 5).map(l => l.trim()).filter(l => l.length > 10);
  
  // 提取 wikilinks
  const wikilinks = (content.match(/\[\[([^\]]+)\]\]/g) || []).map(m => m.replace('[[', '').replace(']]', ''));
  
  // 生成摘要內容
  const summary = `---
title: "極簡筆記_${fileName.replace(/\.md$/, '')}"
type: "summary"
tier: 1
confidence: 2
decay_factor: 0.5
last_verified: ${today}
sources:
  - "[[${path.basename(sourcePath, '.md')}]]"
contradictions: []
tags: ["極簡筆記", "${category}", "Prompt"]
created: ${today}
updated: ${today}
---

# 摘要：極簡筆記 — ${fileName.replace(/\.md$/, '').replace(/[_-]+/g, ' ')}

## 原始來源
- 來源：[[${path.basename(sourcePath, '.md')}]]
- 路徑：${relPath}
- 類型：Prompt 模板/筆記
- 日期：${today}

## 核心摘要
${keyPoints.length > 0 ? keyPoints.map((p, i) => `- ${p}`).join('\n') : '- 內容摘要待提取'}

## 涉及概念
${wikilinks.length > 0 ? wikilinks.map(w => `- [[${w}]]`).join('\n') : '- 待提取實體'}

## 分類
- 類別：${category}

## 參考來源
- [[${path.basename(sourcePath, '.md')}]]
`;

  return summary;
}

/**
 * 生成概念頁面
 */
function generateConcept(fileName, content, sourcePath) {
  const category = inferCategory(fileName, content);
  
  // 提取關鍵定義
  const firstLine = content.split('\n').find(l => l.trim() && !l.startsWith('#') && !l.startsWith('---') && l.trim().length > 10);
  const definition = firstLine ? firstLine.trim().substring(0, 100) : '概念定義待提取';
  
  const concept = `---
title: "極簡筆記_${fileName.replace(/\.md$/, '').replace(/[_-]+/g, '_')}"
type: "concept"
tier: 1
confidence: 2
decay_factor: 0.3
last_verified: ${today}
sources:
  - "[[${path.basename(sourcePath, '.md')}]]"
contradictions: []
tags: ["極簡筆記", "concept", "${category}"]
created: ${today}
updated: ${today}
---

# [[極簡筆記_${fileName.replace(/\.md$/, '').replace(/[_-]+/g, ' ')}]]

## 核心定義
- 這是什麼：從極簡筆記提取的概念
- 類型：${category}
- 來源：極簡筆記/${path.basename(sourcePath)}

## 關鍵內容
- ${definition}

## 參考來源
- [[${path.basename(sourcePath, '.md')}]]
`;

  return concept;
}

/**
 * 編譯單一檔案
 */
function compileFile(sourcePath) {
  try {
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const fileName = path.basename(sourcePath);
    const nameWithoutExt = fileName.replace('.md', '');
    
    stats.total++;
    
    // 跳過已經有編譯標記的檔案
    if (content.includes('type: "summary"') || content.includes('type: "concept"')) {
      stats.skipped++;
      return { action: 'skipped', name: fileName };
    }
    
    // 判斷是否為概念或摘要
    // 如果內容有明確的 Prompt 模板或框架 → 概念
    // 如果只是筆記或摘要 → 摘要
    const hasPromptTemplate = content.includes('# Role') || content.includes('# Task') || content.includes('Template');
    const isConcept = hasPromptTemplate || nameWithoutExt.includes('框架') || nameWithoutExt.includes('方法');
    
    if (isConcept) {
      const conceptContent = generateConcept(fileName, content, sourcePath);
      const outputPath = path.join(WIKI_CONCEPTS, `極簡筆記_${nameWithoutExt}.md`);
      fs.writeFileSync(outputPath, conceptContent, 'utf-8');
    } else {
      const summaryContent = generateSummary(fileName, content, sourcePath);
      const outputPath = path.join(WIKI_SUMMARIES, `極簡筆記_${nameWithoutExt}.md`);
      fs.writeFileSync(outputPath, summaryContent, 'utf-8');
    }
    
    stats.compiled++;
    return {
      action: isConcept ? 'concept' : 'summary',
      name: fileName,
      category: inferCategory(fileName, content)
    };
  } catch (e) {
    stats.errors++;
    return { action: 'error', name: path.basename(sourcePath), error: e.message };
  }
}

/**
 * 掃描目錄
 */
function scanDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === '.DS_Store' || item.startsWith('.')) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(compileFile(fullPath));
    }
  }
  
  return results;
}

/**
 * 更新 Index.md
 */
function updateIndex(results) {
  try {
    let index = fs.readFileSync(INDEX_PATH, 'utf-8');
    
    // 添加極簡筆記批次匯入記錄
    const jianbiEntry = `
## 📥 [${today}] 批次匯入：極簡筆記知識編譯
- [極簡筆記批量編譯: ${stats.compiled} 頁面]
- [概念: ${results.filter(r => r.action === 'concept').length} 個]
- [摘要: ${results.filter(r => r.action === 'summary').length} 個]
- [分類: ${[...new Set(results.filter(r => r.action !== 'error' && r.action !== 'skipped').map(r => r.category))].join(', ')}]
`;
    
    // 檢查是否已存在
    if (!index.includes('極簡筆記知識編譯')) {
      index = index.replace('## 🧬 知識網絡強化', jianbiEntry + '\n## 🧬 知識網絡強化');
      fs.writeFileSync(INDEX_PATH, index, 'utf-8');
    }
  } catch (e) {
    console.error('⚠️  Index 更新失敗:', e.message);
  }
}

// 主流程
console.log('🔧 開始極簡筆記知識編譯...');
console.log(`📂 極簡筆記目錄: ${JIANBI_ROOT}`);
console.log(`📝 概念輸出: ${WIKI_CONCEPTS}`);
console.log(`📝 摘要輸出: ${WIKI_SUMMARIES}`);
console.log('');

const startTime = Date.now();
const results = scanDir(JIANBI_ROOT);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

// 更新 Index
updateIndex(results);

// 總結
console.log('\n========================================');
console.log('📊 極簡筆記編譯總結');
console.log('========================================');
console.log(`⏱️  總耗時: ${elapsed}秒`);
console.log(`📁 總檔案數: ${stats.total}`);
console.log(`✅ 已編譯: ${stats.compiled}`);
console.log(`⏭️  已跳過: ${stats.skipped}`);
console.log(`❌ 錯誤: ${stats.errors}`);
console.log('========================================');

// 分類統計
const categoryCounts = {};
for (const r of results) {
  if (r.action !== 'error' && r.action !== 'skipped' && r.category) {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  }
}
if (Object.keys(categoryCounts).length > 0) {
  console.log('\n📋 分類分佈:');
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
  }
}

// 顯示編譯結果 Top 10
const compiled = results.filter(r => r.action === 'concept' || r.action === 'summary');
if (compiled.length > 0) {
  console.log(`\n📝 編譯結果 Top 10:`);
  compiled.slice(0, 10).forEach(r => {
    console.log(`   ${r.name} → ${r.action} (${r.category})`);
  });
  if (compiled.length > 10) console.log(`   ... 及其他 ${compiled.length - 10} 個`);
}

// 保存報告
const report = {
  timestamp: new Date().toISOString(),
  elapsed: parseFloat(elapsed),
  stats,
  results: compiled.slice(0, 50),
  categoryCounts
};

const reportPath = path.join('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend', 'jianbi-compile-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📝 詳細報告: ${reportPath}`);
console.log('========================================');
