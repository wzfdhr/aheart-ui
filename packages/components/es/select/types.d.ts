import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type SelectStatus = 'error' | 'warning';
export type SelectMode = 'multiple';
export type SelectValue = string | string[];
export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}
export declare const selectProps: {
    readonly modelValue: PropType<SelectValue>;
    readonly options: PropType<SelectOption[]>;
    readonly placeholder: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<SelectStatus>;
    readonly allowClear: BooleanConstructor;
    readonly mode: PropType<"multiple">;
};
export declare const selectEmits: {
    'update:modelValue': (value: SelectValue) => boolean;
    change: (value: SelectValue) => boolean;
    clear: () => boolean;
};
export type SelectProps = ExtractPropTypes<typeof selectProps>;
