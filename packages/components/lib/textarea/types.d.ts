import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type TextareaStatus = 'error' | 'warning';
export declare const textareaProps: {
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly rows: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<TextareaStatus>;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: BooleanConstructor;
};
export declare const textareaEmits: {
    'update:modelValue': (value: string) => boolean;
    input: (value: string) => boolean;
    change: (value: string) => boolean;
};
export type TextareaProps = ExtractPropTypes<typeof textareaProps>;
