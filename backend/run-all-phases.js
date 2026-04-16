#!/usr/bin/env node
/**
 * LLM Wiki v3.0 全流程引擎
 * Phase 3-6 整合
 * 
 * 流程：
 * 1. 實體提取 (Phase 3)
 * 2. 自動 Lint (Phase 4)
 * 3. 質量評分 (Phase 5)
 * 4. Mesh Sync (Phase 6)
 * 5. 知識編譯
 */

const path = require('path');
const fs = require('fs');

const BACKEND_DIR = __dirname;

// 載入所有模組
const extractEntities = require('./extract-entities');
const WikiLinter = require('./hooks/auto-lint');
const QualityScorer = require('./quality/scorer');
const MeshSync = require('./collab/mesh-sync');
const HybridSearch = require('./search/hybrid-search');
const ContextInjector = require('./hooks/context-injector');

async function runAllPhases() {
    console.log('========================================');
    console.log('🚀 LLM Wiki v3.0 全流程引擎');
    console.log('   Phase 3-6 整合執行');
    console.log('========================================\n');

    const startTime = Date.now();
    const results = {};

    // Phase 3: 結構化
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Phase 3: 結構化');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
        const { execSync } = require('child_process');
        const output = execSync('node extract-entities.js', {
            encoding: 'utf-8',
            cwd: BACKEND_DIR,
            timeout: 120000
        });
        const lines = output.trim().split('\n');
        const entityLine = lines.find(l => l.includes('提取') && l.includes('個實體'));
        const linkLine = lines.find(l => l.includes('條連結'));

        let entities = 0, links = 0;
        if (entityLine) {
            const match = entityLine.match(/(\d+)\s*個實體/);
            if (match) entities = parseInt(match[1]);
        }
        if (linkLine) {
            const match = linkLine.match(/(\d+)\s*條連結/);
            if (match) links = parseInt(match[1]);
        }

        results.phase3 = { entities, links };
        console.log('✅ Phase 3 完成\n');
    } catch (e) {
        console.error(`❌ Phase 3 失敗: ${e.message}\n`);
        results.phase3 = { error: e.message };
    }

    // Phase 4: 自動化
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 Phase 4: 自動化');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
        const linter = new WikiLinter();
        const lintReport = await linter.run();
        results.phase4 = lintReport ? {
            totalIssues: lintReport.stats.total,
            orphans: lintReport.stats.orphan,
            brokenRefs: lintReport.stats.brokenRef,
            duplicates: lintReport.stats.duplicate,
            staleClaims: lintReport.stats.stale,
            fixed: lintReport.fixes.length
        } : {};
        console.log('✅ Phase 4 完成\n');
    } catch (e) {
        console.error(`❌ Phase 4 失敗: ${e.message}\n`);
        results.phase4 = { error: e.message };
    }

    // Phase 5: 規模化
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Phase 5: 規模化');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
        const scorer = new QualityScorer();
        const qualityReport = scorer.generateReport();
        results.phase5 = qualityReport;
        console.log('✅ Phase 5 完成\n');
    } catch (e) {
        console.error(`❌ Phase 5 失敗: ${e.message}\n`);
        results.phase5 = { error: e.message };
    }

    // 測試混合搜尋
    console.log('\n🔍 測試混合搜尋...');
    try {
        const search = new HybridSearch();
        search.loadGraphData();
        const testResults = search.search('LLM Wiki', { topN: 5 });
        console.log(`   "LLM Wiki" 搜索: ${testResults.length} 結果`);
        results.searchTest = testResults.slice(0, 3).map(r => ({
            id: r.id || r.name,
            score: r.rrfScore?.toFixed(4) || 'N/A'
        }));
    } catch (e) {
        console.error(`   ⚠️  搜索測試失敗: ${e.message}`);
    }

    // 測試上下文注入
    console.log('\n🧠 測試上下文注入...');
    try {
        const injector = new ContextInjector();
        const ctx = injector.injectContext('Redis', { maxNodes: 5 });
        console.log(`   "Redis" 上下文: ${ctx.context.length} 節點, ${ctx.backlinks.length} 反向連結, ${ctx.related.length} 相關`);
        results.contextTest = {
            query: 'Redis',
            contextCount: ctx.context.length,
            backlinkCount: ctx.backlinks.length,
            relatedCount: ctx.related.length
        };
    } catch (e) {
        console.error(`   ⚠️  上下文測試失敗: ${e.message}`);
    }

    // Phase 6: 協作
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤝 Phase 6: 協作');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
        const meshSync = new MeshSync();
        const syncResult = await meshSync.sync();
        results.phase6 = syncResult;
        console.log('✅ Phase 6 完成\n');
    } catch (e) {
        console.error(`❌ Phase 6 失敗: ${e.message}\n`);
        results.phase6 = { error: e.message };
    }

    // 總結
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n========================================');
    console.log('📊 全流程總結');
    console.log('========================================');
    console.log(`⏱️  總耗時: ${elapsed}秒`);
    console.log(`\nPhase 3 (結構化): ${results.phase3.error ? '❌' : '✅'} ${results.phase3.entities || '?'} 實體`);
    console.log(`Phase 4 (自動化): ${results.phase4.error ? '❌' : '✅'} ${results.phase4.totalIssues || '?'} 問題`);
    console.log(`Phase 5 (規模化): ${results.phase5.error ? '❌' : '✅'} ${results.phase5.avgScore || '?'}% 平均質量`);
    console.log(`Phase 6 (協作):   ${results.phase6.error ? '❌' : '✅'} ${results.phase6.synced || '?'} 同步`);

    // 保存最終報告
    const reportPath = path.join(BACKEND_DIR, 'phase-report.json');
    results.timestamp = new Date().toISOString();
    results.elapsed = elapsed;
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n📝 完整報告: ${reportPath}`);
    console.log('========================================');
}

// 執行
runAllPhases().catch(err => {
    console.error('💥 全流程失敗:', err);
    process.exit(1);
});
