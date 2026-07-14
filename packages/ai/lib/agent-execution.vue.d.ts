import type { AIAgentArtifact, AIAgentTask } from './types';
declare const _default: __VLS_WithTemplateSlots<import("@vue/runtime-core").DefineComponent<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    tasks?: AIAgentTask[] | undefined;
    artifacts?: AIAgentArtifact[] | undefined;
    disabled?: boolean | undefined;
}>, {
    tasks: () => never[];
    artifacts: () => never[];
    disabled: boolean;
}>>, {}, {}, {}, {}, import("@vue/runtime-core").ComponentOptionsMixin, import("@vue/runtime-core").ComponentOptionsMixin, {
    cancel: (task: AIAgentTask) => void;
    "update:tasks": (tasks: AIAgentTask[]) => void;
    approve: (task: AIAgentTask) => void;
    reject: (task: AIAgentTask) => void;
    retry: (task: AIAgentTask) => void;
    "move-task": (id: string, direction: "up" | "down") => void;
}, string, import("@vue/runtime-core").PublicProps, Readonly<import("@vue/runtime-core").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    tasks?: AIAgentTask[] | undefined;
    artifacts?: AIAgentArtifact[] | undefined;
    disabled?: boolean | undefined;
}>, {
    tasks: () => never[];
    artifacts: () => never[];
    disabled: boolean;
}>>> & Readonly<{
    onCancel?: ((task: AIAgentTask) => any) | undefined;
    "onUpdate:tasks"?: ((tasks: AIAgentTask[]) => any) | undefined;
    onApprove?: ((task: AIAgentTask) => any) | undefined;
    onReject?: ((task: AIAgentTask) => any) | undefined;
    onRetry?: ((task: AIAgentTask) => any) | undefined;
    "onMove-task"?: ((id: string, direction: "up" | "down") => any) | undefined;
}>, {
    disabled: boolean;
    tasks: AIAgentTask[];
    artifacts: AIAgentArtifact[];
}, {}, {}, {}, string, import("@vue/runtime-core").ComponentProvideOptions, true, {}, any>, {
    task?(_: {
        task: AIAgentTask;
        index: number;
    }): any;
    artifact?(_: {
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
