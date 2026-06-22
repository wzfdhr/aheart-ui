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
        readonly showZero: BooleanConstructor;
        readonly size: {
            readonly type: import("vue").PropType<import("./types").BadgeSize>;
            readonly default: "medium";
        };
        readonly offset: import("vue").PropType<import("./types").BadgeOffset>;
        readonly color: StringConstructor;
        readonly title: StringConstructor;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly size: import("./types").BadgeSize;
        readonly dot: boolean;
        readonly overflowCount: number;
        readonly showZero: boolean;
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
        readonly showZero: BooleanConstructor;
        readonly size: {
            readonly type: import("vue").PropType<import("./types").BadgeSize>;
            readonly default: "medium";
        };
        readonly offset: import("vue").PropType<import("./types").BadgeOffset>;
        readonly color: StringConstructor;
        readonly title: StringConstructor;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly size: import("./types").BadgeSize;
        readonly dot: boolean;
        readonly overflowCount: number;
        readonly showZero: boolean;
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
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: import("vue").PropType<import("./types").BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: import("vue").PropType<import("./types").BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly size: import("./types").BadgeSize;
    readonly dot: boolean;
    readonly overflowCount: number;
    readonly showZero: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        count?(_: {}): any;
    };
})>;
export default Badge;
