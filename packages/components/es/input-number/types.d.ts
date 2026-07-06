import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type InputNumberStatus = 'error' | 'warning';
export type InputNumberVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type InputNumberStepType = 'up' | 'down';
export type InputNumberRenderable = VNodeChild;
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
export type InputNumberClassNames = Partial<Record<InputNumberSemanticPart, string>>;
export type InputNumberStyles = Partial<Record<InputNumberSemanticPart, StyleValue>>;
export interface InputNumberStepInfo {
    offset: number;
    type: InputNumberStepType;
}
export declare const inputNumberProps: {
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
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
    readonly formatter: PropType<(value: number | undefined, info: InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<InputNumberSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<InputNumberSemanticPart, StyleValue>>>;
};
export declare const inputNumberEmits: {
    'update:modelValue': (value: number | undefined) => boolean;
    change: (value: number | undefined) => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
    step: (value: number, info: InputNumberStepInfo) => boolean;
};
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>;
