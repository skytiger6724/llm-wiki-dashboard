#!/usr/bin/env node
/**
 * 質量評分引擎 (Quality Scorer)
 * Phase 5: 規模化
 * 
 * 評分維度：
 * - 結構評分
 * - 引用評分
 * - 一致性評分
 */

const fs = require('fs');
const path = require('path');

const GRAPH_DATA_PATH = path.join(__dirname, '..', 'graph-data.json');

class QualityScorer {
    constructor() {
        this.graphData = null;
    }

    loadGraphData() {
        if (fs.existsSync(GRAPH_DATA_PATH)) {
            this.graphData = JSON.parse(fs.readFileSync(GRAPH_DATA_PATH, 'utf-8'));
        }
    }

    /**
     * 結構評分
     * 檢查是否有元數據、標題、章節結構
     * Raw 類型檔案不要求章節結構
     */
    scoreStructure(content, nodeType) {
        let score = 0;
        const maxScore = 5;

        // 有 YAML front matter
        if (content.startsWith('---')) score += 1;

        // 有標題
        if (content.match(/^# /m)) score += 1;

        // Raw 類型不需要章節結構（原始對話/筆記本來就沒有 ## 標題）
        const isRaw = nodeType === 'raw';
        if (!isRaw) {
            // 有至少一個章節
            if (content.match(/^## /m)) score += 1;
        } else {
            // Raw 只要有內容就給分
            if (content.length > 100) score += 1;
        }

        // 有 wikilinks
        if (content.match(/\[\[.*?\]\]/g)) score += 1;

        // 有清單結構
        if (content.match(/^[-*] /m)) score += 1;

        return { structure: score, maxScore };
    }

    /**
     * 引用評分
     * 檢查來源數量和質量
     */
    scoreReferences(frontMatter) {
        let score = 0;
        const maxScore = 5;

        const sources = frontMatter.sources || [];
        const sourcesCount = Array.isArray(sources) ? sources.length : 0;

        // 有來源
        if (sourcesCount > 0) score += 1;
        if (sourcesCount >= 2) score += 1;
        if (sourcesCount >= 3) score += 1;

        // 有最後驗證時間
        if (frontMatter.last_verified) score += 1;

        // 有信心分數
        if (frontMatter.confidence && frontMatter.confidence >= 3) score += 1;

        return { references: Math.min(score, maxScore), maxScore, sourcesCount };
    }

    /**
     * 一致性評分
     * 檢查是否與現有知識矛盾
     */
    scoreConsistency(node, graphData) {
        let score = 0;
        const maxScore = 5;

        // 沒有未解決矛盾
        const contradictions = node.contradictions || [];
        if (contradictions.length === 0) score += 2;
        else score += Math.max(0, 2 - contradictions.length);

        // 有信心分數且 > 2
        if (node.confidence && node.confidence > 2) score += 2;

        // 被多次引用（入站連結多）
        const incomingLinks = (graphData.links || []).filter(l => {
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return tgt.toLowerCase() === (node.id || node.name || '').toLowerCase();
        }).length;

        if (incomingLinks >= 3) score += 1;

        return { consistency: Math.min(score, maxScore), maxScore, incomingLinks };
    }

    /**
     * 綜合評分
     */
    scoreNode(node) {
        const content = node.content || '';
        const frontMatter = node.frontMatter || {};
        const nodeType = frontMatter.type || node.type || 'unknown';
        const structure = this.scoreStructure(content, nodeType);
        const references = this.scoreReferences(frontMatter);
        const consistency = this.scoreConsistency(node, this.graphData);

        const totalScore = structure.structure + references.references + consistency.consistency;
        const maxTotal = structure.maxScore + references.maxScore + consistency.maxScore;

        return {
            nodeId: node.id || node.name,
            structure: structure.structure,
            references: references.references,
            consistency: consistency.consistency,
            totalScore,
            maxTotal,
            percentage: Math.round((totalScore / maxTotal) * 100),
            needsReview: totalScore < 5, // 總分 < 5 需要審核
            issues: []
        };
    }

    /**
     * 批量評分
     */
    scoreAll() {
        if (!this.graphData) this.loadGraphData();
        if (!this.graphData) return [];

        const scores = [];
        for (const node of this.graphData.nodes) {
            // 讀取檔案內容（如果有路徑）
            if (node.path && fs.existsSync(node.path)) {
                try {
                    node.content = fs.readFileSync(node.path, 'utf-8');
                } catch (e) {
                    node.content = '';
                }
            }
            const score = this.scoreNode(node);
            scores.push(score);
        }

        return scores.sort((a, b) => a.percentage - b.percentage);
    }

    /**
     * 生成報告
     */
    generateReport() {
        const scores = this.scoreAll();
        const total = scores.length;
        const needsReview = scores.filter(s => s.needsReview).length;
        const avgScore = scores.reduce((sum, s) => sum + s.percentage, 0) / total;

        const report = {
            timestamp: new Date().toISOString(),
            totalNodes: total,
            needsReview,
            avgScore: Math.round(avgScore),
            top5Lowest: scores.slice(0, 5).map(s => ({ id: s.nodeId, score: s.percentage })),
            top5Highest: scores.slice(-5).reverse().map(s => ({ id: s.nodeId, score: s.percentage }))
        };

        const reportPath = path.join(__dirname, 'quality-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

        console.log('📊 質量評分報告');
        console.log(`   總節點: ${total}`);
        console.log(`   需要審核: ${needsReview}`);
        console.log(`   平均評分: ${Math.round(avgScore)}%`);
        console.log(`\n📉 最低分 Top 5:`);
        for (const s of report.top5Lowest) {
            console.log(`   ${s.id}: ${s.score}%`);
        }
        console.log(`\n📈 最高分 Top 5:`);
        for (const s of report.top5Highest) {
            console.log(`   ${s.id}: ${s.score}%`);
        }
        console.log(`\n📝 報告已保存到: ${reportPath}`);

        return report;
    }
}

// CLI 使用
if (require.main === module) {
    const scorer = new QualityScorer();
    scorer.generateReport();
}

module.exports = QualityScorer;
