import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly text: PropType<VNodeChild>;
    readonly color: StringConstructor;
    readonly placement: {
        readonly type: PropType<import("./types").BadgeRibbonPlacement>;
        readonly default: "end";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").BadgeRibbonSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").BadgeRibbonSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly text: PropType<VNodeChild>;
    readonly color: StringConstructor;
    readonly placement: {
        readonly type: PropType<import("./types").BadgeRibbonPlacement>;
        readonly default: "end";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").BadgeRibbonSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").BadgeRibbonSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {
    readonly placement: import("./types").BadgeRibbonPlacement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
