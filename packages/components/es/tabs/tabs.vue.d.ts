import { type PropType } from 'vue';
import { type TabItem, type TabsExtraContent } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: PropType<import("./types").TabsType>;
        readonly default: "line";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly centered: BooleanConstructor;
    readonly tabPlacement: PropType<import("./types").TabsPlacement>;
    readonly tabPosition: PropType<import("./types").TabsPosition>;
    readonly tabBarExtraContent: PropType<TabsExtraContent>;
    readonly tabBarGutter: NumberConstructor;
    readonly tabBarStyle: PropType<import("vue").StyleValue>;
    readonly indicator: PropType<import("./types").TabsIndicatorConfig>;
    readonly animated: {
        readonly type: PropType<import("./types").TabsAnimated>;
        readonly default: false;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").TabsSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").TabsSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (key: string) => void;
    "update:activeKey": (key: string) => void;
    tabClick: (key: string, event: MouseEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: PropType<import("./types").TabsType>;
        readonly default: "line";
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly centered: BooleanConstructor;
    readonly tabPlacement: PropType<import("./types").TabsPlacement>;
    readonly tabPosition: PropType<import("./types").TabsPosition>;
    readonly tabBarExtraContent: PropType<TabsExtraContent>;
    readonly tabBarGutter: NumberConstructor;
    readonly tabBarStyle: PropType<import("vue").StyleValue>;
    readonly indicator: PropType<import("./types").TabsIndicatorConfig>;
    readonly animated: {
        readonly type: PropType<import("./types").TabsAnimated>;
        readonly default: false;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").TabsSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").TabsSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((key: string) => any) | undefined;
    "onUpdate:activeKey"?: ((key: string) => any) | undefined;
    onTabClick?: ((key: string, event: MouseEvent) => any) | undefined;
}>, {
    readonly type: import("./types").TabsType;
    readonly centered: boolean;
    readonly animated: import("./types").TabsAnimated;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, Partial<Record<string, (_: {}) => any>> & {
    extraLeft?(_: {}): any;
    extraRight?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
