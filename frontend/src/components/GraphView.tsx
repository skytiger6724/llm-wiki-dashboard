import React, { useRef, useCallback, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const COLORS: Record<string, string> = {
  'Entities_實體': '#00f2ff',
  'Concepts_概念': '#7000ff',
  'Summaries_摘要': '#ff007a',
  'Synthesis_綜合': '#00ff85',
  'Crystallized_核心結晶': '#ffcc00',
  'Wiki': '#10b981',
};

interface GraphViewProps {
  nodes: any[];
  links: any[];
  onNodeClick: (node: any) => void;
  searchQuery: string;
}

export const GraphView = React.memo(({ nodes, links, onNodeClick, searchQuery }: GraphViewProps) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [nodeScale, setNodeScale] = useState(3.0); // 提高初始倍率
  const [linkDist, setLinkDist] = useState(160); // 提高初始間距
  const [minDegree, setMinDegree] = useState(0);
  
  const [dims, setDims] = useState({ width: window.innerWidth - 200, height: window.innerHeight });

  // 1. 強力尺寸追蹤
  useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDims({ width, height });
          console.log(`[Graph] New Dims: ${width}x${height}`);
        }
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. 穩定數據源
  const gData = useMemo(() => {
    const processedNodes = (nodes || []).map(n => ({ ...n, id: n.name || n.id }));
    const processedLinks = (links || []).map(l => ({
      ...l,
      source: l.source?.id || l.source?.name || l.source,
      target: l.target?.id || l.target?.name || l.target
    }));

    const nIds = new Set(processedNodes.map(n => n.id));
    const filteredLinks = processedLinks.filter(l => nIds.has(l.source) && nIds.has(l.target));

    return { nodes: processedNodes, links: filteredLinks };
  }, [nodes.length, links.length]);

  const adjRef = useRef<Map<string, Set<string>>>(new Map());
  useEffect(() => {
    const m = new Map<string, Set<string>>();
    gData.links.forEach(l => {
      const s = l.source;
      const t = l.target;
      if (typeof s === 'string' && typeof t === 'string') {
        if (!m.has(s)) m.set(s, new Set());
        if (!m.has(t)) m.set(t, new Set());
        m.get(s)!.add(t);
        m.get(t)!.add(s);
      }
    });
    adjRef.current = m;
  }, [gData]);

  // 3. 物理與參數連動 (解決調節棒失效)
  useEffect(() => {
    if (!fgRef.current) return;
    const fg = fgRef.current;
    fg.d3Force('link').distance(linkDist);
    fg.d3Force('charge').strength(-1200);
    fg.d3ReheatSimulation();
    console.log("[Graph] Simulation Reheated - Expansion:", linkDist);
  }, [linkDist, nodes.length]);

  const handleHover = useCallback((node: any) => {
    if (hoverNode === (node?.id || null)) return;
    if (!node) { 
        setHighlightNodes(new Set()); setHighlightLinks(new Set()); setHoverNode(null); 
        return; 
    }
    const id = node.id;
    setHoverNode(id);
    const neighbors = adjRef.current.get(id) || new Set();
    setHighlightNodes(new Set([id, ...neighbors]));
    const hl = new Set<string>();
    gData.links.forEach(l => { 
      const sId = l.source?.id || l.source;
      const tId = l.target?.id || l.target;
      if (sId === id || tId === id) hl.add(`${sId}--${tId}`); 
    });
    setHighlightLinks(hl);
  }, [gData.links, hoverNode]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', background: '#000000', overflow: 'hidden' }}>
      {/* 頂層控制面板：確保 zIndex 高且不擋住點擊 */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 1000,
        background: 'rgba(5,5,15,0.98)', backdropFilter: 'blur(30px)', borderRadius: 24, padding: 24, 
        border: '1px solid rgba(0,242,255,0.4)', boxShadow: '0 12px 64px rgba(0,0,0,1)', width: 280, color: '#fff',
        pointerEvents: 'auto'
      }}>
        <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 16, color: '#00f2ff', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2em' }}>✨ Stellar Map v3.6</div>
        
        <button onClick={() => fgRef.current?.zoomToFit(600, 100)} style={{
            width: '100%', padding: '12px', background: 'rgba(0,242,255,0.2)', border: '1px solid #00f2ff',
            borderRadius: 12, color: '#00f2ff', fontWeight: 900, cursor: 'pointer', marginBottom: 20, fontSize: 11
        }}>🎯 RESET VIEWPORT</button>

        {[
          { label: 'NODE SIZE', val: nodeScale, min: 1, max: 10, step: 0.1, set: setNodeScale },
          { label: 'EXPANSION', val: linkDist, min: 50, max: 600, step: 10, set: setLinkDist },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#00f2ff', marginBottom: 8, fontWeight: 800 }}>
              <span>{s.label}</span><span>{s.val}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(parseFloat(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>
        ))}
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={gData}
        width={dims.width}
        height={dims.height}
        backgroundColor="#000000"
        
        // 核心尺寸邏輯：顯著放大
        nodeRelSize={nodeScale}
        nodeVal={(n: any) => (n.links || 1) + 5}
        nodeLabel="name"
        nodeColor={(n: any) => COLORS[n.layer || n.category] || '#ffffff'}
        
        // 渲染重構：簡單、高對比、發光
        nodeCanvasObjectMode={() => 'always'}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, gs: number) => {
          const isHl = highlightNodes.has(node.id);
          const isHv = hoverNode === node.id;
          const sz = (Math.log10((node.links || 1) + 1) * 8 + 10) * nodeScale;
          const color = COLORS[node.layer || node.category] || '#ffffff';

          // 核心球體
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, sz, 0, 2 * Math.PI);
          ctx.fillStyle = (isHv || isHl) ? '#fff' : color;
          ctx.fill();

          // 標籤
          if (gs > 0.3 || isHl) {
            const fontSize = (isHv ? 20 : 14) / Math.max(gs, 0.4);
            ctx.font = `${(isHv || isHl) ? '900' : '600'} ${fontSize}px "Inter", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillText(node.name, node.x! + 1, node.y! + sz + 12);
            ctx.fillStyle = (isHv || isHl) ? '#fff' : 'rgba(255,255,255,0.9)';
            ctx.fillText(node.name, node.x!, node.y! + sz + 11);
          }
        }}

        // 連結邏輯
        linkColor={() => 'rgba(255,255,255,0.1)'}
        linkWidth={0.5}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={3}
        
        // 交互邏輯
        onNodeHover={handleHover}
        onNodeClick={onNodeClick}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        
        // 性能與穩定性
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.3}
        cooldownTicks={10000}
      />
    </div>
  );
});
