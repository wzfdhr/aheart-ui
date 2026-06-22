declare const Spin: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly spinning: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly size: {
            readonly type: import("vue").PropType<import("../config").AheartSize>;
            readonly default: "middle";
        };
        readonly tip: StringConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly size: import("../config").AheartSize;
        readonly spinning: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly spinning: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly size: {
            readonly type: import("vue").PropType<import("../config").AheartSize>;
            readonly default: "middle";
        };
        readonly tip: StringConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly size: import("../config").AheartSize;
        readonly spinning: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly spinning: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly size: {
        readonly type: import("vue").PropType<import("../config").AheartSize>;
        readonly default: "middle";
    };
    readonly tip: StringConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly size: import("../config").AheartSize;
    readonly spinning: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Spin;
