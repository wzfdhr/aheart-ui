import type { TreeKey, TreeNodeData } from './types';
import { type TreeIndex } from './tree-index';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    node: TreeNodeData;
    expandedKeys: TreeKey[];
    selectedKeys: TreeKey[];
    checkedKeys: TreeKey[];
    focusedKey?: TreeKey | undefined;
    checkable: boolean;
    parentDisabled?: boolean | undefined;
    nodeIndex: TreeIndex;
    idPrefix: string;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    focus: (node: TreeNodeData) => void;
    keydown: (event: KeyboardEvent, node: TreeNodeData) => void;
    select: (node: TreeNodeData) => void;
    toggle: (node: TreeNodeData) => void;
    check: (node: TreeNodeData) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    node: TreeNodeData;
    expandedKeys: TreeKey[];
    selectedKeys: TreeKey[];
    checkedKeys: TreeKey[];
    focusedKey?: TreeKey | undefined;
    checkable: boolean;
    parentDisabled?: boolean | undefined;
    nodeIndex: TreeIndex;
    idPrefix: string;
}>>> & Readonly<{
    onFocus?: ((node: TreeNodeData) => any) | undefined;
    onKeydown?: ((event: KeyboardEvent, node: TreeNodeData) => any) | undefined;
    onSelect?: ((node: TreeNodeData) => any) | undefined;
    onToggle?: ((node: TreeNodeData) => any) | undefined;
    onCheck?: ((node: TreeNodeData) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
