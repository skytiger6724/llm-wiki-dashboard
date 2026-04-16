import { useRef, useCallback, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const COLORS: Record<string, string> = {
  'Entities_實體': '#00f2ff',
  'Concepts_概念': '#7000ff',
  'Summaries_摘要': '#ff007a',
  'Synthesis_綜合': '#00ff85',
  'Crystallized_核心結晶': '#ffcc00',
  '01_System_系統層': '#8b5cf6',
  '02_Raw_原始資料': '#06b6d4',
  '03_Wiki_知識層': '#10b981',
  '04_Output_產出層': '#f59e0b',
};

interface GraphViewProps {
  nodes: any[];
  links: any[];
  onNodeClick: (node: any) => void;
  searchQuery: string;
}

export function GraphView({ nodes, links, onNodeClick, searchQuery }: GraphViewProps) {
  const fgRef = useRef<any>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [nodeScale, setNodeScale] = useState(2.0);
  const [linkDist, setLinkDist] = useState(120);
  const [minDegree, setMinDegree] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState('all');
  
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useLayoutEffect(() => {
    const updateSize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const gData = useMemo(() => {
    const processedNodes = (nodes || []).map(n => ({ ...n, id: n.name || n.id }));
    const processedLinks = (links || []).map(l => ({
      ...l,
      source: l.source?.id || l.source?.name || l.source,
      target: l.target?.id || l.target?.name || l.target
    }));
    const filteredNodes = processedNodes.filter(n => {
      const layer = n.layer || n.category || 'unknown';
      return (selectedLayer === 'all' || layer === selectedLayer) && (n.links || 0) >= minDegree;
    });
    const nIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = processedLinks.filter(l => nIds.has(l.source) && nIds.has(l.target));
    return { nodes: filteredNodes, links: filteredLinks };
  }, [nodes, links, selectedLayer, minDegree]);

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

  const handleHover = useCallback((node: any) => {
    if (!node) { 
        setHighlightNodes(new Set()); 
        setHighlightLinks(new Set()); 
        setHoverNode(null); 
        if (fgRef.current) fgRef.current.renderer().domElement.style.cursor = 'default';
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
    if (fgRef.current) fgRef.current.renderer().domElement.style.cursor = 'pointer';
  }, [gData]);

  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force('link').distance(linkDist);
    fgRef.current.d3Force('charge').strength(-800);
    fgRef.current.d3ReheatSimulation();
  }, [linkDist, gData.nodes.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000000', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 100,
        background: 'rgba(5,5,15,0.95)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        borderRadius: 20, padding: 20, border: '1px solid rgba(0,242,255,0.2)',
        boxShadow: '0 12px 48px rgba(0,0,0,1)', width: 260, color: '#fff',
      }}>
        <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 16, color: '#00f2ff', textTransform: 'uppercase', textAlign: 'center' }}>✨ Stellar Map v3.1</div>
        <button onClick={() => fgRef.current?.zoomToFit(600, 80)} style={{
            width: '100%', padding: '8px', background: 'rgba(0,242,255,0.1)', border: '1px solid #00f2ff',
            borderRadius: 8, color: '#00f2ff', fontWeight: 700, cursor: 'pointer', marginBottom: 16, fontSize: 10
        }}>🎯 RESET VIEWPORT</button>
        {[
          { label: 'NODE SIZE', val: nodeScale, min: 0.5, max: 6, step: 0.1, set: setNodeScale },
          { label: 'EXPANSION', val: linkDist, min: 50, max: 400, step: 10, set: setLinkDist },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#00f2ff', marginBottom: 4 }}>
              <span>{s.label}</span><span>{s.val}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        ))}
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={gData}
        nodeRelSize={1}
        nodeVal={(n: any) => Math.max(8, Math.min(30, Math.log10((n.links || 1) + 1) * 15)) * nodeScale}
        nodeCanvasObjectMode={() => 'always'}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, gs: number) => {
          const degree = node.links || 1;
          const sz = Math.max(8, Math.min(30, Math.log10(degree + 1) * 15)) * nodeScale;
          const layer = node.layer || node.category || '';
          const color = COLORS[layer] || '#ffffff';
          const isHl = highlightNodes.has(node.id);
          const isHv = hoverNode === node.id;

          // 1. Halo
          const r = sz * (isHv ? 4 : 3);
          const g = ctx.createRadialGradient(node.x!, node.y!, sz * 0.1, node.x!, node.y!, r);
          g.addColorStop(0, color + '55');
          g.addColorStop(0.5, color + '11');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI); ctx.fill();

          // 2. Core
          ctx.fillStyle = isHv ? '#fff' : color;
          ctx.beginPath(); ctx.arc(node.x!, node.y!, sz, 0, 2 * Math.PI); ctx.fill();

          // 3. Label
          if (showLabels && (gs > 0.4 || isHl)) {
            const fontSize = (isHv ? 18 : 13) / Math.max(gs, 0.5);
            ctx.font = `${(isHv || isHl) ? '900' : '600'} ${fontSize}px "Inter", sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillStyle = isHv ? '#fff' : (isHl ? color : 'rgba(255,255,255,0.9)');
            ctx.fillText(node.name, node.x!, node.y! + sz + (10 / Math.max(gs, 0.5)));
          }
        }}
        linkColor={(l: any) => {
            const sId = l.source?.id || l.source;
            const tId = l.target?.id || l.target;
            return highlightLinks.has(`${sId}--${tId}`) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)';
        }}
        linkWidth={(l: any) => {
            const sId = l.source?.id || l.source;
            const tId = l.target?.id || l.target;
            return highlightLinks.has(`${sId}--${tId}`) ? 3.0 : 1.0;
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={3}
        backgroundColor="#000000"
        onNodeHover={handleHover}
        onNodeClick={(node: any) => onNodeClick(node)}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
