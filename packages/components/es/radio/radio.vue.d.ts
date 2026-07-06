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
    readonly value: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, import("vue").StyleValue>>>;
}>, {
    focus: () => void;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean, event: Event) => void;
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
    readonly value: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((checked: boolean, event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly value: import("./types").RadioValue;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly autoFocus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
