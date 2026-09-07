import type { TreeKey, TreeNodeData } from './types';
export interface IndexedTreeNode {
    key: TreeKey;
    node: TreeNodeData;
    parentKey: TreeKey | undefined;
    children: TreeKey[];
    level: number;
    position: number;
    setSize: number;
    disabled: boolean;
}
export interface TreeIndex {
    nodes: Map<TreeKey, IndexedTreeNode>;
    roots: TreeKey[];
    order: TreeKey[];
}
/** One typed-key index shared by tree rendering, keyboard navigation and selection. */
export declare const createTreeIndex: (treeData: readonly TreeNodeData[], disabled?: boolean) => TreeIndex;
export declare const getVisibleTreeNodes: (index: TreeIndex, expandedKeys: readonly TreeKey[]) => IndexedTreeNode[];
/** Builds an ancestor-preserving filtered tree without recursively walking deep input data. */
export declare const filterTreeIndex: (index: TreeIndex, matches: (node: TreeNodeData) => boolean) => TreeNodeData[];
export declare const closestVisibleTreeKey: (key: TreeKey | undefined, index: TreeIndex, visible: ReadonlySet<TreeKey>) => TreeKey | undefined;
export declare const treeKeyToken: (key: TreeKey) => string;
