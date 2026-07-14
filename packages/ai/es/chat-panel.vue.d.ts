import type { AIAttachment, AIConversation, AIMessage, AIPrompt, AITransport } from './types';
declare const _default: import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    messages?: AIMessage[] | undefined;
    defaultMessages?: AIMessage[] | undefined;
    transport: AITransport;
    conversationId?: string | undefined;
    conversations?: AIConversation[] | undefined;
    activeConversation?: string | undefined;
    prompts?: AIPrompt[] | undefined;
    attachments?: AIAttachment[] | undefined;
    welcomeTitle?: string | undefined;
    welcomeDescription?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    messages: () => never[];
    defaultMessages: () => never[];
    conversationId: undefined;
    conversations: () => never[];
    activeConversation: undefined;
    prompts: () => never[];
    attachments: () => never[];
    welcomeTitle: string;
    welcomeDescription: string;
    disabled: boolean;
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    error: (error: string) => void;
    send: (content: string) => void;
    retry: (message: AIMessage) => void;
    regenerate: (message: AIMessage) => void;
    edit: (message: AIMessage, content: string) => void;
    copy: (message: AIMessage) => void;
    stop: () => void;
    "update:messages": (messages: AIMessage[]) => void;
    "update:activeConversation": (key: string) => void;
    "update:attachments": (attachments: AIAttachment[]) => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    messages?: AIMessage[] | undefined;
    defaultMessages?: AIMessage[] | undefined;
    transport: AITransport;
    conversationId?: string | undefined;
    conversations?: AIConversation[] | undefined;
    activeConversation?: string | undefined;
    prompts?: AIPrompt[] | undefined;
    attachments?: AIAttachment[] | undefined;
    welcomeTitle?: string | undefined;
    welcomeDescription?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    messages: () => never[];
    defaultMessages: () => never[];
    conversationId: undefined;
    conversations: () => never[];
    activeConversation: undefined;
    prompts: () => never[];
    attachments: () => never[];
    welcomeTitle: string;
    welcomeDescription: string;
    disabled: boolean;
}>>> & Readonly<{
    onError?: ((error: string) => any) | undefined;
    onSend?: ((content: string) => any) | undefined;
    onRetry?: ((message: AIMessage) => any) | undefined;
    onRegenerate?: ((message: AIMessage) => any) | undefined;
    onEdit?: ((message: AIMessage, content: string) => any) | undefined;
    onCopy?: ((message: AIMessage) => any) | undefined;
    onStop?: (() => any) | undefined;
    "onUpdate:messages"?: ((messages: AIMessage[]) => any) | undefined;
    "onUpdate:activeConversation"?: ((key: string) => any) | undefined;
    "onUpdate:attachments"?: ((attachments: AIAttachment[]) => any) | undefined;
}>, {
    disabled: boolean;
    attachments: AIAttachment[];
    conversations: AIConversation[];
    prompts: AIPrompt[];
    messages: AIMessage[];
    defaultMessages: AIMessage[];
    conversationId: string;
    activeConversation: string;
    welcomeTitle: string;
    welcomeDescription: string;
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
