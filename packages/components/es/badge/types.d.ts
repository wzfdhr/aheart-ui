import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type BadgeRenderable = VNodeChild;
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export type BadgeSize = 'default' | 'medium' | 'small';
export type BadgeOffset = [number, number];
export type BadgeSemanticPart = 'root' | 'indicator';
export type BadgeClassNames = Partial<Record<BadgeSemanticPart, string>>;
export type BadgeStyles = Partial<Record<BadgeSemanticPart, StyleValue>>;
export type BadgeRibbonPlacement = 'start' | 'end';
export type BadgeRibbonSemanticPart = 'root' | 'indicator' | 'content';
export type BadgeRibbonClassNames = Partial<Record<BadgeRibbonSemanticPart, string>>;
export type BadgeRibbonStyles = Partial<Record<BadgeRibbonSemanticPart, StyleValue>>;
export declare const badgeProps: {
    readonly count: PropType<VNodeChild>;
    readonly dot: BooleanConstructor;
    readonly status: PropType<BadgeStatus>;
    readonly text: PropType<VNodeChild>;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: PropType<BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: PropType<BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<BadgeSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<BadgeSemanticPart, StyleValue>>>;
};
export declare const badgeRibbonProps: {
    readonly text: PropType<VNodeChild>;
    readonly color: StringConstructor;
    readonly placement: {
        readonly type: PropType<BadgeRibbonPlacement>;
        readonly default: "end";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<BadgeRibbonSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<BadgeRibbonSemanticPart, StyleValue>>>;
};
export type BadgeProps = ExtractPropTypes<typeof badgeProps>;
export type BadgeRibbonProps = ExtractPropTypes<typeof badgeRibbonProps>;
