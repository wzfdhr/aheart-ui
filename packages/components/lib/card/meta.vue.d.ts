import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly avatar: PropType<VNodeChild>;
    readonly title: PropType<VNodeChild>;
    readonly description: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").CardMetaSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").CardMetaSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly avatar: PropType<VNodeChild>;
    readonly title: PropType<VNodeChild>;
    readonly description: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").CardMetaSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").CardMetaSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    avatar?(_: {}): any;
    title?(_: {}): any;
    description?(_: {}): any;
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
