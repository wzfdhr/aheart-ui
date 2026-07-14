declare const _default: import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: Record<string, unknown> | undefined;
    schema: unknown;
}>, {
    modelValue: () => {};
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    submit: (value: Record<string, unknown>) => void;
    "update:modelValue": (value: Record<string, unknown>) => void;
    "schema-error": (errors: string[]) => void;
    "validation-error": (errors: {
        key: string;
        message: string;
    }[]) => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: Record<string, unknown> | undefined;
    schema: unknown;
}>, {
    modelValue: () => {};
}>>> & Readonly<{
    onSubmit?: ((value: Record<string, unknown>) => any) | undefined;
    "onUpdate:modelValue"?: ((value: Record<string, unknown>) => any) | undefined;
    "onSchema-error"?: ((errors: string[]) => any) | undefined;
    "onValidation-error"?: ((errors: {
        key: string;
        message: string;
    }[]) => any) | undefined;
}>, {
    modelValue: Record<string, unknown>;
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
