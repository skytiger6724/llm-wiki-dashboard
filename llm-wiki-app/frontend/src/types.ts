export interface TreeNode {
  name: string;
  type: 'dir' | 'file';
  path: string;
  children?: TreeNode[];
}

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  layer: string;
  links: number;
  val: number;
  x?: number;
  y?: number;
  path?: string;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
