import { type SelectValue } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<SelectValue>;
    readonly options: import("vue").PropType<import("./types").SelectOption[]>;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").SelectStatus>;
    readonly allowClear: BooleanConstructor;
    readonly mode: import("vue").PropType<"multiple">;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: SelectValue) => void;
    "update:modelValue": (value: SelectValue) => void;
    clear: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<SelectValue>;
    readonly options: import("vue").PropType<import("./types").SelectOption[]>;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").SelectStatus>;
    readonly allowClear: BooleanConstructor;
    readonly mode: import("vue").PropType<"multiple">;
}>> & Readonly<{
    onChange?: ((value: SelectValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: SelectValue) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly allowClear: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
