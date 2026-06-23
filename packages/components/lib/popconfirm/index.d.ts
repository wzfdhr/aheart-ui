declare const Popconfirm: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: {
            type: import("vue").PropType<import("./types").PopconfirmContent>;
            default: undefined;
        };
        readonly description: {
            type: import("vue").PropType<import("./types").PopconfirmContent>;
            default: undefined;
        };
        readonly icon: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
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
        readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly disabled: BooleanConstructor;
        readonly showCancel: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly color: StringConstructor;
        readonly arrow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").PopconfirmGetPopupContainer>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onCancel?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
        onConfirm?: (() => any) | undefined;
        onPopupClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        cancel: () => void;
        "update:open": (open: boolean) => void;
        openChange: (open: boolean) => void;
        confirm: () => void;
        popupClick: (event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly icon: import("vue").VNodeChild;
        readonly title: import("./types").PopconfirmContent;
        readonly description: import("./types").PopconfirmContent;
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly arrow: boolean;
        readonly defaultOpen: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly showCancel: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: {
            type: import("vue").PropType<import("./types").PopconfirmContent>;
            default: undefined;
        };
        readonly description: {
            type: import("vue").PropType<import("./types").PopconfirmContent>;
            default: undefined;
        };
        readonly icon: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
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
        readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly disabled: BooleanConstructor;
        readonly showCancel: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly color: StringConstructor;
        readonly arrow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").PopconfirmGetPopupContainer>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onCancel?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
        onConfirm?: (() => any) | undefined;
        onPopupClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly icon: import("vue").VNodeChild;
        readonly title: import("./types").PopconfirmContent;
        readonly description: import("./types").PopconfirmContent;
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly arrow: boolean;
        readonly defaultOpen: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly showCancel: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: {
        type: import("vue").PropType<import("./types").PopconfirmContent>;
        default: undefined;
    };
    readonly description: {
        type: import("vue").PropType<import("./types").PopconfirmContent>;
        default: undefined;
    };
    readonly icon: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
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
    readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
    readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
    readonly disabled: BooleanConstructor;
    readonly showCancel: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly color: StringConstructor;
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: import("vue").PropType<import("./types").PopconfirmGetPopupContainer>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").PopconfirmSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onCancel?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onConfirm?: (() => any) | undefined;
    onPopupClick?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
    confirm: () => void;
    popupClick: (event: MouseEvent) => void;
}, string, {
    readonly icon: import("vue").VNodeChild;
    readonly title: import("./types").PopconfirmContent;
    readonly description: import("./types").PopconfirmContent;
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly arrow: boolean;
    readonly defaultOpen: boolean;
    readonly okText: string;
    readonly cancelText: string;
    readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
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
