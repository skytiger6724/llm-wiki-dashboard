#!/usr/bin/env node
/**
 * 對話記錄編譯器
 * 將 475 個對話檔案編譯為結構化摘要和概念頁面
 */

const fs = require('fs');
const path = require('path');

const RAW_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/02_Raw_原始資料';
const WIKI_SUMMARIES = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層/Summaries_摘要';
const WIKI_CONCEPTS = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層/Concepts_概念';
const INDEX_PATH = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫/03_Wiki_知識層/全域原始資料與對話總索引.md';

const today = new Date().toISOString().split('T')[0];

// 統計
let stats = {
  total: 0,
  byMonth: {},
  byTopic: {},
  topics: new Set(),
  keywords: new Map()
};

// 主題分類關鍵字
const TOPIC_KEYWORDS = {
  'Prompt工程': ['Prompt', '提示詞', '提示工程', 'Prompt Engineering', '指令'],
  'Gemini': ['Gemini', 'Gem Apps', 'Gemini Apps', 'Gem角色'],
  '工作運勢': ['工作運', '工作運勢', '事業', '職場'],
  '財運投機': ['財運', '投機', '投資', '股票', '台股'],
  '感情關係': ['感情', '戀愛', '關係', '桃花'],
  '健康': ['健康', '運動', '飲食', '睡眠'],
  '學習教育': ['學習', '教育', '考試', '培訓'],
  'AI工具': ['AI', 'LLM', 'ChatGPT', 'Claude', 'AI 工具'],
  '寫作創作': ['寫作', '創作', '文案', '內容'],
  '個人成長': ['個人成長', '自我提升', '習慣', '目標'],
  '神秘學': ['塔羅', '占星', '命理', '紫微', '奇門']
};

/**
 * 從內容提取主題
 */
function extractTopics(content) {
  const topics = [];
  const lowerContent = content.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerContent.includes(kw.toLowerCase())) {
        topics.push(topic);
        stats.topics.add(topic);
        stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
        break;
      }
    }
  }
  
  if (topics.length === 0) {
    topics.push('未分類');
    stats.byTopic['未分類'] = (stats.byTopic['未分類'] || 0) + 1;
  }
  
  return [...new Set(topics)];
}

/**
 * 提取關鍵字（Top 10）
 */
