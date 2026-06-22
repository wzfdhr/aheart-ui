declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly rows: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").TextareaStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").TextareaVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    clear: () => void;
    "update:modelValue": (value: string) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly rows: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").TextareaStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").TextareaVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly variant: import("./types").TextareaVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly rows: number;
    readonly readOnly: boolean;
    readonly allowClear: boolean;
    readonly showCount: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
