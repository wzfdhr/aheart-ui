declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly level: {
        readonly type: import("vue").PropType<import("./types").TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly level: {
        readonly type: import("vue").PropType<import("./types").TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
}>> & Readonly<{}>, {
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
