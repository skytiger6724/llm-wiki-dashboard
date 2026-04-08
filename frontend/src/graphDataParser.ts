import type { TreeNode, GraphNode, GraphLink, GraphData } from './types';

export type { GraphNode, GraphLink, GraphData };

export interface IsolatedNode {
  node: GraphNode;
  reason: 'no_links' | 'single_layer' | 'orphan';
}

/**
 * 判斷檔案所屬的知識層級與分類
 */
function categorizeNode(filePath: string): { layer: string; category: string } {
  const parts = filePath.split('/');
  const wikiIndex = parts.findIndex(p => p === '20_LLM_Wiki');
  if (wikiIndex === -1) return { layer: 'unknown', category: 'unknown' };

  const subPath = parts.slice(wikiIndex + 1);
  const layer = subPath[0]?.replace(/\d+_/, '') || 'unknown';
  const category = subPath[1]?.replace(/\d+_/, '') || 'unknown';

  return { layer, category };
}

/**
 * 從 Markdown 內容中提取 [[wikilink]] 目標
 */
export function extractWikiLinks(content: string): string[] {
  const regex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)]; // 去重
}

/**
 * 從樹狀結構和 wikilink 數據构建圖譜數據
 * wikilinkCache: { fileName: [linkTarget1, linkTarget2, ...] }
 */
export async function buildGraphData(
  tree: TreeNode[],
  wikilinkCache: Record<string, string[]>
): Promise<GraphData> {
  const nodeMap = new Map<string, GraphNode>();
  const linkMap = new Map<string, Map<string, number>>();

  // 先建立所有 Markdown 檔案為節點
  function traverseNodes(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'file' && node.name.endsWith('.md')) {
        const name = node.name.replace('.md', '');
        const { layer, category } = categorizeNode(node.path);
        nodeMap.set(name.toLowerCase(), {
          id: name,
          name,
          category,
          layer,
          links: 0,
          val: 1,
          path: node.path,
        });
        linkMap.set(name.toLowerCase(), new Map());
      }
      if (node.children) traverseNodes(node.children);
    }
  }
  traverseNodes(tree);

  // 從 wikilink 緩存建立邊
  for (const [fileName, targets] of Object.entries(wikilinkCache)) {
    const sourceKey = fileName.toLowerCase();
    if (!linkMap.has(sourceKey)) continue;

    const sourceLinks = linkMap.get(sourceKey)!;

    for (const target of targets) {
      const targetKey = target.toLowerCase();
      if (nodeMap.has(targetKey)) {
        sourceLinks.set(targetKey, (sourceLinks.get(targetKey) || 0) + 1);
      }
    }
  }

  // 計算每個節點的連結數
  for (const [sourceKey, targets] of linkMap.entries()) {
    const sourceNode = nodeMap.get(sourceKey);
    if (sourceNode) {
      sourceNode.links += targets.size;
      sourceNode.val = Math.max(1, Math.min(5, 1 + targets.size * 0.5));
    }
  }

  // 建立邊列表（含強度）
  const links: GraphLink[] = [];
  const processedPairs = new Set<string>();

  for (const [sourceKey, targets] of linkMap.entries()) {
    for (const [targetKey, strength] of targets.entries()) {
      const pairKey = [sourceKey, targetKey].sort().join('|||');
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      // 檢查是否有反向連結（增加強度）
      const reverseStrength = linkMap.get(targetKey)?.get(sourceKey) || 0;
      const finalStrength = strength + reverseStrength;

      links.push({
        source: nodeMap.get(sourceKey)!.id,
        target: nodeMap.get(targetKey)!.id,
        strength: finalStrength,
      });
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    links,
  };
}

/**
 * 識別孤立節點
 */
export function findIsolatedNodes(graphData: GraphData): IsolatedNode[] {
  const connectedNodes = new Set<string>();
  for (const link of graphData.links) {
    connectedNodes.add(typeof link.source === 'string' ? link.source : link.source.id);
    connectedNodes.add(typeof link.target === 'string' ? link.target : link.target.id);
  }

  return graphData.nodes
    .filter(node => !connectedNodes.has(node.id))
    .map(node => {
      let reason: IsolatedNode['reason'] = 'no_links';
      if (node.layer === '01_System') reason = 'single_layer';
      else if (node.category === 'Summaries') reason = 'orphan';
      return { node, reason };
    });
}

/**
 * 計算圖譜統計指標
 */
export function computeGraphMetrics(graphData: GraphData) {
  const { nodes, links } = graphData;
  const totalNodes = nodes.length;
  const totalLinks = links.length;
  const density = totalNodes > 1 ? (2 * totalLinks) / (totalNodes * (totalNodes - 1)) : 0;

  // 分類統計
  const categoryCount: Record<string, number> = {};
  for (const node of nodes) {
    categoryCount[node.category] = (categoryCount[node.category] || 0) + 1;
  }

  // 層級統計
  const layerCount: Record<string, number> = {};
  for (const node of nodes) {
    layerCount[node.layer] = (layerCount[node.layer] || 0) + 1;
  }

  // 平均度
  const avgDegree = totalNodes > 0 ? (2 * totalLinks) / totalNodes : 0;

  // 最大度節點
  const sortedByDegree = [...nodes].sort((a, b) => b.links - a.links);
  const topNodes = sortedByDegree.slice(0, 10);

  // 孤立節點數
  const connectedNodes = new Set<string>();
  for (const link of links) {
    connectedNodes.add(typeof link.source === 'string' ? link.source : link.source.id);
    connectedNodes.add(typeof link.target === 'string' ? link.target : link.target.id);
  }
  const isolatedCount = totalNodes - connectedNodes.size;

  return {
    totalNodes,
    totalLinks,
    density,
    avgDegree,
    categoryCount,
    layerCount,
    topNodes,
    isolatedCount,
  };
}
