import { type AIFormAsyncValidator } from './form-schema';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: Record<string, unknown> | undefined;
    schema: unknown;
    disabled?: boolean | undefined;
    submitting?: boolean | undefined;
    submitText?: string | undefined;
    submitError?: string | undefined;
    validators?: Record<string, AIFormAsyncValidator> | undefined;
}>, {
    modelValue: () => {};
    disabled: boolean;
    submitting: boolean;
    submitText: string;
    submitError: undefined;
    validators: () => {};
}>>, {
    validate: () => Promise<any>;
    resetFields: () => void;
    clearValidate: (names?: string[] | undefined) => void;
    setFieldsErrors: (fields: {
        name: string;
        errors: string[];
    }[]) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (value: Record<string, unknown>) => void;
    "update:modelValue": (value: Record<string, unknown>) => void;
    "schema-error": (errors: string[]) => void;
    "validation-error": (errors: {
        key: string;
        message: string;
    }[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    modelValue?: Record<string, unknown> | undefined;
    schema: unknown;
    disabled?: boolean | undefined;
    submitting?: boolean | undefined;
    submitText?: string | undefined;
    submitError?: string | undefined;
    validators?: Record<string, AIFormAsyncValidator> | undefined;
}>, {
    modelValue: () => {};
    disabled: boolean;
    submitting: boolean;
    submitText: string;
    submitError: undefined;
    validators: () => {};
}>>> & Readonly<{
    onSubmit?: ((value: Record<string, unknown>) => any) | undefined;
    "onUpdate:modelValue"?: ((value: Record<string, unknown>) => any) | undefined;
    "onSchema-error"?: ((errors: string[]) => any) | undefined;
    "onValidation-error"?: ((errors: {
        key: string;
        message: string;
    }[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: Record<string, unknown>;
    submitting: boolean;
    submitText: string;
    submitError: string;
    validators: Record<string, AIFormAsyncValidator>;
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
