import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight, ChevronDown, FileText, Folder, BrainCircuit,
  Network, BarChart3, AlertTriangle, Search, X, Sparkles
} from 'lucide-react';
import { GraphView } from './components/GraphView';
import { DashboardMetrics } from './components/DashboardMetrics';
import { IsolatedNodes } from './components/IsolatedNodes';
import { buildGraphData, type GraphData, type GraphNode } from './graphDataParser';
import type { TreeNode } from './types';

// 類型已在 types.ts 中定義，此處複合使用
interface ContentTreeItem {
  name: string;
  type: 'file' | 'dir';
  path: string;
  children?: ContentTreeItem[];
}

const TreeNodeItem = ({ node, onSelect, activePath }: { node: ContentTreeItem, onSelect: (p: string) => void, activePath: string | null }) => {
  const [open, setOpen] = useState(node.name === '03_Wiki_知識層');
  const isActive = activePath === node.path;

  if (node.type === 'dir') {
    return (
      <div style={{ marginLeft: '10px' }}>
        <div
          onClick={() => setOpen(!open)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', padding: '6px 0', fontSize: '0.9rem' }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} style={{ margin: '0 8px', opacity: 0.6 }} />
          <span style={{ fontWeight: open ? 500 : 400 }}>{node.name}</span>
        </div>
        {open && node.children?.map((c, i) => <TreeNodeItem key={i} node={c} onSelect={onSelect} activePath={activePath} />)}
      </div>
    );
  }
  return (
    <div
      onClick={() => onSelect(node.path)}
      style={{
        marginLeft: '25px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '6px 8px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'rgba(0, 255, 163, 0.1)' : 'transparent',
        transition: 'all 0.2s'
      }}
    >
      <FileText size={14} style={{ margin: '0 8px', color: isActive ? 'var(--accent-neon)' : 'var(--accent-electric)', opacity: 0.8 }} />
      <span style={{ color: isActive ? 'var(--accent-neon)' : 'var(--text-main)', fontSize: '0.85rem' }}>
        {node.name.replace('.md', '')}
      </span>
    </div>
  );
};

type ViewMode = 'home' | 'reader' | 'graph' | 'metrics' | 'isolated';

/** 全站搜尋組件 */
const GlobalSearch = ({
  graphData,
  tree,
  onNodeClick,
  onSwitchToReader,
}: {
  graphData: GraphData | null;
  tree: ContentTreeItem[];
  onNodeClick: (node: GraphNode) => void;
  onSwitchToReader: (path: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // 即時搜尋
  useEffect(() => {
    if (!graphData || !query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = graphData.nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
    setResults(matches.slice(0, 20));
  }, [query, graphData]);

  const handleSelect = (node: GraphNode) => {
    if (node.path) {
      setRecentlyViewed((prev) => {
        const updated = [node.name, ...prev.filter((n) => n !== node.name)].slice(0, 5);
        return updated;
      });
      onNodeClick(node);
    }
  };

  const CATEGORY_COLORS: Record<string, string> = {
    實體: '#00ffa3',
    概念: '#00e5ff',
    摘要: '#ff6b9d',
    對比: '#ffd93d',
    綜合: '#c084fc',
    unknown: '#6b7280',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 搜尋列 */}
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: query ? '1px solid var(--accent-neon)' : '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            boxShadow: query ? '0 0 30px rgba(0,255,163,0.1)' : '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: query ? 'var(--accent-neon)' : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s',
            }}
          />
          <input
            type="text"
            placeholder="搜尋知識庫中的任何節點..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '18px 50px 18px 50px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {query && (
            <X
              size={16}
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            />
          )}
        </div>

        {/* 搜尋結果 */}
        {query && results.length > 0 && (
          <div
            style={{
              marginTop: '8px',
              backgroundColor: 'rgba(13,15,18,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {results.map((node) => (
              <div
                key={node.id}
                onClick={() => handleSelect(node)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,163,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[node.category] || '#6b7280',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    {node.category} · {node.layer.replace(/\d+_/, '')}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--accent-neon)',
                    backgroundColor: 'rgba(0,255,163,0.1)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    flexShrink: 0,
                  }}
                >
                  {node.links} 連結
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 搜尋無結果 */}
        {query && results.length === 0 && (
          <div style={{ marginTop: '12px', textAlign: 'center', opacity: 0.4, fontSize: '0.85rem' }}>
            找不到符合的節點
          </div>
        )}
      </div>

      {/* 快速統計 */}
      {graphData && !query && (
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {[
              { label: '知識節點', value: graphData.nodes.length, color: '#00ffa3' },
              { label: '關聯連結', value: graphData.links.length, color: '#00e5ff' },
              {
                label: '知識密度',
                value: graphData.nodes.length > 1
                  ? ((2 * graphData.links.length) / (graphData.nodes.length * (graphData.nodes.length - 1)) * 100).toFixed(2) + '%'
                  : '0%',
                color: '#ffd93d',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '6px',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近瀏覽（如果有的話） */}
      {recentlyViewed.length > 0 && !query && (
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '12px',
            }}
          >
            最近瀏覽
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentlyViewed.map((name) => {
              const node = graphData?.nodes.find((n) => n.name === name);
              if (!node) return null;
              return (
                <div
                  key={name}
                  onClick={() => handleSelect(node)}
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.6)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-neon)';
                    e.currentTarget.style.color = 'var(--accent-neon)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [tree, setTree] = useState<ContentTreeItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // v2.0 狀態
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLayer, setFilterLayer] = useState<string>('all');

  // 初始化拉取樹狀結構
  useEffect(() => {
    fetch('http://localhost:3001/api/tree').then(r => r.json()).then(setTree);
  }, []);

  // 讀取單個檔案內容
  useEffect(() => {
    if (selectedPath) {
      setLoading(true);
      fetch(`http://localhost:3001/api/content?path=${encodeURIComponent(selectedPath)}`)
        .then(r => r.text())
        .then(text => {
          setContent(text);
          setLoading(false);
        });
    }
  }, [selectedPath]);

  // 加載所有內容用於圖譜分析
  const loadGraphData = useCallback(async () => {
    if (graphData) return; // 已加載過
    if (tree.length === 0) return; // 樹狀結構還沒加載，等待
    setGraphLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/all-content');
      const json = await res.json();
      const wikilinks: Record<string, string[]> = json.wikilinks || {};

      const graph = await buildGraphData(tree, wikilinks);
      setGraphData(graph);
    } catch (e) {
      console.error('圖譜數據加載失敗:', e);
    } finally {
      setGraphLoading(false);
    }
  }, [tree, graphData]);

  // 搜尋檔案路徑
  const findPathByName = useCallback((name: string, nodes: ContentTreeItem[]): string | null => {
    for (const node of nodes) {
      if (node.type === 'file' && node.name.replace('.md', '').toLowerCase() === name.toLowerCase()) {
        return node.path;
      }
      if (node.children) {
        const found = findPathByName(name, node.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // 解析 [[Link]]
  const processedContent = content.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, (match, target, alias) => {
    const displayText = alias ? alias : target;
    return `[${displayText}](wikilink:${target})`;
  });

  // 圖譜節點點擊 -> 跳轉到閱讀器
  const handleGraphNodeClick = useCallback((node: GraphNode) => {
    if (node.path) {
      setSelectedPath(node.path);
      setViewMode('reader');
    }
  }, []);

  // 指標面板篩選回調
  const handleCategoryClick = useCallback((category: string) => {
    setFilterCategory(prev => prev === category ? 'all' : category);
    setViewMode('graph');
  }, []);

  const handleLayerClick = useCallback((layer: string) => {
    setFilterLayer(prev => prev === layer ? 'all' : layer);
    setViewMode('graph');
  }, []);

  // 視圖切換按鈕樣式
  const viewButtonStyle = (mode: ViewMode): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: viewMode === mode ? 'rgba(0, 255, 163, 0.15)' : 'rgba(255,255,255,0.05)',
    color: viewMode === mode ? 'var(--accent-neon)' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  });

  // 預設載入圖譜數據（首頁也需要）
  useEffect(() => {
    if (viewMode !== 'reader' && !graphData) {
      loadGraphData();
    }
  }, [viewMode, loadGraphData]);

  return (
    <div className="app-container">
      {/* 側邊欄 */}
      <aside className="glass-panel animate-stagger" style={{
        width: viewMode === 'home' ? '260px' : viewMode === 'reader' ? '320px' : '280px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit size={24} color="var(--accent-neon)" />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>LLM WIKI</h1>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DASHBOARD v2.0</div>
          </div>
        </div>

        {/* 視圖切換 */}
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setViewMode('home')} style={viewButtonStyle('home')}>
            <Sparkles size={14} />
            首頁
          </button>
          <button onClick={() => setViewMode('reader')} style={viewButtonStyle('reader')}>
            <FileText size={14} />
            閱讀器
          </button>
          <button onClick={() => setViewMode('graph')} style={viewButtonStyle('graph')}>
            <Network size={14} />
            知識圖譜
          </button>
          <button onClick={() => setViewMode('metrics')} style={viewButtonStyle('metrics')}>
            <BarChart3 size={14} />
            指標面板
          </button>
          <button onClick={() => setViewMode('isolated')} style={viewButtonStyle('isolated')}>
            <AlertTriangle size={14} />
            孤立節點
          </button>
        </div>

        {/* 圖譜篩選控制面板 */}
        {viewMode === 'graph' && graphData && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              篩選
            </div>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="text"
                placeholder="搜尋節點..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px 6px 26px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.75rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchQuery && (
                <X
                  size={12}
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        )}

        {/* 首頁模式：顯示快速導航 */}
        {viewMode === 'home' && graphData && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              快速導航
            </div>
            {graphData.nodes
              .sort((a, b) => b.links - a.links)
              .slice(0, 10)
              .map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    if (node.path) {
                      setSelectedPath(node.path);
                      setViewMode('reader');
                    }
                  }}
                  style={{
                    padding: '8px 10px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,255,163,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: node.links > 5 ? '#ffd93d' : '#00ffa3',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {node.name}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{node.links}</span>
                </div>
              ))}
          </div>
        )}

        {/* 閱讀器模式顯示樹狀目錄 */}
        {viewMode === 'reader' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
            {tree.map((n, i) => <TreeNodeItem key={i} node={n} onSelect={setSelectedPath} activePath={selectedPath} />)}
          </div>
        )}

        {/* 其他模式顯示簡短統計 */}
        {viewMode !== 'reader' && graphData && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              圖譜統計
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', flex: 1 }}>節點</span>
                <span style={{ color: 'var(--accent-neon)', fontWeight: 600 }}>{graphData.nodes.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', flex: 1 }}>連結</span>
                <span style={{ color: 'var(--accent-electric)', fontWeight: 600 }}>{graphData.links.length}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 主內容區 */}
      <main className="glass-panel animate-stagger" style={{ flex: 1, display: 'flex', flexDirection: 'column', animationDelay: '0.1s' }}>
        {graphLoading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', opacity: 0.5 }}>
            <Sparkles size={32} style={{ animation: 'spin 2s linear infinite' }} />
            <p style={{ fontSize: '0.8rem' }}>正在解析知識圖譜...</p>
          </div>
        ) : viewMode === 'home' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <BrainCircuit size={48} color="var(--accent-neon)" style={{ marginBottom: '12px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                知識庫總覽
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                搜尋、探索、連結你的知識網絡
              </p>
            </div>
            <GlobalSearch
              graphData={graphData}
              tree={tree}
              onNodeClick={handleGraphNodeClick}
              onSwitchToReader={(path) => {
                setSelectedPath(path);
                setViewMode('reader');
              }}
            />
          </div>
        ) : viewMode === 'reader' ? (
          selectedPath ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', maxWidth: '900px' }}>
              <div style={{ marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--accent-electric)', opacity: 0.5, fontFamily: 'monospace' }}>
                {selectedPath.split('/').slice(-3).join(' / ')}
              </div>
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => {
                      if (href?.startsWith('wikilink:')) {
                        const targetName = href.replace('wikilink:', '');
                        return (
                          <span
                            onClick={() => {
                              const newPath = findPathByName(targetName, tree);
                              if (newPath) setSelectedPath(newPath);
                              else alert(`找不到結點: ${targetName}`);
                            }}
                            style={{ color: 'var(--accent-neon)', cursor: 'pointer', borderBottom: '1px dashed var(--accent-neon)' }}
                          >
                            {children}
                          </span>
                        );
                      }
                      return <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-electric)' }}>{children}</a>;
                    }
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, textAlign: 'center' }}>
              <div>
                <BrainCircuit size={64} style={{ marginBottom: '1rem' }} />
                <p>INITIATE KNOWLEDGE RETRIEVAL</p>
              </div>
            </div>
          )
        ) : viewMode === 'graph' && graphData ? (
          <GraphView
            data={graphData}
            onNodeClick={handleGraphNodeClick}
            filterCategory={filterCategory}
            filterLayer={filterLayer}
            searchQuery={searchQuery}
          />
        ) : viewMode === 'metrics' && graphData ? (
          <DashboardMetrics
            data={graphData}
            onCategoryClick={handleCategoryClick}
            onLayerClick={handleLayerClick}
          />
        ) : viewMode === 'isolated' && graphData ? (
          <IsolatedNodes
            data={graphData}
            onNodeClick={handleGraphNodeClick}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, flexDirection: 'column', gap: '10px' }}>
            <Network size={48} />
            <p style={{ fontSize: '0.8rem' }}>加載圖譜數據中...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
