export interface GraphNode {
  name: string;
  category: string;
  layer: string;
  path: string;
  links: number;
  confidence?: number;
  decay_factor?: number;
  isCrystallized?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  index?: number;
  id?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  wikilinks: Record<string, string[]>;
  count: number;
  totalWikilinks: number;
}

/**
 * 從 API 回應建立圖譜數據
 * 按照 Karpathy LLM Wiki 邏輯：
 * - wikilinks 是核心關聯數據
 * - 連結計數反映節點的知識密度
 */
export async function buildGraphData(
  tree: any[],
  _wikilinks: Record<string, string[]>
): Promise<GraphData> {
  // 從 API 獲取完整圖譜數據
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[GraphData] 嘗試加載圖譜數據 (第 ${attempt} 次)...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 秒超時

      const res = await fetch('/api/all-content', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      console.log(`[GraphData] 加載成功: ${json.count || 0} 節點, ${json.links?.length || 0} 連結`);
      return {
        nodes: json.nodes || [],
        links: json.links || [],
        wikilinks: json.wikilinks || {},
        count: json.count || 0,
        totalWikilinks: json.totalWikilinks || 0,
      };
    } catch (e: any) {
      lastError = e;
      console.warn(`[GraphData] 加載失敗 (第 ${attempt} 次):`, e.message);
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 遞延重試
        console.log(`[GraphData] ${delay}ms 後重試...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('[GraphData] 所有重試失敗，返回空數據');
  return { nodes: [], links: [], wikilinks: {}, count: 0, totalWikilinks: 0 };
}

/**
 * 計算知識密度指標
 * 基於 Metcalfe's Law 和實際連結數
 */
export function computeKnowledgeDensity(graphData: GraphData): {
  density: number;
  avgLinks: number;
  maxLinks: number;
  isolated: number;
  hubs: GraphNode[];
} {
  const n = graphData.nodes.length;
  const e = graphData.links.length;
  const maxPossible = n * (n - 1);
  const density = maxPossible > 0 ? (2 * e / maxPossible) * 100 : 0;
  const avgLinks = n > 0 ? e / n : 0;
  const maxLinks = Math.max(...graphData.nodes.map((node) => node.links || 0), 0);
  const isolated = graphData.nodes.filter((node) => node.links === 0).length;

  // 知識中心（連結數 > avg + 1std）
  const stdDev =
    n > 0
      ? Math.sqrt(graphData.nodes.reduce((sum, node) => sum + Math.pow((node.links || 0) - avgLinks, 2), 0) / n)
      : 0;
  const hubs = graphData.nodes
    .filter((node) => (node.links || 0) > avgLinks + stdDev)
    .sort((a, b) => (b.links || 0) - (a.links || 0))
    .slice(0, 10);

  return { density, avgLinks, maxLinks, isolated, hubs };
}
