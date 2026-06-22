declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").TextareaAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").TextareaShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").TextareaCountConfig>;
    readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, import("vue").StyleValue>>>;
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
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").TextareaAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").TextareaShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").TextareaCountConfig>;
    readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, import("vue").StyleValue>>>;
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
    readonly allowClear: import("./types").TextareaAllowClear;
    readonly showCount: import("./types").TextareaShowCount;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    clearIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
