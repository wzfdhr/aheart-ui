declare const Empty: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly description: {
            readonly type: import("vue").PropType<import("./types").EmptyDescription>;
            readonly default: undefined;
        };
        readonly image: {
            readonly type: import("vue").PropType<import("./types").EmptyImage>;
            readonly default: undefined;
        };
        readonly imageStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly description: import("./types").EmptyDescription;
        readonly image: import("./types").EmptyImage;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly description: {
            readonly type: import("vue").PropType<import("./types").EmptyDescription>;
            readonly default: undefined;
        };
        readonly image: {
            readonly type: import("vue").PropType<import("./types").EmptyImage>;
            readonly default: undefined;
        };
        readonly imageStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly description: import("./types").EmptyDescription;
        readonly image: import("./types").EmptyImage;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly description: {
        readonly type: import("vue").PropType<import("./types").EmptyDescription>;
        readonly default: undefined;
    };
    readonly image: {
        readonly type: import("vue").PropType<import("./types").EmptyImage>;
        readonly default: undefined;
    };
    readonly imageStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly description: import("./types").EmptyDescription;
    readonly image: import("./types").EmptyImage;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        image?(_: {}): any;
        description?(_: {}): any;
        default?(_: {}): any;
    };
})>;
export default Empty;