function extractKeywords(content) {
  const words = content.split(/[\s\n]+/).filter(w => w.length > 2 && !w.match(/^[#*\-\[\]()]$/));
  const freq = {};
  
  for (const word of words) {
    const clean = word.replace(/[^\w\u4e00-\u9fff]/g, '');
    if (clean.length >= 2) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  }
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

/**
 * 解析檔案名稱中的日期
 */
function parseDateFromFilename(filename) {
  // 格式: 2025-12-19_上午8-57-24_Conversation_464.md
  const match = filename.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return {
      year: match[1],
      month: match[2],
      day: match[3],
      key: `${match[1]}-${match[2].padStart(2, '0')}`
    };
  }
  return { year: 'unknown', month: 'unknown', day: 'unknown', key: 'unknown' };
}

/**
 * 生成月度摘要頁面
 */
function generateMonthlySummary(yearMonth, conversations) {
  const [year, month] = yearMonth.split('-');
  const monthName = `${year}年${parseInt(month)}月`;
  
  // 按主題分組
  const byTopic = {};
  for (const conv of conversations) {
    for (const topic of conv.topics) {
      if (!byTopic[topic]) byTopic[topic] = [];
      byTopic[topic].push(conv);
    }
  }
  
  const summary = `---
title: "對話摘要_${monthName}"
type: "summary"
tier: 2
confidence: 3
decay_factor: 0.3
last_verified: ${today}
sources:
${conversations.slice(0, 5).map(c => `  - "[[${c.name}]]"`).join('\n')}
contradictions: []
tags: ["對話摘要", "${monthName}", "Conversation"]
created: ${today}
updated: ${today}
---

# 對話摘要：${monthName}

## 統計
- 總對話數：${conversations.length}
- 主要主題：${Object.keys(byTopic).join('、')}

## 按主題分類

${Object.entries(byTopic).map(([topic, convs]) => `### ${topic} (${convs.length} 次)
${convs.slice(0, 5).map(c => `- [[${c.name}]]`).join('\n')}
${convs.length > 5 ? `- ... 及其他 ${convs.length - 5} 次` : ''}
`).join('\n')}

## 關鍵字雲
${extractTopKeywords(conversations)}

## 涉及對話
${conversations.map(c => `- [[${c.name}]]`).join('\n')}

## 參考來源
${[...new Set(conversations.map(c => c.name))].slice(0, 10).map(n => `- [[${n}]]`).join('\n')}
`;

  const outputPath = path.join(WIKI_SUMMARIES, `對話摘要_${monthName}.md`);
  fs.writeFileSync(outputPath, summary, 'utf-8');
  return { path: outputPath, count: conversations.length };
}

/**
 * 提取 Top 關鍵字
 */
function extractTopKeywords(conversations) {
  const allKeywords = {};
  for (const conv of conversations) {
    for (const kw of (conv.keywords || [])) {
      allKeywords[kw.word] = (allKeywords[kw.word] || 0) + kw.count;
    }
  }
  
  return Object.entries(allKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => `- ${word} (${count})`)
    .join('\n');
}

/**
 * 生成概念頁面（從頻繁出現的主題）
 */
function generateConceptPages() {
  const concepts = [];
  
  for (const [topic, count] of Object.entries(stats.byTopic)) {
    if (count < 5) continue; // 只生成出現 5 次以上的主題
    
    const concept = `---
title: "對話主題_${topic}"
type: "concept"
tier: 2
confidence: 3
decay_factor: 0.3
last_verified: ${today}
sources:
  - "[[全域原始資料與對話總索引]]"
contradictions: []
tags: ["對話主題", "concept", "${topic}"]
created: ${today}
updated: ${today}
---

# [[對話主題_${topic}]]

## 核心定義
- 這是什麼：從對話記錄中提取的頻繁主題
- 出現次數：${count} 次對話
- 時間跨度：2025-12 至 2026-03

## 關鍵內容
- 這個主題在對話中頻繁出現，代表用戶的持續興趣或需求
- 相關對話分布在多个月份

## 參考來源
- [[全域原始資料與對話總索引]]
- 相關月度摘要
`;

    const outputPath = path.join(WIKI_CONCEPTS, `對話主題_${topic}.md`);
    fs.writeFileSync(outputPath, concept, 'utf-8');
    concepts.push({ topic, count, path: outputPath });
  }
  
  return concepts;
}

/**
 * 更新總索引為結構化格式
 */
function updateIndex(monthlySummaries, concepts) {
  const index = `---
title: "全域原始資料與對話總索引"
type: "raw"
tier: 1
confidence: 4
decay_factor: 0.5
last_verified: ${today}
sources:
  - "[[全域原始資料與對話總索引]]"
contradictions: []
tags: ["raw", "對話索引", "Conversation"]
created: 2026-04-14
updated: ${today}
---

# 📚 全域原始資料與對話總索引

> **狀態**: 已結構化編譯
> **總對話數**: ${stats.total}
> **編譯日期**: ${today}
> **月度摘要**: ${monthlySummaries.length} 個
> **概念頁面**: ${concepts.length} 個

---

## 📊 統計摘要

| 指標 | 數值 |
|------|------|
| 總對話數 | ${stats.total} |
| 時間跨度 | 2025-12 至 2026-03 |
| 主題分類 | ${Object.keys(stats.byTopic).length} 個 |
| 月度摘要 | ${monthlySummaries.length} 個 |

### 主題分佈

| 主題 | 對話數 | 比例 |
|------|--------|------|
${Object.entries(stats.byTopic).sort((a, b) => b[1] - a[1]).map(([topic, count]) => `| ${topic} | ${count} | ${Math.round(count / stats.total * 100)}% |`).join('\n')}

---

## 📅 月度摘要

${monthlySummaries.map(s => `- [[${path.basename(s.path, '.md')}]] (${s.count} 次對話)`).join('\n')}

---

## 🧠 對話主題概念

${concepts.map(c => `- [[${path.basename(c.path, '.md')}]] (${c.count} 次)`).join('\n')}

---

## 📝 原始對話（按日期分組）

> 完整對話列表已編譯為上方摘要，詳細列表可參考原始檔案。

---
*自動編纂：對話編譯器 v1.0*
`;

  fs.writeFileSync(INDEX_PATH, index, 'utf-8');
}

/**
 * 掃描所有對話檔案
 */
function scanConversations(dir) {
  const conversations = [];
  if (!fs.existsSync(dir)) return conversations;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === '.DS_Store' || item.startsWith('.') || item === '.obsidian') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      conversations.push(...scanConversations(fullPath));
    } else if (item.includes('Conversation') && item.endsWith('.md')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        stats.total++;
        
        const dateInfo = parseDateFromFilename(item);
        stats.byMonth[dateInfo.key] = (stats.byMonth[dateInfo.key] || 0) + 1;
        
        const topics = extractTopics(content);
        const keywords = extractKeywords(content);
        
        conversations.push({
          name: item.replace('.md', ''),
          path: fullPath,
          date: dateInfo,
          topics,
          keywords,
          content: content.substring(0, 500) // 前 500 字用於分析
        });
      } catch (e) {
        // 忽略錯誤
      }
    }
  }
  
  return conversations;
}

