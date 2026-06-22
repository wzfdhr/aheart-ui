import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export interface TabItem {
    key: string;
    label: string;
    icon?: string;
    children?: string;
    disabled?: boolean;
}
export type TabsType = 'line' | 'card';
export type TabsPlacement = 'top' | 'bottom' | 'start' | 'end';
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right';
export type TabsIndicatorAlign = 'start' | 'center' | 'end';
export interface TabsExtraContentConfig {
    left?: string;
    right?: string;
}
export interface TabsIndicatorConfig {
    size?: number;
    align?: TabsIndicatorAlign;
}
export interface TabsAnimatedConfig {
    inkBar?: boolean;
    tabPane?: boolean;
}
export type TabsExtraContent = string | TabsExtraContentConfig;
export type TabsAnimated = boolean | TabsAnimatedConfig;
export type TabsSemanticPart = 'root' | 'nav' | 'navList' | 'tab' | 'activeTab' | 'tabIcon' | 'tabLabel' | 'panel' | 'extra' | 'extraLeft' | 'extraRight';
export type TabsClassNames = Partial<Record<TabsSemanticPart, string>>;
export type TabsStyles = Partial<Record<TabsSemanticPart, StyleValue>>;
export declare const tabsProps: {
    readonly items: PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: PropType<TabsType>;
        readonly default: "line";
    };
    readonly size: PropType<AheartSize>;
    readonly centered: BooleanConstructor;
    readonly tabPlacement: PropType<TabsPlacement>;
    readonly tabPosition: PropType<TabsPosition>;
    readonly tabBarExtraContent: PropType<TabsExtraContent>;
    readonly tabBarGutter: NumberConstructor;
    readonly tabBarStyle: PropType<StyleValue>;
    readonly indicator: PropType<TabsIndicatorConfig>;
    readonly animated: {
        readonly type: PropType<TabsAnimated>;
        readonly default: false;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<TabsSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<TabsSemanticPart, StyleValue>>>;
};
export declare const tabsEmits: {
    'update:activeKey': (key: string) => boolean;
    change: (key: string) => boolean;
    tabClick: (key: string, event: MouseEvent) => boolean;
};
export type TabsProps = ExtractPropTypes<typeof tabsProps>;
