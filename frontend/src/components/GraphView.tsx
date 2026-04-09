import ForceGraph2D from 'react-force-graph-2d';

export function GraphView({ nodes, links, onNodeClick, searchQuery }: {
  nodes: any[];
  links: any[];
  onNodeClick: (node: any) => void;
  searchQuery: string;
}) {
  const filteredNodes = searchQuery
    ? nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodes;
  const nodeIds = new Set(filteredNodes.map(n => n.name));
  const filteredLinks = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

  return (
    <ForceGraph2D
      graphData={{ nodes: filteredNodes, links: filteredLinks }}
      nodeLabel="name"
      nodeRelSize={4}
      nodeVal={(n: any) => Math.max(2, Math.min(8, n.links || 1))}
      nodeColor={(n: any) => {
        const cat = n.category?.split('_')[0] || '';
        const colors: Record<string, string> = { Entities: '#34c759', Concepts: '#0071e3', Summaries: '#ff375f', Synthesis: '#af52de' };
        return colors[cat] || '#86868b';
      }}
      linkWidth={0.5}
      linkColor={() => 'rgba(0,113,227,0.15)'}
      backgroundColor="#f5f5f7"
      onNodeClick={onNodeClick}
      width={window.innerWidth - 280}
      height={window.innerHeight - 60}
    />
  );
}
