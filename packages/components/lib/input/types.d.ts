import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type InputStatus = 'error' | 'warning';
export type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export declare const inputProps: {
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
    readonly addonBefore: StringConstructor;
    readonly addonAfter: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<InputStatus>;
    readonly variant: {
        readonly type: PropType<InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
};
export declare const inputEmits: {
    'update:modelValue': (value: string) => boolean;
    input: (value: string) => boolean;
    change: (value: string) => boolean;
    clear: () => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
};
export type InputProps = ExtractPropTypes<typeof inputProps>;
