declare const Alert: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<import("./types").AlertType>;
            readonly default: undefined;
        };
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly message: import("vue").PropType<import("vue").VNodeChild>;
        readonly description: import("vue").PropType<import("vue").VNodeChild>;
        readonly showIcon: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly closable: {
            readonly type: import("vue").PropType<boolean | import("./types").AlertClosableConfig>;
            readonly default: false;
        };
        readonly banner: BooleanConstructor;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").AlertVariant>;
            readonly default: "outlined";
        };
        readonly action: import("vue").PropType<import("vue").VNodeChild>;
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly closeIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly role: {
            readonly type: StringConstructor;
            readonly default: "alert";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
        onAfterClose?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: (event: MouseEvent) => void;
        afterClose: () => void;
    }, import("vue").PublicProps, {
        readonly type: import("./types").AlertType;
        readonly showIcon: boolean;
        readonly closable: boolean | import("./types").AlertClosableConfig;
        readonly banner: boolean;
        readonly variant: import("./types").AlertVariant;
        readonly role: string;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<import("./types").AlertType>;
            readonly default: undefined;
        };
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly message: import("vue").PropType<import("vue").VNodeChild>;
        readonly description: import("vue").PropType<import("vue").VNodeChild>;
        readonly showIcon: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly closable: {
            readonly type: import("vue").PropType<boolean | import("./types").AlertClosableConfig>;
            readonly default: false;
        };
        readonly banner: BooleanConstructor;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").AlertVariant>;
            readonly default: "outlined";
        };
        readonly action: import("vue").PropType<import("vue").VNodeChild>;
        readonly icon: import("vue").PropType<import("vue").VNodeChild>;
        readonly closeIcon: import("vue").PropType<import("vue").VNodeChild>;
        readonly role: {
            readonly type: StringConstructor;
            readonly default: "alert";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
        onAfterClose?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: import("./types").AlertType;
        readonly showIcon: boolean;
        readonly closable: boolean | import("./types").AlertClosableConfig;
        readonly banner: boolean;
        readonly variant: import("./types").AlertVariant;
        readonly role: string;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").AlertType>;
        readonly default: undefined;
    };
    readonly title: import("vue").PropType<import("vue").VNodeChild>;
    readonly message: import("vue").PropType<import("vue").VNodeChild>;
    readonly description: import("vue").PropType<import("vue").VNodeChild>;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: {
        readonly type: import("vue").PropType<boolean | import("./types").AlertClosableConfig>;
        readonly default: false;
    };
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: import("vue").PropType<import("vue").VNodeChild>;
    readonly icon: import("vue").PropType<import("vue").VNodeChild>;
    readonly closeIcon: import("vue").PropType<import("vue").VNodeChild>;
    readonly role: {
        readonly type: StringConstructor;
        readonly default: "alert";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
    onAfterClose?: (() => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
    afterClose: () => void;
}, string, {
    readonly type: import("./types").AlertType;
    readonly showIcon: boolean;
    readonly closable: boolean | import("./types").AlertClosableConfig;
    readonly banner: boolean;
    readonly variant: import("./types").AlertVariant;
    readonly role: string;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        icon?(_: {}): any;
        default?(_: {}): any;
        action?(_: {}): any;
        closeIcon?(_: {}): any;
    };
})>;
export default Alert;
