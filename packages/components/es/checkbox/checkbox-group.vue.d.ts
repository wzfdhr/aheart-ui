import { type PropType } from 'vue';
import { type CheckboxValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: PropType<import("./types").CheckboxRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: CheckboxValue[]) => void;
    "update:modelValue": (value: CheckboxValue[]) => void;
    "update:value": (value: CheckboxValue[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: PropType<CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: PropType<import("./types").CheckboxRawOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
}>> & Readonly<{
    onChange?: ((value: CheckboxValue[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: CheckboxValue[]) => any) | undefined;
    "onUpdate:value"?: ((value: CheckboxValue[]) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly direction: import("./types").CheckboxGroupDirection;
    readonly value: CheckboxValue[];
    readonly options: import("./types").CheckboxRawOption[];
    readonly modelValue: CheckboxValue[];
    readonly defaultValue: CheckboxValue[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
