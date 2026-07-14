import type { AIAgentArtifact, AIAgentContextItem, AIAgentTask, AIAttachment, AIConversation, AIMessage, AIPrompt, AISource, AITransport } from './types';
type WorkbenchPanelSize = number | `${number}%` | 'auto';
declare const _default: __VLS_WithTemplateSlots<import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    title?: string | undefined;
    description?: string | undefined;
    panelSizes?: WorkbenchPanelSize[] | undefined;
    conversations?: AIConversation[] | undefined;
    activeConversation?: string | undefined;
    messages?: AIMessage[] | undefined;
    prompts?: AIPrompt[] | undefined;
    transport?: AITransport | undefined;
    tasks?: AIAgentTask[] | undefined;
    contextItems?: AIAgentContextItem[] | undefined;
    sources?: AISource[] | undefined;
    attachments?: AIAttachment[] | undefined;
    artifacts?: AIAgentArtifact[] | undefined;
    activeArtifact?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    title: string;
    description: string;
    panelSizes: () => (string | number)[];
    conversations: () => never[];
    activeConversation: undefined;
    messages: () => never[];
    prompts: () => never[];
    transport: undefined;
    tasks: () => never[];
    contextItems: () => never[];
    sources: () => never[];
    attachments: () => never[];
    artifacts: () => never[];
    activeArtifact: undefined;
    disabled: boolean;
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    error: (message: string) => void;
    retry: (task: AIAgentTask) => void;
    cancel: (task: AIAgentTask) => void;
    stop: () => void;
    "update:tasks": (tasks: AIAgentTask[]) => void;
    approve: (task: AIAgentTask) => void;
    reject: (task: AIAgentTask) => void;
    "move-task": (id: string, direction: "up" | "down") => void;
    "update:messages": (messages: AIMessage[]) => void;
    "update:activeConversation": (key: string) => void;
    "update:panelSizes": (sizes: number[]) => void;
    "update:activeArtifact": (id: string) => void;
    "update:contextItems": (items: AIAgentContextItem[]) => void;
    "move-context": (id: string, direction: "up" | "down") => void;
    "chat-retry": (message: AIMessage) => void;
    "chat-regenerate": (message: AIMessage) => void;
    "chat-edit": (message: AIMessage, content: string) => void;
    "chat-copy": (message: AIMessage) => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    title?: string | undefined;
    description?: string | undefined;
    panelSizes?: WorkbenchPanelSize[] | undefined;
    conversations?: AIConversation[] | undefined;
    activeConversation?: string | undefined;
    messages?: AIMessage[] | undefined;
    prompts?: AIPrompt[] | undefined;
    transport?: AITransport | undefined;
    tasks?: AIAgentTask[] | undefined;
    contextItems?: AIAgentContextItem[] | undefined;
    sources?: AISource[] | undefined;
    attachments?: AIAttachment[] | undefined;
    artifacts?: AIAgentArtifact[] | undefined;
    activeArtifact?: string | undefined;
    disabled?: boolean | undefined;
}>, {
    title: string;
    description: string;
    panelSizes: () => (string | number)[];
    conversations: () => never[];
    activeConversation: undefined;
    messages: () => never[];
    prompts: () => never[];
    transport: undefined;
    tasks: () => never[];
    contextItems: () => never[];
    sources: () => never[];
    attachments: () => never[];
    artifacts: () => never[];
    activeArtifact: undefined;
    disabled: boolean;
}>>> & Readonly<{
    onError?: ((message: string) => any) | undefined;
    onRetry?: ((task: AIAgentTask) => any) | undefined;
    onCancel?: ((task: AIAgentTask) => any) | undefined;
    onStop?: (() => any) | undefined;
    "onUpdate:tasks"?: ((tasks: AIAgentTask[]) => any) | undefined;
    onApprove?: ((task: AIAgentTask) => any) | undefined;
    onReject?: ((task: AIAgentTask) => any) | undefined;
    "onMove-task"?: ((id: string, direction: "up" | "down") => any) | undefined;
    "onUpdate:messages"?: ((messages: AIMessage[]) => any) | undefined;
    "onUpdate:activeConversation"?: ((key: string) => any) | undefined;
    "onUpdate:panelSizes"?: ((sizes: number[]) => any) | undefined;
    "onUpdate:activeArtifact"?: ((id: string) => any) | undefined;
    "onUpdate:contextItems"?: ((items: AIAgentContextItem[]) => any) | undefined;
    "onMove-context"?: ((id: string, direction: "up" | "down") => any) | undefined;
    "onChat-retry"?: ((message: AIMessage) => any) | undefined;
    "onChat-regenerate"?: ((message: AIMessage) => any) | undefined;
    "onChat-edit"?: ((message: AIMessage, content: string) => any) | undefined;
    "onChat-copy"?: ((message: AIMessage) => any) | undefined;
}>, {
    sources: AISource[];
    title: string;
    disabled: boolean;
    tasks: AIAgentTask[];
    artifacts: AIAgentArtifact[];
    activeArtifact: string;
    attachments: AIAttachment[];
    conversations: AIConversation[];
    prompts: AIPrompt[];
    description: string;
    messages: AIMessage[];
    transport: AITransport;
    activeConversation: string;
    panelSizes: WorkbenchPanelSize[];
    contextItems: AIAgentContextItem[];
}, {}, {}, {}, string, import("@vue/runtime-core").ComponentProvideOptions, true, {}, any>, {
    sources?(_: {
        sources: AISource[];
    }): any;
    attachments?(_: {
        attachments: AIAttachment[];
    }): any;
    task?(_: {
        task: AIAgentTask;
        index: number;
    }): any;
    artifact?(_: {
        artifact: AIAgentArtifact;
    }): any;
    "artifact-preview"?(_: {
        artifact: AIAgentArtifact;
    }): any;
}>;
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
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
