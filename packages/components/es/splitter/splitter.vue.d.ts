import { type PropType, type VNode } from 'vue';
import type { SplitterLayout, SplitterSize } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly sizes: PropType<SplitterSize[]>;
    readonly defaultSizes: {
        readonly type: PropType<SplitterSize[]>;
        readonly default: () => never[];
    };
    readonly layout: {
        readonly type: PropType<SplitterLayout>;
        readonly default: "horizontal";
    };
    readonly lazy: BooleanConstructor;
    readonly disabled: BooleanConstructor;
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    'update:sizes': (sizes: number[]) => boolean;
    resizeStart: (sizes: number[]) => boolean;
    resize: (sizes: number[]) => boolean;
    resizeEnd: (sizes: number[]) => boolean;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly sizes: PropType<SplitterSize[]>;
    readonly defaultSizes: {
        readonly type: PropType<SplitterSize[]>;
        readonly default: () => never[];
    };
    readonly layout: {
        readonly type: PropType<SplitterLayout>;
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
    readonly layout: SplitterLayout;
    readonly disabled: boolean;
    readonly defaultSizes: SplitterSize[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
