declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly checkedChildren: StringConstructor;
    readonly unCheckedChildren: StringConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean) => void;
    "update:modelValue": (checked: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly checkedChildren: StringConstructor;
    readonly unCheckedChildren: StringConstructor;
}>> & Readonly<{
    onChange?: ((checked: boolean) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly loading: boolean;
    readonly modelValue: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
