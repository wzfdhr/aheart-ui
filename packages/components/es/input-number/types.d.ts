import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type InputNumberStatus = 'error' | 'warning';
export type InputNumberVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type InputNumberStepType = 'up' | 'down';
export type InputNumberStepEmitter = 'handler' | 'keydown' | 'wheel';
export type InputNumberFocusCursor = 'start' | 'end' | 'all';
export type InputNumberRenderable = VNodeChild;
export type InputNumberValue = number | string;
export interface InputNumberFocusOptions extends FocusOptions {
    cursor?: InputNumberFocusCursor;
}
export interface InputNumberFormatterInfo {
    userTyping: boolean;
    input: string;
}
export interface InputNumberControlsConfig {
    upIcon?: InputNumberRenderable;
    downIcon?: InputNumberRenderable;
}
export type InputNumberControls = boolean | InputNumberControlsConfig;
export type InputNumberSemanticPart = 'root' | 'input' | 'prefix' | 'suffix' | 'actions' | 'action';
export interface InputNumberSemanticInfo {
    props: Readonly<Record<string, unknown>>;
}
export type InputNumberSemanticRecord<T> = Partial<Record<InputNumberSemanticPart, T>>;
export type InputNumberSemanticConfig<T> = InputNumberSemanticRecord<T> | ((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<T>);
export type InputNumberClassNames = InputNumberSemanticConfig<string>;
export type InputNumberStyles = InputNumberSemanticConfig<StyleValue>;
export interface InputNumberStepInfo {
    offset: number;
    type: InputNumberStepType;
    emitter: InputNumberStepEmitter;
}
export declare const inputNumberProps: {
    readonly id: StringConstructor;
    readonly modelValue: PropType<InputNumberValue>;
    readonly value: PropType<InputNumberValue>;
    readonly defaultValue: PropType<InputNumberValue>;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<InputNumberStatus>;
    readonly variant: {
        readonly type: PropType<InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: PropType<string | number>;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly stringMode: BooleanConstructor;
    readonly formatter: PropType<(value: InputNumberValue | undefined, info: InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => InputNumberValue | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnBlur: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<InputNumberClassNames>;
    readonly styles: PropType<InputNumberStyles>;
};
export declare const inputNumberEmits: {
    'update:modelValue': (value: InputNumberValue | undefined) => boolean;
    change: (value: InputNumberValue | undefined) => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
    step: (value: InputNumberValue, info: InputNumberStepInfo) => boolean;
};
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>;
