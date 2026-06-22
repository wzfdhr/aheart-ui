import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export type BadgeSize = 'default' | 'medium' | 'small';
export type BadgeOffset = [number, number];
export type BadgeSemanticPart = 'root' | 'indicator';
export type BadgeClassNames = Partial<Record<BadgeSemanticPart, string>>;
export type BadgeStyles = Partial<Record<BadgeSemanticPart, StyleValue>>;
export declare const badgeProps: {
    readonly count: PropType<string | number>;
    readonly dot: BooleanConstructor;
    readonly status: PropType<BadgeStatus>;
    readonly text: StringConstructor;
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
    readonly classNames: PropType<Partial<Record<BadgeSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<BadgeSemanticPart, StyleValue>>>;
};
export type BadgeProps = ExtractPropTypes<typeof badgeProps>;
