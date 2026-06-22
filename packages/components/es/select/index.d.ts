declare const Select: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
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
    change: (value: import("./types").SelectValue) => void;
    "update:modelValue": (value: import("./types").SelectValue) => void;
    clear: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
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
    onChange?: ((value: import("./types").SelectValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly allowClear: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Select;
