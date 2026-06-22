declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly code: BooleanConstructor;
    readonly keyboard: BooleanConstructor;
    readonly delete: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly code: BooleanConstructor;
    readonly keyboard: BooleanConstructor;
    readonly delete: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {
    readonly italic: boolean;
    readonly underline: boolean;
    readonly disabled: boolean;
    readonly code: boolean;
    readonly mark: boolean;
    readonly strong: boolean;
    readonly delete: boolean;
    readonly keyboard: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
