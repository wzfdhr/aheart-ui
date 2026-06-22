import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type TextareaStatus = 'error' | 'warning';
export type TextareaVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export interface TextareaAutoSizeConfig {
    minRows?: number;
    maxRows?: number;
}
export declare const textareaProps: {
    readonly id: StringConstructor;
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
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<TextareaStatus>;
    readonly variant: {
        readonly type: PropType<TextareaVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: PropType<boolean | TextareaAutoSizeConfig>;
};
export declare const textareaEmits: {
    'update:modelValue': (value: string) => boolean;
    input: (value: string) => boolean;
    change: (value: string) => boolean;
    clear: () => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
};
export type TextareaProps = ExtractPropTypes<typeof textareaProps>;
