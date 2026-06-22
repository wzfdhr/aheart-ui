declare const Badge: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly count: import("vue").PropType<string | number>;
        readonly dot: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").BadgeStatus>;
        readonly text: StringConstructor;
        readonly overflowCount: {
            readonly type: NumberConstructor;
            readonly default: 99;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly dot: boolean;
        readonly overflowCount: number;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly count: import("vue").PropType<string | number>;
        readonly dot: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").BadgeStatus>;
        readonly text: StringConstructor;
        readonly overflowCount: {
            readonly type: NumberConstructor;
            readonly default: 99;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly dot: boolean;
        readonly overflowCount: number;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly count: import("vue").PropType<string | number>;
    readonly dot: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").BadgeStatus>;
    readonly text: StringConstructor;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly dot: boolean;
    readonly overflowCount: number;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Badge;
