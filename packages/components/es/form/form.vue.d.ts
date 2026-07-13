import { type FormModel, type FormValidationError } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly model: {
        readonly type: import("vue").PropType<FormModel>;
        readonly default: () => {};
    };
    readonly rules: {
        readonly type: import("vue").PropType<import("./types").FormRules>;
        readonly default: () => {};
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").FormLayout>;
        readonly default: "horizontal";
    };
    readonly labelAlign: {
        readonly type: import("vue").PropType<import("./types").FormLabelAlign>;
        readonly default: "right";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly requiredMark: {
        readonly type: import("vue").PropType<import("./types").FormRequiredMark>;
        readonly default: true;
    };
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: import("vue").PropType<import("../config").AheartVariant>;
        readonly default: undefined;
    };
    readonly scrollToFirstError: {
        readonly type: import("vue").PropType<import("./types").FormScrollToFirstError>;
        readonly default: false;
    };
}>, {
    validate: () => {
        values: FormModel;
        errorFields: FormValidationError[];
    };
    validateFields: (names?: string[] | undefined) => {
        values: FormModel;
        errorFields: FormValidationError[];
    };
    clearValidate: (names?: string[] | undefined) => void;
    setFieldValue: (name: string, value: unknown) => void;
    setFieldsValue: (values: FormModel) => void;
    getFieldValue: (name: string) => unknown;
    getFieldsValue: (names?: true | string[] | undefined) => FormModel;
    getFieldError: (name: string) => string[];
    getFieldsError: (names?: string[] | undefined) => {
        name: string;
        errors: string[];
    }[];
    scrollToField: (name: string, options?: ScrollIntoViewOptions | undefined) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (event: Event) => void;
    finish: (values: FormModel) => void;
    finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
    validate: (name: string, status: boolean, errors: string[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly model: {
        readonly type: import("vue").PropType<FormModel>;
        readonly default: () => {};
    };
    readonly rules: {
        readonly type: import("vue").PropType<import("./types").FormRules>;
        readonly default: () => {};
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").FormLayout>;
        readonly default: "horizontal";
    };
    readonly labelAlign: {
        readonly type: import("vue").PropType<import("./types").FormLabelAlign>;
        readonly default: "right";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly requiredMark: {
        readonly type: import("vue").PropType<import("./types").FormRequiredMark>;
        readonly default: true;
    };
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: import("vue").PropType<import("../config").AheartVariant>;
        readonly default: undefined;
    };
    readonly scrollToFirstError: {
        readonly type: import("vue").PropType<import("./types").FormScrollToFirstError>;
        readonly default: false;
    };
}>> & Readonly<{
    onSubmit?: ((event: Event) => any) | undefined;
    onFinish?: ((values: FormModel) => any) | undefined;
    onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
    onValidate?: ((name: string, status: boolean, errors: string[]) => any) | undefined;
}>, {
    readonly variant: import("../config").AheartVariant;
    readonly layout: import("./types").FormLayout;
    readonly disabled: boolean;
    readonly colon: boolean;
    readonly model: FormModel;
    readonly rules: import("./types").FormRules;
    readonly labelAlign: import("./types").FormLabelAlign;
    readonly requiredMark: import("./types").FormRequiredMark;
    readonly scrollToFirstError: import("./types").FormScrollToFirstError;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
