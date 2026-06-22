import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type RadioValue = string | number | boolean;
export type RadioGroupDirection = 'horizontal' | 'vertical';
export type RadioOptionType = 'default' | 'button';
export type RadioButtonStyle = 'outline' | 'solid';
export interface RadioOption {
    label: string;
    value: RadioValue;
    disabled?: boolean;
}
export declare const radioProps: {
    readonly modelValue: BooleanConstructor;
    readonly value: PropType<RadioValue>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly label: StringConstructor;
    readonly name: StringConstructor;
};
export declare const radioEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    change: (checked: boolean) => boolean;
};
export declare const radioGroupProps: {
    readonly modelValue: PropType<RadioValue>;
    readonly options: {
        readonly type: PropType<RadioOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: PropType<RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: PropType<RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: PropType<RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: PropType<AheartSize>;
    readonly block: BooleanConstructor;
};
export declare const radioGroupEmits: {
    'update:modelValue': (value: RadioValue) => boolean;
    change: (value: RadioValue) => boolean;
};
export type RadioProps = ExtractPropTypes<typeof radioProps>;
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;
