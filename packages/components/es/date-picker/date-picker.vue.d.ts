declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: string | undefined;
    defaultValue?: string | undefined;
    format?: string | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    disabledDate?: ((date: Date) => boolean) | undefined;
}>, {
    format: string;
    placeholder: string;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string | undefined) => void;
    "update:modelValue": (value: string | undefined) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: string | undefined;
    defaultValue?: string | undefined;
    format?: string | undefined;
    placeholder?: string | undefined;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
    disabledDate?: ((date: Date) => boolean) | undefined;
}>, {
    format: string;
    placeholder: string;
}>>> & Readonly<{
    onChange?: ((value: string | undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    placeholder: string;
    format: string;
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
