import { type PropType, type VNodeChild } from 'vue';
import { type DescriptionItem } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: PropType<VNodeChild>;
    readonly extra: PropType<VNodeChild>;
    readonly items: PropType<DescriptionItem[]>;
    readonly bordered: BooleanConstructor;
    readonly column: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly layout: {
        readonly type: PropType<import("./types").DescriptionsLayout>;
        readonly default: "horizontal";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly labelStyle: PropType<import("vue").StyleValue>;
    readonly contentStyle: PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").DescriptionsSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: PropType<VNodeChild>;
    readonly extra: PropType<VNodeChild>;
    readonly items: PropType<DescriptionItem[]>;
    readonly bordered: BooleanConstructor;
    readonly column: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly layout: {
        readonly type: PropType<import("./types").DescriptionsLayout>;
        readonly default: "horizontal";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly colon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly labelStyle: PropType<import("vue").StyleValue>;
    readonly contentStyle: PropType<import("vue").StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").DescriptionsSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {
    readonly classNames: Partial<Record<import("./types").DescriptionsSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").DescriptionsSemanticPart, import("vue").StyleValue>>;
    readonly column: number;
    readonly layout: import("./types").DescriptionsLayout;
    readonly bordered: boolean;
    readonly colon: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    title?(_: {}): any;
    extra?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
