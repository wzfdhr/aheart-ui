declare const Flex: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly vertical: BooleanConstructor;
        readonly orientation: import("vue").PropType<import("./types").FlexOrientation>;
        readonly wrap: import("vue").PropType<import("./types").FlexWrap>;
        readonly justify: import("vue").PropType<string>;
        readonly align: import("vue").PropType<string>;
        readonly gap: import("vue").PropType<import("./types").FlexGap>;
        readonly flex: import("vue").PropType<string | number>;
        readonly component: {
            readonly type: import("vue").PropType<string | object | Function>;
            readonly default: "div";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly vertical: boolean;
        readonly component: string | object | Function;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly vertical: BooleanConstructor;
        readonly orientation: import("vue").PropType<import("./types").FlexOrientation>;
        readonly wrap: import("vue").PropType<import("./types").FlexWrap>;
        readonly justify: import("vue").PropType<string>;
        readonly align: import("vue").PropType<string>;
        readonly gap: import("vue").PropType<import("./types").FlexGap>;
        readonly flex: import("vue").PropType<string | number>;
        readonly component: {
            readonly type: import("vue").PropType<string | object | Function>;
            readonly default: "div";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly vertical: boolean;
        readonly component: string | object | Function;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly orientation: import("vue").PropType<import("./types").FlexOrientation>;
    readonly wrap: import("vue").PropType<import("./types").FlexWrap>;
    readonly justify: import("vue").PropType<string>;
    readonly align: import("vue").PropType<string>;
    readonly gap: import("vue").PropType<import("./types").FlexGap>;
    readonly flex: import("vue").PropType<string | number>;
    readonly component: {
        readonly type: import("vue").PropType<string | object | Function>;
        readonly default: "div";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly vertical: boolean;
    readonly component: string | object | Function;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Flex;
