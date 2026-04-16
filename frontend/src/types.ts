export interface ContentTreeItem {
  name: string;
  type: 'file' | 'dir';
  path: string;
  children?: ContentTreeItem[];
}

export interface ChangelogEntry {
  title: string;
  body: string;
  type: 'add' | 'fix' | 'update' | 'remove';
  affectedFiles: string[];
  summary: string;
}

export interface GraphNode {
  name: string;
  category: string;
  layer: string;
  path: string;
  links: number;
  confidence?: number;
  decay_factor?: number;
  isCrystallized?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  links: Array<{ source: string; target: string; strength?: number; relation?: string }>;
  wikilinks: Record<string, string[]>;
  count: number;
  totalWikilinks: number;
}
