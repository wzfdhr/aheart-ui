import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type InputNumberStatus = 'error' | 'warning';
export type InputNumberVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type InputNumberStepType = 'up' | 'down';
export interface InputNumberStepInfo {
    offset: number;
    type: InputNumberStepType;
}
export declare const inputNumberProps: {
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
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
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly formatter: PropType<(value: number | undefined) => string>;
    readonly parser: PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
};
export declare const inputNumberEmits: {
    'update:modelValue': (value: number | undefined) => boolean;
    change: (value: number | undefined) => boolean;
    pressEnter: (event: KeyboardEvent) => boolean;
    step: (value: number, info: InputNumberStepInfo) => boolean;
};
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>;
