declare const Textarea: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    readonly status: import("vue").PropType<import("./types").TextareaStatus>;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    "update:modelValue": (value: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
    readonly status: import("vue").PropType<import("./types").TextareaStatus>;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly autoSize: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly showCount: boolean;
    readonly rows: number;
    readonly autoSize: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Textarea;
