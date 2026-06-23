declare const Popover: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: {
            type: import("vue").PropType<import("./types").PopoverContent>;
            default: undefined;
        };
        readonly content: {
            type: import("vue").PropType<import("./types").PopoverContent>;
            default: undefined;
        };
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "top";
            readonly validator: (value: string) => boolean;
        };
        readonly trigger: {
            readonly type: import("vue").PropType<import("../utils/floating").FloatingTriggerProp>;
            readonly default: "hover";
            readonly validator: (value: unknown) => boolean;
        };
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly color: StringConstructor;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly destroyOnHidden: BooleanConstructor;
        readonly fresh: BooleanConstructor;
        readonly arrow: {
            readonly type: import("vue").PropType<import("./types").PopoverArrow>;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").PopoverGetPopupContainer>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayClassName: StringConstructor;
        readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:open": (open: boolean) => void;
        openChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly content: import("./types").PopoverContent;
        readonly title: import("./types").PopoverContent;
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly destroyOnHidden: boolean;
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly arrow: import("./types").PopoverArrow;
        readonly defaultOpen: boolean;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
        readonly fresh: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: {
            type: import("vue").PropType<import("./types").PopoverContent>;
            default: undefined;
        };
        readonly content: {
            type: import("vue").PropType<import("./types").PopoverContent>;
            default: undefined;
        };
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "top";
            readonly validator: (value: string) => boolean;
        };
        readonly trigger: {
            readonly type: import("vue").PropType<import("../utils/floating").FloatingTriggerProp>;
            readonly default: "hover";
            readonly validator: (value: unknown) => boolean;
        };
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly color: StringConstructor;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly destroyOnHidden: BooleanConstructor;
        readonly fresh: BooleanConstructor;
        readonly arrow: {
            readonly type: import("vue").PropType<import("./types").PopoverArrow>;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").PopoverGetPopupContainer>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayClassName: StringConstructor;
        readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly content: import("./types").PopoverContent;
        readonly title: import("./types").PopoverContent;
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly destroyOnHidden: boolean;
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly arrow: import("./types").PopoverArrow;
        readonly defaultOpen: boolean;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
        readonly fresh: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: {
        type: import("vue").PropType<import("./types").PopoverContent>;
        default: undefined;
    };
    readonly content: {
        type: import("vue").PropType<import("./types").PopoverContent>;
        default: undefined;
    };
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly trigger: {
        readonly type: import("vue").PropType<import("../utils/floating").FloatingTriggerProp>;
        readonly default: "hover";
        readonly validator: (value: unknown) => boolean;
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly color: StringConstructor;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly fresh: BooleanConstructor;
    readonly arrow: {
        readonly type: import("vue").PropType<import("./types").PopoverArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: import("vue").PropType<import("./types").PopoverGetPopupContainer>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").PopoverSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
}, string, {
    readonly content: import("./types").PopoverContent;
    readonly title: import("./types").PopoverContent;
    readonly open: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly destroyOnHidden: boolean;
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly arrow: import("./types").PopoverArrow;
    readonly defaultOpen: boolean;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
    readonly fresh: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        title?(_: {}): any;
        content?(_: {}): any;
    };
})>;
export default Popover;
export type { PopoverProps } from './types';
