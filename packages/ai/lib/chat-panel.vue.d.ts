import type { AIMessage, AITransport } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    messages?: AIMessage[] | undefined;
    transport: AITransport;
    conversationId?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    messages: () => never[];
    conversationId: undefined;
    disabled: boolean;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    error: (error: string) => void;
    stop: () => void;
    "update:messages": (messages: AIMessage[]) => void;
    send: (content: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    messages?: AIMessage[] | undefined;
    transport: AITransport;
    conversationId?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    messages: () => never[];
    conversationId: undefined;
    disabled: boolean;
}>>> & Readonly<{
    onError?: ((error: string) => any) | undefined;
    onStop?: (() => any) | undefined;
    "onUpdate:messages"?: ((messages: AIMessage[]) => any) | undefined;
    onSend?: ((content: string) => any) | undefined;
}>, {
    disabled: boolean;
    messages: AIMessage[];
    conversationId: string;
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
