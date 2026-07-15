export declare const AI_FORM_FIELD_TYPES: readonly ["input", "textarea", "number", "select", "checkbox", "radio", "switch", "date", "date-range", "time", "time-range", "upload", "tree-select"];
export declare const AI_FORM_CONDITION_OPERATORS: readonly ["equals", "not-equals", "includes", "not-includes", "is-empty", "is-not-empty"];
export type AIFormFieldType = (typeof AI_FORM_FIELD_TYPES)[number];
export type AIFormConditionOperator = (typeof AI_FORM_CONDITION_OPERATORS)[number];
export interface AIFormCondition {
    field: string;
    operator: AIFormConditionOperator;
    value?: string | number | boolean | string[];
}
export interface AIFormOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
export interface AIFormGroupV1 {
    key: string;
    title: string;
    description?: string;
}
export interface AIFormFieldV1 {
    key: string;
    label: string;
    type: AIFormFieldType;
    defaultValue?: unknown;
    placeholder?: string;
    description?: string;
    group?: string;
    required?: boolean;
    options?: AIFormOption[];
    visibleWhen?: AIFormCondition;
    disabledWhen?: AIFormCondition;
}
export interface AIFormSchemaV1 {
    version: '1';
    title?: string;
    description?: string;
    groups?: AIFormGroupV1[];
    fields: AIFormFieldV1[];
}
export interface AIFormSchemaValidation {
    valid: boolean;
    errors: string[];
    schema?: AIFormSchemaV1;
}
export declare const validateAIFormSchema: (schema: unknown) => AIFormSchemaValidation;
