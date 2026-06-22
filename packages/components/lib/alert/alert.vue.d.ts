declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").AlertType>;
        readonly default: undefined;
    };
    readonly title: StringConstructor;
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: BooleanConstructor;
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: StringConstructor;
    readonly icon: StringConstructor;
    readonly closeIcon: StringConstructor;
    readonly role: {
        readonly type: StringConstructor;
        readonly default: "alert";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
    afterClose: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly type: {
        readonly type: import("vue").PropType<import("./types").AlertType>;
        readonly default: undefined;
    };
    readonly title: StringConstructor;
    readonly message: StringConstructor;
    readonly description: StringConstructor;
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly closable: BooleanConstructor;
    readonly banner: BooleanConstructor;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").AlertVariant>;
        readonly default: "outlined";
    };
    readonly action: StringConstructor;
    readonly icon: StringConstructor;
    readonly closeIcon: StringConstructor;
    readonly role: {
        readonly type: StringConstructor;
        readonly default: "alert";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").AlertSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
    onAfterClose?: (() => any) | undefined;
}>, {
    readonly type: import("./types").AlertType;
    readonly showIcon: boolean;
    readonly closable: boolean;
    readonly banner: boolean;
    readonly variant: import("./types").AlertVariant;
    readonly role: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    icon?(_: {}): any;
    default?(_: {}): any;
    action?(_: {}): any;
    closeIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
