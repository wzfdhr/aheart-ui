declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly description: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly trigger: {
        readonly type: import("vue").PropType<import("../utils/floating").FloatingTriggerProp>;
        readonly default: "click";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly okText: {
        readonly type: StringConstructor;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: StringConstructor;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "primary";
    };
    readonly disabled: BooleanConstructor;
    readonly showCancel: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
    confirm: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly description: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly trigger: {
        readonly type: import("vue").PropType<import("../utils/floating").FloatingTriggerProp>;
        readonly default: "click";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly okText: {
        readonly type: StringConstructor;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: StringConstructor;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "primary";
    };
    readonly disabled: BooleanConstructor;
    readonly showCancel: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
}>> & Readonly<{
    onCancel?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onConfirm?: (() => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly defaultOpen: boolean;
    readonly arrow: boolean;
    readonly okText: string;
    readonly cancelText: string;
    readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
    readonly showCancel: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
    icon?(_: {}): any;
    title?(_: {}): any;
    description?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
