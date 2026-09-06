import { type FormModel, type FormNamePath, type FormValidationError } from './types';
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
    readonly validateTrigger: {
        readonly type: import("vue").PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
        readonly default: false;
    };
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>, {
    validate: () => {
        outOfDate?: true | undefined;
        values: FormModel;
        errorFields: FormValidationError[];
    } | Promise<{
        outOfDate?: true | undefined;
        values: FormModel;
        errorFields: FormValidationError[];
    }>;
    validateFields: (names?: FormNamePath[] | undefined) => {
        outOfDate?: true | undefined;
        values: FormModel;
        errorFields: FormValidationError[];
    } | Promise<{
        outOfDate?: true | undefined;
        values: FormModel;
        errorFields: FormValidationError[];
    }>;
    resetFields: (names?: FormNamePath[] | undefined) => void;
    clearValidate: (names?: FormNamePath[] | undefined) => void;
    setFieldValue: (name: FormNamePath, value: unknown) => void;
    setFieldsValue: (values: FormModel) => void;
    getFieldValue: (name: FormNamePath) => unknown;
    getFieldsValue: (names?: true | FormNamePath[] | undefined) => FormModel;
    getFieldError: (name: FormNamePath) => string[];
    getFieldsError: (names?: FormNamePath[] | undefined) => {
        name: FormNamePath;
        errors: string[];
    }[];
    scrollToField: (name: FormNamePath, options?: ScrollIntoViewOptions | undefined) => void;
    setFieldsErrors: (fields: {
        name: FormNamePath;
        errors: string[];
    }[]) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (event: Event) => void;
    finish: (values: FormModel) => void;
    finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
    validate: (name: FormNamePath, status: boolean, errors: string[]) => void;
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
    readonly validateTrigger: {
        readonly type: import("vue").PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
        readonly default: false;
    };
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>> & Readonly<{
    onSubmit?: ((event: Event) => any) | undefined;
    onFinish?: ((values: FormModel) => any) | undefined;
    onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
    onValidate?: ((name: FormNamePath, status: boolean, errors: string[]) => any) | undefined;
}>, {
    readonly variant: import("../config").AheartVariant;
    readonly layout: import("./types").FormLayout;
    readonly preserve: boolean;
    readonly disabled: boolean;
    readonly colon: boolean;
    readonly model: FormModel;
    readonly rules: import("./types").FormRules;
    readonly labelAlign: import("./types").FormLabelAlign;
    readonly requiredMark: import("./types").FormRequiredMark;
    readonly scrollToFirstError: import("./types").FormScrollToFirstError;
    readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
