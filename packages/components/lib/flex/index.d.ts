declare const Flex: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly vertical: BooleanConstructor;
        readonly wrap: import("vue").PropType<string | boolean>;
        readonly justify: import("vue").PropType<import("./types").FlexJustify>;
        readonly align: import("vue").PropType<import("./types").FlexAlign>;
        readonly gap: import("vue").PropType<import("./types").FlexGap>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly vertical: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly vertical: BooleanConstructor;
        readonly wrap: import("vue").PropType<string | boolean>;
        readonly justify: import("vue").PropType<import("./types").FlexJustify>;
        readonly align: import("vue").PropType<import("./types").FlexAlign>;
        readonly gap: import("vue").PropType<import("./types").FlexGap>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly vertical: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly wrap: import("vue").PropType<string | boolean>;
    readonly justify: import("vue").PropType<import("./types").FlexJustify>;
    readonly align: import("vue").PropType<import("./types").FlexAlign>;
    readonly gap: import("vue").PropType<import("./types").FlexGap>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly vertical: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Flex;
