declare const Button: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<"large" | "normal" | "small" | "mini">;
            readonly default: "normal";
            readonly validator: (value: string) => boolean;
        };
        readonly nativeType: {
            readonly type: import("vue").PropType<"button" | "submit" | "reset">;
            readonly default: "button";
            readonly validator: (value: string) => boolean;
        };
        readonly disabled: BooleanConstructor;
        readonly loading: BooleanConstructor;
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly type: "default" | "primary" | "success" | "warning" | "danger";
        readonly size: "large" | "normal" | "small" | "mini";
        readonly nativeType: "button" | "submit" | "reset";
        readonly disabled: boolean;
        readonly loading: boolean;
        readonly block: boolean;
        readonly round: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<"large" | "normal" | "small" | "mini">;
            readonly default: "normal";
            readonly validator: (value: string) => boolean;
        };
        readonly nativeType: {
            readonly type: import("vue").PropType<"button" | "submit" | "reset">;
            readonly default: "button";
            readonly validator: (value: string) => boolean;
        };
        readonly disabled: BooleanConstructor;
        readonly loading: BooleanConstructor;
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly type: "default" | "primary" | "success" | "warning" | "danger";
        readonly size: "large" | "normal" | "small" | "mini";
        readonly nativeType: "button" | "submit" | "reset";
        readonly disabled: boolean;
        readonly loading: boolean;
        readonly block: boolean;
        readonly round: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"large" | "normal" | "small" | "mini">;
        readonly default: "normal";
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly type: "default" | "primary" | "success" | "warning" | "danger";
    readonly size: "large" | "normal" | "small" | "mini";
    readonly nativeType: "button" | "submit" | "reset";
    readonly disabled: boolean;
    readonly loading: boolean;
    readonly block: boolean;
    readonly round: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Button;
