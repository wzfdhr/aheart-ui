import { type PropType, type VNodeChild } from 'vue';
import { type FormMessageVariables, type FormNamePath } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: PropType<FormNamePath>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: PropType<import("./types").FormLabelAlign>;
    readonly layout: PropType<import("./types").FormItemLayout>;
    readonly hidden: BooleanConstructor;
    readonly noStyle: BooleanConstructor;
    readonly validateFirst: {
        readonly type: PropType<import("./types").FormValidateFirst>;
        readonly default: false;
    };
    readonly messageVariables: {
        readonly type: PropType<FormMessageVariables>;
        readonly default: () => {};
    };
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
    readonly dependencies: PropType<FormNamePath[]>;
    readonly validateTrigger: {
        readonly type: PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
        readonly default: undefined;
    };
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly label: PropType<VNodeChild>;
    readonly name: PropType<FormNamePath>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: PropType<import("./types").FormLabelAlign>;
    readonly layout: PropType<import("./types").FormItemLayout>;
    readonly hidden: BooleanConstructor;
    readonly noStyle: BooleanConstructor;
    readonly validateFirst: {
        readonly type: PropType<import("./types").FormValidateFirst>;
        readonly default: false;
    };
    readonly messageVariables: {
        readonly type: PropType<FormMessageVariables>;
        readonly default: () => {};
    };
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
    readonly dependencies: PropType<FormNamePath[]>;
    readonly validateTrigger: {
        readonly type: PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
        readonly default: undefined;
    };
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>> & Readonly<{}>, {
    readonly hidden: boolean;
    readonly help: VNodeChild;
    readonly preserve: boolean;
    readonly tooltip: import("./types").FormItemTooltip;
    readonly extra: VNodeChild;
    readonly colon: boolean;
    readonly required: boolean;
    readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
    readonly noStyle: boolean;
    readonly validateFirst: import("./types").FormValidateFirst;
    readonly messageVariables: FormMessageVariables;
    readonly hasFeedback: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    label?(_: {}): any;
    help?(_: {}): any;
    extra?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
