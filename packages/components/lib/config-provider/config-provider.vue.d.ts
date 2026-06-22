declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly locale: import("vue").PropType<import("../config").AheartLocale>;
    readonly theme: import("vue").PropType<import("../config").AheartTheme>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly locale: import("vue").PropType<import("../config").AheartLocale>;
    readonly theme: import("vue").PropType<import("../config").AheartTheme>;
}>> & Readonly<{}>, {
    readonly disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
