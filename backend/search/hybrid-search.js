#!/usr/bin/env node
/**
 * 混合搜尋引擎 (Hybrid Search Engine)
 * Phase 5: 規模化
 * 
 * 結合三流搜索：
 * - BM25 (關鍵字匹配)
 * - Graph traversal (圖譜遍歷)
 * - RRF 融合結果
 */

const fs = require('fs');
const path = require('path');

const GRAPH_DATA_PATH = path.join(__dirname, '..', 'graph-data.json');

class HybridSearch {
    constructor() {
        this.graphData = null;
        this.nodeIndex = new Map();
        this.linkIndex = new Map();
    }

    /**
     * 載入圖譜數據
     */
    loadGraphData() {
        if (fs.existsSync(GRAPH_DATA_PATH)) {
            this.graphData = JSON.parse(fs.readFileSync(GRAPH_DATA_PATH, 'utf-8'));

            // 建立節點索引
            for (const node of this.graphData.nodes) {
                const key = (node.id || node.name || '').toLowerCase();
                if (key) this.nodeIndex.set(key, node);
            }

            // 建立連結索引 (source -> [links])
            for (const link of this.graphData.links || []) {
                const src = typeof link.source === 'object' ? link.source.id : link.source;
                const srcKey = src.toLowerCase();
                if (!this.linkIndex.has(srcKey)) this.linkIndex.set(srcKey, []);
                this.linkIndex.get(srcKey).push(link);
            }

            console.log(`📊 圖譜已載入: ${this.nodeIndex.size} 節點, ${this.graphData.links.length} 連結`);
        }
    }

    /**
     * BM25 關鍵字搜索
     * 簡化版：使用 TF-IDF 近似
     */
    bm25Search(query, topN = 20) {
        if (!query || !this.graphData) return [];

        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
        if (terms.length === 0) return [];

        // 計算詞頻
        const termFreq = {};
        const docFreq = {};
        const N = this.graphData.nodes.length;

        // 收集所有文檔詞頻
        const docs = this.graphData.nodes.map(node => {
            const text = `${node.id || ''} ${node.name || ''} ${(node.tags || []).join(' ')} ${(node.category || '')} ${(node.layer || '')}`.toLowerCase();
            return { node, text, words: text.split(/\s+/) };
        });

        // 計算 IDF
        for (const term of terms) {
            docFreq[term] = docs.filter(d => d.words.some(w => w.includes(term))).length || 1;
        }

        // 計算 BM25 分數
        const scores = docs.map(doc => {
            let score = 0;
            for (const term of terms) {
                const tf = doc.words.filter(w => w.includes(term)).length;
                const idf = Math.log((N - docFreq[term] + 0.5) / (docFreq[term] + 0.5) + 1);
                const k1 = 1.2, b = 0.75;
                const avgLen = docs.reduce((sum, d) => sum + d.words.length, 0) / N;
                score += (idf * tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc.words.length / avgLen));
            }
            return { node: doc.node, score };
        });

        return scores
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topN)
            .map(s => ({ ...s.node, searchScore: s.score }));
    }

    /**
     * 圖譜遍歷搜索
     * 從匹配節點開始，沿關係邊向外遍歷
     */
    graphTraversalSearch(query, maxHops = 2, topN = 20) {
        if (!query || !this.graphData) return [];

        const queryLower = query.toLowerCase();

        // 找到起點節點
        const startNodes = [];
        for (const [key, node] of this.nodeIndex) {
            if (key.includes(queryLower) || (node.name || '').toLowerCase().includes(queryLower)) {
                startNodes.push(node);
            }
        }

        if (startNodes.length === 0) return [];

        // BFS 遍歷
        const visited = new Set();
        const results = [];

        for (const startNode of startNodes) {
            const queue = [{ node: startNode, hop: 0, path: [startNode.id || startNode.name] }];
            const localVisited = new Set();

            while (queue.length > 0) {
                const { node, hop, path } = queue.shift();
                const nodeId = node.id || node.name;
                const nodeKey = nodeId.toLowerCase();

                if (localVisited.has(nodeKey) || hop > maxHops) continue;
                localVisited.add(nodeKey);

                if (hop > 0) {
                    results.push({
                        ...node,
                        searchScore: 1 / (hop * 0.5),
                        hops: hop,
                        path: path.join(' → ')
                    });
                }

                // 沿連結向外走
                const links = this.linkIndex.get(nodeKey) || [];
                for (const link of links) {
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    const targetNode = this.nodeIndex.get(targetId.toLowerCase());
                    if (targetNode) {
                        queue.push({
                            node: targetNode,
                            hop: hop + 1,
                            path: [...path, targetId]
                        });
                    }
                }
            }
        }

        return results
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, topN);
    }

    /**
     * RRF 融合
     * Reciprocal Rank Fusion
     */
    rrfFusion(results, k = 60) {
        const scoreMap = new Map();

        for (const resultList of results) {
            resultList.forEach((item, rank) => {
                const key = (item.id || item.name || '').toLowerCase();
                if (!scoreMap.has(key)) {
                    scoreMap.set(key, { ...item, rrfScore: 0 });
                }
                const entry = scoreMap.get(key);
                entry.rrfScore += 1 / (k + rank + 1);
            });
        }

        return Array.from(scoreMap.values())
            .sort((a, b) => b.rrfScore - a.rrfScore);
    }

    /**
     * 混合搜尋入口
     */
    search(query, options = {}) {
        const {
            topN = 20,
            maxHops = 2,
            useBm25 = true,
            useGraph = true
        } = options;

        if (!this.graphData) this.loadGraphData();
        if (!this.graphData) return [];

        const results = [];

        if (useBm25) {
            const bm25Results = this.bm25Search(query, topN);
            results.push(bm25Results);
        }

        if (useGraph) {
            const graphResults = this.graphTraversalSearch(query, maxHops, topN);
            results.push(graphResults);
        }

        // RRF 融合
        return this.rrfFusion(results);
    }
}

// CLI 使用
if (require.main === module) {
    const query = process.argv[2] || 'Redis';
    console.log(`🔍 搜尋: "${query}"\n`);

    const search = new HybridSearch();
    search.loadGraphData();

    const results = search.search(query, { topN: 10, maxHops: 2 });

    if (results.length === 0) {
        console.log('未找到結果');
    } else {
        console.log(`找到 ${results.length} 個結果:\n`);
        for (const [i, r] of results.entries()) {
            console.log(`${i + 1}. ${r.id || r.name}`);
            console.log(`   類型: ${r.type || 'unknown'} | 分類: ${r.category || 'unknown'} | RRF: ${r.rrfScore.toFixed(4)}`);
            if (r.hops) console.log(`   距離: ${r.hops} hops`);
            if (r.path) console.log(`   路徑: ${r.path}`);
            console.log();
        }
    }
}

module.exports = HybridSearch;
