export function IsolatedNodes({ nodes, onNodeClick }: { nodes: any[]; onNodeClick: (node: any) => void }) {
  const isolated = nodes.filter(n => n.links === 0).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>⚠️ 孤立節點檢測</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--apple-text-secondary)', marginBottom: '20px' }}>
        這些節點沒有被任何 Wikilink 引用，可能是待編譯的原始資料。
      </p>
      <div style={{ background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--apple-orange)' }}>共 {isolated.length} 個孤立節點</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)' }}>{nodes.length > 0 ? ((isolated.length / nodes.length) * 100).toFixed(1) : 0}% 總節點</span>
      </div>
      {isolated.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--apple-green)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>沒有孤立節點！</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--apple-text-secondary)', marginTop: '4px' }}>所有知識節點都已相互連結</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {isolated.map(node => (
            <div key={node.name} onClick={() => { if (node.path) onNodeClick(node); }}
              style={{ background: 'white', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: node.path ? 'pointer' : 'default', boxShadow: 'var(--shadow-sm)', opacity: node.path ? 1 : 0.5 }}>
              <span style={{ fontSize: '0.82rem' }}>{node.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--apple-text-tertiary)' }}>{node.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
