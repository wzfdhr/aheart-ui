import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export declare const inputNumberProps: {
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
};
export declare const inputNumberEmits: {
    'update:modelValue': (value: number | undefined) => boolean;
    change: (value: number | undefined) => boolean;
};
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>;
