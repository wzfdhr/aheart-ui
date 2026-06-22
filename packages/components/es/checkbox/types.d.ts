import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export type CheckboxValue = string | number | boolean;
export type CheckboxGroupDirection = 'horizontal' | 'vertical';
export type CheckboxSemanticPart = 'root' | 'icon' | 'label';
export type CheckboxClassNames = Partial<Record<CheckboxSemanticPart, string>>;
export type CheckboxStyles = Partial<Record<CheckboxSemanticPart, StyleValue>>;
export type CheckboxRawOption = CheckboxValue | CheckboxOption;
export interface CheckboxOption {
    label: string;
    value: CheckboxValue;
    disabled?: boolean;
    className?: string;
    style?: StyleValue;
    title?: string;
}
export declare const checkboxProps: {
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: PropType<CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<CheckboxSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<CheckboxSemanticPart, StyleValue>>>;
};
export declare const checkboxEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    'update:checked': (checked: boolean) => boolean;
    change: (checked: boolean, event: Event) => boolean;
};
export declare const checkboxGroupProps: {
    readonly modelValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: PropType<CheckboxRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: PropType<CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
};
export declare const checkboxGroupEmits: {
    'update:modelValue': (value: CheckboxValue[]) => boolean;
    'update:value': (value: CheckboxValue[]) => boolean;
    change: (value: CheckboxValue[]) => boolean;
};
export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;
export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;
