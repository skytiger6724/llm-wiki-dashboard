import { useRef, useCallback, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// Obsidian-style category colors
const SUBCATEGORY_COLORS: Record<string, string> = {
  'Entities_實體': '#34d399',
  'Concepts_概念': '#3b82f6',
  'Summaries_摘要': '#f472b6',
  'Synthesis_綜合': '#a78bfa',
  'Crystallized_核心結晶': '#fbbf24',
};

const LAYER_COLORS: Record<string, string> = {
  '01_System_系統層': '#8b5cf6',
  '02_Raw_原始資料': '#06b6d4',
  '03_Wiki_知識層': '#10b981',
  '04_Output_產出層': '#f59e0b',
  '核心結晶': '#fbbf24',
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
  const [darkMode, setDarkMode] = useState(false);
  const [nodeScale, setNodeScale] = useState(1.0);
  const [linkDist, setLinkDist] = useState(30);
  const [minDegree, setMinDegree] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState('all');

  // Build adjacency once
  const adjRef = useRef<Map<string, Set<string>>>(new Map());
  if (adjRef.current.size === 0 && nodes.length > 0) {
    const m = new Map<string, Set<string>>();
    links.forEach(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      if (!m.has(sourceId)) m.set(sourceId, new Set());
      if (!m.has(targetId)) m.set(targetId, new Set());
      m.get(sourceId)!.add(targetId);
      m.get(targetId)!.add(sourceId);
    });
    adjRef.current = m;
  }

  // Link strength cache
  const strRef = useRef<Map<string, number>>(new Map());
  if (strRef.current.size === 0 && links.length > 0) {
    const m = new Map<string, number>();
    links.forEach(l => { 
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      const k = `${sourceId}--${targetId}`; 
      m.set(k, (m.get(k) || 0) + (l.strength || 1)); 
    });
    strRef.current = m;
  }

  const layers = Array.from(new Set(nodes.map(n => n.layer || n.category || 'unknown')));

  const fNodes = nodes.filter(n => {
    const layer = n.layer || n.category || 'unknown';
    if (selectedLayer !== 'all' && layer !== selectedLayer) return false;
    if ((n.links || 0) < minDegree) return false;
    return true;
  });
  const nIds = new Set(fNodes.map(n => n.name));
  const fLinks = links.filter(l => {
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    return nIds.has(sourceId) && nIds.has(targetId);
  });

  // Wiki v2.0: 搜尋高亮邏輯
  const isMatch = useCallback((n: any) => {
    if (!searchQuery) return true;
    return n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const onNodeHover = useCallback((node: any) => {
    if (!node) { setHighlightNodes(new Set()); setHighlightLinks(new Set()); setHoverNode(null); return; }
    const id = node.name;
    setHoverNode(id);
    const neighbors = adjRef.current.get(id) || new Set();
    setHighlightNodes(new Set([id, ...neighbors]));
    const hl = new Set<string>();
    fLinks.forEach(l => { 
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      if (sourceId === id || targetId === id) hl.add(`${sourceId}--${targetId}`); 
    });
    setHighlightLinks(hl);
  }, [fLinks]);

  const gColor = useCallback((n: any) => {
    const layer = n.layer || n.category || '';
    const base = SUBCATEGORY_COLORS[layer] || LAYER_COLORS[layer] || '#6b7280';
    
    const matched = isMatch(n);
    if (searchQuery && !matched) return darkMode ? '#1e293b' : '#e2e8f0';
    if (hoverNode && !highlightNodes.has(n.name)) return darkMode ? '#1e293b' : '#e2e8f0';
    
    return base;
  }, [hoverNode, highlightNodes, darkMode, searchQuery, isMatch]);

  const gSize = useCallback((n: any) => {
    const base = Math.max(1.5, Math.min(10, Math.sqrt(n.links || 1) * 1.5));
    const confidenceScale = n.confidence ? (n.confidence / 3) : 1;
    const crystallizedBonus = n.isCrystallized ? 1.5 : 1;
    return base * confidenceScale * crystallizedBonus * nodeScale;
  }, [nodeScale]);

  const lColor = useCallback((l: any) => {
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    const k = `${sourceId}--${targetId}`;
    const hl = highlightLinks.has(k);
    if (hoverNode && !hl) return darkMode ? 'rgba(30,41,59,0.04)' : 'rgba(226,232,240,0.08)';
    const strength = l.strength || 1;
    const a = hl ? 0.7 : Math.min(0.35, strength * 0.12);
    if (l.relation) return darkMode ? `rgba(251,191,36,${a})` : `rgba(217,119,6,${a})`; 
    return darkMode ? `rgba(139,92,246,${a})` : `rgba(99,102,241,${a})`;
  }, [hoverNode, highlightLinks, darkMode]);

  const lWidth = useCallback((l: any) => {
    const s = l.strength || 1;
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    const k = `${sourceId}--${targetId}`;
    return highlightLinks.has(k) ? Math.max(0.8, s * 0.8) : Math.max(0.2, s * 0.3);
  }, [highlightLinks]);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.centerAt();
      fgRef.current.zoom(0.7, 0);
    }
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      const f = fgRef.current.d3Force('link');
      if (f) f.distance(linkDist);
    }
  }, [linkDist]);

  const bg = darkMode ? '#0f172a' : '#fafafa';
  const txt = darkMode ? '#e2e8f0' : '#1e293b';
  const panelBg = darkMode ? 'rgba(30,41,59,0.92)' : 'rgba(255,255,255,0.92)';
  const border = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const muted = darkMode ? '#64748b' : '#94a3b8';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: bg }}>
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 100,
        background: panelBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 14, padding: 14, border: `1px solid ${border}`,
        boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
        width: 220, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
        fontSize: 11, color: txt,
      }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, letterSpacing: '-0.01em' }}>⚡ Obsidian Graph View v2.0</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[
            { label: showLabels ? '🏷️ On' : '🏷️ Off', active: showLabels, onClick: () => setShowLabels(!showLabels) },
            { label: darkMode ? '☀️ Light' : '🌙 Dark', active: darkMode, onClick: () => setDarkMode(!darkMode) },
          ].map(b => (
            <button key={b.label} onClick={b.onClick} style={{
              flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 600, border: 'none', borderRadius: 6,
              cursor: 'pointer', transition: 'all 0.15s',
              background: b.active ? '#6366f1' : (darkMode ? '#334155' : '#f1f5f9'),
              color: b.active ? '#fff' : txt,
            }}>{b.label}</button>
          ))}
        </div>
        {[
          { label: 'Node Size', val: nodeScale, min: 0.5, max: 3, step: 0.1, unit: 'x', set: setNodeScale },
          { label: 'Link Dist', val: linkDist, min: 10, max: 80, step: 5, unit: 'px', set: setLinkDist },
          { label: 'Min Degree', val: minDegree, min: 0, max: 20, step: 1, unit: '', set: setMinDegree },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: muted, marginBottom: 3 }}>
              <span>{s.label}</span><span>{s.val}{s.unit}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={e => s.set(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', height: 4 }} />
          </div>
        ))}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: muted, marginBottom: 4 }}>Layer</div>
          <select value={selectedLayer} onChange={e => setSelectedLayer(e.target.value)}
            style={{
              width: '100%', padding: '4px 8px', fontSize: 10, borderRadius: 6,
              border: `1px solid ${border}`, background: darkMode ? '#1e293b' : '#fff',
              color: txt, outline: 'none',
            }}>
            <option value="all">All ({nodes.length})</option>
            {layers.map(l => <option key={l} value={l}>{l.replace(/_/g, ' ')} ({nodes.filter(n => (n.layer || n.category) === l).length})</option>)}
          </select>
        </div>
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8, marginTop: 4 }}>
          <div style={{ fontSize: 9, color: muted, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Legend</div>
          {Object.entries(SUBCATEGORY_COLORS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: v }} />
              <span style={{ fontSize: 9 }}>{k.split('_')[0]}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8, marginTop: 8, fontSize: 10, color: muted }}>
          <span style={{ color: txt, fontWeight: 600 }}>{fNodes.length}</span> nodes · <span style={{ color: txt, fontWeight: 600 }}>{fLinks.length}</span> links
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes: fNodes, links: fLinks }}
        nodeRelSize={1}
        nodeVal={gSize}
        nodeColor={gColor}
        nodeCanvasObjectMode={() => ['after']}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, gs: number) => {
          const sz = gSize(node);
          const hl = highlightNodes.has(node.name);
          const hv = hoverNode === node.name;
          const layer = node.layer || node.category || '';
          const base = SUBCATEGORY_COLORS[layer] || LAYER_COLORS[layer] || '#6b7280';

          if (node.isCrystallized) {
            const r = sz * 2.5;
            const g = ctx.createRadialGradient(node.x!, node.y!, sz * 0.5, node.x!, node.y!, r);
            g.addColorStop(0, '#fbbf2440');
            g.addColorStop(1, '#fbbf2400');
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }

          if (hl) {
            const r = sz * (hv ? 3 : 2);
            const g = ctx.createRadialGradient(node.x!, node.y!, sz * 0.3, node.x!, node.y!, r);
            g.addColorStop(0, base + '35');
            g.addColorStop(1, base + '00');
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, hv ? sz * 1.4 : sz, 0, Math.PI * 2);
          ctx.fillStyle = gColor(node);
          ctx.fill();

          if (node.isCrystallized) {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          if (hl) {
            ctx.strokeStyle = hv ? '#fff' : (darkMode ? '#475569' : '#cbd5e1');
            ctx.lineWidth = hv ? 2 : 1;
            ctx.stroke();
          }

          if (showLabels && gs > 0.55) {
            const matched = isMatch(node);
            const op = Math.min(1, (gs - 0.55) * 2.5);
            const show = highlightNodes.size === 0 || hl || (searchQuery && matched);
            
            if (show || gs > 0.8) {
                ctx.font = `${(hv || node.isCrystallized) ? '600' : '400'} ${hv ? 12 : 10}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
                ctx.fillStyle = darkMode ? `rgba(226,232,240,${op * (show ? 0.9 : 0.08)})` : `rgba(30,41,59,${op * (show ? 0.9 : 0.08)})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                const crystalIcon = node.isCrystallized ? '💎 ' : '';
                const name = node.name.length > 28 ? node.name.slice(0, 28) + '…' : node.name;
                ctx.fillText(crystalIcon + name, node.x!, node.y! + sz + 4);
            }
          }
        }}
        linkColor={lColor}
        linkWidth={lWidth}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={lColor}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.002}
        linkDirectionalParticleColor={(l: any) => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          const k = `${sourceId}--${targetId}`;
          return highlightLinks.has(k) ? '#818cf8' : (darkMode ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.15)');
        }}
        backgroundColor={bg}
        onNodeHover={onNodeHover}
        onNodeClick={onNodeClick}
        d3AlphaDecay={0.015}
        d3VelocityDecay={0.3}
        warmupTicks={150}
        cooldownTicks={Infinity}
        minZoom={0.05}
        maxZoom={5}
        width={window.innerWidth - 30}
        height={window.innerHeight - 60}
      />
    </div>
  );
}
