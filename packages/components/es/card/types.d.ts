import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export declare const cardVariants: readonly ["outlined", "borderless"];
export declare const cardTypes: readonly ["inner"];
export type CardVariant = (typeof cardVariants)[number];
export type CardType = (typeof cardTypes)[number];
export type CardAction = string | number;
export interface CardTab {
    key: string;
    tab: VNodeChild;
    disabled?: boolean;
    children?: VNodeChild;
}
export type CardTabSemanticPart = 'root' | 'list' | 'tab' | 'activeTab' | 'tabLabel' | 'extra';
export type CardTabClassNames = Partial<Record<CardTabSemanticPart, string>>;
export type CardTabStyles = Partial<Record<CardTabSemanticPart, StyleValue>>;
export interface CardTabProps {
    className?: string;
    rootClassName?: string;
    style?: StyleValue;
    tabBarGutter?: number;
    classNames?: CardTabClassNames;
    styles?: CardTabStyles;
}
export type CardSemanticPart = 'root' | 'header' | 'title' | 'extra' | 'cover' | 'body' | 'actions';
export type CardClassNames = Partial<Record<CardSemanticPart, string>>;
export type CardStyles = Partial<Record<CardSemanticPart, StyleValue>>;
export type CardMetaSemanticPart = 'root' | 'section' | 'avatar' | 'title' | 'description';
export type CardMetaClassNames = Partial<Record<CardMetaSemanticPart, string>>;
export type CardMetaStyles = Partial<Record<CardMetaSemanticPart, StyleValue>>;
export type CardGridSemanticPart = 'root' | 'content';
export type CardGridClassNames = Partial<Record<CardGridSemanticPart, string>>;
export type CardGridStyles = Partial<Record<CardGridSemanticPart, StyleValue>>;
export declare const cardProps: {
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
    readonly size: PropType<AheartSize>;
    readonly actions: PropType<CardAction[]>;
    readonly tabList: PropType<CardTab[]>;
    readonly activeTabKey: StringConstructor;
    readonly defaultActiveTabKey: StringConstructor;
    readonly tabBarExtraContent: PropType<VNodeChild>;
    readonly tabProps: PropType<CardTabProps>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly headStyle: PropType<StyleValue>;
    readonly bodyStyle: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<CardSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<CardSemanticPart, StyleValue>>>;
};
export declare const cardEmits: {
    'update:activeTabKey': (key: string) => boolean;
    tabChange: (key: string) => boolean;
};
export declare const cardMetaProps: {
    readonly avatar: PropType<VNodeChild>;
    readonly title: PropType<VNodeChild>;
    readonly description: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<CardMetaSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<CardMetaSemanticPart, StyleValue>>>;
};
export declare const cardGridProps: {
    readonly hoverable: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<CardGridSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<CardGridSemanticPart, StyleValue>>>;
};
export type CardProps = ExtractPropTypes<typeof cardProps>;
export type CardMetaProps = ExtractPropTypes<typeof cardMetaProps>;
export type CardGridProps = ExtractPropTypes<typeof cardGridProps>;
