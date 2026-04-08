import { useMemo, useState } from 'react';
import { findIsolatedNodes, type IsolatedNode } from '../graphDataParser';
import type { GraphData, GraphNode } from '../types';
import { Unlink, FileText, Search, Lightbulb } from 'lucide-react';

interface IsolatedNodesProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
}

const REASON_LABELS: Record<IsolatedNode['reason'], { text: string; color: string; icon: any }> = {
  'no_links': { text: '無連結', color: '#ff6b9d', icon: Unlink },
  'single_layer': { text: '系統層級', color: '#ffd93d', icon: FileText },
  'orphan': { text: '孤立摘要', color: '#c084fc', icon: Lightbulb },
};

/**
 * 根據孤立節點的名稱和分類，建議可能的關聯節點
 */
function suggestConnections(node: GraphNode, allNodes: GraphNode[]): GraphNode[] {
  const nodeName = node.name.toLowerCase();
  const nodeCategory = node.category;

  return allNodes
    .filter(n => n.id !== node.id)
    .map(n => {
      let score = 0;
      // 同分類加分
      if (n.category === nodeCategory) score += 3;
      // 同層級加分
      if (n.layer === node.layer) score += 2;
      // 名稱關鍵字匹配加分
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

export const IsolatedNodes = ({ data, onNodeClick, contentCache }: IsolatedNodesProps) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', gap: '16px' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '4px' }}>
          孤立節點檢測
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          這些知識節點尚未與其他節點建立連結，可能是待開發的知識領域
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(REASON_LABELS).map(([key, { text, color }]) => (
          <button
            key={key}
            onClick={() => setFilterReason(filterReason === key ? 'all' : key)}
            style={{
              fontSize: '0.7rem',
              padding: '4px 10px',
              borderRadius: '20px',
              border: `1px solid ${filterReason === key ? color : 'rgba(255,255,255,0.15)'}`,
              backgroundColor: filterReason === key ? `${color}15` : 'transparent',
              color: filterReason === key ? color : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {text}
            <span style={{ opacity: 0.6 }}>({reasonCounts[key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        <input
          type="text"
          placeholder="搜尋孤立節點..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px 8px 30px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isolatedNodes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.3 }}>
            <Unlink size={40} style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '0.8rem' }}>沒有符合條件的孤立節點</p>
          </div>
        ) : (
          isolatedNodes.map(({ node, reason }) => {
            const isExpanded = expandedNode === node.id;
            const connections = isExpanded ? suggestConnections(node, data.nodes) : [];
            const { text, color, icon: Icon } = REASON_LABELS[reason];

            return (
              <div
                key={node.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => {
                    if (isExpanded) setExpandedNode(null);
                    else setExpandedNode(node.id);
                  }}
                  style={{ cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{node.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {node.category} · {node.layer.replace(/\d+_/, '')}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.6rem',
                    color,
                    backgroundColor: `${color}15`,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <Icon size={10} />
                    {text}
                  </span>
                </div>

                {/* Expanded: suggested connections */}
                {isExpanded && connections.length > 0 && (
                  <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', padding: '8px 0 4px' }}>
                      建議關聯節點
                    </div>
                    {connections.map(cn => (
                      <div
                        key={cn.id}
                        onClick={() => onNodeClick(cn)}
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.6)',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {cn.name}
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>
                          {cn.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
