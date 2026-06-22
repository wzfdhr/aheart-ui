import { type RadioOption, type RadioValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<RadioValue>;
    readonly options: {
        readonly type: import("vue").PropType<RadioOption[]>;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: RadioValue) => void;
    "update:modelValue": (value: RadioValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<RadioValue>;
    readonly options: {
        readonly type: import("vue").PropType<RadioOption[]>;
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
}>> & Readonly<{
    onChange?: ((value: RadioValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RadioValue) => any) | undefined;
}>, {
    readonly block: boolean;
    readonly disabled: boolean;
    readonly options: RadioOption[];
    readonly direction: import("./types").RadioGroupDirection;
    readonly optionType: import("./types").RadioOptionType;
    readonly buttonStyle: import("./types").RadioButtonStyle;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
