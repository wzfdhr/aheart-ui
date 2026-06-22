declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").DividerType>;
        readonly default: "horizontal";
    };
    readonly orientation: {
        readonly type: import("vue").PropType<import("./types").DividerOrientation>;
        readonly default: "center";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").DividerType>;
        readonly default: "horizontal";
    };
    readonly orientation: {
        readonly type: import("vue").PropType<import("./types").DividerOrientation>;
        readonly default: "center";
    };
    readonly dashed: BooleanConstructor;
    readonly plain: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly type: import("./types").DividerType;
    readonly orientation: import("./types").DividerOrientation;
    readonly dashed: boolean;
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
