import { useMemo, useState, useEffect } from 'react';
import { computeGraphMetrics } from '../graphDataParser';
import type { GraphData } from '../types';
import { BarChart3, Network, GitBranch, AlertTriangle, TrendingUp, Layers, Flame, ExternalLink } from 'lucide-react';

interface DashboardMetricsProps {
  data: GraphData;
  onCategoryClick?: (category: string) => void;
  onLayerClick?: (layer: string) => void;
}

const MetricCard = ({ icon: Icon, label, value, subtext, accentColor }: {
  icon: any; label: string; value: string | number; subtext?: string; accentColor: string;
}) => (
  <div style={{
    background: 'var(--apple-surface)',
    border: '1px solid var(--apple-border)',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--apple-shadow-sm)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={14} color={accentColor} />
      <span style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {label}
      </span>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: accentColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
      {value}
    </div>
    {subtext && (
      <div style={{ fontSize: '0.7rem', color: 'var(--apple-text-tertiary)' }}>{subtext}</div>
    )}
  </div>
);

const CATEGORY_COLORS: Record<string, string> = {
  '實體': '#34c759',
  '概念': '#0071e3',
  '摘要': '#ff375f',
  '對比': '#ff9500',
  '綜合': '#af52de',
  'unknown': '#86868b',
};

export const DashboardMetrics = ({ data, onCategoryClick, onLayerClick, onIsolatedClick }: DashboardMetricsProps & { onIsolatedClick?: () => void }) => {
  const metrics = useMemo(() => computeGraphMetrics(data), [data]);

  // 🔥 知識密度熱力圖
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [crossLinks, setCrossLinks] = useState(0);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/density-heatmap')
      .then(r => r.json())
      .then(d => {
        setHeatmap(d.heatmap || []);
        setCrossLinks(d.crossLinks || 0);
        setHeatmapLoading(false);
      })
      .catch(() => setHeatmapLoading(false));
  }, []);

  const densityColor = (density: number) => {
    if (density > 0.1) return '#ff375f';    // 高密度 - 紅
    if (density > 0.05) return '#ff9500';    // 中高密度 - 橘
    if (density > 0.02) return '#ffcc00';    // 中密度 - 黃
    if (density > 0.005) return '#34c759';   // 低密度 - 綠
    return '#86868b';                         // 極低 - 灰
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* 核心指標 */}
      <div>
        <h3 style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
          知識圖譜概覽
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <MetricCard
            icon={Network}
            label="節點總數"
            value={metrics.totalNodes}
            subtext={`密度: ${metrics.density.toFixed(4)}`}
            accentColor="var(--apple-blue)"
          />
          <MetricCard
            icon={GitBranch}
            label="連結總數"
            value={metrics.totalLinks}
            subtext={`平均度: ${metrics.avgDegree.toFixed(2)}`}
            accentColor="var(--apple-teal)"
          />
          <MetricCard
            icon={TrendingUp}
            label="最高連結節點"
            value={metrics.topNodes[0]?.name || '-'}
            subtext={`${metrics.topNodes[0]?.links || 0} 個連結`}
            accentColor="var(--apple-orange)"
          />
          <MetricCard
            icon={AlertTriangle}
            label="孤立節點"
            value={metrics.isolatedCount}
            subtext="待關聯知識"
            accentColor="var(--apple-red)"
          />
          {onIsolatedClick && metrics.isolatedCount > 0 && (
            <button
              onClick={onIsolatedClick}
              style={{
                gridColumn: '1 / -1',
                padding: '8px',
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
                borderRadius: '10px',
                color: 'var(--apple-red)',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--apple-font)',
              }}
            >
              🔍 查看孤立節點列表 →
            </button>
          )}
        </div>
      </div>

      {/* 分類分佈 */}
      <div>
        <h3 style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={13} />
          分類分佈
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(metrics.categoryCount).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
            const pct = metrics.totalNodes > 0 ? (count / metrics.totalNodes) * 100 : 0;
            const color = CATEGORY_COLORS[cat] || '#86868b';
            return (
              <div
                key={cat}
                onClick={() => onCategoryClick?.(cat)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}
              >
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--apple-text-secondary)', flex: 1 }}>{cat}</span>
                <div style={{ width: '80px', height: '4px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', minWidth: '28px', textAlign: 'right', fontWeight: 500 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 層級分佈 */}
      <div>
        <h3 style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart3 size={13} />
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
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#af52de', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--apple-text-secondary)', flex: 1 }}>{layer}</span>
                <div style={{ width: '80px', height: '4px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#af52de', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', minWidth: '28px', textAlign: 'right', fontWeight: 500 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 知識密度熱力圖 */}
      <div>
        <h3 style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={13} />
          知識密度熱力圖
          {crossLinks > 0 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--apple-blue)', marginLeft: 8, fontWeight: 400 }}>
              跨領域連結: {crossLinks}
            </span>
          )}
        </h3>
        {heatmapLoading ? (
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)' }}>載入中...</div>
        ) : heatmap.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {heatmap.map((h, i) => (
              <div
                key={i}
                style={{
                  background: densityColor(h.density),
                  borderRadius: '8px',
                  padding: '8px 10px',
                  opacity: 0.85,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 600, marginBottom: 2 }}>
                  {h.category.replace(/\d+_[^_]+_/, '').replace('_概念', '概念').replace('_實體', '實體').replace('_摘要', '摘要').replace('_綜合', '綜合')}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{h.nodes}</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)' }}>
                  密度 {h.density.toFixed(3)} | 連結 {h.internalLinks}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)' }}>無熱力圖數據</div>
        )}
      </div>

      {/* Top 10 Hub 節點 */}
      <div>
        <h3 style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
          Top 10 知識樞紐
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {metrics.topNodes.map((node, i) => (
            <div
              key={node.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                backgroundColor: i === 0 ? 'rgba(255, 149, 0, 0.06)' : 'transparent',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '0.675rem', color: 'var(--apple-text-tertiary)', minWidth: '18px', fontWeight: 500 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--apple-text-primary)', flex: 1, fontWeight: i < 3 ? 500 : 400 }}>{node.name}</span>
              <span style={{
                fontSize: '0.65rem',
                color: CATEGORY_COLORS[node.category],
                backgroundColor: `${CATEGORY_COLORS[node.category]}12`,
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 500,
              }}>
                {node.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#ff9500', fontWeight: 600 }}>{node.links}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
