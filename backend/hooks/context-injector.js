#!/usr/bin/env node
/**
 * 上下文注入器 (Context Injector)
 * Phase 4: 自動化 - 上下文注入
 * 
 * 功能：
 * - 基於查詢自動加載相關上下文
 * - 圖譜遍歷擴展
 * - 信心打分過濾
 */

const fs = require('fs');
const path = require('path');
const HybridSearch = require('../search/hybrid-search');

const GRAPH_DATA_PATH = path.join(__dirname, '..', 'graph-data.json');

class ContextInjector {
    constructor() {
        this.search = new HybridSearch();
        this.graphData = null;
    }

    loadGraphData() {
        if (fs.existsSync(GRAPH_DATA_PATH)) {
            this.graphData = JSON.parse(fs.readFileSync(GRAPH_DATA_PATH, 'utf-8'));
            this.search.loadGraphData();
        }
    }

    /**
     * 為查詢注入上下文
     */
    injectContext(query, options = {}) {
        const {
            maxNodes = 10,
            maxHops = 2,
            minConfidence = 0,
            includeBacklinks = true,
            includeRelated = true
        } = options;

        if (!this.graphData) this.loadGraphData();
        if (!this.graphData) return { query, context: [], related: [], backlinks: [] };

        // 1. 搜索相關節點
        const searchResults = this.search.search(query, { topN: maxNodes, maxHops });

        // 2. 過濾信心分數
        const filtered = searchResults.filter(n =>
            (n.confidence || 0) >= minConfidence
        ).slice(0, maxNodes);

        // 3. 獲取反向連結
        let backlinks = [];
        if (includeBacklinks) {
            backlinks = this.getBacklinks(filtered.map(n => n.id || n.name));
        }

        // 4. 獲取相關節點
        let related = [];
        if (includeRelated) {
            related = this.getRelatedNodes(filtered.map(n => n.id || n.name));
        }

        return {
            query,
            context: filtered,
            backlinks: backlinks.slice(0, 5),
            related: related.slice(0, 5)
        };
    }

    /**
     * 獲取反向連結（誰引用了這些節點）
     */
    getBacklinks(nodeIds) {
        const backlinks = [];
        const nodeSet = new Set(nodeIds.map(id => id.toLowerCase()));

        for (const link of this.graphData.links || []) {
            const target = typeof link.target === 'object' ? link.target.id : link.target;
            const source = typeof link.source === 'object' ? link.source.id : link.source;

            if (nodeSet.has(target.toLowerCase())) {
                const sourceNode = this.graphData.nodes.find(n =>
                    (n.id || n.name || '').toLowerCase() === source.toLowerCase()
                );
                if (sourceNode) {
                    backlinks.push({
                        source: sourceNode,
                        target: target,
                        relationType: link.relationType || 'relates_to',
                        weight: link.weight || 0.3
                    });
                }
            }
        }

        return backlinks;
    }

    /**
     * 獲取相關節點（共同引用的節點）
     */
    getRelatedNodes(nodeIds) {
        const related = new Map();
        const nodeSet = new Set(nodeIds.map(id => id.toLowerCase()));

        for (const nodeId of nodeIds) {
            const key = nodeId.toLowerCase();
            const links = this.graphData.links.filter(l => {
                const src = typeof l.source === 'object' ? l.source.id : l.source;
                return src.toLowerCase() === key;
            });

            for (const link of links) {
                const target = typeof link.target === 'object' ? link.target.id : link.target;
                if (!nodeSet.has(target.toLowerCase())) {
                    const targetNode = this.graphData.nodes.find(n =>
                        (n.id || n.name || '').toLowerCase() === target.toLowerCase()
                    );
                    if (targetNode) {
                        const targetKey = target.toLowerCase();
                        if (!related.has(targetKey)) {
                            related.set(targetKey, { node: targetNode, count: 0 });
                        }
                        related.get(targetKey).count++;
                    }
                }
            }
        }

        return Array.from(related.values())
            .sort((a, b) => b.count - a.count)
            .map(r => ({ ...r.node, relationCount: r.count }));
    }

    /**
     * 格式化上下文為可讀文本
     */
    formatContext(ctx) {
        let output = `🔍 查詢: "${ctx.query}"\n\n`;

        if (ctx.context.length > 0) {
            output += `📋 相關知識 (${ctx.context.length} 個):\n`;
            for (const node of ctx.context) {
                output += `- **${node.id || node.name}** (類型: ${node.type || 'unknown'}, 信心: ${node.confidence || '?'})\n`;
            }
            output += '\n';
        }

        if (ctx.backlinks.length > 0) {
            output += `🔗 反向連結 (${ctx.backlinks.length} 個):\n`;
            for (const bl of ctx.backlinks) {
                output += `- ${bl.source.id || bl.source.name} --(${bl.relationType}:${bl.weight})--> ${bl.target}\n`;
            }
            output += '\n';
        }

        if (ctx.related.length > 0) {
            output += `📊 相關節點 (${ctx.related.length} 個):\n`;
            for (const rel of ctx.related) {
                output += `- ${rel.id || rel.name} (${rel.type || 'unknown'}, 共同引用: ${rel.relationCount || 0})\n`;
            }
        }

        return output;
    }
}

// CLI 使用
if (require.main === module) {
    const query = process.argv[2] || 'LLM Wiki';
    console.log(`🧠 上下文注入查詢: "${query}"\n`);

    const injector = new ContextInjector();
    const ctx = injector.injectContext(query, { maxNodes: 8, maxHops: 2 });

    console.log(injector.formatContext(ctx));
}

module.exports = ContextInjector;
