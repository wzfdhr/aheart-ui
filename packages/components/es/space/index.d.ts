declare const Space: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("./types").SpaceSize>;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly align: import("vue").PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("./types").SpaceSize>;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly align: import("vue").PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly wrap: boolean;
    readonly direction: import("./types").SpaceDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Space;
