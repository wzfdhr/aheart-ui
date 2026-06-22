import type { ExtractPropTypes } from 'vue';
export declare const checkboxProps: {
    readonly modelValue: BooleanConstructor;
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
export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;
