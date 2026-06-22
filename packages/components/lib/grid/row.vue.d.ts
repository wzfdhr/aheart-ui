import { type GridBreakpoint, type GridGutter } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly gutter: {
        readonly type: import("vue").PropType<number | Partial<Record<GridBreakpoint, number>> | [GridGutter, GridGutter]>;
        readonly default: 0;
    };
    readonly justify: import("vue").PropType<import("./types").RowJustify>;
    readonly align: import("vue").PropType<import("./types").RowAlign>;
    readonly wrap: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly gutter: {
        readonly type: import("vue").PropType<number | Partial<Record<GridBreakpoint, number>> | [GridGutter, GridGutter]>;
        readonly default: 0;
    };
    readonly justify: import("vue").PropType<import("./types").RowJustify>;
    readonly align: import("vue").PropType<import("./types").RowAlign>;
    readonly wrap: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>> & Readonly<{}>, {
    readonly wrap: boolean;
    readonly gutter: number | Partial<Record<GridBreakpoint, number>> | [GridGutter, GridGutter];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
