import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type InputStatus = 'error' | 'warning';
export declare const inputProps: {
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<InputStatus>;
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
};
export type InputProps = ExtractPropTypes<typeof inputProps>;
