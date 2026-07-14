import type { TreeKey, TreeNodeData } from '../tree';
type TreeSelectValue = TreeKey | TreeKey[] | undefined;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    treeData?: TreeNodeData[] | undefined;
    modelValue?: TreeSelectValue;
    defaultValue?: TreeSelectValue;
    multiple?: boolean | undefined;
    showSearch?: boolean | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    treeData: () => never[];
    placeholder: string;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: TreeSelectValue) => void;
    "update:modelValue": (value: TreeSelectValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    treeData?: TreeNodeData[] | undefined;
    modelValue?: TreeSelectValue;
    defaultValue?: TreeSelectValue;
    multiple?: boolean | undefined;
    showSearch?: boolean | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    treeData: () => never[];
    placeholder: string;
}>>> & Readonly<{
    onChange?: ((value: TreeSelectValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: TreeSelectValue) => any) | undefined;
}>, {
    placeholder: string;
    treeData: TreeNodeData[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
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
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
