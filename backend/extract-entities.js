#!/usr/bin/env node
/**
 * 實體提取引擎 (Entity Extraction Engine)
 * 從 Wiki Markdown 檔案中提取類型化實體和關係
 * Phase 3: 結構化
 */

const fs = require('fs');
const path = require('path');

const WIKI_ROOT = '/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫';

// 實體類型定義
const ENTITY_TYPES = {
    Person: { keywords: ['作者', '開發者', '工程師', '人名', '人物'], pathPatterns: [] },
    Project: { keywords: ['專案', '計畫', 'project', 'plan'], pathPatterns: ['Dynasafe', '前鋒三角', 'ROSA'] },
    Library: { keywords: ['框架', '庫', 'library', 'framework', '工具'], pathPatterns: [] },
    Concept: { keywords: ['概念', '模式', 'concept', 'pattern', '方法', '技術'], pathPatterns: [] },
    File: { keywords: ['檔案', '文件', 'file', 'document'], pathPatterns: ['schema', 'config', '.md'] },
    Decision: { keywords: ['決策', '決定', 'decision', '選擇'], pathPatterns: [] },
    Bug: { keywords: ['bug', '錯誤', '缺陷', '問題', 'issue'], pathPatterns: [] },
    Pattern: { keywords: ['最佳實踐', '模式', 'pattern', 'sop', '指南'], pathPatterns: [] }
};

// 關係類型定義（擴展模式匹配）
const RELATION_TYPES = {
    uses: { patterns: ['使用', 'uses', '用', '採用', '導入', '部署', '整合', 'build on', 'built with'], weight: 0.8 },
    depends_on: { patterns: ['依賴', 'depends on', '需要', '基於', '前提', 'require', 'based on'], weight: 0.9 },
    contradicts: { patterns: ['矛盾', 'contradicts', '衝突', '相反', 'vs', 'versus', 'however', 'but'], weight: -1.0 },
    caused: { patterns: ['導致', 'caused', '造成', '引起', 'result in', 'trigger', '因為', '由於'], weight: 0.7 },
    fixed: { patterns: ['修復', 'fixed', '解決', '修正', 'patch', 'remediate', '改善'], weight: 0.8 },
    supersedes: { patterns: ['取代', 'supersedes', '替代', '更新版本', 'replaces', 'newer version', '升級'], weight: 1.0 },
    relates_to: { patterns: ['相關', 'relates to', '關於', '涉及', 'see also', 'refer to'], weight: 0.3 },
    owns: { patterns: ['擁有', 'owns', '負責', '主導', 'owner', 'lead', 'manage'], weight: 0.6 },
    opposes: { patterns: ['反對', 'opposes', '不建議', 'avoid', 'don\'t', '不要'], weight: -0.5 },
    implements: { patterns: ['實作', 'implements', '實踐', '執行', 'run', 'execute'], weight: 0.7 },
    references: { patterns: ['參考', 'references', '引用', '根據', 'according to', 'cites'], weight: 0.5 }
};

// 預設關係（當無法判斷時的 fallback）
const DEFAULT_RELATION = { type: 'relates_to', weight: 0.3 };

/**
 * 提取 Wikilinks
 * 格式: [[Name]] 或 [[Name|Display]]
 */
function extractWikilinks(content) {
    const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    const links = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        links.push({
            target: match[1].trim(),
            display: match[2] ? match[2].trim() : match[1].trim(),
            context: getContext(content, match.index, 100)
        });
    }
    return links;
}

/**
 * 提取上下文
 */
function getContext(content, index, radius) {
    const start = Math.max(0, index - radius);
    const end = Math.min(content.length, index + radius);
    return content.substring(start, end).replace(/\n/g, ' ').trim();
}

/**
 * 推斷關係類型（擴展上下文分析）
 */
