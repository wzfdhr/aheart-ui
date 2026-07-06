import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly rules: PropType<import("./types").FormRule[]>;
    readonly validateStatus: PropType<import("./types").FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: StringConstructor;
    readonly required: BooleanConstructor;
    readonly rules: PropType<import("./types").FormRule[]>;
    readonly validateStatus: PropType<import("./types").FormValidateStatus>;
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
