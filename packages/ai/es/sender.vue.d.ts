declare const _default: import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: string | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    loading?: boolean | undefined;
}>, {
    modelValue: string;
    placeholder: string;
    disabled: boolean;
    loading: boolean;
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    submit: (content: string) => void;
    stop: () => void;
    "update:modelValue": (value: string) => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: string | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    loading?: boolean | undefined;
}>, {
    modelValue: string;
    placeholder: string;
    disabled: boolean;
    loading: boolean;
}>>> & Readonly<{
    onSubmit?: ((content: string) => any) | undefined;
    onStop?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    disabled: boolean;
    loading: boolean;
    placeholder: string;
    modelValue: string;
}, {}, {}, {}, string, import("@vue/runtime-core").ComponentProvideOptions, true, {}, any>;
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