function inferRelation(context, sourceContent, targetName) {
    const ctx = context.toLowerCase();
    const fullCtx = (context + ' ' + (sourceContent || '').substring(0, 500)).toLowerCase();

    // 1. 首先檢查明確的關係模式
    for (const [relType, relDef] of Object.entries(RELATION_TYPES)) {
        for (const pattern of relDef.patterns) {
            if (fullCtx.includes(pattern.toLowerCase())) {
                return { type: relType, weight: relDef.weight };
            }
        }
    }

    // 2. 如果目標在「參考來源」或「來源」區塊附近 → references
    if (ctx.includes('參考') || ctx.includes('source') || ctx.includes('來源')) {
        return { type: 'references', weight: 0.5 };
    }

    // 3. 如果目標在「涉及」、「相關」附近 → relates_to
    if (ctx.includes('涉及') || ctx.includes('相關')) {
        return { type: 'relates_to', weight: 0.3 };
    }

    // 4. 如果目標在「使用」、「導入」附近 → uses
    if (ctx.includes('導入') || ctx.includes('使用') || ctx.includes('部署')) {
        return { type: 'uses', weight: 0.8 };
    }

    // 5. 如果目標在標題或章節附近 → implements
    if (ctx.includes('實作') || ctx.includes('實踐') || ctx.includes('執行')) {
        return { type: 'implements', weight: 0.7 };
    }

    return { ...DEFAULT_RELATION };
}

/**
 * 推斷實體類型
 */
function inferEntityType(name, filePath, content) {
    const lowerName = name.toLowerCase();
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();

    // 基於路徑判斷
    if (lowerPath.includes('entity') || lowerPath.includes('實體')) return 'Entity';
    if (lowerPath.includes('concept') || lowerPath.includes('概念')) return 'Concept';
    if (lowerPath.includes('summary') || lowerPath.includes('摘要')) return 'Summary';
    if (lowerPath.includes('crystallized') || lowerPath.includes('結晶')) return 'Crystallized';
    if (lowerPath.includes('raw') || lowerPath.includes('原始')) return 'Raw';

    // 基於關鍵字判斷
    for (const [type, def] of Object.entries(ENTITY_TYPES)) {
        for (const kw of def.keywords) {
            if (lowerContent.includes(kw.toLowerCase()) || lowerName.includes(kw.toLowerCase())) {
                return type;
            }
        }
    }

    // 基於名稱模式
    if (lowerName.includes('_')) return 'Concept';
    if (/^[A-Z]/.test(name) && name.includes(' ')) return 'Concept';

    return 'Concept'; // 預設
}

/**
 * 提取 YAML front matter
 */
function extractFrontMatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return {};

    const yaml = match[1];
    const result = {};

    // 簡單 YAML 解析
    const lines = yaml.split('\n');
    for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;

        const key = line.substring(0, colonIdx).trim();
        let value = line.substring(colonIdx + 1).trim();

        // 處理數組
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }

        // 處理數字
        if (!isNaN(value) && value !== '') {
            value = Number(value);
        }

        result[key] = value;
    }

    return result;
}

/**
 * 掃描整個知識庫
 */
function scanWiki(root) {
    const entities = [];
    const links = [];
    const entityMap = new Map();

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
                    const frontMatter = extractFrontMatter(content);
                    const wikilinks = extractWikilinks(content);
                    const relativePath = path.relative(root, fullPath);

                    // 提取實體
                    const fileName = item.replace('.md', '');
                    const entityType = inferEntityType(fileName, relativePath, content);

                    const entity = {
                        id: fileName,
                        name: frontMatter.title || fileName,
                        type: entityType,
                        path: fullPath,
                        relativePath,
                        category: path.dirname(relativePath).split('/')[0],
                        layer: path.dirname(relativePath).split('/')[1] || 'unknown',
                        tags: frontMatter.tags || [],
                        confidence: frontMatter.confidence || 2,
                        decay_factor: frontMatter.decay_factor || 0.5,
                        last_verified: frontMatter.last_verified || null,
                        created: frontMatter.created || stat.birthtime.toISOString().split('T')[0],
                        updated: frontMatter.updated || stat.mtime.toISOString().split('T')[0],
                        tier: frontMatter.tier ?? 1,
                        mtime: stat.mtimeMs,
                        wikilinksCount: wikilinks.length,
                    };

                    entities.push(entity);
                    entityMap.set(fileName.toLowerCase(), entity);

                    // 提取關係
                    for (const link of wikilinks) {
                        const relation = inferRelation(link.context, content, link.target);

                        links.push({
                            source: fileName,
                            target: link.target,
                            type: relation.type,
                            strength: Math.abs(relation.weight),
                            weight: relation.weight,
                            context: link.context
                        });
                    }
                } catch (e) {
                    console.error(`⚠️  讀取失敗: ${fullPath}: ${e.message}`);
                }
            }
        }
    }

    scanDir(root);
    return { entities, links, entityMap };
}

/**
 * 計算實體連結統計
 */
