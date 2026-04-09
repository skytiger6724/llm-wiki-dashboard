import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight, ChevronDown, FileText, Folder, BrainCircuit,
  Network, BarChart3, AlertTriangle, Search, X, Sparkles,
  Clock, PlusCircle, Wrench, Trash2, List, RefreshCw
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
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#515154', padding: '6px 0', fontSize: '0.85rem', fontWeight: 500 }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} style={{ margin: '0 8px', opacity: 0.5 }} />
          <span>{node.name}</span>
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
        padding: '6px 10px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <FileText size={14} style={{ margin: '0 8px', color: isActive ? '#0071e3' : '#86868b', opacity: 0.7 }} />
      <span style={{ color: isActive ? '#0071e3' : 'var(--apple-text-primary)', fontSize: '0.82rem', fontWeight: isActive ? 500 : 400 }}>
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
    實體: '#34c759',
    概念: '#0071e3',
    摘要: '#ff375f',
    對比: '#ff9500',
    綜合: '#af52de',
    unknown: '#86868b',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 搜尋列 */}
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            backgroundColor: '#f5f5f7',
            border: query ? '2px solid var(--apple-blue)' : '1px solid var(--apple-border)',
            borderRadius: '14px',
            boxShadow: query ? '0 0 0 4px rgba(0, 113, 227, 0.15), var(--apple-shadow-md)' : 'var(--apple-shadow-sm)',
            transition: 'all 0.2s ease',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: query ? '#0071e3' : '#86868b',
              transition: 'color 0.2s ease',
            }}
          />
          <input
            type="text"
            placeholder="搜尋知識庫..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '16px 44px 16px 46px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--apple-text-primary)',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--apple-font)',
            }}
          />
          {query && (
            <X
              size={16}
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#86868b',
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
              backgroundColor: 'var(--apple-surface)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--apple-border)',
              borderRadius: '12px',
              maxHeight: '380px',
              overflowY: 'auto',
              boxShadow: 'var(--apple-shadow-lg)',
            }}
          >
            {results.map((node) => (
              <div
                key={node.id}
                onClick={() => handleSelect(node)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid var(--apple-border)',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 113, 227, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[node.category] || '#86868b',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--apple-text-primary)', fontWeight: 500 }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--apple-text-tertiary)', marginTop: '2px' }}>
                    {node.category} · {node.layer.replace(/\d+_/, '')}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: '#0071e3',
                    backgroundColor: 'rgba(0, 113, 227, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {node.links}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 搜尋無結果 */}
        {query && results.length === 0 && (
          <div style={{ marginTop: '10px', textAlign: 'center', color: 'var(--apple-text-tertiary)', fontSize: '0.875rem' }}>
            找不到符合的結果
          </div>
        )}
      </div>

      {/* 快速統計 */}
      {graphData && !query && (
        <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: '知識節點', value: graphData.nodes.length, color: '#0071e3' },
              { label: '關聯連結', value: graphData.links.length, color: 'var(--apple-teal)' },
              {
                label: '知識密度',
                value: graphData.nodes.length > 1
                  ? ((2 * graphData.links.length) / (graphData.nodes.length * (graphData.nodes.length - 1)) * 100).toFixed(2) + '%'
                  : '0%',
                color: 'var(--apple-green)',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'var(--apple-surface)',
                  border: '1px solid var(--apple-border)',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: 'var(--apple-shadow-sm)',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近瀏覽 */}
      {recentlyViewed.length > 0 && !query && (
        <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '0.725rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>
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
                    fontSize: '0.82rem',
                    color: 'var(--apple-blue)',
                    backgroundColor: 'rgba(0, 113, 227, 0.06)',
                    border: '1px solid rgba(0, 113, 227, 0.12)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 113, 227, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 113, 227, 0.06)';
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

/** KM Changelog 組件 — 顯示最新 5 次知識庫變更 */
const KMChangelog = ({
  entries,
  loading,
  fileExists,
  onRefresh,
}: {
  entries: ChangelogEntry[];
  loading: boolean;
  fileExists: boolean;
  onRefresh?: () => void;
}) => {
  const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string; bg: string }> = {
    add: { icon: <PlusCircle size={14} />, color: 'var(--apple-green)', label: '新增', bg: 'rgba(52, 199, 89, 0.1)' },
    fix: { icon: <Wrench size={14} />, color: 'var(--apple-orange)', label: '優化', bg: 'rgba(255, 149, 0, 0.1)' },
    remove: { icon: <Trash2 size={14} />, color: 'var(--apple-red)', label: '移除', bg: 'rgba(255, 59, 48, 0.1)' },
    update: { icon: <Clock size={14} />, color: 'var(--apple-blue)', label: '更新', bg: 'rgba(0, 113, 227, 0.1)' },
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '20px', color: 'var(--apple-text-tertiary)' }}>
        <Clock size={16} style={{ display: 'inline', animation: 'spin 2s linear infinite', marginRight: '8px' }} />
        載入變更記錄...
      </div>
    );
  }

  if (!fileExists) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '16px', fontSize: '0.82rem', color: 'var(--apple-text-tertiary)' }}>
        尚無變更記錄
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '16px', fontSize: '0.82rem', color: 'var(--apple-text-tertiary)' }}>
        暫無變更記錄
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.725rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, margin: 0 }}>
          📋 知識庫變更記錄
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              background: 'none',
              border: '1px solid var(--apple-border)',
              borderRadius: '8px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: 'var(--apple-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              transition: 'all 0.15s ease',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--apple-blue)';
              e.currentTarget.style.color = 'var(--apple-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--apple-border)';
              e.currentTarget.style.color = 'var(--apple-text-tertiary)';
            }}
            title="重新整理變更記錄"
          >
            <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.map((entry, i) => {
          const cfg = typeConfig[entry.type] || typeConfig.update;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--apple-surface)',
                border: '1px solid var(--apple-border)',
                borderRadius: '12px',
                padding: '14px 16px',
                boxShadow: 'var(--apple-shadow-sm)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--apple-shadow-md)';
                e.currentTarget.style.borderColor = 'rgba(0, 113, 227, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--apple-shadow-sm)';
                e.currentTarget.style.borderColor = '#e5e5ea';
              }}
            >
              {/* 標題列 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: cfg.color, backgroundColor: cfg.bg,
                  padding: '3px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600,
                }}>
                  {cfg.icon}
                  {cfg.label}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--apple-text-primary)', flex: 1 }}>
                  {entry.title}
                </span>
              </div>
              {/* 摘要 */}
              {entry.summary && (
                <div style={{ fontSize: '0.78rem', color: '#515154', lineHeight: 1.5, marginBottom: '8px' }}>
                  {entry.summary}
                </div>
              )}
              {/* 影響檔案 */}
              {entry.affectedFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {entry.affectedFiles.map((f, j) => (
                    <span key={j} style={{
                      fontSize: '0.65rem', color: 'var(--apple-text-tertiary)',
                      backgroundColor: '#f5f5f7', padding: '2px 8px', borderRadius: '6px',
                      fontFamily: 'var(--apple-mono)',
                    }}>
                      {f.split('/').pop() || f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ChangelogEntry {
  title: string;
  body: string;
  type: string;
  affectedFiles: string[];
  summary: string;
}

function App() {
  const [tree, setTree] = useState<ContentTreeItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // KM Changelog 狀態
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [changelogLoading, setChangelogLoading] = useState(false);
  const [changelogFileExists, setChangelogFileExists] = useState(true);

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

  // 拉取 KM Changelog 函式
  const fetchChangelog = () => {
    setChangelogLoading(true);
    fetch('http://localhost:3001/api/km-changelog')
      .then(r => r.json())
      .then(data => {
        setChangelog(data.entries || []);
        setChangelogFileExists(data.fileExists ?? true);
        setChangelogLoading(false);
      })
      .catch(() => setChangelogLoading(false));
  };

  // 初始化拉取 KM Changelog
  useEffect(() => {
    fetchChangelog();
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

  // 從 Markdown 內容提取目錄（H1-H3）
  const tableOfContents = useMemo(() => {
    if (!content) return [];
    const headings: { level: number; text: string; id: string }[] = [];
    const lines = content.split('\n');
    let index = 0;
    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`]/g, '').trim();
        headings.push({ level, text, id: `heading-${index}` });
      }
      index++;
    }
    return headings;
  }, [content]);

  const [tocOpen, setTocOpen] = useState(true);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

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

  const handleIsolatedClick = useCallback(() => {
    setViewMode('isolated');
  }, []);

  // 視圖切換按鈕樣式 — Apple UI
  const viewButtonStyle = (mode: ViewMode): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: viewMode === mode ? 'rgba(0, 113, 227, 0.1)' : 'transparent',
    color: viewMode === mode ? 'var(--apple-blue)' : '#515154',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: viewMode === mode ? 600 : 400,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
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
        width: viewMode === 'home' ? '260px' : viewMode === 'reader' ? '300px' : '270px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid var(--apple-border)',
      }}>
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--apple-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit size={22} color="var(--apple-blue)" />
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--apple-text-primary)', letterSpacing: '-0.02em' }}>LLM Wiki</h1>
            <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dashboard v2.0</div>
          </div>
        </div>

        {/* 視圖切換 */}
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--apple-border)' }}>
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
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--apple-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              篩選
            </div>
            <div style={{ position: 'relative', marginBottom: '6px' }}>
              <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)' }} />
              <input
                type="text"
                placeholder="搜尋節點..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 8px 7px 28px',
                  backgroundColor: '#f5f5f7',
                  border: '1px solid var(--apple-border)',
                  borderRadius: '8px',
                  color: 'var(--apple-text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--apple-font)',
                }}
              />
              {searchQuery && (
                <X
                  size={12}
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-tertiary)', cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        )}

        {/* 首頁模式：顯示快速導航 */}
        {viewMode === 'home' && graphData && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
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
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.15s ease',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 113, 227, 0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: node.links > 5 ? 'var(--apple-orange)' : 'var(--apple-green)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--apple-text-primary)',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {node.name}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', fontWeight: 500 }}>{node.links}</span>
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
        {viewMode !== 'reader' && viewMode !== 'home' && graphData && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              圖譜統計
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.8rem' }}>
                <span style={{ color: '#515154', flex: 1 }}>節點</span>
                <span style={{ color: 'var(--apple-blue)', fontWeight: 600 }}>{graphData.nodes.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.8rem' }}>
                <span style={{ color: '#515154', flex: 1 }}>連結</span>
                <span style={{ color: 'var(--apple-teal)', fontWeight: 600 }}>{graphData.links.length}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 主內容區 */}
      <main className="glass-panel animate-stagger" style={{ flex: 1, display: 'flex', flexDirection: 'column', animationDelay: '0.08s' }}>
        {graphLoading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--apple-text-tertiary)' }}>
            <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: 'var(--apple-blue)' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>正在解析知識圖譜...</p>
          </div>
        ) : viewMode === 'home' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <BrainCircuit size={40} color="var(--apple-blue)" style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--apple-text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
                知識庫總覽
              </h2>
              <p style={{ fontSize: '0.938rem', color: 'var(--apple-text-secondary)' }}>
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

            {/* KM Changelog 區塊 */}
            <div style={{ marginTop: '40px' }}>
              <KMChangelog
                entries={changelog}
                loading={changelogLoading}
                fileExists={changelogFileExists}
                onRefresh={fetchChangelog}
              />
            </div>
          </div>
        ) : viewMode === 'reader' ? (
          selectedPath ? (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* 閱讀內容區（左側） */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 3rem', maxWidth: tableOfContents.length > 2 && tocOpen ? '900px' : '860px' }}>
                {/* TOC 展開按鈕（當收起時） */}
                {!tocOpen && tableOfContents.length > 2 && (
                  <button
                    onClick={() => setTocOpen(true)}
                    style={{
                      marginBottom: '1rem',
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--apple-border)',
                      borderRadius: '8px',
                      color: 'var(--apple-text-tertiary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--apple-font)',
                    }}
                  >
                    <List size={12} />
                    顯示目錄 ({tableOfContents.length} 個標題)
                  </button>
                )}
                <div style={{ marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', fontFamily: 'var(--apple-mono)' }}>
                  {selectedPath.split('/').slice(-3).join(' / ')}
                </div>
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => {
                        const text = String(children).replace(/[*_`]/g, '');
                        const id = `heading-${content.split('\n').findIndex(l => l.match(/^#\s+/) && l.includes(text))}`;
                        return <h1 id={id} onClick={() => setActiveHeading(id)} style={{ cursor: 'pointer' }}>{children}</h1>;
                      },
                      h2: ({ children }) => {
                        const text = String(children).replace(/[*_`]/g, '');
                        const idx = content.split('\n').findIndex(l => l.match(/^##\s+/) && l.includes(text));
                        const id = `heading-${idx}`;
                        return <h2 id={id} onClick={() => setActiveHeading(id)} style={{ cursor: 'pointer' }}>{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const text = String(children).replace(/[*_`]/g, '');
                        const idx = content.split('\n').findIndex(l => l.match(/^###\s+/) && l.includes(text));
                        const id = `heading-${idx}`;
                        return <h3 id={id} onClick={() => setActiveHeading(id)} style={{ cursor: 'pointer' }}>{children}</h3>;
                      },
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

              {/* TOC 側邊欄（右側） */}
              {tableOfContents.length > 2 && (
                <div style={{
                  width: tocOpen ? '240px' : '0px',
                  borderLeft: tocOpen ? '1px solid var(--apple-border)' : 'none',
                  transition: 'width 0.2s ease',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#f5f5f7',
                }}>
                  <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid var(--apple-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <List size={13} color="var(--apple-text-tertiary)" />
                        <span style={{ fontSize: '0.65rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                          目錄
                        </span>
                      </div>
                      <button
                        onClick={() => setTocOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--apple-text-tertiary)' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '8px 0', overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
                    {tableOfContents.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        style={{
                          display: 'block',
                          padding: '4px 14px',
                          paddingLeft: `${14 + (h.level - 1) * 14}px`,
                          fontSize: h.level === 1 ? '0.82rem' : h.level === 2 ? '0.78rem' : '0.72rem',
                          fontWeight: h.level === 1 ? 600 : h.level === 2 ? 500 : 400,
                          color: activeHeading === h.id ? 'var(--apple-blue)' : 'var(--apple-text-secondary)',
                          textDecoration: 'none',
                          borderLeft: activeHeading === h.id ? '2px solid var(--apple-blue)' : '2px solid transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {h.text}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--apple-text-tertiary)', textAlign: 'center' }}>
              <div>
                <BrainCircuit size={48} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>選擇一個知識節點開始閱讀</p>
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
            onIsolatedClick={handleIsolatedClick}
          />
        ) : viewMode === 'isolated' && graphData ? (
          <IsolatedNodes
            data={graphData}
            onNodeClick={handleGraphNodeClick}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--apple-text-tertiary)', flexDirection: 'column', gap: '8px' }}>
            <Network size={36} opacity={0.4} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>加載圖譜數據中...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
