declare const Descriptions: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
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
}>> & Readonly<{}>, {
    readonly classNames: Partial<Record<import("./types").DescriptionsSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>;
    readonly column: number;
    readonly layout: import("./types").DescriptionsLayout;
    readonly bordered: boolean;
    readonly colon: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Descriptions;
