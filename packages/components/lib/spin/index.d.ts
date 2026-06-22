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
        readonly delay: NumberConstructor;
        readonly indicator: import("vue").PropType<import("./types").SpinIndicator>;
        readonly percent: import("vue").PropType<import("./types").SpinPercent>;
        readonly fullscreen: BooleanConstructor;
        readonly wrapperClassName: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
        readonly size: import("../config").AheartSize;
        readonly spinning: boolean;
        readonly fullscreen: boolean;
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
        readonly delay: NumberConstructor;
        readonly indicator: import("vue").PropType<import("./types").SpinIndicator>;
        readonly percent: import("vue").PropType<import("./types").SpinPercent>;
        readonly fullscreen: BooleanConstructor;
        readonly wrapperClassName: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
        readonly size: import("../config").AheartSize;
        readonly spinning: boolean;
        readonly fullscreen: boolean;
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
    readonly delay: NumberConstructor;
    readonly indicator: import("vue").PropType<import("./types").SpinIndicator>;
    readonly percent: import("vue").PropType<import("./types").SpinPercent>;
    readonly fullscreen: BooleanConstructor;
    readonly wrapperClassName: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
    readonly size: import("../config").AheartSize;
    readonly spinning: boolean;
    readonly fullscreen: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Spin;
