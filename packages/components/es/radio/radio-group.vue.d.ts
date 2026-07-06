import { type PropType } from 'vue';
import { type RadioGroupDirection, type RadioValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").RadioRawOption[]>;
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
    readonly orientation: PropType<RadioGroupDirection>;
    readonly vertical: BooleanConstructor;
    readonly optionType: {
        readonly type: PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: RadioValue) => void;
    "update:modelValue": (value: RadioValue) => void;
    "update:value": (value: RadioValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").RadioRawOption[]>;
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
    readonly orientation: PropType<RadioGroupDirection>;
    readonly vertical: BooleanConstructor;
    readonly optionType: {
        readonly type: PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
}>> & Readonly<{
    onChange?: ((value: RadioValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RadioValue) => any) | undefined;
    "onUpdate:value"?: ((value: RadioValue) => any) | undefined;
}>, {
    readonly block: boolean;
    readonly vertical: boolean;
    readonly disabled: boolean;
    readonly direction: RadioGroupDirection;
    readonly value: RadioValue;
    readonly modelValue: RadioValue;
    readonly defaultValue: RadioValue;
    readonly options: import("./types").RadioRawOption[];
    readonly buttonStyle: import("./types").RadioButtonStyle;
    readonly optionType: import("./types").RadioOptionType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
