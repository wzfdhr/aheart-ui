declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly required: boolean;
    readonly hasFeedback: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    label?(_: {}): any;
    default?(_: {}): any;
    help?(_: {}): any;
    extra?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
