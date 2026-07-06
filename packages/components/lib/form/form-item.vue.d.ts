import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: StringConstructor;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: PropType<import("./types").FormLabelAlign>;
    readonly layout: PropType<import("./types").FormItemLayout>;
    readonly required: BooleanConstructor;
    readonly rules: PropType<import("./types").FormRule[]>;
    readonly validateStatus: PropType<import("./types").FormValidateStatus>;
    readonly help: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly extra: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tooltip: {
        type: PropType<import("./types").FormItemTooltip>;
        default: undefined;
    };
    readonly hasFeedback: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: StringConstructor;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: PropType<import("./types").FormLabelAlign>;
    readonly layout: PropType<import("./types").FormItemLayout>;
    readonly required: BooleanConstructor;
    readonly rules: PropType<import("./types").FormRule[]>;
    readonly validateStatus: PropType<import("./types").FormValidateStatus>;
    readonly help: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly extra: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tooltip: {
        type: PropType<import("./types").FormItemTooltip>;
        default: undefined;
    };
    readonly hasFeedback: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly help: VNodeChild;
    readonly tooltip: import("./types").FormItemTooltip;
    readonly extra: VNodeChild;
    readonly colon: boolean;
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
