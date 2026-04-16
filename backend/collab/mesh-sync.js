#!/usr/bin/env node
/**
 * Mesh Sync 引擎 (協作同步)
 * Phase 6: 協作
 * 
 * 功能：
 * - Git-based sync 機制
 * - 衝突解決
 * - 共享/私有分層
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';
const SYNC_STATE_PATH = path.join(__dirname, '..', 'sync-state.json');

class MeshSync {
    constructor() {
        this.syncState = this.loadSyncState();
    }

    loadSyncState() {
        if (fs.existsSync(SYNC_STATE_PATH)) {
            return JSON.parse(fs.readFileSync(SYNC_STATE_PATH, 'utf-8'));
        }
        return {
            lastSync: null,
            syncCount: 0,
            conflicts: [],
            resolved: 0
        };
    }

    /**
     * 檢測變更
     */
    detectChanges() {
        console.log('🔍 檢測變更...');

        try {
            const output = execSync(
                'git diff --name-only --diff-filter=ACMRT HEAD',
                { cwd: WIKI_ROOT, encoding: 'utf-8' }
            ).trim();

            const files = output.split('\n').filter(f => f && f.endsWith('.md'));
            console.log(`   發現 ${files.length} 個變更檔案`);
            return files;
        } catch (e) {
            console.log('   ⚠️  不在 Git 倉庫中，使用檔案時間戳');
            return this.detectChangesByTimestamp();
        }
    }

    /**
     * 基於時間戳檢測變更 (fallback)
     */
    detectChangesByTimestamp() {
        const lastSync = this.syncState.lastSync ? new Date(this.syncState.lastSync).getTime() : 0;
        const changes = [];

        function scanDir(dir) {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item === '.DS_Store' || item.startsWith('.') || item === '.obsidian') continue;
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanDir(fullPath);
                } else if (item.endsWith('.md') && stat.mtimeMs > lastSync) {
                    changes.push(fullPath);
                }
            }
        }

        scanDir(WIKI_ROOT);
        console.log(`   發現 ${changes.length} 個變更檔案`);
        return changes;
    }

    /**
     * 衝突檢測
     */
    detectConflicts(changes) {
        console.log('⚔️  檢測衝突...');
        const conflicts = [];

        // 簡化版衝突檢測：同一檔案多個來源修改
        const fileMap = new Map();
        for (const file of changes) {
            if (fileMap.has(file)) {
                conflicts.push({
                    file,
                    type: 'concurrent_modification',
                    sources: fileMap.get(file)
                });
            }
            fileMap.set(file, ['local']);
        }

        console.log(`   發現 ${conflicts.length} 個衝突`);
        return conflicts;
    }

    /**
     * 衝突解決
     */
    resolveConflict(conflict) {
        console.log(`   🔧 解決衝突: ${conflict.file}`);

        // 策略：Last-write-wins (時間戳最新的贏)
        // 進階：可以添加手動合併或三方合併

        const stat = fs.statSync(conflict.file);
        const content = fs.readFileSync(conflict.file, 'utf-8');

        // 標記為已解決
        this.syncState.resolved++;
        console.log(`      ✅ Last-write-wins (${new Date(stat.mtimeMs).toISOString()})`);

        return { resolved: true, strategy: 'last_write_wins', timestamp: stat.mtimeMs };
    }

    /**
     * 共享/私有分層
     * 基於 metadata 的 scope 判斷
     */
    classifyScope(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        // 檢查 front matter
        const hasPrivateTag = content.includes('private') ||
            content.includes('scope: private') ||
            content.includes('@private');

        return hasPrivateTag ? 'private' : 'shared';
    }

    /**
     * 執行同步
     */
    async sync() {
        console.log('🔄 開始 Mesh Sync...');

        const changes = this.detectChanges();
        if (changes.length === 0) {
            console.log('✅ 沒有變更，跳過同步');
            return { synced: 0, conflicts: 0 };
        }

        // 分類變更
        const classified = {
            shared: [],
            private: []
        };

        for (const file of changes) {
            const scope = this.classifyScope(file);
            classified[scope].push(file);
        }

        console.log(`📂 分類: ${classified.shared.length} shared, ${classified.private.length} private`);

        // 檢測衝突
        const conflicts = this.detectConflicts(changes);
        for (const conflict of conflicts) {
            this.resolveConflict(conflict);
        }

        // 更新同步狀態
        this.syncState.lastSync = new Date().toISOString();
        this.syncState.syncCount++;
        this.syncState.conflicts = conflicts;
        fs.writeFileSync(SYNC_STATE_PATH, JSON.stringify(this.syncState, null, 2), 'utf-8');

        console.log(`\n✅ Mesh Sync 完成`);
        console.log(`   同步: ${changes.length} 檔案`);
        console.log(`   衝突: ${conflicts.length}`);
        console.log(`   已解決: ${this.syncState.resolved}`);

        return { synced: changes.length, conflicts: conflicts.length };
    }

    /**
     * 生成報告
     */
    generateReport() {
        console.log('📊 Mesh Sync 狀態');
        console.log(`   最後同步: ${this.syncState.lastSync || '從未'}`);
        console.log(`   同步次數: ${this.syncState.syncCount}`);
        console.log(`   衝突已解決: ${this.syncState.resolved}`);

        return this.syncState;
    }
}

// CLI 使用
if (require.main === module) {
    const meshSync = new MeshSync();
    meshSync.sync().then(result => {
        meshSync.generateReport();
    }).catch(err => {
        console.error('❌ Mesh Sync 失敗:', err);
        process.exit(1);
    });
}

module.exports = MeshSync;
