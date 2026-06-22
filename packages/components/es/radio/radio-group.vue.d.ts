import { type RadioValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: import("vue").PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: import("vue").PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: RadioValue) => void;
    "update:modelValue": (value: RadioValue) => void;
    "update:value": (value: RadioValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<RadioValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: import("vue").PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: import("vue").PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>> & Readonly<{
    onChange?: ((value: RadioValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RadioValue) => any) | undefined;
    "onUpdate:value"?: ((value: RadioValue) => any) | undefined;
}>, {
    readonly block: boolean;
    readonly disabled: boolean;
    readonly value: RadioValue;
    readonly modelValue: RadioValue;
    readonly defaultValue: RadioValue;
    readonly options: import("./types").RadioRawOption[];
    readonly direction: import("./types").RadioGroupDirection;
    readonly buttonStyle: import("./types").RadioButtonStyle;
    readonly optionType: import("./types").RadioOptionType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
