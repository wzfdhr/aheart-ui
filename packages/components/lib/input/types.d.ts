import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type InputStatus = 'error' | 'warning';
export type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export interface InputCountFormatterInfo {
    count: number;
    maxLength?: number;
    value: string;
}
export interface InputAllowClearConfig {
    clearIcon?: string;
}
export interface InputShowCountConfig {
    formatter?: (info: InputCountFormatterInfo) => string;
}
export interface InputCountConfig {
    max?: number;
    strategy?: (value: string) => number;
    show?: boolean | ((info: InputCountFormatterInfo) => string);
}
export type InputAllowClear = boolean | InputAllowClearConfig;
export type InputShowCount = boolean | InputShowCountConfig;
export type InputSemanticPart = 'root' | 'input' | 'prefix' | 'suffix' | 'clear' | 'count';
export type InputClassNames = Partial<Record<InputSemanticPart, string>>;
export type InputStyles = Partial<Record<InputSemanticPart, StyleValue>>;
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
    readonly allowClear: {
        readonly type: PropType<InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: PropType<InputShowCount>;
        readonly default: false;
    };
    readonly count: PropType<InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<InputSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<InputSemanticPart, StyleValue>>>;
};
export declare const inputEmits: {
    'update:modelValue': (value: string) => boolean;
    input: (value: string) => boolean;
    change: (value: string) => boolean;
    clear: () => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
};
export type InputProps = ExtractPropTypes<typeof inputProps>;