// 主流程
console.log('🔧 開始對話記錄編譯...');
console.log(`📂 原始資料目錄: ${RAW_ROOT}`);
console.log('');

const startTime = Date.now();

// 1. 掃描所有對話
console.log('📝 掃描對話檔案...');
const conversations = scanConversations(RAW_ROOT);
console.log(`   找到 ${conversations.length} 個對話檔案`);

// 2. 按月分組
console.log('\n📅 按月分組...');
const byMonth = {};
for (const conv of conversations) {
  const key = conv.date.key;
  if (!byMonth[key]) byMonth[key] = [];
  byMonth[key].push(conv);
}
console.log(`   ${Object.keys(byMonth).length} 個月`);

// 3. 生成月度摘要
console.log('\n📋 生成月度摘要...');
const monthlySummaries = [];
for (const [yearMonth, convs] of Object.entries(byMonth).sort()) {
  const result = generateMonthlySummary(yearMonth, convs);
  monthlySummaries.push(result);
  console.log(`   ✅ ${yearMonth}: ${convs.length} 次對話 → ${result.path}`);
}

// 4. 生成概念頁面
console.log('\n🧠 生成概念頁面...');
const concepts = generateConceptPages();
console.log(`   ✅ ${concepts.length} 個概念頁面`);
for (const c of concepts) {
  console.log(`      ${c.topic}: ${c.count} 次`);
}

// 5. 更新總索引
console.log('\n📚 更新總索引...');
updateIndex(monthlySummaries, concepts);
console.log(`   ✅ ${INDEX_PATH}`);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

// 總結
console.log('\n========================================');
console.log('📊 對話編譯總結');
console.log('========================================');
console.log(`⏱️  總耗時: ${elapsed}秒`);
console.log(`📁 總對話數: ${stats.total}`);
console.log(`📅 月度摘要: ${monthlySummaries.length} 個`);
console.log(`🧠 概念頁面: ${concepts.length} 個`);
console.log(`📋 主題分類: ${Object.keys(stats.byTopic).length} 個`);
console.log('========================================');

// 主題分佈
console.log('\n📈 主題分佈 Top 10:');
for (const [topic, count] of Object.entries(stats.byTopic).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log(`   ${topic}: ${count} (${Math.round(count / stats.total * 100)}%)`);
}

// 保存報告
const report = {
  timestamp: new Date().toISOString(),
  elapsed: parseFloat(elapsed),
  stats: {
    total: stats.total,
    byMonth: stats.byMonth,
    byTopic: stats.byTopic,
    topics: [...stats.topics]
  },
  monthlySummaries: monthlySummaries,
  concepts: concepts
};

const reportPath = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend/conversation-compile-report.json';
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📝 詳細報告: ${reportPath}`);
console.log('========================================');
