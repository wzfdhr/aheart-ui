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
        readonly description: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly tip: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
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
        readonly description: import("vue").VNodeChild;
        readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
        readonly size: import("../config").AheartSize;
        readonly tip: import("vue").VNodeChild;
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
        readonly description: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly tip: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
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
        readonly description: import("vue").VNodeChild;
        readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
        readonly size: import("../config").AheartSize;
        readonly tip: import("vue").VNodeChild;
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
    readonly description: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly tip: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
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
    readonly description: import("vue").VNodeChild;
    readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
    readonly size: import("../config").AheartSize;
    readonly tip: import("vue").VNodeChild;
    readonly spinning: boolean;
    readonly fullscreen: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        description?(_: {}): any;
    };
})>;
export default Spin;
export type { SpinClassNames, SpinIndicator, SpinPercent, SpinProps, SpinRenderable, SpinSemanticPart, SpinStyles } from './types';
