import { type CheckboxValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<CheckboxValue[]>;
        readonly default: () => never[];
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: CheckboxValue[]) => void;
    "update:modelValue": (value: CheckboxValue[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<CheckboxValue[]>;
        readonly default: () => never[];
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
}>> & Readonly<{
    onChange?: ((value: CheckboxValue[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: CheckboxValue[]) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly modelValue: CheckboxValue[];
    readonly options: import("./types").CheckboxOption[];
    readonly direction: import("./types").CheckboxGroupDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
