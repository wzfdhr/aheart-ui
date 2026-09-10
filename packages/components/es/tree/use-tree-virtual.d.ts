import { type ComputedRef, type Ref } from 'vue';
import { type VirtualItem, type Virtualizer } from '@tanstack/vue-virtual';
import type { IndexedTreeNode } from './tree-index';
import type { TreeKey } from './types';
import type { NormalizedTreeVirtual } from './virtual-options';
/** Tree's virtualization adapter. The logical TreeIndex remains authoritative. */
export declare function useTreeVirtual(root: Ref<HTMLElement | undefined>, config: ComputedRef<NormalizedTreeVirtual | null>, nodes: ComputedRef<IndexedTreeNode[]>, focusedKey: Ref<TreeKey | undefined>, disabled: Ref<boolean>): {
    rows: ComputedRef<{
        entry: IndexedTreeNode;
        item: VirtualItem;
    }[]>;
    totalSize: ComputedRef<number>;
    items: ComputedRef<VirtualItem[]>;
    fallback: Ref<boolean, boolean>;
    ensureKey: (key: TreeKey) => number;
    isPending: (key: TreeKey, version: number) => boolean;
    isMountedKey: (key: TreeKey) => boolean;
    commitFocus: (key: TreeKey) => void;
    cancelPending: (stopReconcile?: boolean) => void;
    measureRow: (element: Element | null, index: number, stableToken?: string) => void;
    focusRecoveryKey: Ref<TreeKey | undefined, TreeKey | undefined>;
    virtualizer: Ref<Virtualizer<HTMLElement, HTMLElement>, Virtualizer<HTMLElement, HTMLElement>>;
};
export type TreeVirtualRow = {
    entry: IndexedTreeNode;
    item: VirtualItem;
};
export type TreeVirtualizer = Virtualizer<HTMLElement, HTMLElement>;
