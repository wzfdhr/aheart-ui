declare const Divider: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: {
            readonly type: import("vue").PropType<import("./types").DividerType>;
            readonly default: "horizontal";
        };
        readonly vertical: BooleanConstructor;
        readonly orientation: {
            readonly type: import("vue").PropType<import("./types").DividerOrientation>;
            readonly default: "center";
        };
        readonly titlePlacement: import("vue").PropType<import("./types").DividerTitlePlacement>;
        readonly orientationMargin: import("vue").PropType<string | number>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").DividerVariant>;
            readonly default: "solid";
        };
        readonly size: {
            readonly type: import("vue").PropType<import("./types").DividerSize>;
            readonly default: "middle";
        };
        readonly dashed: BooleanConstructor;
        readonly plain: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly type: import("./types").DividerType;
        readonly size: import("./types").DividerSize;
        readonly dashed: boolean;
        readonly vertical: boolean;
        readonly variant: import("./types").DividerVariant;
        readonly orientation: import("./types").DividerOrientation;
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
        readonly vertical: BooleanConstructor;
        readonly orientation: {
            readonly type: import("vue").PropType<import("./types").DividerOrientation>;
            readonly default: "center";
        };
        readonly titlePlacement: import("vue").PropType<import("./types").DividerTitlePlacement>;
        readonly orientationMargin: import("vue").PropType<string | number>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").DividerVariant>;
            readonly default: "solid";
        };
        readonly size: {
            readonly type: import("vue").PropType<import("./types").DividerSize>;
            readonly default: "middle";
        };
        readonly dashed: BooleanConstructor;
        readonly plain: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly type: import("./types").DividerType;
        readonly size: import("./types").DividerSize;
        readonly dashed: boolean;
        readonly vertical: boolean;
        readonly variant: import("./types").DividerVariant;
        readonly orientation: import("./types").DividerOrientation;
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
    readonly vertical: BooleanConstructor;
    readonly orientation: {
        readonly type: import("vue").PropType<import("./types").DividerOrientation>;
        readonly default: "center";
    };
    readonly titlePlacement: import("vue").PropType<import("./types").DividerTitlePlacement>;
    readonly orientationMargin: import("vue").PropType<string | number>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").DividerVariant>;
        readonly default: "solid";
    };
    readonly size: {
        readonly type: import("vue").PropType<import("./types").DividerSize>;
        readonly default: "middle";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly type: import("./types").DividerType;
    readonly size: import("./types").DividerSize;
    readonly dashed: boolean;
    readonly vertical: boolean;
    readonly variant: import("./types").DividerVariant;
    readonly orientation: import("./types").DividerOrientation;
    readonly plain: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Divider;
