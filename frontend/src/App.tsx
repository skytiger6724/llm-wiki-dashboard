import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight, ChevronDown, FileText, Folder, BrainCircuit,
  Network, BarChart3, AlertTriangle, Search, X, Sparkles, Clock, Link2, Layers, TrendingUp, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { GraphView } from './components/GraphView';
import { DashboardMetrics } from './components/DashboardMetrics';
import { IsolatedNodes } from './components/IsolatedNodes';
import { buildGraphData, computeKnowledgeDensity, type GraphData, type GraphNode } from './graphDataParser';
import type { ContentTreeItem, ChangelogEntry } from './types';

type ViewMode = 'home' | 'reader' | 'graph' | 'metrics' | 'isolated';

// ==================== 樹狀目錄組件 ====================
const TreeNodeItem = ({ node, onSelect, activePath, depth = 0 }: {
  node: ContentTreeItem; onSelect: (p: string) => void; activePath: string | null; depth?: number;
}) => {
  const [open, setOpen] = useState(false); // 預設不展開
  const isActive = activePath === node.path;
  const displayName = node.name.replace(/^\d+/, '').replace(/^[_-]+/, '');

  if (node.type === 'dir') {
    return (
      <div>
        <div onClick={() => setOpen(!open)} style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#202122',
          padding: '3px 4px', fontSize: depth === 0 ? '0.82rem' : '0.78rem', fontWeight: depth === 0 ? 600 : 400,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaf3ff')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          <Folder size={11} style={{ marginRight: '4px', opacity: 0.5 }} />
          {displayName}
        </div>
        {open && node.children?.map((c) => <TreeNodeItem key={c.path} node={c} onSelect={onSelect} activePath={activePath} depth={depth + 1} />)}
      </div>
    );
  }

  return (
    <div onClick={() => onSelect(node.path)} style={{
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      padding: '2px 4px', marginLeft: `${depth * 12 + 16}px`,
      fontSize: '0.76rem', color: '#0645ad', borderRadius: '2px',
      backgroundColor: isActive ? '#eaf3ff' : 'transparent',
      fontWeight: isActive ? 600 : 400,
    }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <FileText size={10} style={{ marginRight: '4px', opacity: 0.5, flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
    </div>
  );
};

// ==================== Changelog 組件 ====================
const ChangelogList = ({ entries }: { entries: ChangelogEntry[] }) => {
  const TYPE_CFG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
    add: { icon: '✅', color: '#14866d', bg: '#e6f7f1', label: '新增' },
    fix: { icon: '🔧', color: '#a45700', bg: '#fef0db', label: '修復' },
    update: { icon: '📝', color: '#0645ad', bg: '#eaf3ff', label: '更新' },
    remove: { icon: '🗑️', color: '#d33', bg: '#fee7e6', label: '刪除' },
    scan: { icon: '🔍', color: '#7b61ff', bg: '#f0e6ff', label: '掃描' },
  };

  if (!entries || entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: '#72777d' }}>
        <Clock size={20} style={{ marginBottom: '6px', opacity: 0.5 }} />
        <div style={{ fontSize: '0.82rem' }}>尚無變更記錄</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {entries.slice(0, 5).map((entry, i) => {
        const cfg = TYPE_CFG[entry.type] || TYPE_CFG.update;
        return (
          <div key={i} style={{
            background: '#fff', borderRadius: '2px', padding: '8px 10px',
            border: '1px solid #eaecf0', borderLeft: `3px solid ${cfg.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, padding: '1px 5px', borderRadius: '2px', backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#72777d' }}>{entry.title.split('—')[0]?.trim()}</span>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 500, marginBottom: '2px', color: '#202122' }}>
              {entry.title.split('—').slice(1).join('—').trim()}
            </div>
            {entry.summary && <div style={{ fontSize: '0.7rem', color: '#54595d', lineHeight: 1.4 }}>{entry.summary}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ==================== 全站搜尋 ====================
const GlobalSearch = ({ graphData, onNodeClick }: { graphData: GraphData | null; onNodeClick: (node: GraphNode) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);

  useEffect(() => {
    if (!graphData || !query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(graphData.nodes.filter(n => n.name.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)).slice(0, 20));
  }, [query, graphData]);

  const CAT_COLORS: Record<string, string> = { 實體: '#14866d', 概念: '#0645ad', 摘要: '#d33', 綜合: '#7b61ff' };

  return (
    <div>
      <div style={{ position: 'relative', background: '#fff', border: '1px solid #a2a9b1', borderRadius: '2px', padding: '4px', marginBottom: '14px' }}>
        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#72777d' }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus placeholder="搜尋知識庫..."
          style={{ width: '100%', padding: '9px 34px 9px 34px', backgroundColor: 'transparent', border: 'none', color: '#202122', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif' }} />
        {query && <X size={15} onClick={() => setQuery('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#72777d', cursor: 'pointer' }} />}
      </div>

      {query && results.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px', overflow: 'hidden' }}>
          {results.map((node, i) => (
            <div key={i} onClick={() => { if (node.path) onNodeClick(node); }}
              style={{ padding: '7px 10px', cursor: node.path ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eaecf0' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaf3ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CAT_COLORS[node.category.split('_')[0]] || '#72777d' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', color: '#0645ad', fontWeight: 500 }}>{node.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#72777d' }}>{node.category}</div>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#72777d' }}>{node.links} 🔗</div>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && <div style={{ textAlign: 'center', padding: '28px', color: '#72777d' }}><div>找不到符合的結果</div></div>}

      {graphData && !query && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { label: '知識節點', value: graphData.count || graphData.nodes.length, color: '#0645ad', icon: Layers },
            { label: '關聯連結', value: graphData.links.length, color: '#14866d', icon: Link2 },
            { label: 'Wikilinks', value: graphData.totalWikilinks || 0, color: '#7b61ff', icon: TrendingUp },
            { label: '平均連結', value: (() => { const n = graphData.count || graphData.nodes.length; const e = graphData.links.length; return n > 0 ? (e / n).toFixed(1) : '0'; })(), color: '#a45700', icon: ArrowUpRight },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ background: '#f8f9fa', border: '1px solid #eaecf0', borderRadius: '2px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#54595d', marginTop: '1px' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==================== 主應用 ====================
function App() {
  const [tree, setTree] = useState<ContentTreeItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/tree').then(r => r.json()).then((data: ContentTreeItem[]) => {
      const filtered = data.length === 1 && data[0].children ? data[0].children : data;
      setTree(filtered);
    });
    fetch('http://localhost:3001/api/km-changelog').then(r => r.json()).then(d => setChangelog(d.entries || []));
  }, []);

  useEffect(() => {
    if (selectedPath) {
      setLoading(true);
      fetch(`http://localhost:3001/api/content?path=${encodeURIComponent(selectedPath)}`).then(r => r.text()).then(t => { setContent(t); setLoading(false); });
    }
  }, [selectedPath]);

  const loadGraphData = useCallback(async () => {
    if (graphData || tree.length === 0) return;
    setGraphLoading(true);
    try { const g = await buildGraphData(tree, {}); setGraphData(g); }
    catch (e) { console.error(e); }
    finally { setGraphLoading(false); }
  }, [tree, graphData]);

  const findPathByName = useCallback((name: string, nodes: ContentTreeItem[]): string | null => {
    for (const n of nodes) {
      if (n.type === 'file' && n.name.replace('.md', '').toLowerCase() === name.toLowerCase()) return n.path;
      if (n.children) { const f = findPathByName(name, n.children); if (f) return f; }
    }
    return null;
  }, []);

  const handleGraphNodeClick = useCallback((node: GraphNode) => { if (node.path) { setSelectedPath(node.path); setViewMode('reader'); } }, []);

  // 掃描變更 + 重新整理 changelog
  const handleRefresh = useCallback(async () => {
    setScanning(true);
    try {
      await fetch('http://localhost:3001/api/scan-changes');
    } catch (e) { console.error('Scan failed:', e); }
    await new Promise(r => setTimeout(r, 1500));
    try {
      const d = await fetch('http://localhost:3001/api/km-changelog').then(r => r.json());
      setChangelog(d.entries || []);
    } catch (e) { console.error(e); }
    setScanning(false);
  }, []);

  const density = useMemo(() => graphData ? computeKnowledgeDensity(graphData) : null, [graphData]);

  const navButtonStyle = (mode: ViewMode): React.CSSProperties => ({
    padding: '6px 10px', borderRadius: '2px', border: viewMode === mode ? '1px solid #36c' : '1px solid #a2a9b1',
    backgroundColor: viewMode === mode ? '#eaf3ff' : '#f8f9fa',
    color: viewMode === mode ? '#0645ad' : '#202122',
    cursor: 'pointer', fontSize: '0.76rem', fontWeight: viewMode === mode ? 600 : 400,
    display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'sans-serif',
  });

  useEffect(() => { if (viewMode !== 'reader' && !graphData) loadGraphData(); }, [viewMode, loadGraphData]);

  const processedContent = content.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, (m, t) => `[${t}](wikilink:${t})`);

  // ==================== 目錄樹面板 ====================
  const TreePanel = ({ onNav }: { onNav?: boolean }) => (
    <div style={{
      background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px',
      flexShrink: 0,
    }}>
      <div style={{
        background: onNav ? '#eaf3ff' : '#f8f9fa', padding: '7px 10px', borderBottom: '1px solid #eaecf0',
        fontSize: '0.8rem', fontWeight: 600, color: '#202122',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        📂 {onNav ? '導航' : '知識目錄'}
      </div>
      <div style={{ padding: '6px', overflowY: 'auto', maxHeight: onNav ? '400px' : '500px' }}>
        {tree.map((n) => <TreeNodeItem key={n.path} node={n} onSelect={(p) => { setSelectedPath(p); setViewMode('reader'); }} activePath={selectedPath} />)}
      </div>
    </div>
  );

  // ==================== 最近變更面板 ====================
  const ChangelogPanel = () => (
    <div style={{ background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px' }}>
      <div style={{
        background: '#eaf3ff', padding: '7px 10px', borderBottom: '1px solid #eaecf0',
        fontSize: '0.8rem', fontWeight: 600, color: '#202122',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span><Clock size={12} style={{ marginRight: '5px', verticalAlign: 'middle' }} />最近變更</span>
        <button onClick={handleRefresh} disabled={scanning} style={{
          fontSize: '0.68rem', color: '#0645ad', background: 'none', border: 'none', cursor: scanning ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'sans-serif', opacity: scanning ? 0.5 : 1,
        }}>
          <RefreshCw size={10} className={scanning ? 'spin' : ''} /> {scanning ? '掃描中...' : '重新整理'}
        </button>
      </div>
      <div style={{ padding: '10px' }}>
        <ChangelogList entries={changelog} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8f9fa', fontFamily: 'sans-serif' }}>
      {/* 側邊欄 */}
      <div style={{ width: '180px', background: '#fff', borderRight: '1px solid #eaecf0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #eaecf0', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <BrainCircuit size={15} color="#0645ad" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#202122' }}>LLM Wiki</span>
        </div>
        <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => setViewMode('home')} style={navButtonStyle('home')}><Sparkles size={11} /> 首頁</button>
          <button onClick={() => setViewMode('reader')} style={navButtonStyle('reader')}><FileText size={11} /> 閱讀器</button>
          <button onClick={() => setViewMode('graph')} style={navButtonStyle('graph')}><Network size={11} /> 知識圖譜</button>
          <button onClick={() => setViewMode('metrics')} style={navButtonStyle('metrics')}><BarChart3 size={11} /> 指標</button>
          <button onClick={() => setViewMode('isolated')} style={navButtonStyle('isolated')}><AlertTriangle size={11} /> 孤立</button>
        </div>
      </div>

      {/* 主內容區 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {graphLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', color: '#54595d' }}><div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>⏳</div><div>正在解析知識圖譜...</div></div>
          </div>
        ) : viewMode === 'home' ? (
          <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa' }}>
            {/* 頂部橫幅 */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eaecf0', padding: '14px 20px' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <BrainCircuit size={24} color="#0645ad" />
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#202122', margin: 0 }}>LLM Wiki Dashboard</h1>
                  <span style={{ fontSize: '0.65rem', color: '#72777d', background: '#eaf3ff', padding: '1px 7px', borderRadius: '2px', fontWeight: 500 }}>v2.1</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#54595d', marginBottom: '10px', lineHeight: 1.5 }}>
                  歡迎來到你的個人知識庫。編譯並展示了 <strong>{graphData?.count || '...'}</strong> 個知識節點，通過 <strong>{graphData?.links.length || '...'}</strong> 條關聯連結相互連接。
                </div>
                <GlobalSearch graphData={graphData} onNodeClick={handleGraphNodeClick} />
              </div>
            </div>
            {/* 三欄佈局 */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '14px', alignItems: 'start' }}>
                {/* 左欄：目錄 */}
                <TreePanel />
                {/* 中欄：最近變更 + Top 10 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <ChangelogPanel />
                  {graphData && (
                    <div style={{ background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px' }}>
                      <div style={{ background: '#fef0db', padding: '7px 10px', borderBottom: '1px solid #eaecf0', fontSize: '0.8rem', fontWeight: 600, color: '#202122' }}>🔗 知識中心（Top 10）</div>
                      <div style={{ padding: '6px 10px' }}>
                        {[...graphData.nodes].sort((a, b) => (b.links || 0) - (a.links || 0)).slice(0, 10).map((node, i) => (
                          <div key={i} onClick={() => { if (node.path) { setSelectedPath(node.path); setViewMode('reader'); } }}
                            style={{ padding: '5px 6px', cursor: node.path ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: i < 9 ? '1px solid #f0f0f0' : 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaf3ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <span style={{ width: '16px', fontSize: '0.7rem', color: '#72777d', textAlign: 'right' }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.78rem', color: '#0645ad', fontWeight: 500 }}>{node.name}</div>
                              <div style={{ fontSize: '0.65rem', color: '#72777d' }}>{node.category}</div>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#14866d', fontWeight: 600 }}>{node.links}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* 右欄：密度 + 操作 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {density && (
                    <div style={{ background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px' }}>
                      <div style={{ background: '#e6f7f1', padding: '7px 10px', borderBottom: '1px solid #eaecf0', fontSize: '0.8rem', fontWeight: 600, color: '#202122' }}>📊 知識密度</div>
                      <div style={{ padding: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          {[
                            { v: `${density.density.toFixed(3)}%`, l: '密度', c: '#0645ad' },
                            { v: density.avgLinks.toFixed(1), l: '平均連結', c: '#14866d' },
                            { v: density.maxLinks, l: '最高連結', c: '#7b61ff' },
                            { v: density.isolated, l: '孤立節點', c: '#a45700' },
                          ].map(s => (
                            <div key={s.l} style={{ textAlign: 'center', background: '#f8f9fa', padding: '8px', borderRadius: '2px' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: s.c }}>{s.v}</div>
                              <div style={{ fontSize: '0.65rem', color: '#72777d' }}>{s.l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ background: '#fff', border: '1px solid #eaecf0', borderRadius: '2px' }}>
                    <div style={{ background: '#eaf3ff', padding: '7px 10px', borderBottom: '1px solid #eaecf0', fontSize: '0.8rem', fontWeight: 600, color: '#202122' }}>⚡ 快速操作</div>
                    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { label: '知識圖譜', icon: Network, action: () => setViewMode('graph') },
                        { label: '指標面板', icon: BarChart3, action: () => setViewMode('metrics') },
                        { label: '孤立節點', icon: AlertTriangle, action: () => setViewMode('isolated') },
                      ].map(b => (
                        <button key={b.label} onClick={b.action} style={{
                          padding: '7px 10px', border: '1px solid #a2a9b1', borderRadius: '2px', background: '#f8f9fa', cursor: 'pointer',
                          fontSize: '0.78rem', textAlign: 'left', fontFamily: 'sans-serif', color: '#202122', display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          <b.icon size={12} /> {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'reader' ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* 閱讀器內容 */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {selectedPath ? (
                <div style={{ overflowY: 'auto', flex: 1, background: '#f8f9fa' }}>
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 10,
                    background: 'rgba(248,249,250,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid #eaecf0', padding: '9px 48px',
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#72777d', letterSpacing: '0.02em' }}>{selectedPath.split('/').slice(-3).join('  ›  ')}</div>
                  </div>
                  <div style={{ maxWidth: '720px', margin: '0 auto', padding: '36px 48px 80px' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#72777d' }}><div style={{ fontSize: '1.5rem', marginBottom: '10px', opacity: 0.5 }}>⏳</div><div>載入中...</div></div>
                    ) : (
                      <div className="apple-reader">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          h1: ({ children }) => <h1 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em', color: '#202122', marginTop: 0, marginBottom: 8 }}>{children}</h1>,
                          h2: ({ children }) => <h2 style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em', color: '#202122', marginTop: 32, marginBottom: 10 }}>{children}</h2>,
                          h3: ({ children }) => <h3 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.015em', color: '#202122', marginTop: 24, marginBottom: 6 }}>{children}</h3>,
                          p: ({ children }) => <p style={{ fontSize: '0.93rem', lineHeight: 1.75, letterSpacing: '0.01em', color: '#202122', marginTop: 0, marginBottom: 14 }}>{children}</p>,
                          ul: ({ children }) => <ul style={{ fontSize: '0.93rem', lineHeight: 1.7, paddingLeft: 22, marginBottom: 14, color: '#202122' }}>{children}</ul>,
                          ol: ({ children }) => <ol style={{ fontSize: '0.93rem', lineHeight: 1.7, paddingLeft: 22, marginBottom: 14, color: '#202122' }}>{children}</ol>,
                          li: ({ children }) => <li style={{ marginBottom: 5 }}>{children}</li>,
                          blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #0645ad', paddingLeft: 18, margin: '18px 0', color: '#54595d', fontStyle: 'italic', lineHeight: 1.7, fontSize: '0.93rem' }}>{children}</blockquote>,
                          code: ({ children }) => <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: 'rgba(0,0,0,0.05)', padding: '2px 5px', borderRadius: 3, color: '#d33' }}>{children}</code>,
                          pre: ({ children }) => <pre style={{ background: '#1d1d1f', color: '#f8f9fa', padding: 18, borderRadius: 6, overflowX: 'auto', marginBottom: 18, fontSize: '0.82rem', lineHeight: 1.6, fontFamily: 'monospace' }}>{children}</pre>,
                          table: ({ children }) => <div style={{ overflowX: 'auto', margin: '20px 0', borderRadius: 4, border: '2px solid #eaecf0' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', lineHeight: 1.6 }}>{children}</table></div>,
                          th: ({ children }) => <th style={{ textAlign: 'center', padding: '9px 12px', border: '2px solid #eaecf0', fontWeight: 600, fontSize: '0.78rem', color: '#54595d', background: '#f8f9fa', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{children}</th>,
                          td: ({ children }) => <td style={{ textAlign: 'center', padding: '9px 12px', border: '2px solid #eaecf0', color: '#202122', fontSize: '0.86rem' }}>{children}</td>,
                          hr: () => <hr style={{ border: 'none', borderTop: '1px solid #eaecf0', margin: '28px 0' }} />,
                          img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 6, margin: '18px 0' }} />,
                          a: ({ href, children }) => {
                            if (href?.startsWith('wikilink:')) {
                              const t = href.replace('wikilink:', '');
                              return <a onClick={() => { const p = findPathByName(t, tree); if (p) setSelectedPath(p); else alert(`找不到: ${t}`); }} style={{ color: '#0645ad', cursor: 'pointer', borderBottom: '1px solid rgba(6,69,173,0.3)', textDecoration: 'none', fontWeight: 500 }}>{children}</a>;
                            }
                            return <a href={href} style={{ color: '#0645ad', textDecoration: 'none', borderBottom: '1px solid rgba(6,69,173,0.3)' }}>{children}</a>;
                          },
                        }}>{processedContent}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8f9fa' }}>
                  <div style={{ textAlign: 'center', color: '#72777d' }}><div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.4 }}>📖</div><div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: '#54595d' }}>選擇一個檔案開始閱讀</div><div style={{ fontSize: '0.8rem' }}>從左下方目錄中點擊任意檔案</div></div>
                </div>
              )}
            </div>
            {/* 閱讀器左下方：目錄導航 */}
            <div style={{ width: '240px', borderLeft: '1px solid #eaecf0', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <TreePanel onNav />
              </div>
            </div>
          </div>
        ) : viewMode === 'graph' && graphData ? (
          <GraphView nodes={graphData.nodes} links={graphData.links} onNodeClick={handleGraphNodeClick} searchQuery={searchQuery} />
        ) : viewMode === 'metrics' && graphData ? (
          <DashboardMetrics nodes={graphData.nodes} links={graphData.links} />
        ) : viewMode === 'isolated' && graphData ? (
          <IsolatedNodes nodes={graphData.nodes} onNodeClick={handleGraphNodeClick} />
        ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8f9fa' }}><div style={{ textAlign: 'center', color: '#54595d' }}>加載圖譜數據中...</div></div>}
      </div>

      {/* 掃描動畫 */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default App;
