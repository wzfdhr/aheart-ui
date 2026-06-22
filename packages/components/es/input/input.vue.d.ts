declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
    readonly addonBefore: StringConstructor;
    readonly addonAfter: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").InputShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
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
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
    readonly addonBefore: StringConstructor;
    readonly addonAfter: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").InputShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly type: string;
    readonly variant: import("./types").InputVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly readOnly: boolean;
    readonly allowClear: import("./types").InputAllowClear;
    readonly showCount: import("./types").InputShowCount;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    clearIcon?(_: {}): any;
    suffix?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
