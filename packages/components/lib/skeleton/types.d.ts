import type { ExtractPropTypes, PropType } from 'vue';
export type SkeletonAvatarShape = 'circle' | 'square';
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
    readonly round: BooleanConstructor;
};
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>;
