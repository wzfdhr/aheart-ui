import { type PropType, type VNodeChild } from 'vue';
import { type CardTab } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: PropType<"outlined" | "borderless">;
        readonly validator: (value: string) => boolean;
    };
    readonly type: {
        readonly type: PropType<"inner">;
        readonly validator: (value: string) => boolean;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly actions: PropType<import("./types").CardAction[]>;
    readonly tabList: PropType<CardTab[]>;
    readonly activeTabKey: StringConstructor;
    readonly defaultActiveTabKey: StringConstructor;
    readonly tabBarExtraContent: PropType<VNodeChild>;
    readonly tabProps: PropType<import("./types").CardTabProps>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly headStyle: PropType<import("vue").StyleValue>;
    readonly bodyStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").CardSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").CardSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:activeTabKey": (key: string) => void;
    tabChange: (key: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly title: StringConstructor;
    readonly extra: StringConstructor;
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly variant: {
        readonly type: PropType<"outlined" | "borderless">;
        readonly validator: (value: string) => boolean;
    };
    readonly type: {
        readonly type: PropType<"inner">;
        readonly validator: (value: string) => boolean;
    };
    readonly hoverable: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly actions: PropType<import("./types").CardAction[]>;
    readonly tabList: PropType<CardTab[]>;
    readonly activeTabKey: StringConstructor;
    readonly defaultActiveTabKey: StringConstructor;
    readonly tabBarExtraContent: PropType<VNodeChild>;
    readonly tabProps: PropType<import("./types").CardTabProps>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly headStyle: PropType<import("vue").StyleValue>;
    readonly bodyStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").CardSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").CardSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    "onUpdate:activeTabKey"?: ((key: string) => any) | undefined;
    onTabChange?: ((key: string) => any) | undefined;
}>, {
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly hoverable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, Partial<Record<string, (_: {}) => any>> & {
    cover?(_: {}): any;
    title?(_: {}): any;
    extra?(_: {}): any;
    tabBarExtraContent?(_: {}): any;
    default?(_: {}): any;
    actions?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
