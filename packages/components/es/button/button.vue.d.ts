declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"large" | "middle" | "small" | "normal" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"large" | "middle" | "small" | "normal" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly disabled: boolean;
    readonly type: "default" | "primary" | "success" | "warning" | "danger";
    readonly nativeType: "button" | "submit" | "reset";
    readonly loading: boolean;
    readonly block: boolean;
    readonly round: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
