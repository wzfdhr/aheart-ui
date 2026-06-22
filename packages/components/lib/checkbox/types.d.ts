import type { ExtractPropTypes, PropType } from 'vue';
export type CheckboxValue = string | number | boolean;
export type CheckboxGroupDirection = 'horizontal' | 'vertical';
export interface CheckboxOption {
    label: string;
    value: CheckboxValue;
    disabled?: boolean;
}
export declare const checkboxProps: {
    readonly modelValue: BooleanConstructor;
    readonly value: PropType<CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
};
export declare const checkboxEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    change: (checked: boolean) => boolean;
};
export declare const checkboxGroupProps: {
    readonly modelValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: () => never[];
    };
    readonly options: {
        readonly type: PropType<CheckboxOption[]>;
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
};
export declare const checkboxGroupEmits: {
    'update:modelValue': (value: CheckboxValue[]) => boolean;
    change: (value: CheckboxValue[]) => boolean;
};
export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;
export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;
