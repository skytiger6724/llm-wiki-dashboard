import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronDown, FileText, Folder, BrainCircuit } from 'lucide-react';

// 介面定義
export interface TreeNode {
  name: string;
  type: 'file' | 'dir';
  path: string;
  children?: TreeNode[];
}

const TreeNodeItem = ({ node, onSelect, activePath }: { node: TreeNode, onSelect: (p: string) => void, activePath: string | null }) => {
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

function App() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 初始化拉取
  useEffect(() => {
    fetch('http://localhost:3001/api/tree').then(r => r.json()).then(setTree);
  }, []);

  // 讀取內容
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

  // 搜尋檔案路徑的功能 (用於處理 [[Link]])
  const findPathByName = useCallback((name: string, nodes: TreeNode[]): string | null => {
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

  return (
    <div className="app-container">
      {/* 側邊欄 */}
      <aside className="glass-panel animate-stagger" style={{ width: '320px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BrainCircuit size={24} color="var(--accent-neon)" />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>LLM WIKI</h1>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COMPILED DASHBOARD</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
          {tree.map((n, i) => <TreeNodeItem key={i} node={n} onSelect={setSelectedPath} activePath={selectedPath} />)}
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="glass-panel animate-stagger" style={{ flex: 1, display: 'flex', flexDirection: 'column', animationDelay: '0.1s' }}>
        {selectedPath ? (
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
        )}
      </main>
    </div>
  );
}

export default App;
