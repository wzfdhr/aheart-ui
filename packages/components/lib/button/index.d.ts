declare const Button: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<"small" | "normal" | "middle" | "large" | "mini">;
            readonly validator: (value: string) => boolean;
        };
        readonly nativeType: {
            readonly type: import("vue").PropType<"reset" | "submit" | "button">;
            readonly default: "button";
            readonly validator: (value: string) => boolean;
        };
        readonly htmlType: {
            readonly type: import("vue").PropType<"reset" | "submit" | "button">;
            readonly validator: (value: string) => boolean;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly loading: BooleanConstructor;
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
        readonly danger: BooleanConstructor;
        readonly ghost: BooleanConstructor;
        readonly shape: {
            readonly type: import("vue").PropType<"default" | "circle" | "round">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
    }>> & Readonly<{
        onClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        click: (event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly type: "success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger";
        readonly round: boolean;
        readonly block: boolean;
        readonly disabled: boolean;
        readonly danger: boolean;
        readonly nativeType: "reset" | "submit" | "button";
        readonly loading: boolean;
        readonly ghost: boolean;
        readonly shape: "default" | "circle" | "round";
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<"small" | "normal" | "middle" | "large" | "mini">;
            readonly validator: (value: string) => boolean;
        };
        readonly nativeType: {
            readonly type: import("vue").PropType<"reset" | "submit" | "button">;
            readonly default: "button";
            readonly validator: (value: string) => boolean;
        };
        readonly htmlType: {
            readonly type: import("vue").PropType<"reset" | "submit" | "button">;
            readonly validator: (value: string) => boolean;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly loading: BooleanConstructor;
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
        readonly danger: BooleanConstructor;
        readonly ghost: BooleanConstructor;
        readonly shape: {
            readonly type: import("vue").PropType<"default" | "circle" | "round">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
    }>> & Readonly<{
        onClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: "success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger";
        readonly round: boolean;
        readonly block: boolean;
        readonly disabled: boolean;
        readonly danger: boolean;
        readonly nativeType: "reset" | "submit" | "button";
        readonly loading: boolean;
        readonly ghost: boolean;
        readonly shape: "default" | "circle" | "round";
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"small" | "normal" | "middle" | "large" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"reset" | "submit" | "button">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly htmlType: {
        readonly type: import("vue").PropType<"reset" | "submit" | "button">;
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
    readonly danger: BooleanConstructor;
    readonly ghost: BooleanConstructor;
    readonly shape: {
        readonly type: import("vue").PropType<"default" | "circle" | "round">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
}>> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => void;
}, string, {
    readonly type: "success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger";
    readonly round: boolean;
    readonly block: boolean;
    readonly disabled: boolean;
    readonly danger: boolean;
    readonly nativeType: "reset" | "submit" | "button";
    readonly loading: boolean;
    readonly ghost: boolean;
    readonly shape: "default" | "circle" | "round";
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Button;
