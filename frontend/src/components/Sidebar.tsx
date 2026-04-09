import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useState } from 'react';
import type { ContentTreeItem } from '../types';

export function Sidebar({ tree, onSelect, activePath }: { tree: ContentTreeItem[]; onSelect: (path: string) => void; activePath: string | null }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
      {tree.map((n) => <TreeNodeItem key={n.path} node={n} onSelect={onSelect} activePath={activePath} />)}
    </div>
  );
}

function TreeNodeItem({ node, onSelect, activePath, depth = 0 }: { node: ContentTreeItem; onSelect: (p: string) => void; activePath: string | null; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const displayName = node.name.replace(/^\d+_/, '');

  if (node.type === 'dir') {
    return (
      <div>
        <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 6px', color: 'var(--apple-text-secondary)', fontSize: depth === 0 ? '0.8rem' : '0.74rem', fontWeight: depth === 0 ? 600 : 500, borderRadius: '4px' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          <Folder size={11} style={{ marginRight: '4px', opacity: 0.6 }} />
          {displayName}
        </div>
        {open && node.children?.map((child) => <TreeNodeItem key={child.path} node={child} onSelect={onSelect} activePath={activePath} depth={depth + 1} />)}
      </div>
    );
  }
  return null;
}
