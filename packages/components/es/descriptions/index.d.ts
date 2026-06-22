declare const Descriptions: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly extra: import("vue").PropType<import("vue").VNodeChild>;
        readonly items: import("vue").PropType<import("./types").DescriptionItem[]>;
        readonly bordered: BooleanConstructor;
        readonly column: {
            readonly type: NumberConstructor;
            readonly default: 3;
        };
        readonly layout: {
            readonly type: import("vue").PropType<import("./types").DescriptionsLayout>;
            readonly default: "horizontal";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly labelStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly contentStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly classNames: Partial<Record<import("./types").DescriptionsSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>;
        readonly column: number;
        readonly layout: import("./types").DescriptionsLayout;
        readonly bordered: boolean;
        readonly colon: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly extra: import("vue").PropType<import("vue").VNodeChild>;
        readonly items: import("vue").PropType<import("./types").DescriptionItem[]>;
        readonly bordered: BooleanConstructor;
        readonly column: {
            readonly type: NumberConstructor;
            readonly default: 3;
        };
        readonly layout: {
            readonly type: import("vue").PropType<import("./types").DescriptionsLayout>;
            readonly default: "horizontal";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly labelStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly contentStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, string>>>;
            readonly default: () => {};
        };
        readonly styles: {
            readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>>;
            readonly default: () => {};
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly classNames: Partial<Record<import("./types").DescriptionsSemanticPart, string>>;
        readonly styles: Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>;
        readonly column: number;
        readonly layout: import("./types").DescriptionsLayout;
        readonly bordered: boolean;
        readonly colon: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly title: import("vue").PropType<import("vue").VNodeChild>;
    readonly extra: import("vue").PropType<import("vue").VNodeChild>;
    readonly items: import("vue").PropType<import("./types").DescriptionItem[]>;
    readonly bordered: BooleanConstructor;
    readonly column: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").DescriptionsLayout>;
        readonly default: "horizontal";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly labelStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly contentStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly classNames: Partial<Record<import("./types").DescriptionsSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>;
    readonly column: number;
    readonly layout: import("./types").DescriptionsLayout;
    readonly bordered: boolean;
    readonly colon: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        title?(_: {}): any;
        extra?(_: {}): any;
    };
})>;
export default Descriptions;
export type { DescriptionItem, DescriptionItemSpan, DescriptionRenderable, DescriptionsClassNames, DescriptionsLayout, DescriptionsProps, DescriptionsSemanticPart, DescriptionsStyles } from './types';
