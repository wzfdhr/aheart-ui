declare const Button: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
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
        readonly loading: {
            readonly type: import("vue").PropType<import("./types").ButtonLoading>;
            readonly default: false;
        };
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
        readonly danger: BooleanConstructor;
        readonly ghost: BooleanConstructor;
        readonly shape: {
            readonly type: import("vue").PropType<"default" | "round" | "circle">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly autoInsertSpace: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly icon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly iconPlacement: {
            readonly type: import("vue").PropType<"end" | "start">;
            readonly validator: (value: string) => boolean;
        };
        readonly iconPosition: {
            readonly type: import("vue").PropType<"end" | "start">;
            readonly validator: (value: string) => boolean;
        };
        readonly color: {
            readonly type: import("vue").PropType<"success" | "info" | "warning" | "default" | "blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "primary" | "danger" | "volcano" | "geekblue">;
            readonly validator: (value: string) => boolean;
        };
        readonly variant: {
            readonly type: import("vue").PropType<"outlined" | "filled" | "link" | "text" | "dashed" | "solid">;
            readonly validator: (value: string) => boolean;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        click: (event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly icon: import("vue").VNodeChild;
        readonly type: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly round: boolean;
        readonly block: boolean;
        readonly disabled: boolean;
        readonly danger: boolean;
        readonly nativeType: "reset" | "submit" | "button";
        readonly loading: import("./types").ButtonLoading;
        readonly ghost: boolean;
        readonly shape: "default" | "round" | "circle";
        readonly autoInsertSpace: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
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
        readonly loading: {
            readonly type: import("vue").PropType<import("./types").ButtonLoading>;
            readonly default: false;
        };
        readonly block: BooleanConstructor;
        readonly round: BooleanConstructor;
        readonly danger: BooleanConstructor;
        readonly ghost: BooleanConstructor;
        readonly shape: {
            readonly type: import("vue").PropType<"default" | "round" | "circle">;
            readonly default: "default";
            readonly validator: (value: string) => boolean;
        };
        readonly autoInsertSpace: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly icon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly iconPlacement: {
            readonly type: import("vue").PropType<"end" | "start">;
            readonly validator: (value: string) => boolean;
        };
        readonly iconPosition: {
            readonly type: import("vue").PropType<"end" | "start">;
            readonly validator: (value: string) => boolean;
        };
        readonly color: {
            readonly type: import("vue").PropType<"success" | "info" | "warning" | "default" | "blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "primary" | "danger" | "volcano" | "geekblue">;
            readonly validator: (value: string) => boolean;
        };
        readonly variant: {
            readonly type: import("vue").PropType<"outlined" | "filled" | "link" | "text" | "dashed" | "solid">;
            readonly validator: (value: string) => boolean;
        };
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onClick?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly icon: import("vue").VNodeChild;
        readonly type: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly round: boolean;
        readonly block: boolean;
        readonly disabled: boolean;
        readonly danger: boolean;
        readonly nativeType: "reset" | "submit" | "button";
        readonly loading: import("./types").ButtonLoading;
        readonly ghost: boolean;
        readonly shape: "default" | "round" | "circle";
        readonly autoInsertSpace: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
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
    readonly loading: {
        readonly type: import("vue").PropType<import("./types").ButtonLoading>;
        readonly default: false;
    };
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
    readonly danger: BooleanConstructor;
    readonly ghost: BooleanConstructor;
    readonly shape: {
        readonly type: import("vue").PropType<"default" | "round" | "circle">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly autoInsertSpace: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly icon: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
    readonly iconPlacement: {
        readonly type: import("vue").PropType<"end" | "start">;
        readonly validator: (value: string) => boolean;
    };
    readonly iconPosition: {
        readonly type: import("vue").PropType<"end" | "start">;
        readonly validator: (value: string) => boolean;
    };
    readonly color: {
        readonly type: import("vue").PropType<"success" | "info" | "warning" | "default" | "blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "primary" | "danger" | "volcano" | "geekblue">;
        readonly validator: (value: string) => boolean;
    };
    readonly variant: {
        readonly type: import("vue").PropType<"outlined" | "filled" | "link" | "text" | "dashed" | "solid">;
        readonly validator: (value: string) => boolean;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").ButtonSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => void;
}, string, {
    readonly icon: import("vue").VNodeChild;
    readonly type: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
    readonly round: boolean;
    readonly block: boolean;
    readonly disabled: boolean;
    readonly danger: boolean;
    readonly nativeType: "reset" | "submit" | "button";
    readonly loading: import("./types").ButtonLoading;
    readonly ghost: boolean;
    readonly shape: "default" | "round" | "circle";
    readonly autoInsertSpace: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        loadingIcon?(_: {}): any;
        icon?(_: {}): any;
    };
})>;
export default Button;
