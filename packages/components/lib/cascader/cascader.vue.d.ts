import type { FloatingPlacement } from '../utils/floating';
import type { CascaderOption, CascaderValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    options?: CascaderOption[] | undefined;
    modelValue?: CascaderValue;
    defaultValue?: CascaderValue;
    multiple?: boolean | undefined;
    showSearch?: boolean | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    allowClear?: boolean | undefined;
    maxTagCount?: number | undefined;
    placement?: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom" | undefined;
    autoAdjustOverflow?: boolean | undefined;
    getPopupContainer?: ((triggerNode: HTMLElement) => HTMLElement) | undefined;
    loadData?: ((option: CascaderOption) => Promise<CascaderOption[]>) | undefined;
}>, {
    options: () => never[];
    placeholder: string;
    placement: string;
    autoAdjustOverflow: boolean;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: CascaderValue) => void;
    clear: () => void;
    "update:modelValue": (value: CascaderValue) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    options?: CascaderOption[] | undefined;
    modelValue?: CascaderValue;
    defaultValue?: CascaderValue;
    multiple?: boolean | undefined;
    showSearch?: boolean | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    open?: boolean | undefined;
    defaultOpen?: boolean | undefined;
    allowClear?: boolean | undefined;
    maxTagCount?: number | undefined;
    placement?: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom" | undefined;
    autoAdjustOverflow?: boolean | undefined;
    getPopupContainer?: ((triggerNode: HTMLElement) => HTMLElement) | undefined;
    loadData?: ((option: CascaderOption) => Promise<CascaderOption[]>) | undefined;
}>, {
    options: () => never[];
    placeholder: string;
    placement: string;
    autoAdjustOverflow: boolean;
}>>> & Readonly<{
    onChange?: ((value: CascaderValue) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: CascaderValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    placeholder: string;
    placement: FloatingPlacement;
    options: CascaderOption[];
    autoAdjustOverflow: boolean;
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
