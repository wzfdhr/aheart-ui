declare const Tooltip: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
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
        readonly arrow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0;
        };
    }>> & Readonly<{
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        "update:open": (open: boolean) => void;
        openChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
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
        readonly arrow: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly zIndex: NumberConstructor;
        readonly mouseEnterDelay: {
            readonly type: NumberConstructor;
            readonly default: 0;
        };
        readonly mouseLeaveDelay: {
            readonly type: NumberConstructor;
            readonly default: 0;
        };
    }>> & Readonly<{
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly open: boolean;
        readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
        readonly trigger: import("../utils/floating").FloatingTriggerProp;
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
        readonly mouseEnterDelay: number;
        readonly mouseLeaveDelay: number;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
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
    readonly arrow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly zIndex: NumberConstructor;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
}>> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
}, string, {
    readonly open: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly trigger: import("../utils/floating").FloatingTriggerProp;
    readonly defaultOpen: boolean;
    readonly arrow: boolean;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        title?(_: {}): any;
    };
})>;
export default Tooltip;
export type { TooltipProps } from './types';
