declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly description: {
        readonly type: import("vue").PropType<import("./types").EmptyDescription>;
        readonly default: undefined;
    };
    readonly image: {
        readonly type: import("vue").PropType<import("./types").EmptyImage>;
        readonly default: undefined;
    };
    readonly imageStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly description: {
        readonly type: import("vue").PropType<import("./types").EmptyDescription>;
        readonly default: undefined;
    };
    readonly image: {
        readonly type: import("vue").PropType<import("./types").EmptyImage>;
        readonly default: undefined;
    };
    readonly imageStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").EmptySemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {
    readonly description: import("./types").EmptyDescription;
    readonly image: import("./types").EmptyImage;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    image?(_: {}): any;
    description?(_: {}): any;
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
