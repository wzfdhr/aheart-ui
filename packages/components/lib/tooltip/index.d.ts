declare const Tooltip: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: {
            type: import("vue").PropType<import("./types").TooltipTitle>;
            default: undefined;
        };
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "top";
            readonly validator: (value: string) => boolean;
        };
        readonly autoAdjustOverflow: {
            readonly type: BooleanConstructor;
            readonly default: true;
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
        readonly align: import("vue").PropType<import("./types").TooltipAlignConfig>;
        readonly arrow: {
            readonly type: import("vue").PropType<import("./types").TooltipArrow>;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").TooltipGetPopupContainer>;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly destroyOnHidden: BooleanConstructor;
        readonly destroyTooltipOnHide: BooleanConstructor;
        readonly fresh: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayClassName: StringConstructor;
        readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TooltipClassNames>;
        readonly styles: import("vue").PropType<import("./types").TooltipStyles>;
    }>> & Readonly<{
        onOpenChange?: ((open: boolean) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        openChange: (open: boolean) => void;
        "update:open": (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly title: import("./types").TooltipTitle;
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly arrow: import("./types").TooltipArrow;
        readonly defaultOpen: boolean;
        readonly autoAdjustOverflow: boolean;
        readonly destroyOnHidden: boolean;
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
        readonly destroyTooltipOnHide: boolean;
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
            type: import("vue").PropType<import("./types").TooltipTitle>;
            default: undefined;
        };
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
            readonly default: "top";
            readonly validator: (value: string) => boolean;
        };
        readonly autoAdjustOverflow: {
            readonly type: BooleanConstructor;
            readonly default: true;
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
        readonly align: import("vue").PropType<import("./types").TooltipAlignConfig>;
        readonly arrow: {
            readonly type: import("vue").PropType<import("./types").TooltipArrow>;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly getPopupContainer: import("vue").PropType<import("./types").TooltipGetPopupContainer>;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0.1;
        };
        readonly destroyOnHidden: BooleanConstructor;
        readonly destroyTooltipOnHide: BooleanConstructor;
        readonly fresh: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayClassName: StringConstructor;
        readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TooltipClassNames>;
        readonly styles: import("vue").PropType<import("./types").TooltipStyles>;
    }>> & Readonly<{
        onOpenChange?: ((open: boolean) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly title: import("./types").TooltipTitle;
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly arrow: import("./types").TooltipArrow;
        readonly defaultOpen: boolean;
        readonly autoAdjustOverflow: boolean;
        readonly destroyOnHidden: boolean;
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
        readonly destroyTooltipOnHide: boolean;
        readonly fresh: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: {
        type: import("vue").PropType<import("./types").TooltipTitle>;
        default: undefined;
    };
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "top";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
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
    readonly align: import("vue").PropType<import("./types").TooltipAlignConfig>;
    readonly arrow: {
        readonly type: import("vue").PropType<import("./types").TooltipArrow>;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly getPopupContainer: import("vue").PropType<import("./types").TooltipGetPopupContainer>;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyTooltipOnHide: BooleanConstructor;
    readonly fresh: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayInnerStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TooltipClassNames>;
    readonly styles: import("vue").PropType<import("./types").TooltipStyles>;
}>> & Readonly<{
    onOpenChange?: ((open: boolean) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    openChange: (open: boolean) => void;
    "update:open": (open: boolean) => void;
}, string, {
    readonly title: import("./types").TooltipTitle;
    readonly open: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly arrow: import("./types").TooltipArrow;
    readonly defaultOpen: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly destroyOnHidden: boolean;
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
    readonly destroyTooltipOnHide: boolean;
    readonly fresh: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        title?(_: {}): any;
    };
})>;
export default Tooltip;
export type { TooltipProps } from './types';
