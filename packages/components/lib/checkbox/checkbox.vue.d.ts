declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: import("vue").PropType<import("./types").CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, import("vue").StyleValue>>>;
}>, {
    focus: () => void;
    blur: () => void;
    nativeElement: import("vue").Ref<HTMLLabelElement | undefined, HTMLLabelElement | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => void;
    change: (checked: boolean, event: Event) => void;
    focus: (event: FocusEvent) => void;
    "update:modelValue": (checked: boolean) => void;
    "update:checked": (checked: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: import("vue").PropType<import("./types").CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((checked: boolean, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly autoFocus: boolean;
    readonly indeterminate: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
