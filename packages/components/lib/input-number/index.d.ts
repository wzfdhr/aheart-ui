declare const InputNumber: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: number | undefined) => void;
    "update:modelValue": (value: number | undefined) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>> & Readonly<{
    onChange?: ((value: number | undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
}>, {
    readonly step: number;
    readonly disabled: boolean;
    readonly controls: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default InputNumber;
