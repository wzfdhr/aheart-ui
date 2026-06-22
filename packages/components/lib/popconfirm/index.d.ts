declare const Popconfirm: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
        readonly description: StringConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
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
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
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
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        cancel: () => void;
        "update:open": (open: boolean) => void;
        openChange: (open: boolean) => void;
        confirm: () => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly open: boolean;
        readonly placement: "left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
        readonly showCancel: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
        readonly description: StringConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
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
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
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
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly open: boolean;
        readonly placement: "left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
        readonly showCancel: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly description: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
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
        readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
    confirm: () => void;
}, string, {
    readonly disabled: boolean;
    readonly open: boolean;
    readonly placement: "left" | "right" | "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly defaultOpen: boolean;
    readonly arrow: boolean;
    readonly okText: string;
    readonly cancelText: string;
    readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
    readonly showCancel: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        icon?(_: {}): any;
        title?(_: {}): any;
        description?(_: {}): any;
    };
})>;
export default Popconfirm;
export type { PopconfirmProps } from './types';
