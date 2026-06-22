declare const Card: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
        readonly extra: StringConstructor;
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly hoverable: BooleanConstructor;
        readonly loading: BooleanConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly loading: boolean;
        readonly bordered: boolean;
        readonly hoverable: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: StringConstructor;
        readonly extra: StringConstructor;
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly hoverable: BooleanConstructor;
        readonly loading: BooleanConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly loading: boolean;
        readonly bordered: boolean;
        readonly hoverable: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly hoverable: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        cover?(_: {}): any;
        title?(_: {}): any;
        extra?(_: {}): any;
        default?(_: {}): any;
        actions?(_: {}): any;
    };
})>;
export default Card;
