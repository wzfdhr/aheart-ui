declare const InputNumber: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputNumberStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly formatter: import("vue").PropType<(value: number | undefined) => string>;
    readonly parser: import("vue").PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: number | undefined) => void;
    step: (value: number, info: import("./types").InputNumberStepInfo) => void;
    "update:modelValue": (value: number | undefined) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputNumberStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly formatter: import("vue").PropType<(value: number | undefined) => string>;
    readonly parser: import("vue").PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>> & Readonly<{
    onChange?: ((value: number | undefined) => any) | undefined;
    onStep?: ((value: number, info: import("./types").InputNumberStepInfo) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly variant: import("./types").InputNumberVariant;
    readonly disabled: boolean;
    readonly step: number;
    readonly bordered: boolean;
    readonly keyboard: boolean;
    readonly readOnly: boolean;
    readonly controls: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default InputNumber;
