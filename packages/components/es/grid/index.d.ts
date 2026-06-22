import type { Plugin } from 'vue';
declare const Row: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly gutter: {
            readonly type: import("vue").PropType<number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter]>;
            readonly default: 0;
        };
        readonly justify: import("vue").PropType<import("./types").RowJustify>;
        readonly align: import("vue").PropType<import("./types").RowAlign>;
        readonly wrap: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly wrap: boolean;
        readonly gutter: number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter];
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly gutter: {
            readonly type: import("vue").PropType<number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter]>;
            readonly default: 0;
        };
        readonly justify: import("vue").PropType<import("./types").RowJustify>;
        readonly align: import("vue").PropType<import("./types").RowAlign>;
        readonly wrap: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly wrap: boolean;
        readonly gutter: number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter];
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly gutter: {
        readonly type: import("vue").PropType<number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter]>;
        readonly default: 0;
    };
    readonly justify: import("vue").PropType<import("./types").RowJustify>;
    readonly align: import("vue").PropType<import("./types").RowAlign>;
    readonly wrap: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly wrap: boolean;
    readonly gutter: number | Partial<Record<import("./types").GridBreakpoint, number>> | [import("./types").GridGutter, import("./types").GridGutter];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Col: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly span: NumberConstructor;
        readonly offset: NumberConstructor;
        readonly order: NumberConstructor;
        readonly pull: NumberConstructor;
        readonly push: NumberConstructor;
        readonly flex: import("vue").PropType<string | number>;
        readonly xs: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly sm: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly md: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly lg: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly xl: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly xxl: import("vue").PropType<import("./types").ColResponsiveConfig>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly span: NumberConstructor;
        readonly offset: NumberConstructor;
        readonly order: NumberConstructor;
        readonly pull: NumberConstructor;
        readonly push: NumberConstructor;
        readonly flex: import("vue").PropType<string | number>;
        readonly xs: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly sm: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly md: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly lg: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly xl: import("vue").PropType<import("./types").ColResponsiveConfig>;
        readonly xxl: import("vue").PropType<import("./types").ColResponsiveConfig>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly span: NumberConstructor;
    readonly offset: NumberConstructor;
    readonly order: NumberConstructor;
    readonly pull: NumberConstructor;
    readonly push: NumberConstructor;
    readonly flex: import("vue").PropType<string | number>;
    readonly xs: import("vue").PropType<import("./types").ColResponsiveConfig>;
    readonly sm: import("vue").PropType<import("./types").ColResponsiveConfig>;
    readonly md: import("vue").PropType<import("./types").ColResponsiveConfig>;
    readonly lg: import("vue").PropType<import("./types").ColResponsiveConfig>;
    readonly xl: import("vue").PropType<import("./types").ColResponsiveConfig>;
    readonly xxl: import("vue").PropType<import("./types").ColResponsiveConfig>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Grid: Plugin;
export { Row, Col, Row as ARow, Col as ACol };
export type { ColProps, ColResponsiveConfig, ColSpanConfig, GridBreakpoint, GridGutter, GridResponsiveGutter, RowAlign, RowJustify, RowProps } from './types';
export default Grid;
