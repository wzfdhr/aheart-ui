import type { TreeKey } from './types';
import type { TreeIndex } from './tree-index';
export interface TreeCheckState {
    checkedKeys: TreeKey[];
    halfCheckedKeys: TreeKey[];
}
/** Derives checked and half-checked state without mutating the caller's keys or tree data. */
export declare const deriveTreeCheckState: (index: TreeIndex, keys: readonly TreeKey[], checkStrictly: boolean) => TreeCheckState;
/** Toggles one key against the derived state while retaining typed-key identity. */
export declare const toggleTreeCheck: (index: TreeIndex, keys: readonly TreeKey[], key: TreeKey, checkStrictly: boolean) => TreeCheckState;
