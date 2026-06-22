declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
}>> & Readonly<{}>, {
    readonly type: import("./types").DividerType;
    readonly size: import("./types").DividerSize;
    readonly dashed: boolean;
    readonly vertical: boolean;
    readonly variant: import("./types").DividerVariant;
    readonly orientation: import("./types").DividerOrientation;
    readonly plain: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
