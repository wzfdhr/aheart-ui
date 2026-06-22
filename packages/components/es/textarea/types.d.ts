import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type TextareaStatus = 'error' | 'warning';
export type TextareaVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type TextareaRenderable = VNodeChild;
export interface TextareaCountFormatterInfo {
    count: number;
    maxLength?: number;
    value: string;
}
export interface TextareaAllowClearConfig {
    clearIcon?: TextareaRenderable;
    disabled?: boolean;
}
export interface TextareaShowCountConfig {
    formatter?: (info: TextareaCountFormatterInfo) => TextareaRenderable;
}
export interface TextareaCountExceedFormatterInfo {
    max: number;
}
export interface TextareaCountConfig {
    max?: number;
    strategy?: (value: string) => number;
    show?: boolean | ((info: TextareaCountFormatterInfo) => TextareaRenderable);
    exceedFormatter?: (value: string, config: TextareaCountExceedFormatterInfo) => string;
}
export interface TextareaAutoSizeConfig {
    minRows?: number;
    maxRows?: number;
}
export type TextareaAllowClear = boolean | TextareaAllowClearConfig;
export type TextareaShowCount = boolean | TextareaShowCountConfig;
export type TextareaSemanticPart = 'root' | 'textarea' | 'clear' | 'count';
export type TextareaClassNames = Partial<Record<TextareaSemanticPart, string>>;
export type TextareaStyles = Partial<Record<TextareaSemanticPart, StyleValue>>;
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
    readonly allowClear: {
        readonly type: PropType<TextareaAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: PropType<TextareaShowCount>;
        readonly default: false;
    };
    readonly count: PropType<TextareaCountConfig>;
    readonly autoSize: PropType<boolean | TextareaAutoSizeConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<TextareaSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<TextareaSemanticPart, StyleValue>>>;
};
export declare const textareaEmits: {
    'update:modelValue': (value: string) => boolean;
    input: (value: string) => boolean;
    change: (value: string) => boolean;
    clear: () => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
};
export type TextareaProps = ExtractPropTypes<typeof textareaProps>;
