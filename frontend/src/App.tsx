import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight, ChevronDown, FileText, Folder, BrainCircuit,
  Network, BarChart3, AlertTriangle, Search, X, Sparkles, Clock, Link2, Layers, TrendingUp, ArrowUpRight
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
  const [open, setOpen] = useState(depth < 2);
  const isActive = activePath === node.path;
  const displayName = node.name.replace(/^\d+/, '').replace(/^[_-]+/, '');

  if (node.type === 'dir') {
    return (
      <div>
        <div onClick={() => setOpen(!open)} style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--apple-text-secondary)',
          padding: '4px 6px', fontSize: depth === 0 ? '0.8rem' : '0.74rem', fontWeight: depth === 0 ? 600 : 500,
          borderRadius: '4px',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)')}
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

  // 顯示檔案，點擊跳轉閱讀器
  return (
    <div
      onClick={() => onSelect(node.path)}
      style={{
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        padding: '3px 6px', marginLeft: `${depth * 12 + 16}px`,
        fontSize: '0.72rem', borderRadius: '4px',
        backgroundColor: isActive ? 'rgba(0,113,227,0.1)' : 'transparent',
        color: isActive ? 'var(--apple-blue)' : 'var(--apple-text-primary)',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.12s ease',
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
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
    add: { icon: '✅', color: 'var(--apple-green)', bg: 'rgba(52,199,89,0.08)', label: '新增' },
    fix: { icon: '🔧', color: 'var(--apple-orange)', bg: 'rgba(255,149,0,0.08)', label: '修復' },
    update: { icon: '📝', color: 'var(--apple-blue)', bg: 'rgba(0,113,227,0.08)', label: '更新' },
    remove: { icon: '🗑️', color: 'var(--apple-red)', bg: 'rgba(255,59,48,0.08)', label: '刪除' },
  };

  if (!entries || entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--apple-text-tertiary)' }}>
        <Clock size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <div style={{ fontSize: '0.85rem' }}>尚無變更記錄</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {entries.slice(0, 5).map((entry, i) => {
        const cfg = TYPE_CFG[entry.type] || TYPE_CFG.update;
        return (
          <div key={i} style={{
            background: 'white', borderRadius: 'var(--radius-md)', padding: '14px',
            boxShadow: 'var(--shadow-sm)', borderLeft: `3px solid ${cfg.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--apple-text-tertiary)' }}>{entry.title.split('—')[0]?.trim()}</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
              {entry.title.split('—').slice(1).join('—').trim()}
            </div>
            {entry.summary && <div style={{ fontSize: '0.75rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5 }}>{entry.summary}</div>}
            {entry.affectedFiles.length > 0 && (
              <div style={{ fontSize: '0.68rem', color: 'var(--apple-text-tertiary)', marginTop: '6px' }}>影響 {entry.affectedFiles.length} 個檔案</div>
            )}
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

  const CAT_COLORS: Record<string, string> = { 實體: '#34c759', 概念: '#0071e3', 摘要: '#ff375f', 對比: '#ff9500', 綜合: '#af52de' };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ position: 'relative', background: 'white', borderRadius: 'var(--radius-lg)', padding: '4px', boxShadow: 'var(--shadow-md)', marginBottom: '20px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)' }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus placeholder="搜尋知識庫..."
          style={{ width: '100%', padding: '14px 40px 14px 44px', backgroundColor: 'transparent', border: 'none', color: 'var(--apple-text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--apple-font)' }} />
        {query && <X size={18} onClick={() => setQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)', cursor: 'pointer' }} />}
      </div>

      {query && results.length > 0 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {results.map((node, i) => (
            <div key={i} onClick={() => { if (node.path) onNodeClick(node); }}
              style={{ padding: '10px 14px', cursor: node.path ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--apple-border)', transition: 'background 0.12s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,113,227,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: CAT_COLORS[node.category.split('_')[0]] || '#86868b' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{node.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-tertiary)' }}>{node.category} · {node.layer}</div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-tertiary)' }}>{node.links} 🔗</div>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--apple-text-tertiary)' }}><div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤔</div><div>找不到符合的結果</div></div>}

      {graphData && !query && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { label: '知識節點', value: graphData.count || graphData.nodes.length, color: 'var(--apple-blue)', icon: Layers },
            { label: '關聯連結', value: graphData.links.length, color: 'var(--apple-teal)', icon: Link2 },
            { label: '知識密度', value: (() => { const n = graphData.count || graphData.nodes.length; const e = graphData.links.length; return n > 1 ? ((2 * e) / (n * (n - 1)) * 100).toFixed(2) + '%' : '0%'; })(), color: 'var(--apple-green)', icon: TrendingUp },
            { label: 'Wikilinks', value: graphData.totalWikilinks || 0, color: 'var(--apple-purple)', icon: ArrowUpRight },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Icon size={14} style={{ color: s.color, marginBottom: '4px' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--apple-text-secondary)', marginTop: '2px' }}>{s.label}</div>
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLayer, setFilterLayer] = useState('all');
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);

  // 初始化
  useEffect(() => {
    fetch('http://localhost:3001/api/tree').then(r => r.json()).then((data: ContentTreeItem[]) => {
      // 過濾掉根目錄的 21_LLM_Wiki_核心知識庫，直接顯示子層
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
    try {
      const g = await buildGraphData(tree, {});
      setGraphData(g);
    } catch (e) { console.error(e); }
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
  const refreshChangelog = useCallback(() => { fetch('http://localhost:3001/api/km-changelog').then(r => r.json()).then(d => setChangelog(d.entries || [])); }, []);

  const density = useMemo(() => graphData ? computeKnowledgeDensity(graphData) : null, [graphData]);

  const viewButtonStyle = (mode: ViewMode): React.CSSProperties => ({
    padding: '7px 12px', borderRadius: '9px', border: 'none',
    backgroundColor: viewMode === mode ? 'rgba(0,113,227,0.1)' : 'transparent',
    color: viewMode === mode ? 'var(--apple-blue)' : 'var(--apple-text-secondary)',
    cursor: 'pointer', fontSize: '0.78rem', fontWeight: viewMode === mode ? 600 : 400,
    display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.15s ease', fontFamily: 'var(--apple-font)',
  });

  useEffect(() => { if (viewMode !== 'reader' && !graphData) loadGraphData(); }, [viewMode, loadGraphData]);

  const processedContent = content.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, (m, t) => `[${t}](wikilink:${t})`);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--apple-bg)' }}>
      {/* 側邊欄 */}
      <div style={{ width: '260px', background: 'var(--apple-surface)', borderRight: '1px solid var(--apple-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--apple-border)' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><BrainCircuit size={18} color="var(--apple-blue)" /> LLM Wiki</h1>
          <div style={{ fontSize: '0.6rem', color: 'var(--apple-text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dashboard v2.1</div>
        </div>

        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button onClick={() => setViewMode('home')} style={viewButtonStyle('home')}><Sparkles size={13} /> 首頁</button>
          <button onClick={() => setViewMode('reader')} style={viewButtonStyle('reader')}><FileText size={13} /> 閱讀器</button>
          <button onClick={() => setViewMode('graph')} style={viewButtonStyle('graph')}><Network size={13} /> 知識圖譜</button>
          <button onClick={() => setViewMode('metrics')} style={viewButtonStyle('metrics')}><BarChart3 size={13} /> 指標面板</button>
          <button onClick={() => setViewMode('isolated')} style={viewButtonStyle('isolated')}><AlertTriangle size={13} /> 孤立節點</button>
        </div>

        {/* 圖譜篩選 */}
        {viewMode === 'graph' && graphData && (
          <div style={{ padding: '10px', borderTop: '1px solid var(--apple-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={11} style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)' }} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜尋節點..."
                style={{ width: '100%', padding: '6px 6px 6px 24px', backgroundColor: '#f5f5f7', border: '1px solid var(--apple-border)', borderRadius: '7px', color: 'var(--apple-text-primary)', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--apple-font)' }} />
              {searchQuery && <X size={11} onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)', cursor: 'pointer' }} />}
            </div>
          </div>
        )}

        {/* 首頁模式：目錄式導航 */}
        {viewMode === 'home' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', borderTop: '1px solid var(--apple-border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--apple-text-secondary)', marginBottom: '6px', padding: '0 4px' }}>📂 知識目錄</div>
            {tree.map((n) => <TreeNodeItem key={n.path} node={n} onSelect={(p) => { setSelectedPath(p); setViewMode('reader'); }} activePath={selectedPath} />)}
          </div>
        )}

        {/* 閱讀器模式：相同目錄樹 + 當前高亮 */}
        {viewMode === 'reader' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', borderTop: '1px solid var(--apple-border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--apple-text-secondary)', marginBottom: '6px', padding: '0 4px' }}>📂 導航</div>
            {tree.map((n) => <TreeNodeItem key={n.path} node={n} onSelect={(p) => { setSelectedPath(p); setViewMode('reader'); }} activePath={selectedPath} />)}
          </div>
        )}

        {/* 圖譜統計 */}
        {viewMode !== 'reader' && viewMode !== 'home' && graphData && (
          <div style={{ padding: '10px', borderTop: '1px solid var(--apple-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: '#f5f5f7', borderRadius: '7px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--apple-blue)' }}>{graphData.count || graphData.nodes.length}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)' }}>節點</div>
              </div>
              <div style={{ background: '#f5f5f7', borderRadius: '7px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--apple-teal)' }}>{graphData.links.length}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)' }}>連結</div>
              </div>
            </div>
            {density && (
              <div style={{ marginTop: '8px', background: '#f5f5f7', borderRadius: '7px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--apple-text-secondary)' }}>密度 {density.density.toFixed(3)}% · 平均 {(density.avgLinks).toFixed(1)} 連結 · {density.isolated} 孤立</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 主內容區 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {graphLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ textAlign: 'center', color: 'var(--apple-text-secondary)' }}><div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div><div>正在解析知識圖譜...</div></div></div>
        ) : viewMode === 'home' ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <GlobalSearch graphData={graphData} onNodeClick={handleGraphNodeClick} />
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px' }}><Clock size={16} color="var(--apple-text-secondary)" /> 最近變更</h2>
                <button onClick={refreshChangelog} style={{ fontSize: '0.72rem', color: 'var(--apple-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--apple-font)', fontWeight: 500 }}>重新整理</button>
              </div>
              <ChangelogList entries={changelog} />
            </div>
          </div>
        ) : viewMode === 'reader' ? (
          selectedPath ? (
            <div style={{ overflowY: 'auto', flex: 1, background: 'var(--apple-bg)' }}>
              {/* Breadcrumb */}
              <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'rgba(245,245,247,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--apple-border)',
                padding: '12px 48px',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--apple-text-tertiary)', fontFamily: 'var(--apple-font)', letterSpacing: '0.02em' }}>
                  {selectedPath.split('/').slice(-3).join('  ›  ')}
                </div>
              </div>

              {/* Content Area — Apple-style centered layout */}
              <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 48px 80px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--apple-text-tertiary)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '12px', opacity: 0.5 }}>⏳</div>
                    <div style={{ fontSize: '0.9rem' }}>載入中...</div>
                  </div>
                ) : (
                  <div className="apple-reader">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      h1: ({ children }) => (
                        <h1 style={{
                          fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em',
                          color: 'var(--apple-text-primary)', marginTop: '0', marginBottom: '8px',
                          fontFamily: 'var(--apple-font)',
                        }}>{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 style={{
                          fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em',
                          color: 'var(--apple-text-primary)', marginTop: '36px', marginBottom: '12px',
                          fontFamily: 'var(--apple-font)',
                        }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{
                          fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.015em',
                          color: 'var(--apple-text-primary)', marginTop: '28px', marginBottom: '8px',
                          fontFamily: 'var(--apple-font)',
                        }}>{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 style={{
                          fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.4,
                          color: 'var(--apple-text-primary)', marginTop: '24px', marginBottom: '8px',
                          fontFamily: 'var(--apple-font)',
                        }}>{children}</h4>
                      ),
                      p: ({ children }) => (
                        <p style={{
                          fontSize: '0.95rem', lineHeight: 1.75, letterSpacing: '0.01em',
                          color: 'var(--apple-text-primary)', marginTop: '0', marginBottom: '16px',
                          fontFamily: 'var(--apple-font)',
                        }}>{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul style={{
                          fontSize: '0.95rem', lineHeight: 1.7, paddingLeft: '24px', marginBottom: '16px',
                          color: 'var(--apple-text-primary)', fontFamily: 'var(--apple-font)',
                        }}>{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{
                          fontSize: '0.95rem', lineHeight: 1.7, paddingLeft: '24px', marginBottom: '16px',
                          color: 'var(--apple-text-primary)', fontFamily: 'var(--apple-font)',
                        }}>{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: '6px' }}>{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote style={{
                          borderLeft: '3px solid var(--apple-blue)', paddingLeft: '20px', margin: '20px 0',
                          color: 'var(--apple-text-secondary)', fontStyle: 'italic', lineHeight: 1.7,
                          fontSize: '0.95rem', fontFamily: 'var(--apple-font)',
                        }}>{children}</blockquote>
                      ),
                      code: ({ children }) => (
                        <code style={{
                          fontFamily: 'var(--apple-font-mono)', fontSize: '0.85rem',
                          background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '5px',
                          color: '#e83e8c',
                        }}>{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre style={{
                          background: '#1d1d1f', color: '#f5f5f7', padding: '20px', borderRadius: '12px',
                          overflowX: 'auto', marginBottom: '20px', fontSize: '0.85rem', lineHeight: 1.6,
                          fontFamily: 'var(--apple-font-mono)',
                        }}>{children}</pre>
                      ),
                      table: ({ children }) => (
                        <div style={{ overflowX: 'auto', margin: '24px 0', borderRadius: '10px', border: '2px solid var(--apple-border)' }}>
                          <table style={{
                            width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', lineHeight: 1.6,
                            fontFamily: 'var(--apple-font)',
                          }}>{children}</table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th style={{
                          textAlign: 'center', padding: '10px 14px', border: '2px solid var(--apple-border)',
                          fontWeight: 600, fontSize: '0.8rem', color: 'var(--apple-text-secondary)',
                          background: 'rgba(0,0,0,0.02)', letterSpacing: '0.02em', textTransform: 'uppercase',
                        }}>{children}</th>
                      ),
                      td: ({ children }) => (
                        <td style={{
                          textAlign: 'center', padding: '10px 14px', border: '2px solid var(--apple-border)',
                          color: 'var(--apple-text-primary)', fontSize: '0.88rem',
                        }}>{children}</td>
                      ),
                      hr: () => (
                        <hr style={{
                          border: 'none', borderTop: '1px solid var(--apple-border)',
                          margin: '32px 0',
                        }} />
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt} style={{
                          maxWidth: '100%', borderRadius: '12px', margin: '20px 0',
                          boxShadow: 'var(--shadow-md)',
                        }} />
                      ),
                      a: ({ href, children }) => {
                        if (href?.startsWith('wikilink:')) {
                          const t = href.replace('wikilink:', '');
                          return (
                            <a onClick={() => { const p = findPathByName(t, tree); if (p) setSelectedPath(p); else alert(`找不到: ${t}`); }}
                              style={{
                                color: 'var(--apple-blue)', cursor: 'pointer',
                                borderBottom: '1px solid rgba(0,113,227,0.3)', textDecoration: 'none',
                                fontWeight: 500, transition: 'border-color 0.15s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--apple-blue)')}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0,113,227,0.3)')}
                            >{children}</a>
                          );
                        }
                        return (
                          <a href={href} style={{ color: 'var(--apple-blue)', textDecoration: 'none', borderBottom: '1px solid rgba(0,113,227,0.3)' }}>{children}</a>
                        );
                      },
                    }}>{processedContent}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--apple-bg)' }}>
              <div style={{ textAlign: 'center', color: 'var(--apple-text-tertiary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>📖</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px', color: 'var(--apple-text-secondary)' }}>選擇一個檔案開始閱讀</div>
                <div style={{ fontSize: '0.82rem' }}>從左側目錄中點擊任意檔案</div>
              </div>
            </div>
          )
        ) : viewMode === 'graph' && graphData ? (
          <GraphView nodes={graphData.nodes} links={graphData.links} onNodeClick={handleGraphNodeClick} searchQuery={searchQuery} />
        ) : viewMode === 'metrics' && graphData ? (
          <DashboardMetrics nodes={graphData.nodes} links={graphData.links} />
        ) : viewMode === 'isolated' && graphData ? (
          <IsolatedNodes nodes={graphData.nodes} onNodeClick={handleGraphNodeClick} />
        ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ textAlign: 'center', color: 'var(--apple-text-secondary)' }}>加載圖譜數據中...</div></div>}
      </div>
    </div>
  );
}

export default App;
