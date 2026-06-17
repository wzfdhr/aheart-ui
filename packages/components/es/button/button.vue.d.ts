declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    readonly type: {
        readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"large" | "normal" | "small" | "mini">;
        readonly default: "normal";
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<"default" | "primary" | "success" | "warning" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<"large" | "normal" | "small" | "mini">;
        readonly default: "normal";
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: import("vue").PropType<"button" | "submit" | "reset">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly disabled: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly block: BooleanConstructor;
    readonly round: BooleanConstructor;
}>>, {
    readonly type: "default" | "primary" | "success" | "warning" | "danger";
    readonly size: "large" | "normal" | "small" | "mini";
    readonly nativeType: "button" | "submit" | "reset";
    readonly disabled: boolean;
    readonly loading: boolean;
    readonly block: boolean;
    readonly round: boolean;
}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
