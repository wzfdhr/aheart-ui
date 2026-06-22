import type { ExtractPropTypes, PropType } from 'vue';
export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type GridGutter = number | Partial<Record<GridBreakpoint, number>>;
export type GridResponsiveGutter = Partial<Record<GridBreakpoint, number>>;
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';
export interface ColSpanConfig {
    span?: number;
    offset?: number;
    order?: number;
    pull?: number;
    push?: number;
    flex?: string | number;
}
export type ColResponsiveConfig = number | ColSpanConfig;
export declare const rowProps: {
    readonly gutter: {
        readonly type: PropType<number | Partial<Record<GridBreakpoint, number>> | [GridGutter, GridGutter]>;
        readonly default: 0;
    };
    readonly justify: PropType<RowJustify>;
    readonly align: PropType<RowAlign>;
    readonly wrap: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
};
export declare const colProps: {
    readonly span: NumberConstructor;
    readonly offset: NumberConstructor;
    readonly order: NumberConstructor;
    readonly pull: NumberConstructor;
    readonly push: NumberConstructor;
    readonly flex: PropType<string | number>;
    readonly xs: PropType<ColResponsiveConfig>;
    readonly sm: PropType<ColResponsiveConfig>;
    readonly md: PropType<ColResponsiveConfig>;
    readonly lg: PropType<ColResponsiveConfig>;
    readonly xl: PropType<ColResponsiveConfig>;
    readonly xxl: PropType<ColResponsiveConfig>;
};
export type RowProps = ExtractPropTypes<typeof rowProps>;
export type ColProps = ExtractPropTypes<typeof colProps>;
