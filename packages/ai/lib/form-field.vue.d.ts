import type { AIFormFieldV1 } from './form-schema';
declare const _default: import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    field: AIFormFieldV1;
    value: unknown;
    disabled?: boolean | undefined;
    error?: string | undefined;
}>>, {
    focus: () => void;
}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    update: (value: unknown) => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    field: AIFormFieldV1;
    value: unknown;
    disabled?: boolean | undefined;
    error?: string | undefined;
}>>> & Readonly<{
    onUpdate?: ((value: unknown) => any) | undefined;
}>, {}, {}, {}, {}, string, import("@vue/runtime-core").ComponentProvideOptions, true, {}, any>;
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
