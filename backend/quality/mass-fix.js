#!/usr/bin/env node
/**
 * 批量修復 Wiki 頁面質量
 * Phase 5+: 質量改進
 * 
 * 功能：
 * - 為沒有 front matter 的頁面添加
 * - 清理假節點
 * - 為有 wikilinks 的頁面添加來源
 * - 自動填充信心分數和衰減係數
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const BACKUP_DIR = path.join(__dirname, 'wiki-backup');

// 假節點模式（名稱像模板/範例的節點）
const FAKE_NODE_PATTERNS = [
    /^來源\s*\d*$/,
    /^來源\s*\d+$/,
    /^Entity\s*Name$/i,
    /^file:/i,
    /^example\.com/i,
    /^malicious\.com/i,
    /^spam\.example\.com/i,
    /^memory:/i,
    /^\[\[.*\]\]$/,  // 整個名稱就是 wikilink 的（解析錯誤）
    /^A$/,
    /^B$/,
];

// 類型判斷關鍵字
const TYPE_KEYWORDS = {
    entity: ['實體', 'Entity', '人物', '專案', '庫', '框架', '檔案', '決策', '缺陷'],
    concept: ['概念', 'Concept', '模式', '方法', '技術', '策略', '框架', '指南'],
    summary: ['摘要', 'Summary', '總結', '報告', '分析'],
    crystallized: ['結晶', 'Crystallized', '精華', '總綱'],
    raw: ['Raw', '原始', 'Gist', 'Article']
};

// 衰減係數指南
const DECAY_GUIDELINES = {
    '概念': 0.1,
    '實體': 0.2,
    '摘要': 0.3,
    '結晶': 0.1,
    '原始': 0.5,
    'default': 0.3
};

class WikiMassFix {
    constructor() {
        this.stats = {
            total: 0,
            noFrontMatter: 0,
            fixedFrontMatter: 0,
            fakeNodes: 0,
            addedSources: 0,
            errors: 0
        };
        this.wikiLinksMap = new Map(); // target -> [sources]
    }

    /**
     * 創建備份目錄
     */
    ensureBackupDir() {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }
    }

    /**
     * 掃描所有 wikilinks 建立反向索引
     */
    buildWikilinksIndex() {
        console.log('🔗 建立 wikilinks 反向索引...');

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
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8');
                        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
                        let match;
                        while ((match = regex.exec(content)) !== null) {
                            const target = match[1].trim();
                            if (!this.wikiLinksMap.has(target)) {
                                this.wikiLinksMap.set(target, []);
                            }
                            const sourcePath = path.relative(WIKI_ROOT, fullPath);
                            if (!this.wikiLinksMap.get(target).includes(sourcePath)) {
                                this.wikiLinksMap.get(target).push(sourcePath);
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        }

        scanDir.call(this, WIKI_ROOT);
        console.log(`   建立 ${this.wikiLinksMap.size} 個 wikilink 目標索引`);
    }

    /**
     * 判斷是否是假節點
     */
    isFakeNode(name) {
        return FAKE_NODE_PATTERNS.some(pattern => pattern.test(name));
    }

    /**
     * 推斷頁面類型
     */
    inferType(fileName, content, filePath) {
        const lowerPath = filePath.toLowerCase();
        const lowerContent = content.toLowerCase();

        // 基於路徑
        if (lowerPath.includes('entity') || lowerPath.includes('實體')) return 'entity';
        if (lowerPath.includes('concept') || lowerPath.includes('概念')) return 'concept';
        if (lowerPath.includes('summary') || lowerPath.includes('摘要')) return 'summary';
        if (lowerPath.includes('crystallized') || lowerPath.includes('結晶')) return 'crystallized';
        if (lowerPath.includes('raw') || lowerPath.includes('原始')) return 'raw';

        // 基於關鍵字
        for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
            for (const kw of keywords) {
                if (lowerContent.includes(kw.toLowerCase()) || fileName.toLowerCase().includes(kw.toLowerCase())) {
                    return type;
                }
            }
        }

        return 'concept'; // 預設
    }

    /**
     * 推斷衰減係數
     */
    inferDecayFactor(type) {
        const typeMap = {
            entity: 0.2,
            concept: 0.1,
            summary: 0.3,
            crystallized: 0.1,
            raw: 0.5
        };
        return typeMap[type] || 0.3;
    }

    /**
     * 推斷信心分數
     */
    inferConfidence(type, wikilinkCount) {
        let base = 2; // 預設中等
        if (type === 'crystallized') base = 4;
        else if (type === 'concept') base = 3;
        else if (type === 'entity') base = 3;
        else if (type === 'summary') base = 2;
        else if (type === 'raw') base = 2;

        // 被引用越多，信心越高
        if (wikilinkCount >= 5) base = Math.min(5, base + 1);
        if (wikilinkCount >= 10) base = Math.min(5, base + 1);

        return base;
    }

    /**
     * 提取現有 wikilinks 作為潛在來源
     */
    extractSources(content, wikilinkCount) {
        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        const links = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            links.push(match[1].trim());
        }
        // 返回前 3 個作為來源
        return [...new Set(links)].slice(0, 3);
    }

    /**
     * 生成 front matter
     */
    generateFrontMatter(fileName, content, filePath, wikilinkCount) {
        const type = this.inferType(fileName, content, filePath);
        const decayFactor = this.inferDecayFactor(type);
        const confidence = this.inferConfidence(type, wikilinkCount);
        const sources = this.extractSources(content, wikilinkCount);
        const today = new Date().toISOString().split('T')[0];

        const sourcesYaml = sources.length > 0
            ? sources.map(s => `  - "[[${s.replace(/"/g, '\\"')}]]"`).join('\n')
            : '  - "[[Index]]"';

        return `---
title: "${fileName.replace(/[_-]+/g, ' ')}"
type: "${type}"
tier: 1
confidence: ${confidence}
decay_factor: ${decayFactor}
last_verified: ${today}
sources:
${sourcesYaml}
contradictions: []
tags: ["${type}", "${filePath.split('/')[1] || 'Wiki'}"]
created: ${today}
updated: ${today}
---`;
    }

    /**
     * 處理單一檔案
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath, '.md');
            const relativePath = path.relative(WIKI_ROOT, filePath);

            // 計算 wikilinks
            const wikilinkCount = (content.match(/\[\[.*?\]\]/g) || []).length;

            // 檢查是否是假節點
            if (this.isFakeNode(fileName)) {
                this.stats.fakeNodes++;
                return { action: 'fake', name: fileName, path: relativePath };
            }

            // 檢查是否有 front matter
            const hasFrontMatter = content.startsWith('---');
            if (hasFrontMatter) {
                return { action: 'skip', name: fileName, path: relativePath };
            }

            // 需要添加 front matter
            this.stats.noFrontMatter++;
            this.stats.fixedFrontMatter++;

            // 備份
            this.ensureBackupDir();
            const backupPath = path.join(BACKUP_DIR, relativePath.replace(/\//g, '_'));
            fs.writeFileSync(backupPath, content, 'utf-8');

            // 生成並添加 front matter
            const frontMatter = this.generateFrontMatter(fileName, content, filePath, wikilinkCount);
            const newContent = frontMatter + '\n\n' + content;
            fs.writeFileSync(filePath, newContent, 'utf-8');

            return {
                action: 'fixed',
                name: fileName,
                path: relativePath,
                type: this.inferType(fileName, content, filePath),
                confidence: this.inferConfidence('concept', wikilinkCount),
                wikilinks: wikilinkCount
            };
        } catch (e) {
            this.stats.errors++;
            return { action: 'error', name: path.basename(filePath), error: e.message };
        }
    }

    /**
     * 掃描並處理所有檔案
     */
    run() {
        console.log('🔧 開始批量修復 Wiki 頁面...\n');

        // 先建立 wikilinks 索引
        this.buildWikilinksIndex();
        console.log();

        const results = [];

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
                    this.stats.total++;
                    const result = this.processFile(fullPath);
                    results.push(result);
                }
            }
        }

        scanDir.call(this, WIKI_ROOT);

        // 統計
        const fixed = results.filter(r => r.action === 'fixed');
        const fakes = results.filter(r => r.action === 'fake');
        const skipped = results.filter(r => r.action === 'skip');

        console.log('\n========================================');
        console.log('📊 批量修復總結');
        console.log('========================================');
        console.log(`📁 總頁面數: ${this.stats.total}`);
        console.log(`✅ 已有 front matter: ${skipped.length}`);
        console.log(`🔧 已添加 front matter: ${fixed.length}`);
        console.log(`🗑️  假節點（已標記）: ${fakes.length}`);
        console.log(`❌ 錯誤: ${this.stats.errors}`);
        console.log('========================================');

        // 顯示前 10 個修復的頁面
        if (fixed.length > 0) {
            console.log('\n📋 修復頁面 Top 10:');
            for (const r of fixed.slice(0, 10)) {
                console.log(`   ${r.name} → type: ${r.type}, confidence: ${r.confidence}, wikilinks: ${r.wikilinks}`);
            }
        }

        // 顯示假節點
        if (fakes.length > 0) {
            console.log(`\n⚠️  假節點 (建議手動檢查): ${fakes.length} 個`);
            for (const r of fakes.slice(0, 10)) {
                console.log(`   ${r.name} (${r.path})`);
            }
            if (fakes.length > 10) {
                console.log(`   ... 及其他 ${fakes.length - 10} 個`);
            }
        }

        // 保存報告
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            fixedCount: fixed.length,
            fakeCount: fakes.length,
            fixedPages: fixed.map(r => ({ name: r.name, type: r.type, confidence: r.confidence })),
            fakePages: fakes.map(r => ({ name: r.name, path: r.path }))
        };

        const reportPath = path.join(__dirname, 'mass-fix-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
        console.log(`\n📝 詳細報告: ${reportPath}`);
        console.log(`💾 備份目錄: ${BACKUP_DIR}`);

        return report;
    }
}

// CLI 使用
if (require.main === module) {
    const fixer = new WikiMassFix();
    fixer.run();
}

module.exports = WikiMassFix;
