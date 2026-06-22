declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").AlertType>;
        readonly default: "info";
    };
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: BooleanConstructor;
    readonly closable: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").AlertType>;
        readonly default: "info";
    };
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: BooleanConstructor;
    readonly closable: BooleanConstructor;
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
}>, {
    readonly type: import("./types").AlertType;
    readonly showIcon: boolean;
    readonly closable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
