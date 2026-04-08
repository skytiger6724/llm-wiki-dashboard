import { useMemo } from 'react';
import { computeGraphMetrics } from '../graphDataParser';
import type { GraphData } from '../types';
import { BarChart3, Network, GitBranch, AlertTriangle, TrendingUp, Layers } from 'lucide-react';

interface DashboardMetricsProps {
  data: GraphData;
  onCategoryClick?: (category: string) => void;
  onLayerClick?: (layer: string) => void;
}

const MetricCard = ({ icon: Icon, label, value, subtext, accentColor }: {
  icon: any; label: string; value: string | number; subtext?: string; accentColor: string;
}) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={16} color={accentColor} />
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, lineHeight: 1 }}>
      {value}
    </div>
    {subtext && (
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{subtext}</div>
    )}
  </div>
);

const CATEGORY_COLORS: Record<string, string> = {
  '實體': '#00ffa3',
  '概念': '#00e5ff',
  '摘要': '#ff6b9d',
  '對比': '#ffd93d',
  '綜合': '#c084fc',
  'unknown': '#6b7280',
};

export const DashboardMetrics = ({ data, onCategoryClick, onLayerClick }: DashboardMetricsProps) => {
  const metrics = useMemo(() => computeGraphMetrics(data), [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* 核心指標 */}
      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          知識圖譜概覽
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <MetricCard
            icon={Network}
            label="節點總數"
            value={metrics.totalNodes}
            subtext={`密度: ${metrics.density.toFixed(4)}`}
            accentColor="#00ffa3"
          />
          <MetricCard
            icon={GitBranch}
            label="連結總數"
            value={metrics.totalLinks}
            subtext={`平均度: ${metrics.avgDegree.toFixed(2)}`}
            accentColor="#00e5ff"
          />
          <MetricCard
            icon={TrendingUp}
            label="最高連結節點"
            value={metrics.topNodes[0]?.name || '-'}
            subtext={`${metrics.topNodes[0]?.links || 0} 個連結`}
            accentColor="#ffd93d"
          />
          <MetricCard
            icon={AlertTriangle}
            label="孤立節點"
            value={metrics.isolatedCount}
            subtext="待關聯知識"
            accentColor="#ff6b9d"
          />
        </div>
      </div>

      {/* 分類分佈 */}
      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} />
          分類分佈
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(metrics.categoryCount).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
            const pct = metrics.totalNodes > 0 ? (count / metrics.totalNodes) * 100 : 0;
            const color = CATEGORY_COLORS[cat] || '#6b7280';
            return (
              <div
                key={cat}
                onClick={() => onCategoryClick?.(cat)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', flex: 1 }}>{cat}</span>
                <div style={{ width: '100px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', minWidth: '30px', textAlign: 'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 層級分佈 */}
      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart3 size={14} />
          層級分佈
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(metrics.layerCount).sort((a, b) => b[1] - a[1]).map(([layer, count]) => {
            const pct = metrics.totalNodes > 0 ? (count / metrics.totalNodes) * 100 : 0;
            return (
              <div
                key={layer}
                onClick={() => onLayerClick?.(layer)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c084fc', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', flex: 1 }}>{layer}</span>
                <div style={{ width: '100px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#c084fc', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', minWidth: '30px', textAlign: 'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 Hub 節點 */}
      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Top 10 知識樞紐
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {metrics.topNodes.map((node, i) => (
            <div
              key={node.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                backgroundColor: i === 0 ? 'rgba(255, 217, 61, 0.08)' : 'transparent',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', minWidth: '18px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', flex: 1 }}>{node.name}</span>
              <span style={{
                fontSize: '0.65rem',
                color: CATEGORY_COLORS[node.category],
                backgroundColor: `${CATEGORY_COLORS[node.category]}15`,
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {node.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#ffd93d', fontWeight: 600 }}>{node.links}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
