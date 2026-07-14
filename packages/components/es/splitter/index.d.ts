declare const Splitter: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly sizes: import("vue").PropType<import("./types").SplitterSize[]>;
    readonly defaultSizes: {
        readonly type: import("vue").PropType<import("./types").SplitterSize[]>;
        readonly default: () => never[];
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").SplitterLayout>;
        readonly default: "horizontal";
    };
    readonly lazy: BooleanConstructor;
    readonly disabled: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:sizes': (sizes: number[]) => boolean;
    resizeStart: (sizes: number[]) => boolean;
    resize: (sizes: number[]) => boolean;
    resizeEnd: (sizes: number[]) => boolean;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly sizes: import("vue").PropType<import("./types").SplitterSize[]>;
    readonly defaultSizes: {
        readonly type: import("vue").PropType<import("./types").SplitterSize[]>;
        readonly default: () => never[];
    };
    readonly layout: {
        readonly type: import("vue").PropType<import("./types").SplitterLayout>;
        readonly default: "horizontal";
    };
    readonly lazy: BooleanConstructor;
    readonly disabled: BooleanConstructor;
}>> & Readonly<{
    onResize?: ((sizes: number[]) => any) | undefined;
    "onUpdate:sizes"?: ((sizes: number[]) => any) | undefined;
    onResizeStart?: ((sizes: number[]) => any) | undefined;
    onResizeEnd?: ((sizes: number[]) => any) | undefined;
}>, {
    readonly lazy: boolean;
    readonly layout: import("./types").SplitterLayout;
    readonly disabled: boolean;
    readonly defaultSizes: import("./types").SplitterSize[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
declare const SplitterPanel: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        min: import("vue").PropType<number | `${number}%` | undefined>;
        max: import("vue").PropType<number | `${number}%` | undefined>;
        collapsible: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        collapsible: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        min: import("vue").PropType<number | `${number}%` | undefined>;
        max: import("vue").PropType<number | `${number}%` | undefined>;
        collapsible: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        collapsible: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    min: import("vue").PropType<number | `${number}%` | undefined>;
    max: import("vue").PropType<number | `${number}%` | undefined>;
    collapsible: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    collapsible: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export { SplitterPanel };
export type { SplitterLayout, SplitterPanelConstraint, SplitterProps, SplitterSize } from './types';
export default Splitter;
