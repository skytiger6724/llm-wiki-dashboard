import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphData, GraphNode, GraphLink } from '../types';

interface GraphViewProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  filterCategory?: string;
  filterLayer?: string;
  searchQuery?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  '實體': '#34c759',
  '概念': '#0071e3',
  '摘要': '#ff375f',
  '對比': '#ff9500',
  '綜合': '#af52de',
  'unknown': '#86868b',
};

export const GraphView = ({ data, onNodeClick, filterCategory, filterLayer, searchQuery }: GraphViewProps) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  // 🔥 新增：聚焦模式 — 點擊節點後只顯示其 1-hop 鄰居
  const [focusNode, setFocusNode] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 建立鄰居索引（用於聚焦模式）
  const neighborIndex = useMemo(() => {
    const index: Record<string, Set<string>> = {};
    for (const link of data.links) {
      const s = typeof link.source === 'string' ? link.source : link.source.id;
      const t = typeof link.target === 'string' ? link.target : link.target.id;
      if (!index[s]) index[s] = new Set();
      if (!index[t]) index[t] = new Set();
      index[s].add(t);
      index[t].add(s);
    }
    return index;
  }, [data.links]);

  // 建立連結強度索引（用於視覺化）
  const linkStrengthMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const link of data.links) {
      const s = typeof link.source === 'string' ? link.source : link.source.id;
      const t = typeof link.target === 'string' ? link.target : link.target.id;
      const key = [s.toLowerCase(), t.toLowerCase()].sort().join('|||');
      map.set(key, link.strength || 1);
    }
    return map;
  }, [data.links]);

  const filteredData = useMemo(() => {
    let nodes = data.nodes;

    // 🔥 聚焦模式：只保留焦點節點及其 1-hop 鄰居
    if (focusNode) {
      const neighbors = neighborIndex[focusNode.toLowerCase()] || new Set();
      const focusNodeIds = new Set([focusNode, ...neighbors]);
      nodes = nodes.filter(n => focusNodeIds.has(n.id));
    } else {
      if (filterCategory && filterCategory !== 'all') {
        nodes = nodes.filter(n => n.category === filterCategory);
      }
      if (filterLayer && filterLayer !== 'all') {
        nodes = nodes.filter(n => n.layer.replace(/\d+_/, '') === filterLayer);
      }
    }

    const nodeIds = new Set(nodes.map(n => n.id));
    const links = data.links.filter(l => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
      const targetId = typeof l.target === 'string' ? l.target : l.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
    return { nodes, links };
  }, [data.nodes, data.links, filterCategory, filterLayer, focusNode, neighborIndex]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setHighlightedNodes(new Set());
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = new Set<string>(
      data.nodes.filter(n => n.name.toLowerCase().includes(q)).map(n => n.id)
    );
    setHighlightedNodes(matches);
  }, [searchQuery, data.nodes]);

  useEffect(() => {
    if (highlightedNodes.size > 0 && fgRef.current) {
      const matchedNodes = data.nodes.filter(n => highlightedNodes.has(n.id));
      if (matchedNodes.length > 0) {
        fgRef.current.centerAt(matchedNodes[0].x, matchedNodes[0].y, 1000);
        fgRef.current.zoom(2, 1000);
      }
    }
  }, [highlightedNodes, data.nodes]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    // 🔥 Shift+點擊 = 聚焦/取消聚焦
    if (focusNode === node.id) {
      setFocusNode(null); // 取消聚焦
    } else {
      setFocusNode(node.id);
      // 自動縮放到聚焦節點
      if (fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 800);
        fgRef.current.zoom(3, 800);
      }
    }
    onNodeClick(node);
  }, [focusNode, onNodeClick]);

  const nodeColor = useCallback((node: GraphNode) => {
    if (highlightedNodes.size > 0) {
      return highlightedNodes.has(node.id) ? '#fff' : 'rgba(107, 114, 128, 0.3)';
    }
    return CATEGORY_COLORS[node.category] || '#6b7280';
  }, [highlightedNodes]);

  const nodeLabel = useCallback((node: GraphNode) => {
    return `${node.name}\n(${node.category}) [${node.links} 連結]`;
  }, []);

  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const size = (node.val || 1) * 3 / globalScale;

    // 光暈
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size * 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(100, 100, 100, 0.08)';
    ctx.fill();

    // 節點
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor(node);
    ctx.fill();

    // 🔥 聚焦節點特殊標記
    if (focusNode === node.id) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, size * 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }

    // 高亮環
    if (highlightedNodes.has(node.id)) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, size * 1.6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }
  }, [nodeColor, highlightedNodes, focusNode]);

  // 🔥 連結視覺化：strength → 粗細 + 透明度
  const linkWidth = useCallback((link: GraphLink) => {
    const strength = link.strength || 1;
    return 0.5 + (strength - 1) * 0.8; // strength=1 → 0.5, strength=2 → 1.3
  }, []);

  const linkColor = useCallback((link: GraphLink) => {
    const strength = link.strength || 1;
    const alpha = 0.15 + (strength - 1) * 0.25; // strength=1 → 0.15, strength=2 → 0.4
    return `rgba(100, 160, 255, ${Math.min(alpha, 0.6)})`;
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null, _: any, event: MouseEvent) => {
    if (node && event) {
      setTooltip({ x: event.clientX, y: event.clientY, node });
    } else {
      setTooltip(null);
    }
  }, []);

  // 重置聚焦
  const resetFocus = useCallback(() => {
    setFocusNode(null);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 🔥 聚焦模式提示 */}
      {focusNode && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: 8, padding: '6px 14px',
          fontSize: '0.75rem', zIndex: 100, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>🔍 聚焦: <b>{focusNode}</b>（點擊其他節點切換）</span>
          <button onClick={resetFocus} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4,
            color: '#fff', cursor: 'pointer', padding: '2px 8px', fontSize: '0.7rem',
          }}>重置</button>
        </div>
      )}

      {/* 🔥 Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 15,
          top: tooltip.y - 10,
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.72rem',
          maxWidth: 200,
          zIndex: 200,
          pointerEvents: 'none',
          lineHeight: 1.4,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.node.name}</div>
          <div style={{ color: CATEGORY_COLORS[tooltip.node.category] || '#888' }}>
            {tooltip.node.category} · {tooltip.node.layer}
          </div>
          <div style={{ marginTop: 4, color: '#aaa' }}>
            {tooltip.node.links} 條連結
          </div>
        </div>
      )}

      <ForceGraph2D
        ref={fgRef}
        graphData={filteredData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0d0f12"
        nodeColor={nodeColor}
        nodeCanvasObject={nodeCanvasObject}
        nodeLabel={nodeLabel}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={0.5}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
        cooldownTime={3000}
      />
    </div>
  );
};
