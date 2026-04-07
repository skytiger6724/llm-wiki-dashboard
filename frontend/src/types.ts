export interface TreeNode {
  name: string;
  type: 'dir' | 'file';
  path: string;
  children?: TreeNode[];
}
