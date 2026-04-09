// ISOLATED_NODES_V2_FIX - 內聯顏色確保文字可見
import { useMemo, useState } from 'react';
import { findIsolatedNodes, type IsolatedNode } from '../graphDataParser';
import type { GraphData, GraphNode } from '../types';
import { Unlink, FileText, Search, Lightbulb } from 'lucide-react';

interface IsolatedNodesProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
}

const REASON_LABELS: Record<IsolatedNode['reason'], { text: string; color: string; icon: any }> = {
  'no_links': { text: '無連結', color: '#ff3b30', icon: Unlink },
  'single_layer': { text: '系統層級', color: '#ff9500', icon: FileText },
  'orphan': { text: '孤立摘要', color: '#af52de', icon: Lightbulb },
};

function suggestConnections(node: GraphNode, allNodes: GraphNode[]): GraphNode[] {
  const nodeName = node.name.toLowerCase();
  const nodeCategory = node.category;
  return allNodes
    .filter(n => n.id !== node.id)
    .map(n => {
      let score = 0;
      if (n.category === nodeCategory) score += 3;
      if (n.layer === node.layer) score += 2;
      const otherName = n.name.toLowerCase();
      const words = nodeName.split(/[\s_-]+/).filter(w => w.length > 1);
      for (const word of words) {
        if (otherName.includes(word)) score += 5;
      }
      return { node: n, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.node);
}

const CATEGORY_COLORS: Record<string, string> = {
  '實體': '#34c759',
  '概念': '#0071e3',
  '摘要': '#ff375f',
  '對比': '#ff9500',
  '綜合': '#af52de',
  'unknown': '#86868b',
};

export const IsolatedNodes = ({ data, onNodeClick }: IsolatedNodesProps) => {
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const isolatedNodes = useMemo(() => {
    const all = findIsolatedNodes(data);
    let filtered = all;
    if (filterReason !== 'all') {
      filtered = filtered.filter(item => item.reason === filterReason);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.node.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [data, filterReason, searchQuery]);

  const reasonCounts = useMemo(() => {
    const all = findIsolatedNodes(data);
    const counts: Record<string, number> = { all: all.length };
    for (const item of all) {
      counts[item.reason] = (counts[item.reason] || 0) + 1;
    }
    return counts;
  }, [data]);

  console.log('[孤立節點] 渲染:', isolatedNodes.length, '筆');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '20px',
      gap: '14px',
      backgroundColor: '#fafafa',
      color: '#000000',
    }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 700, margin: '0 0 4px 0' }}>
          🔗 孤立節點列表
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#555555', margin: 0 }}>
          共 {reasonCounts.all || 0} 個節點尚未與其他節點建立連結
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterReason('all')}
          style={{
            fontSize: '0.7rem',
            padding: '4px 10px',
            borderRadius: '20px',
            border: `1px solid ${filterReason === 'all' ? '#0071e3' : '#ccc'}`,
            backgroundColor: filterReason === 'all' ? '#e3f0ff' : '#fff',
            color: filterReason === 'all' ? '#0071e3' : '#333',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          全部 ({reasonCounts.all || 0})
        </button>
        {Object.entries(REASON_LABELS).map(([key, { text, color }]) => (
          <button
            key={key}
            onClick={() => setFilterReason(filterReason === key ? 'all' : key)}
            style={{
              fontSize: '0.7rem',
              padding: '4px 10px',
              borderRadius: '20px',
              border: `1px solid ${filterReason === key ? color : '#ccc'}`,
              backgroundColor: filterReason === key ? `${color}20` : '#fff',
              color: filterReason === key ? color : '#333',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            {text} ({reasonCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          type="text"
          placeholder="搜尋孤立節點..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px 8px 30px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            color: '#000',
            fontSize: '0.8rem',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Full List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isolatedNodes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Unlink size={40} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
            <p style={{ fontSize: '0.8rem', color: '#666' }}>沒有符合條件的孤立節點</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.7rem', color: '#888', padding: '2px 0', fontWeight: 500 }}>
              顯示 {isolatedNodes.length} 個孤立節點
            </div>
            {isolatedNodes.map(({ node, reason }) => {
              const isExpanded = expandedNode === node.id;
              const connections = isExpanded ? suggestConnections(node, data.nodes) : [];
              const { text, color, icon: Icon } = REASON_LABELS[reason];

              return (
                <div
                  key={node.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    onClick={() => {
                      if (isExpanded) setExpandedNode(null);
                      else setExpandedNode(node.id);
                    }}
                    style={{ cursor: 'pointer', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', color: '#000000', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {node.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#888888', marginTop: '1px' }}>
                        <span style={{ color: CATEGORY_COLORS[node.category] || '#86868b', fontWeight: 500 }}>
                          {node.category}
                        </span>
                        {' · '}
                        {node.layer.replace(/\d+_/, '')}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.6rem',
                      color: color,
                      backgroundColor: `${color}18`,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      flexShrink: 0,
                      fontWeight: 500,
                    }}>
                      <Icon size={10} />
                      {text}
                    </span>
                  </div>

                  {/* Expanded: suggested connections */}
                  {isExpanded && connections.length > 0 && (
                    <div style={{ padding: '0 12px 10px', borderTop: '1px solid #eee' }}>
                      <div style={{ fontSize: '0.68rem', color: '#888', padding: '8px 0 4px', fontWeight: 600 }}>
                        建議關聯節點
                      </div>
                      {connections.map(cn => (
                        <div
                          key={cn.id}
                          onClick={() => onNodeClick(cn)}
                          style={{
                            fontSize: '0.74rem',
                            color: '#333',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {cn.name}
                          <span style={{ fontSize: '0.63rem', color: '#aaa', marginLeft: '6px' }}>
                            {cn.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
