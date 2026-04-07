import React, { useState } from 'react';
import { TreeNode } from '../types';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';

interface SidebarProps {
  tree: TreeNode[];
  onSelectFile: (path: string) => void;
}

const TreeNodeItem: React.FC<{ node: TreeNode, onSelectFile: (path: string) => void }> = ({ node, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === 'dir') {
    return (
      <div style={{ marginLeft: '0.8rem', marginTop: '0.4rem' }}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '4px 0' }}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} style={{ margin: '0 6px', opacity: 0.7 }} />
          <span>{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', marginLeft: '6px' }}>
            {node.children.map((child, idx) => (
              <TreeNodeItem key={idx} node={child} onSelectFile={onSelectFile} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelectFile(node.path)}
      style={{ marginLeft: '1.8rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.85rem', padding: '4px 0' }}
    >
      <FileText size={14} style={{ margin: '0 6px', color: 'var(--accent-electric)', opacity: 0.8 }} />
      <span 
        style={{ transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent-neon)';
        }} 
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-main)';
        }}
      >
        {node.name.replace('.md', '')}
      </span>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ tree, onSelectFile }) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
      {tree.length === 0 && (
        <div style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>知識探測中...</div>
      )}
      {tree.map((node, idx) => (
        <TreeNodeItem key={idx} node={node} onSelectFile={onSelectFile} />
      ))}
    </div>
  );
};

export default Sidebar;
