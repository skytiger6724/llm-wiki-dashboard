#!/usr/bin/env node
/**
 * 自動 Lint 引擎 (Auto-Lint Engine)
 * Phase 4: 自動化 - 自癒機制
 * 
 * 功能：
 * - 孤立頁面檢測
 * - 斷裂引用檢測
 * - 重複實體檢測
 * - 過時聲明標記
 * - 自動修復
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const GRAPH_DATA_PATH = path.join(__dirname, '..', 'graph-data.json');
const LINT_REPORT_PATH = path.join(__dirname, '..', 'lint-report.json');

class WikiLinter {
    constructor() {
        this.report = {
            timestamp: new Date().toISOString(),
            issues: [],
            fixes: [],
            stats: { total: 0, orphan: 0, brokenRef: 0, duplicate: 0, stale: 0 }
        };
    }

    loadGraphData() {
        if (fs.existsSync(GRAPH_DATA_PATH)) {
            return JSON.parse(fs.readFileSync(GRAPH_DATA_PATH, 'utf-8'));
        }
        return null;
    }

    /**
     * 檢測孤立頁面
     * 沒有入站連結也沒有出站連結的頁面
     */
    findOrphans(graphData) {
        console.log('🔍 檢測孤立頁面...');
        const connectedNodes = new Set();

        for (const link of graphData.links || []) {
            const src = typeof link.source === 'object' ? link.source.id : link.source;
            const tgt = typeof link.target === 'object' ? link.target.id : link.target;
            connectedNodes.add(src.toLowerCase());
            connectedNodes.add(tgt.toLowerCase());
        }

        const orphans = [];
        for (const node of graphData.nodes || []) {
            const nodeId = (node.id || node.name || '').toLowerCase();
            if (nodeId && !connectedNodes.has(nodeId)) {
                orphans.push({ id: node.id || node.name, path: node.path });
                this.report.stats.orphan++;
                this.report.stats.total++;
            }
        }

        console.log(`   發現 ${orphans.length} 個孤立頁面`);
        return orphans;
    }

    /**
     * 檢測斷裂引用
     * Wikilink 指向不存在的頁面
     */
    findBrokenRefs(graphData) {
        console.log('🔍 檢測斷裂引用...');
        const existingNodes = new Set();

        for (const node of graphData.nodes || []) {
            const nodeId = (node.id || node.name || '').toLowerCase();
            if (nodeId) existingNodes.add(nodeId);
        }

        const brokenRefs = [];
        for (const link of graphData.links || []) {
            const target = typeof link.target === 'object' ? link.target.id : link.target;
            if (target && !existingNodes.has(target.toLowerCase())) {
                brokenRefs.push({
                    source: typeof link.source === 'object' ? link.source.id : link.source,
                    target: target,
                    type: link.relationType || 'relates_to'
                });
                this.report.stats.brokenRef++;
                this.report.stats.total++;
            }
        }

        console.log(`   發現 ${brokenRefs.length} 個斷裂引用`);
        return brokenRefs;
    }

    /**
     * 檢測重複實體
     * 名稱相似或指向相同內容的實體
     */
    findDuplicates(graphData) {
        console.log('🔍 檢測重複實體...');
        const nameMap = new Map();
        const duplicates = [];

        for (const node of graphData.nodes || []) {
            const name = (node.id || node.name || '').trim();
            const normalizedName = name.toLowerCase().replace(/[_-\s]+/g, ' ');

            if (nameMap.has(normalizedName)) {
                duplicates.push({
                    existing: nameMap.get(normalizedName),
                    duplicate: name,
                    path: node.path
                });
                this.report.stats.duplicate++;
                this.report.stats.total++;
            } else {
                nameMap.set(normalizedName, name);
            }
        }

        console.log(`   發現 ${duplicates.length} 個重複實體`);
        return duplicates;
    }

    /**
     * 檢測過時聲明
     * 被 supersede 但還未標記的實體
     * 注意：只標記真正被 supersede 的，不是所有有 incoming supersedes 連結的
     */
    findStaleClaims(graphData) {
        console.log('🔍 檢測過時聲明...');
        const superseded = new Map();

        // 找到被 supersede 的目標（只有明確的 supersedes 關係才算）
        for (const link of graphData.links || []) {
            const relType = link.relationType || '';
            if (relType === 'supersedes') {
                const target = typeof link.target === 'object' ? link.target.id : link.target;
                const source = typeof link.source === 'object' ? link.source.id : link.source;
                if (target) {
                    superseded.set(target.toLowerCase(), { target, source });
                }
            }
        }

        const staleClaims = [];
        for (const [nodeKey, info] of superseded.entries()) {
            const node = graphData.nodes.find(n =>
                (n.id || n.name || '').toLowerCase() === nodeKey
            );
            if (!node || !node.path) continue;

            // 檢查文件內容是否有 [Superseded] 標記
            try {
                if (fs.existsSync(node.path)) {
                    const content = fs.readFileSync(node.path, 'utf-8');
                    if (!content.includes('[Superseded]') && !content.includes('已取代') && !content.includes('已被取代')) {
                        staleClaims.push({ id: node.id || node.name, path: node.path });
                        this.report.stats.stale++;
                        this.report.stats.total++;
                    }
                }
            } catch (e) {
                // 忽略讀取錯誤
            }
        }

        console.log(`   發現 ${staleClaims.length} 個過時聲明`);
        return staleClaims;
    }

    /**
     * 自動修復
     */
    async autoFix(orphans, brokenRefs, duplicates, staleClaims) {
        console.log('\n🔧 執行自動修復...');

        // 修復孤立頁面：添加 [Orphan] 標記
        for (const orphan of orphans.slice(0, 10)) { // 限制修復數量
            if (orphan.path && fs.existsSync(orphan.path)) {
                try {
                    const content = fs.readFileSync(orphan.path, 'utf-8');
                    if (!content.includes('[Orphan]')) {
                        const newContent = content.replace(
                            /^(# .*)/m,
                            `$1\n\n> [Orphan] 此頁面目前沒有連接到知識圖譜。建議添加反向連結或標記為待合併。`
                        );
                        fs.writeFileSync(orphan.path, newContent, 'utf-8');
                        this.report.fixes.push({
                            type: 'add_orphan_tag',
                            target: orphan.id,
                            action: '添加 [Orphan] 標記'
                        });
                    }
                } catch (e) {
                    console.error(`   ⚠️  修復失敗: ${orphan.id}: ${e.message}`);
                }
            }
        }

        // 修復過時聲明：添加 [Superseded] 標記
        for (const stale of staleClaims.slice(0, 5)) {
            if (stale.path && fs.existsSync(stale.path)) {
                try {
                    const content = fs.readFileSync(stale.path, 'utf-8');
                    const newContent = content.replace(
                        /^(# .*)/m,
                        `$1\n\n> [Superseded] 此知識已被更新版本取代，請查看相關條目。`
                    );
                    fs.writeFileSync(stale.path, newContent, 'utf-8');
                    this.report.fixes.push({
                        type: 'add_superseded_tag',
                        target: stale.id,
                        action: '添加 [Superseded] 標記'
                    });
                } catch (e) {
                    console.error(`   ⚠️  修復失敗: ${stale.id}: ${e.message}`);
                }
            }
        }

        console.log(`   已修復 ${this.report.fixes.length} 個問題`);
    }

    /**
     * 生成報告
     */
    generateReport(orphans, brokenRefs, duplicates, staleClaims) {
        this.report.issues = [
            ...orphans.map(o => ({ type: 'orphan', severity: 'warning', ...o })),
            ...brokenRefs.map(r => ({ type: 'broken_ref', severity: 'error', ...r })),
            ...duplicates.map(d => ({ type: 'duplicate', severity: 'warning', ...d })),
            ...staleClaims.map(s => ({ type: 'stale', severity: 'info', ...s }))
        ];

        // 保存報告
        fs.writeFileSync(LINT_REPORT_PATH, JSON.stringify(this.report, null, 2), 'utf-8');
        console.log(`\n📝 Lint 報告已保存到: ${LINT_REPORT_PATH}`);

        return this.report;
    }

    /**
     * 運行完整 Lint
     */
    async run() {
        console.log('🧹 開始 LLM Wiki 自動 Lint...');

        const graphData = this.loadGraphData();
        if (!graphData) {
            console.error('❌ 找不到圖譜數據');
            return null;
        }

        console.log(`📊 載入 ${graphData.nodes.length} 個節點, ${graphData.links.length} 條連結\n`);

        // 檢測問題
        const orphans = this.findOrphans(graphData);
        const brokenRefs = this.findBrokenRefs(graphData);
        const duplicates = this.findDuplicates(graphData);
        const staleClaims = this.findStaleClaims(graphData);

        // 自動修復
        await this.autoFix(orphans, brokenRefs, duplicates, staleClaims);

        // 生成報告
        const report = this.generateReport(orphans, brokenRefs, duplicates, staleClaims);

        console.log('\n========================================');
        console.log('📊 Lint 總結');
        console.log(`   總問題數: ${report.stats.total}`);
        console.log(`   孤立頁面: ${report.stats.orphan}`);
        console.log(`   斷裂引用: ${report.stats.brokenRef}`);
        console.log(`   重複實體: ${report.stats.duplicate}`);
        console.log(`   過時聲明: ${report.stats.stale}`);
        console.log(`   已修復: ${report.fixes.length}`);
        console.log('========================================');

        return report;
    }
}

// 執行
if (require.main === module) {
    const linter = new WikiLinter();
    linter.run().then(report => {
        if (report) {
            console.log('\n✅ Lint 完成');
        }
    }).catch(err => {
        console.error('❌ Lint 失敗:', err);
        process.exit(1);
    });
}

module.exports = WikiLinter;
