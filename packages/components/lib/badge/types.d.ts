import type { ExtractPropTypes, PropType } from 'vue';
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning';
export declare const badgeProps: {
    readonly count: PropType<string | number>;
    readonly dot: BooleanConstructor;
    readonly status: PropType<BadgeStatus>;
    readonly text: StringConstructor;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
};
export type BadgeProps = ExtractPropTypes<typeof badgeProps>;
