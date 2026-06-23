declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly level: {
        readonly type: import("vue").PropType<import("./types").TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly disabled: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
    readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly level: {
        readonly type: import("vue").PropType<import("./types").TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly disabled: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
    readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {
    readonly disabled: boolean;
    readonly mark: boolean;
    readonly level: import("./types").TitleLevel;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
