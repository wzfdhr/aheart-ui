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
}>> & Readonly<{}>, {
    readonly bordered: boolean;
    readonly column: number;
    readonly layout: import("./types").DescriptionsLayout;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Descriptions;
