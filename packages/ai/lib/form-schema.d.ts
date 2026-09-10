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
    rules?: AIFormRuleV1[];
    dependencies?: string[];
    preserve?: boolean;
}
export type AIFormRuleV1 = {
    kind: 'range';
    valueType: 'number' | 'length';
    min?: number;
    max?: number;
    message?: string;
} | {
    kind: 'format';
    format: 'email' | 'url' | 'date' | 'time';
    message?: string;
} | {
    kind: 'compare';
    field: string;
    operator: 'equals' | 'not-equals' | 'greater-than' | 'greater-than-or-equal' | 'less-than' | 'less-than-or-equal';
    message?: string;
} | {
    kind: 'async';
    validator: string;
    message?: string;
};
export type AIFormAsyncValidator = (value: unknown, context: {
    values: Readonly<Record<string, unknown>>;
    field: AIFormFieldV1;
    signal: AbortSignal;
}) => void | boolean | string | Promise<void | boolean | string>;
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
