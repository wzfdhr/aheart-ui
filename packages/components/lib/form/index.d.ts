declare const Form: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly model: {
            readonly type: import("vue").PropType<import("./types").FormModel>;
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
        onFinish?: ((values: import("./types").FormModel) => any) | undefined;
        onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
        onValidate?: ((name: import("./types").FormNamePath, status: boolean, errors: string[]) => any) | undefined;
    }>, {
        validate: () => {
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        } | Promise<{
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        }>;
        validateFields: (names?: import("./types").FormNamePath[] | undefined) => {
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        } | Promise<{
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        }>;
        resetFields: (names?: import("./types").FormNamePath[] | undefined) => void;
        clearValidate: (names?: import("./types").FormNamePath[] | undefined) => void;
        setFieldValue: (name: import("./types").FormNamePath, value: unknown) => void;
        setFieldsValue: (values: import("./types").FormModel) => void;
        getFieldValue: (name: import("./types").FormNamePath) => unknown;
        getFieldsValue: (names?: true | import("./types").FormNamePath[] | undefined) => import("./types").FormModel;
        getFieldError: (name: import("./types").FormNamePath) => string[];
        getFieldsError: (names?: import("./types").FormNamePath[] | undefined) => {
            name: import("./types").FormNamePath;
            errors: string[];
        }[];
        scrollToField: (name: import("./types").FormNamePath, options?: ScrollIntoViewOptions | undefined) => void;
        setFieldsErrors: (fields: {
            name: import("./types").FormNamePath;
            errors: string[];
        }[]) => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        submit: (event: Event) => void;
        finish: (values: import("./types").FormModel) => void;
        finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
        validate: (name: import("./types").FormNamePath, status: boolean, errors: string[]) => void;
    }, import("vue").PublicProps, {
        readonly variant: import("../config").AheartVariant;
        readonly layout: import("./types").FormLayout;
        readonly preserve: boolean;
        readonly disabled: boolean;
        readonly colon: boolean;
        readonly model: import("./types").FormModel;
        readonly rules: import("./types").FormRules;
        readonly labelAlign: import("./types").FormLabelAlign;
        readonly requiredMark: import("./types").FormRequiredMark;
        readonly scrollToFirstError: import("./types").FormScrollToFirstError;
        readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly model: {
            readonly type: import("vue").PropType<import("./types").FormModel>;
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
        onFinish?: ((values: import("./types").FormModel) => any) | undefined;
        onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
        onValidate?: ((name: import("./types").FormNamePath, status: boolean, errors: string[]) => any) | undefined;
    }>, {
        validate: () => {
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        } | Promise<{
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        }>;
        validateFields: (names?: import("./types").FormNamePath[] | undefined) => {
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        } | Promise<{
            outOfDate?: true | undefined;
            values: import("./types").FormModel;
            errorFields: import("./types").FormValidationError[];
        }>;
        resetFields: (names?: import("./types").FormNamePath[] | undefined) => void;
        clearValidate: (names?: import("./types").FormNamePath[] | undefined) => void;
        setFieldValue: (name: import("./types").FormNamePath, value: unknown) => void;
        setFieldsValue: (values: import("./types").FormModel) => void;
        getFieldValue: (name: import("./types").FormNamePath) => unknown;
        getFieldsValue: (names?: true | import("./types").FormNamePath[] | undefined) => import("./types").FormModel;
        getFieldError: (name: import("./types").FormNamePath) => string[];
        getFieldsError: (names?: import("./types").FormNamePath[] | undefined) => {
            name: import("./types").FormNamePath;
            errors: string[];
        }[];
        scrollToField: (name: import("./types").FormNamePath, options?: ScrollIntoViewOptions | undefined) => void;
        setFieldsErrors: (fields: {
            name: import("./types").FormNamePath;
            errors: string[];
        }[]) => void;
    }, {}, {}, {}, {
        readonly variant: import("../config").AheartVariant;
        readonly layout: import("./types").FormLayout;
        readonly preserve: boolean;
        readonly disabled: boolean;
        readonly colon: boolean;
        readonly model: import("./types").FormModel;
        readonly rules: import("./types").FormRules;
        readonly labelAlign: import("./types").FormLabelAlign;
        readonly requiredMark: import("./types").FormRequiredMark;
        readonly scrollToFirstError: import("./types").FormScrollToFirstError;
        readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly model: {
        readonly type: import("vue").PropType<import("./types").FormModel>;
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
    onFinish?: ((values: import("./types").FormModel) => any) | undefined;
    onFinishFailed?: ((info: import("./types").FormFinishFailedInfo) => any) | undefined;
    onValidate?: ((name: import("./types").FormNamePath, status: boolean, errors: string[]) => any) | undefined;
}>, {
    validate: () => {
        outOfDate?: true | undefined;
        values: import("./types").FormModel;
        errorFields: import("./types").FormValidationError[];
    } | Promise<{
        outOfDate?: true | undefined;
        values: import("./types").FormModel;
        errorFields: import("./types").FormValidationError[];
    }>;
    validateFields: (names?: import("./types").FormNamePath[] | undefined) => {
        outOfDate?: true | undefined;
        values: import("./types").FormModel;
        errorFields: import("./types").FormValidationError[];
    } | Promise<{
        outOfDate?: true | undefined;
        values: import("./types").FormModel;
        errorFields: import("./types").FormValidationError[];
    }>;
    resetFields: (names?: import("./types").FormNamePath[] | undefined) => void;
    clearValidate: (names?: import("./types").FormNamePath[] | undefined) => void;
    setFieldValue: (name: import("./types").FormNamePath, value: unknown) => void;
    setFieldsValue: (values: import("./types").FormModel) => void;
    getFieldValue: (name: import("./types").FormNamePath) => unknown;
    getFieldsValue: (names?: true | import("./types").FormNamePath[] | undefined) => import("./types").FormModel;
    getFieldError: (name: import("./types").FormNamePath) => string[];
    getFieldsError: (names?: import("./types").FormNamePath[] | undefined) => {
        name: import("./types").FormNamePath;
        errors: string[];
    }[];
    scrollToField: (name: import("./types").FormNamePath, options?: ScrollIntoViewOptions | undefined) => void;
    setFieldsErrors: (fields: {
        name: import("./types").FormNamePath;
        errors: string[];
    }[]) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (event: Event) => void;
    finish: (values: import("./types").FormModel) => void;
    finishFailed: (info: import("./types").FormFinishFailedInfo) => void;
    validate: (name: import("./types").FormNamePath, status: boolean, errors: string[]) => void;
}, string, {
    readonly variant: import("../config").AheartVariant;
    readonly layout: import("./types").FormLayout;
    readonly preserve: boolean;
    readonly disabled: boolean;
    readonly colon: boolean;
    readonly model: import("./types").FormModel;
    readonly rules: import("./types").FormRules;
    readonly labelAlign: import("./types").FormLabelAlign;
    readonly requiredMark: import("./types").FormRequiredMark;
    readonly scrollToFirstError: import("./types").FormScrollToFirstError;
    readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const FormItem: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly label: import("vue").PropType<import("vue").VNodeChild>;
        readonly name: import("vue").PropType<import("./types").FormNamePath>;
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly htmlFor: StringConstructor;
        readonly labelAlign: import("vue").PropType<import("./types").FormLabelAlign>;
        readonly layout: import("vue").PropType<import("./types").FormItemLayout>;
        readonly hidden: BooleanConstructor;
        readonly noStyle: BooleanConstructor;
        readonly validateFirst: {
            readonly type: import("vue").PropType<import("./types").FormValidateFirst>;
            readonly default: false;
        };
        readonly messageVariables: {
            readonly type: import("vue").PropType<import("./types").FormMessageVariables>;
            readonly default: () => {};
        };
        readonly required: BooleanConstructor;
        readonly rules: import("vue").PropType<import("./types").FormRule[]>;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly extra: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly tooltip: {
            type: import("vue").PropType<import("./types").FormItemTooltip>;
            default: undefined;
        };
        readonly hasFeedback: BooleanConstructor;
        readonly dependencies: import("vue").PropType<import("./types").FormNamePath[]>;
        readonly validateTrigger: {
            readonly type: import("vue").PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
            readonly default: undefined;
        };
        readonly preserve: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly hidden: boolean;
        readonly help: import("vue").VNodeChild;
        readonly preserve: boolean;
        readonly tooltip: import("./types").FormItemTooltip;
        readonly extra: import("vue").VNodeChild;
        readonly colon: boolean;
        readonly required: boolean;
        readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
        readonly noStyle: boolean;
        readonly validateFirst: import("./types").FormValidateFirst;
        readonly messageVariables: import("./types").FormMessageVariables;
        readonly hasFeedback: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly label: import("vue").PropType<import("vue").VNodeChild>;
        readonly name: import("vue").PropType<import("./types").FormNamePath>;
        readonly colon: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly htmlFor: StringConstructor;
        readonly labelAlign: import("vue").PropType<import("./types").FormLabelAlign>;
        readonly layout: import("vue").PropType<import("./types").FormItemLayout>;
        readonly hidden: BooleanConstructor;
        readonly noStyle: BooleanConstructor;
        readonly validateFirst: {
            readonly type: import("vue").PropType<import("./types").FormValidateFirst>;
            readonly default: false;
        };
        readonly messageVariables: {
            readonly type: import("vue").PropType<import("./types").FormMessageVariables>;
            readonly default: () => {};
        };
        readonly required: BooleanConstructor;
        readonly rules: import("vue").PropType<import("./types").FormRule[]>;
        readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
        readonly help: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly extra: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly tooltip: {
            type: import("vue").PropType<import("./types").FormItemTooltip>;
            default: undefined;
        };
        readonly hasFeedback: BooleanConstructor;
        readonly dependencies: import("vue").PropType<import("./types").FormNamePath[]>;
        readonly validateTrigger: {
            readonly type: import("vue").PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
            readonly default: undefined;
        };
        readonly preserve: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly hidden: boolean;
        readonly help: import("vue").VNodeChild;
        readonly preserve: boolean;
        readonly tooltip: import("./types").FormItemTooltip;
        readonly extra: import("vue").VNodeChild;
        readonly colon: boolean;
        readonly required: boolean;
        readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
        readonly noStyle: boolean;
        readonly validateFirst: import("./types").FormValidateFirst;
        readonly messageVariables: import("./types").FormMessageVariables;
        readonly hasFeedback: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly label: import("vue").PropType<import("vue").VNodeChild>;
    readonly name: import("vue").PropType<import("./types").FormNamePath>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: import("vue").PropType<import("./types").FormLabelAlign>;
    readonly layout: import("vue").PropType<import("./types").FormItemLayout>;
    readonly hidden: BooleanConstructor;
    readonly noStyle: BooleanConstructor;
    readonly validateFirst: {
        readonly type: import("vue").PropType<import("./types").FormValidateFirst>;
        readonly default: false;
    };
    readonly messageVariables: {
        readonly type: import("vue").PropType<import("./types").FormMessageVariables>;
        readonly default: () => {};
    };
    readonly required: BooleanConstructor;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly validateStatus: import("vue").PropType<import("./types").FormValidateStatus>;
    readonly help: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly extra: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly tooltip: {
        type: import("vue").PropType<import("./types").FormItemTooltip>;
        default: undefined;
    };
    readonly hasFeedback: BooleanConstructor;
    readonly dependencies: import("vue").PropType<import("./types").FormNamePath[]>;
    readonly validateTrigger: {
        readonly type: import("vue").PropType<false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[]>;
        readonly default: undefined;
    };
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly hidden: boolean;
    readonly help: import("vue").VNodeChild;
    readonly preserve: boolean;
    readonly tooltip: import("./types").FormItemTooltip;
    readonly extra: import("vue").VNodeChild;
    readonly colon: boolean;
    readonly required: boolean;
    readonly validateTrigger: false | import("./types").FormValidateTrigger | import("./types").FormValidateTrigger[];
    readonly noStyle: boolean;
    readonly validateFirst: import("./types").FormValidateFirst;
    readonly messageVariables: import("./types").FormMessageVariables;
    readonly hasFeedback: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        label?(_: {}): any;
        help?(_: {}): any;
        extra?(_: {}): any;
    };
})>;
export { FormItem as AFormItem };
export default Form;
export type * from './types';
