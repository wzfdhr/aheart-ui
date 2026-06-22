import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type SkeletonAvatarShape = 'circle' | 'square';
export type SkeletonButtonShape = 'default' | 'round' | 'circle';
export type SkeletonButtonSize = 'small' | 'default' | 'large';
export type SkeletonInputSize = 'small' | 'default' | 'large';
export type SkeletonSemanticPart = 'root' | 'avatar' | 'content' | 'title' | 'paragraph' | 'paragraphRow' | 'button' | 'input' | 'image' | 'node';
export type SkeletonClassNames = Partial<Record<SkeletonSemanticPart, string>>;
export type SkeletonStyles = Partial<Record<SkeletonSemanticPart, StyleValue>>;
export interface SkeletonAvatarConfig {
    size?: number | string;
    shape?: SkeletonAvatarShape;
}
export interface SkeletonTitleConfig {
    width?: number | string;
}
export interface SkeletonParagraphConfig {
    rows?: number;
    width?: number | string | Array<number | string>;
}
export interface SkeletonButtonConfig {
    active?: boolean;
    block?: boolean;
    shape?: SkeletonButtonShape;
    size?: SkeletonButtonSize;
    width?: number | string;
}
export interface SkeletonInputConfig {
    active?: boolean;
    block?: boolean;
    size?: SkeletonInputSize;
    width?: number | string;
}
export interface SkeletonImageConfig {
    active?: boolean;
    width?: number | string;
    height?: number | string;
}
export interface SkeletonNodeConfig {
    active?: boolean;
    width?: number | string;
    height?: number | string;
    children?: VNodeChild;
}
export declare const skeletonProps: {
    readonly loading: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly active: BooleanConstructor;
    readonly avatar: PropType<boolean | SkeletonAvatarConfig>;
    readonly title: {
        readonly type: PropType<boolean | SkeletonTitleConfig>;
        readonly default: true;
    };
    readonly paragraph: {
        readonly type: PropType<boolean | SkeletonParagraphConfig>;
        readonly default: true;
    };
    readonly button: PropType<boolean | SkeletonButtonConfig>;
    readonly input: PropType<boolean | SkeletonInputConfig>;
    readonly image: PropType<boolean | SkeletonImageConfig>;
    readonly node: PropType<boolean | SkeletonNodeConfig>;
    readonly round: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<SkeletonSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<SkeletonSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>;
