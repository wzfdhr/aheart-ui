import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export declare const EMPTY_PRESENTED_IMAGE_DEFAULT: "__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__";
export declare const EMPTY_PRESENTED_IMAGE_SIMPLE: "__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__";
export type EmptyRenderable = VNodeChild;
export type EmptyPresetImage = typeof EMPTY_PRESENTED_IMAGE_DEFAULT | typeof EMPTY_PRESENTED_IMAGE_SIMPLE;
export type EmptyImage = EmptyRenderable | EmptyPresetImage | false;
export type EmptyDescription = EmptyRenderable | false;
export type EmptySemanticPart = 'root' | 'image' | 'description' | 'footer';
export type EmptyClassNames = Partial<Record<EmptySemanticPart, string>>;
export type EmptyStyles = Partial<Record<EmptySemanticPart, StyleValue>>;
export declare const emptyProps: {
    readonly description: {
        readonly type: PropType<EmptyDescription>;
        readonly default: undefined;
    };
    readonly image: {
        readonly type: PropType<EmptyImage>;
        readonly default: undefined;
    };
    readonly imageStyle: PropType<StyleValue>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<EmptySemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<EmptySemanticPart, StyleValue>>>;
};
export type EmptyProps = ExtractPropTypes<typeof emptyProps>;
