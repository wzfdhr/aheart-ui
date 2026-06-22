import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
export type EmptyImage = string | false;
export type EmptyDescription = string | false;
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
