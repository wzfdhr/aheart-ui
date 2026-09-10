import type { InjectionKey, Ref } from 'vue';
import type { TreeKey } from './types';
export interface TreeFocusBridge {
    register(request: (key: TreeKey, allowExternalSource?: boolean) => void, cancel: () => void, endpoints?: (last: boolean) => TreeKey | undefined): () => void;
    request(key: TreeKey, options?: {
        allowExternalSource?: boolean;
    }): void;
    requestEndpoint(last: boolean, options?: {
        allowExternalSource?: boolean;
    }): void;
    cancel(): void;
}
export declare const treeFocusBridgeKey: InjectionKey<TreeFocusBridge>;
export declare const treeVirtualViewportHeightKey: InjectionKey<Ref<number | undefined>>;
export declare const createTreeFocusBridge: () => TreeFocusBridge;
