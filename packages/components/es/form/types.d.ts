import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, VNodeChild } from 'vue';
import type { AheartSize, AheartVariant } from '../config';
import type { TooltipProps } from '../tooltip';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormItemLayout = Exclude<FormLayout, 'inline'>;
export type FormLabelAlign = 'left' | 'right';
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating';
export type FormRequiredMark = boolean | 'optional';
export type FormValidateFirst = boolean | 'parallel';
export type FormVariant = AheartVariant;
export type FormRenderable = VNodeChild;
export type FormMessageVariables = Record<string, string | number>;
export type FormScrollToFirstError = boolean | ScrollIntoViewOptions;
export type FormTooltipTitle = FormRenderable | (() => FormRenderable);
export type FormItemTooltipConfig = Partial<Omit<TooltipProps, 'title'>> & {
    title?: FormTooltipTitle;
    icon?: FormRenderable;
};
export type FormItemTooltip = FormTooltipTitle | FormItemTooltipConfig;
export type FormRuleType = 'string' | 'number' | 'email' | 'array';
export type FormModel = Record<string, unknown>;
export type FormRuleValidatorResult = void | boolean | string;
export type FormRuleValidator = (rule: FormRule, value: unknown, model: FormModel) => FormRuleValidatorResult | Promise<FormRuleValidatorResult>;
export interface FormRule {
    required?: boolean;
    message?: string;
    type?: FormRuleType;
    min?: number;
    max?: number;
    len?: number;
    pattern?: RegExp;
    validator?: FormRuleValidator;
}
export type FormRules = Record<string, FormRule[]>;
export interface FormValidationError {
    name: string;
    errors: string[];
}
export interface FormFinishFailedInfo {
    values: FormModel;
    errorFields: FormValidationError[];
}
export interface FormFieldState {
    errors: string[];
    validating: boolean;
    rules: FormRule[];
    validateFirst: FormValidateFirst;
    messageVariables: FormMessageVariables;
}
export interface FormContext {
    requiredMark: ComputedRef<FormRequiredMark>;
    colon: ComputedRef<boolean>;
    registerField: (name: string, rules: FormRule[], validateFirst: FormValidateFirst, messageVariables: FormMessageVariables) => void;
    unregisterField: (name: string) => void;
    getFieldErrors: (name: string) => string[];
    isFieldValidating: (name: string) => boolean;
    isFieldRequired: (name: string) => boolean;
}
export declare const formContextKey: InjectionKey<FormContext>;
export declare const formProps: {
    readonly model: {
        readonly type: PropType<FormModel>;
        readonly default: () => {};
    };
    readonly rules: {
        readonly type: PropType<FormRules>;
        readonly default: () => {};
    };
    readonly layout: {
        readonly type: PropType<FormLayout>;
        readonly default: "horizontal";
    };
    readonly labelAlign: {
        readonly type: PropType<FormLabelAlign>;
        readonly default: "right";
    };
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly requiredMark: {
        readonly type: PropType<FormRequiredMark>;
        readonly default: true;
    };
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: PropType<AheartVariant>;
        readonly default: undefined;
    };
    readonly scrollToFirstError: {
        readonly type: PropType<FormScrollToFirstError>;
        readonly default: false;
    };
};
export declare const formEmits: {
    submit: (event: Event) => boolean;
    finish: (values: FormModel) => boolean;
    finishFailed: (info: FormFinishFailedInfo) => boolean;
    validate: (name: string, status: boolean, errors: string[]) => boolean;
};
export declare const formItemProps: {
    readonly label: PropType<VNodeChild>;
    readonly name: StringConstructor;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly htmlFor: StringConstructor;
    readonly labelAlign: PropType<FormLabelAlign>;
    readonly layout: PropType<FormItemLayout>;
    readonly hidden: BooleanConstructor;
    readonly noStyle: BooleanConstructor;
    readonly validateFirst: {
        readonly type: PropType<FormValidateFirst>;
        readonly default: false;
    };
    readonly messageVariables: {
        readonly type: PropType<FormMessageVariables>;
        readonly default: () => {};
    };
    readonly required: BooleanConstructor;
    readonly rules: PropType<FormRule[]>;
    readonly validateStatus: PropType<FormValidateStatus>;
    readonly help: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly extra: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tooltip: {
        type: PropType<FormItemTooltip>;
        default: undefined;
    };
    readonly hasFeedback: BooleanConstructor;
};
export type FormProps = ExtractPropTypes<typeof formProps>;
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
