export function DashboardMetrics({ nodes, links }: { nodes: any[]; links: any[] }) {
  const n = nodes.length;
  const e = links.length;
  const density = n > 1 ? ((2 * e) / (n * (n - 1)) * 100).toFixed(3) : '0';
  const avgLinks = n > 0 ? (e / n).toFixed(1) : '0';
  const maxLinks = Math.max(...nodes.map(node => node.links || 0), 0);
  const isolated = nodes.filter(node => node.links === 0).length;
  const topNodes = [...nodes].sort((a, b) => (b.links || 0) - (a.links || 0)).slice(0, 15);

  const catCounts: Record<string, number> = {};
  nodes.forEach(node => { const c = node.category || 'unknown'; catCounts[c] = (catCounts[c] || 0) + 1; });

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>📊 知識密度儀表板</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: '知識節點', value: n, color: 'var(--apple-blue)' },
          { label: '關聯連結', value: e, color: 'var(--apple-teal)' },
          { label: '知識密度', value: `${density}%`, color: 'var(--apple-green)' },
          { label: '平均連結', value: avgLinks, color: 'var(--apple-purple)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-secondary)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--apple-blue)' }}>{maxLinks}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-secondary)' }}>最高連結數</div>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--apple-orange)' }}>{isolated}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-secondary)' }}>孤立節點</div>
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--apple-green)' }}>{Object.keys(catCounts).length}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--apple-text-secondary)' }}>類別數</div>
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'var(--apple-text-secondary)' }}>🏆 知識中心（Top 15）</h3>
        {topNodes.map((node, i) => (
          <div key={node.name} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--apple-border)' }}>
            <span style={{ width: '24px', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', fontWeight: 600 }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{node.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--apple-text-tertiary)' }}>{node.category} · {node.layer}</div>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--apple-blue)' }}>{node.links} 🔗</div>
          </div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'var(--apple-text-secondary)' }}>📂 類別分布</h3>
        {Object.entries(catCounts).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([cat, count]) => {
          const pct = n > 0 ? ((count as number) / n) * 100 : 0;
          return (
            <div key={cat} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span>{cat}</span>
                <span style={{ color: 'var(--apple-text-tertiary)' }}>{count} ({pct.toFixed(1)}%)</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#e5e5ea', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--apple-blue)', borderRadius: '2px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
