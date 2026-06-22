import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export declare const switchProps: {
    readonly modelValue: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly checkedChildren: StringConstructor;
    readonly unCheckedChildren: StringConstructor;
};
export declare const switchEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    change: (checked: boolean) => boolean;
};
export type SwitchProps = ExtractPropTypes<typeof switchProps>;
