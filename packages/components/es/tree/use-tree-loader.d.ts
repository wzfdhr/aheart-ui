import { type InjectionKey, type ComputedRef } from 'vue';
import { type TreeIndex } from './tree-index';
import type { TreeKey, TreeLoadData, TreeNodeData } from './types';
export declare function useTreeLoader(source: () => TreeNodeData[], getLoader: () => TreeLoadData | undefined, disabled: () => boolean): {
    data: ComputedRef<TreeNodeData[]>;
    loadingKeys: import("vue").ShallowRef<Set<TreeKey>, Set<TreeKey>>;
    errorKeys: import("vue").ShallowRef<Set<TreeKey>, Set<TreeKey>>;
    version: import("vue").ShallowRef<number, number>;
    load: (key: TreeKey, retry?: boolean) => Promise<boolean>;
    cancel: (key: TreeKey) => void;
    cancelAll: () => void;
};
export declare const treeModelKey: InjectionKey<{
    loader: ReturnType<typeof useTreeLoader>;
    index: ComputedRef<TreeIndex>;
}>;