function computeLinkStats(entities, links) {
    const linkCount = {};
    const incomingLinks = {};
    const outgoingLinks = {};

    for (const link of links) {
        const src = link.source.toLowerCase();
        const tgt = link.target.toLowerCase();

        linkCount[src] = (linkCount[src] || 0) + 1;
        outgoingLinks[src] = (outgoingLinks[src] || 0) + 1;
        incomingLinks[tgt] = (incomingLinks[tgt] || 0) + 1;
    }

    // 更新實體
    for (const entity of entities) {
        const key = entity.id.toLowerCase();
        entity.links = (linkCount[key] || 0) + (incomingLinks[key] || 0);
        entity.incomingLinks = incomingLinks[key] || 0;
        entity.outgoingLinks = outgoingLinks[key] || 0;
    }

    return { linkCount, incomingLinks, outgoingLinks };
}

/**
 * 檢測孤立節點
 */
function findOrphans(entities, links) {
    const connectedNodes = new Set();
    for (const link of links) {
        connectedNodes.add(link.source.toLowerCase());
        connectedNodes.add(link.target.toLowerCase());
    }

    return entities.filter(e => !connectedNodes.has(e.id.toLowerCase()));
}

/**
 * 主流程
 */
function main() {
    console.log('🔍 開始實體提取...');
    console.log(`📂 知識庫: ${WIKI_ROOT}`);

    const { entities, links, entityMap } = scanWiki(WIKI_ROOT);
    console.log(`📊 提取 ${entities.length} 個實體, ${links.length} 條連結`);

    // 計算統計
    computeLinkStats(entities, links);

    // 檢測孤立節點
    const orphans = findOrphans(entities, links);
    console.log(`🧹 孤立節點: ${orphans.length} 個`);

    // 分類統計
    const typeCounts = {};
    for (const e of entities) {
        typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    }
    console.log('📋 實體類型分佈:');
    for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`   ${type}: ${count}`);
    }

    // 關係類型統計
    const relCounts = {};
    for (const l of links) {
        relCounts[l.type] = (relCounts[l.type] || 0) + 1;
    }
    console.log('🔗 關係類型分佈:');
    for (const [type, count] of Object.entries(relCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`   ${type}: ${count}`);
    }

    // 保存結果
    const output = {
        count: entities.length,
        nodes: entities,
        links: links,
        totalWikilinks: links.length,
        stats: {
            typeCounts,
            relCounts,
            orphans: orphans.length,
            orphansList: orphans.map(o => ({ id: o.id, name: o.name, path: o.path }))
        },
        metadata: {
            generated: new Date().toISOString(),
            wikiRoot: WIKI_ROOT,
            version: '3.0',
            schema: 'LLM Wiki v3.0 - Phase 3 結構化'
        }
    };

    const outputPath = path.join(__dirname, 'graph-data-entities.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✅ 結果已保存到: ${outputPath}`);

    // 合併到現有圖譜
    const existingPath = path.join(__dirname, 'graph-data.json');
    if (fs.existsSync(existingPath)) {
        const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));

        // 合併實體資訊
        for (const node of existing.nodes) {
            const nodeId = node.id || node.name || '';
            if (!nodeId) continue;
            const key = nodeId.toLowerCase();
            const extracted = entityMap.get(key);
            if (extracted) {
                node.type = extracted.type;
                node.category = extracted.category;
                node.layer = extracted.layer;
                node.tier = extracted.tier;
                node.confidence = extracted.confidence;
                node.decay_factor = extracted.decay_factor;
                node.last_verified = extracted.last_verified;
                node.tags = extracted.tags;
            }
        }

        // 添加關係類型
        for (const link of existing.links) {
            const src = (typeof link.source === 'object' ? link.source.id : link.source).toLowerCase();
            const tgt = (typeof link.target === 'object' ? link.target.id : link.target).toLowerCase();

            const extractedLink = links.find(l =>
                l.source.toLowerCase() === src && l.target.toLowerCase() === tgt
            );
            if (extractedLink) {
                link.relationType = extractedLink.type;
                link.weight = extractedLink.weight;
            }
        }

        const mergedPath = path.join(__dirname, 'graph-data.json');
        fs.writeFileSync(mergedPath, JSON.stringify(existing, null, 2), 'utf-8');
        console.log(`✅ 圖譜已合併到: ${mergedPath}`);
    }

    return output;
}

// 執行
if (require.main === module) {
    main();
}

module.exports = { extractWikilinks, inferRelation, inferEntityType, scanWiki };
