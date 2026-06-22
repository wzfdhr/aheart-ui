declare const Divider: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<import("./types").DividerType>;
            readonly default: "horizontal";
        };
        readonly orientation: {
            readonly type: import("vue").PropType<import("./types").DividerOrientation>;
            readonly default: "center";
        };
        readonly dashed: BooleanConstructor;
        readonly plain: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly type: import("./types").DividerType;
        readonly orientation: import("./types").DividerOrientation;
        readonly dashed: boolean;
        readonly plain: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<import("./types").DividerType>;
            readonly default: "horizontal";
        };
        readonly orientation: {
            readonly type: import("vue").PropType<import("./types").DividerOrientation>;
            readonly default: "center";
        };
        readonly dashed: BooleanConstructor;
        readonly plain: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly type: import("./types").DividerType;
        readonly orientation: import("./types").DividerOrientation;
        readonly dashed: boolean;
        readonly plain: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").DividerType>;
        readonly default: "horizontal";
    };
    readonly orientation: {
        readonly type: import("vue").PropType<import("./types").DividerOrientation>;
        readonly default: "center";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly type: import("./types").DividerType;
    readonly orientation: import("./types").DividerOrientation;
    readonly dashed: boolean;
    readonly plain: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Divider;
