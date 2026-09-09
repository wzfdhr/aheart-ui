import type { DragData, DraggableOptions } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<DraggableOptions>, {
    tag: string;
    keyboard: boolean;
}>>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    drop: () => void;
    dragStart: () => void;
    keyboardGrab: (args_0: {
        sessionId: string;
        data: DragData;
        source: {
            label: string;
            scopeKey?: string | number | undefined;
        };
    }) => void;
    keyboardCancel: (args_0: {
        sessionId: string;
        data: DragData;
        source: {
            label: string;
            scopeKey?: string | number | undefined;
        };
        reason: "unmounted" | "cancelled" | "replaced" | "scope-changed" | "page-hidden" | "owner-detached";
    }) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<DraggableOptions>, {
    tag: string;
    keyboard: boolean;
}>>> & Readonly<{
    onDrop?: (() => any) | undefined;
    onDragStart?: (() => any) | undefined;
    onKeyboardGrab?: ((args_0: {
        sessionId: string;
        data: DragData;
        source: {
            label: string;
            scopeKey?: string | number | undefined;
        };
    }) => any) | undefined;
    onKeyboardCancel?: ((args_0: {
        sessionId: string;
        data: DragData;
        source: {
            label: string;
            scopeKey?: string | number | undefined;
        };
        reason: "unmounted" | "cancelled" | "replaced" | "scope-changed" | "page-hidden" | "owner-detached";
    }) => any) | undefined;
}>, {
    keyboard: boolean;
    tag: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
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
