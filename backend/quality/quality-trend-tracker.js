#!/usr/bin/env node
/**
 * 質量趨勢追蹤器
 * 記錄每次質量評分的歷史，生成趨勢報告
 */

const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname);
const TREND_FILE = path.join(REPORT_DIR, 'quality-trend.json');
const QualityScorer = require('./scorer');

class QualityTrendTracker {
    constructor() {
        this.trends = this.loadTrends();
    }

    loadTrends() {
        if (fs.existsSync(TREND_FILE)) {
            return JSON.parse(fs.readFileSync(TREND_FILE, 'utf-8'));
        }
        return [];
    }

    recordSnapshot() {
        const scorer = new QualityScorer();
        const report = scorer.scoreAll();

        const total = report.length;
        const avgScore = total > 0 ? report.reduce((sum, s) => sum + s.percentage, 0) / total : 0;

        // 分佈統計
        const ranges = { '0-20%': 0, '21-40%': 0, '41-60%': 0, '61-80%': 0, '81-100%': 0 };
        for (const s of report) {
            if (s.percentage <= 20) ranges['0-20%']++;
            else if (s.percentage <= 40) ranges['21-40%']++;
            else if (s.percentage <= 60) ranges['41-60%']++;
            else if (s.percentage <= 80) ranges['61-80%']++;
            else ranges['81-100%']++;
        }

        const snapshot = {
            timestamp: new Date().toISOString(),
            totalNodes: total,
            avgScore: Math.round(avgScore),
            distribution: ranges,
            needsReview: report.filter(s => s.needsReview).length,
            top5Highest: report.sort((a, b) => b.percentage - a.percentage).slice(0, 5).map(s => ({
                id: s.nodeId, score: s.percentage
            })),
            top5Lowest: report.sort((a, b) => a.percentage - b.percentage).slice(0, 5).map(s => ({
                id: s.nodeId, score: s.percentage
            }))
        };

        this.trends.push(snapshot);

        // 只保留最近 30 次記錄
        if (this.trends.length > 30) {
            this.trends = this.trends.slice(-30);
        }

        fs.writeFileSync(TREND_FILE, JSON.stringify(this.trends, null, 2), 'utf-8');
        return snapshot;
    }

    generateTrendReport() {
        if (this.trends.length === 0) {
            return { message: '尚無歷史記錄', current: this.recordSnapshot() };
        }

        const current = this.trends[this.trends.length - 1];
        const previous = this.trends.length > 1 ? this.trends[this.trends.length - 2] : null;

        const trend = {
            current,
            previous,
            change: previous ? {
                avgScore: current.avgScore - previous.avgScore,
                totalNodes: current.totalNodes - previous.totalNodes,
                needsReview: current.needsReview - previous.needsReview
            } : null,
            history: this.trends.map(t => ({
                timestamp: t.timestamp,
                avgScore: t.avgScore,
                totalNodes: t.totalNodes
            }))
        };

        return trend;
    }
}

// CLI 使用
if (require.main === module) {
    const tracker = new QualityTrendTracker();
    const snapshot = tracker.recordSnapshot();
    const trend = tracker.generateTrendReport();

    console.log('📊 質量趨勢報告');
    console.log(`   當前平均: ${trend.current.avgScore}%`);
    if (trend.change) {
        const sign = trend.change.avgScore >= 0 ? '+' : '';
        console.log(`   變化: ${sign}${trend.change.avgScore}%`);
    }
    console.log(`   總節點: ${trend.current.totalNodes}`);
    console.log(`   需要審核: ${trend.current.needsReview}`);
    console.log('\n📈 分佈:');
    for (const [range, count] of Object.entries(trend.current.distribution)) {
        console.log(`   ${range}: ${count} (${Math.round(count / trend.current.totalNodes * 100)}%)`);
    }
    console.log(`\n📝 趨勢記錄數: ${trend.history.length}`);
}

module.exports = QualityTrendTracker;
