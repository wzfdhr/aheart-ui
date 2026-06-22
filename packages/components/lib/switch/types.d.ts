import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type SwitchRenderable = VNodeChild;
export type SwitchSemanticPart = 'root' | 'content' | 'indicator';
export type SwitchClassNames = Partial<Record<SwitchSemanticPart, string>>;
export type SwitchStyles = Partial<Record<SwitchSemanticPart, StyleValue>>;
export declare const switchProps: {
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly autoFocus: BooleanConstructor;
    readonly checkedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly unCheckedChildren: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<SwitchSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<SwitchSemanticPart, StyleValue>>>;
};
export declare const switchEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    'update:checked': (checked: boolean) => boolean;
    'update:value': (checked: boolean) => boolean;
    change: (checked: boolean, event: MouseEvent) => boolean;
    click: (checked: boolean, event: MouseEvent) => boolean;
};
export type SwitchProps = ExtractPropTypes<typeof switchProps>;
