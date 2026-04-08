import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphData, GraphNode, GraphLink } from '../types';

interface GraphViewProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  filterCategory?: string;
  filterLayer?: string;
  searchQuery?: string;
}

// 知識層級配色（霓虹風格）
const CATEGORY_COLORS: Record<string, string> = {
  '實體': '#34c759',
  '概念': '#0071e3',
  '摘要': '#ff375f',
  '對比': '#ff9500',
  '綜合': '#af52de',
  'unknown': '#86868b',
};

const LAYER_GLOW: Record<string, string> = {
  'System': 'rgba(255, 214, 10, 0.15)',
  'Raw': 'rgba(90, 200, 250, 0.15)',
  'Wiki': 'rgba(52, 199, 89, 0.15)',
  'Output': 'rgba(175, 82, 222, 0.15)',
  'unknown': 'rgba(134, 134, 139, 0.15)',
};

export const GraphView = ({ data, onNodeClick, filterCategory, filterLayer, searchQuery }: GraphViewProps) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  // 響應式尺寸
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

  // 篩選節點和邊
  const filteredData = (() => {
    let nodes = data.nodes;
    if (filterCategory && filterCategory !== 'all') {
      nodes = nodes.filter(n => n.category === filterCategory);
    }
    if (filterLayer && filterLayer !== 'all') {
      nodes = nodes.filter(n => n.layer.replace(/\d+_/, '') === filterLayer);
    }

    const nodeIds = new Set(nodes.map(n => n.id));
    const links = data.links.filter(l => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
      const targetId = typeof l.target === 'string' ? l.target : l.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return { nodes, links };
  })();

  // 搜尋高亮
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

  // 搜尋時自動縮放
  useEffect(() => {
    if (highlightedNodes.size > 0 && fgRef.current) {
      const matchedNodes = data.nodes.filter(n => highlightedNodes.has(n.id));
      if (matchedNodes.length > 0) {
        fgRef.current.centerAt(
          matchedNodes[0].x,
          matchedNodes[0].y,
          1000
        );
        fgRef.current.zoom(2, 1000);
      }
    }
  }, [highlightedNodes, data.nodes]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    onNodeClick(node);
  }, [onNodeClick]);

  const nodeColor = useCallback((node: GraphNode) => {
    if (highlightedNodes.size > 0) {
      return highlightedNodes.has(node.id) ? '#fff' : 'rgba(107, 114, 128, 0.3)';
    }
    return CATEGORY_COLORS[node.category] || '#6b7280';
  }, [highlightedNodes]);

  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    const size = (node.val || 1) * 3 / globalScale;

    // 節點光暈
    const glow = LAYER_GLOW[node.layer] || 'rgba(107, 114, 128, 0.3)';
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size * 2, 0, 2 * Math.PI);
    ctx.fillStyle = glow;
    ctx.fill();

    // 節點本體
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor(node);
    ctx.fill();

    // 標籤（放大時才顯示）
    if (globalScale > 1.2) {
      ctx.font = `${fontSize}px "Microsoft JhengHei", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, node.x || 0, (node.y || 0) + size + fontSize);
    }

    // 高亮環
    if (highlightedNodes.has(node.id)) {
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, size * 1.5, 0, 2 * Math.PI);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }
  }, [nodeColor, highlightedNodes]);

  const linkColor = useCallback((link: GraphLink) => {
    const alpha = Math.min(0.8, 0.2 + (link.strength || 1) * 0.15);
    return `rgba(0, 229, 255, ${alpha})`;
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null, _: any, event: MouseEvent) => {
    if (node && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 10,
        node,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={filteredData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0d0f12"
        nodeColor={nodeColor}
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        linkWidth={(link: GraphLink) => Math.max(0.5, Math.min(3, (link.strength || 1) * 0.5))}
        linkDirectionalParticles={(link: GraphLink) => Math.min(4, link.strength || 1)}
        linkDirectionalParticleSpeed={0.003}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
        cooldownTime={3000}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 15,
            top: tooltip.y - 10,
            background: 'var(--apple-surface)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--apple-border)',
            borderRadius: '10px',
            padding: '10px 14px',
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: '150px',
            boxShadow: 'var(--apple-shadow-md)',
          }}
        >
          <div style={{ color: 'var(--apple-text-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
            {tooltip.node.name}
          </div>
          <div style={{ color: 'var(--apple-text-secondary)', fontSize: '0.75rem' }}>
            <span style={{ color: CATEGORY_COLORS[tooltip.node.category] }}>{tooltip.node.category}</span>
            {' · '}
            {tooltip.node.layer.replace(/\d+_/, '')}
          </div>
          <div style={{ color: 'var(--apple-text-tertiary)', fontSize: '0.7rem', marginTop: '4px' }}>
            連結數: {tooltip.node.links}
          </div>
        </div>
      )}
    </div>
  );
};
