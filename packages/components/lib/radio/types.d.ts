import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type RadioValue = string | number | boolean;
export type RadioGroupDirection = 'horizontal' | 'vertical';
export type RadioOptionType = 'default' | 'button';
export type RadioButtonStyle = 'outline' | 'solid';
export type RadioSemanticPart = 'root' | 'icon' | 'label';
export type RadioClassNames = Partial<Record<RadioSemanticPart, string>>;
export type RadioStyles = Partial<Record<RadioSemanticPart, StyleValue>>;
export type RadioRawOption = string | number | RadioOption;
export interface RadioOption {
    label: string;
    value: RadioValue;
    disabled?: boolean;
    className?: string;
    style?: StyleValue;
    title?: string;
}
export declare const radioProps: {
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<RadioSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<RadioSemanticPart, StyleValue>>>;
};
export declare const radioEmits: {
    'update:modelValue': (checked: boolean) => boolean;
    'update:checked': (checked: boolean) => boolean;
    change: (checked: boolean, event: Event) => boolean;
};
export declare const radioGroupProps: {
    readonly modelValue: {
        readonly type: PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: PropType<RadioRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: PropType<RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: PropType<RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: PropType<RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: PropType<AheartSize>;
    readonly block: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
};
export declare const radioGroupEmits: {
    'update:modelValue': (value: RadioValue) => boolean;
    'update:value': (value: RadioValue) => boolean;
    change: (value: RadioValue) => boolean;
};
export type RadioProps = ExtractPropTypes<typeof radioProps>;
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;
