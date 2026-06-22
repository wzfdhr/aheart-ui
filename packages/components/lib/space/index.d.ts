declare const Space: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("./types").SpaceSize>;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly orientation: import("vue").PropType<import("./types").SpaceDirection>;
    readonly vertical: BooleanConstructor;
    readonly align: import("vue").PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
    readonly separator: StringConstructor;
    readonly split: StringConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("./types").SpaceSize>;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly orientation: import("vue").PropType<import("./types").SpaceDirection>;
    readonly vertical: BooleanConstructor;
    readonly align: import("vue").PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
    readonly separator: StringConstructor;
    readonly split: StringConstructor;
}>> & Readonly<{}>, {
    readonly wrap: boolean;
    readonly vertical: boolean;
    readonly direction: import("./types").SpaceDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Space;
