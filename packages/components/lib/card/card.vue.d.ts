declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: import("vue").PropType<"outlined" | "borderless">;
        readonly validator: (value: string) => boolean;
    };
    readonly type: {
        readonly type: import("vue").PropType<"inner">;
        readonly validator: (value: string) => boolean;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly actions: import("vue").PropType<import("./types").CardAction[]>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly headStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly bodyStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CardSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: import("vue").PropType<"outlined" | "borderless">;
        readonly validator: (value: string) => boolean;
    };
    readonly type: {
        readonly type: import("vue").PropType<"inner">;
        readonly validator: (value: string) => boolean;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly actions: import("vue").PropType<import("./types").CardAction[]>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly headStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly bodyStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CardSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly hoverable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    cover?(_: {}): any;
    title?(_: {}): any;
    extra?(_: {}): any;
    default?(_: {}): any;
    actions?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
