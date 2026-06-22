declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    "update:modelValue": (value: string) => void;
    clear: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    readonly type: string;
    readonly disabled: boolean;
    readonly allowClear: boolean;
    readonly showCount: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    suffix?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
