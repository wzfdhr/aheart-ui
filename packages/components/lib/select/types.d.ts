import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type SelectStatus = 'error' | 'warning';
export type SelectPrimitiveValue = string | number;
export type SelectMode = 'multiple' | 'tags';
export type SelectValue = SelectPrimitiveValue | SelectPrimitiveValue[];
export type SelectVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export interface SelectOption {
    label: string;
    value: SelectPrimitiveValue;
    disabled?: boolean;
}
export type SelectFilterOption = boolean | ((inputValue: string, option: SelectOption) => boolean);
export declare const selectProps: {
    readonly id: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: PropType<SelectValue>;
    readonly options: PropType<SelectOption[]>;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffixIcon: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<SelectStatus>;
    readonly variant: {
        readonly type: PropType<SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly mode: PropType<SelectMode>;
    readonly showSearch: BooleanConstructor;
    readonly searchValue: StringConstructor;
    readonly filterOption: {
        readonly type: PropType<SelectFilterOption>;
        readonly default: undefined;
    };
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
};
export declare const selectEmits: {
    'update:modelValue': (value: SelectValue) => boolean;
    change: (value: SelectValue) => boolean;
    clear: () => boolean;
    search: (value: string) => boolean;
};
export type SelectProps = ExtractPropTypes<typeof selectProps>;
