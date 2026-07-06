import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, VNodeChild } from 'vue';
import type { AheartSize, AheartVariant } from '../config';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormLabelAlign = 'left' | 'right';
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating';
export type FormRequiredMark = boolean | 'optional';
export type FormVariant = AheartVariant;
export type FormRenderable = VNodeChild;
export type FormRuleType = 'string' | 'number' | 'email' | 'array';
export type FormModel = Record<string, unknown>;
export interface FormRule {
    required?: boolean;
    message?: string;
    type?: FormRuleType;
    min?: number;
    max?: number;
    len?: number;
    pattern?: RegExp;
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
    rules: FormRule[];
}
export interface FormContext {
    requiredMark: ComputedRef<FormRequiredMark>;
    colon: ComputedRef<boolean>;
    registerField: (name: string, rules: FormRule[]) => void;
    unregisterField: (name: string) => void;
    getFieldErrors: (name: string) => string[];
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
    readonly required: BooleanConstructor;
    readonly rules: PropType<FormRule[]>;
    readonly validateStatus: PropType<FormValidateStatus>;
    readonly help: StringConstructor;
    readonly extra: StringConstructor;
    readonly hasFeedback: BooleanConstructor;
};
export type FormProps = ExtractPropTypes<typeof formProps>;
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
