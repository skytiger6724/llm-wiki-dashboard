import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentAreaProps {
  filePath: string;
  onLinkClick: (path: string) => void;
}

const ContentArea: React.FC<ContentAreaProps> = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    console.log("正在讀取檔案:", filePath);
    fetch(`http://localhost:3001/api/content?path=${encodeURIComponent(filePath)}`)
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error("檔案讀取失敗:", err);
        setContent('載入失敗或檔案不存在。');
        setLoading(false);
      });
  }, [filePath]);

  if (loading) {
    return <div style={{ padding: '2.5rem', color: 'var(--text-muted)' }}>🧠 知識解碼中...</div>;
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', lineHeight: 1.7 }}>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--accent-electric)', opacity: 0.6, fontFamily: 'monospace' }}>
        {filePath}
      </div>
      
      <div className="markdown-body" style={{ color: '#e0e0e0' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // 簡化組件渲染，確保穩定性
            h1: ({children}) => <h1 style={{ color: 'white', marginBottom: '1rem' }}>{children}</h1>,
            h2: ({children}) => <h2 style={{ color: 'var(--accent-neon)', marginTop: '2rem', borderBottom: '1px solid var(--glass-border)' }}>{children}</h2>,
            p: ({children}) => <p style={{ marginBottom: '1rem' }}>{children}</p>,
            code: ({children}) => <code style={{ background: '#2d2d2d', padding: '2px 4px', borderRadius: '4px' }}>{children}</code>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ContentArea;
