import { type SkeletonAvatarConfig, type SkeletonParagraphConfig, type SkeletonTitleConfig } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly loading: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly active: BooleanConstructor;
    readonly avatar: import("vue").PropType<boolean | SkeletonAvatarConfig>;
    readonly title: {
        readonly type: import("vue").PropType<boolean | SkeletonTitleConfig>;
        readonly default: true;
    };
    readonly paragraph: {
        readonly type: import("vue").PropType<boolean | SkeletonParagraphConfig>;
        readonly default: true;
    };
    readonly round: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly loading: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly active: BooleanConstructor;
    readonly avatar: import("vue").PropType<boolean | SkeletonAvatarConfig>;
    readonly title: {
        readonly type: import("vue").PropType<boolean | SkeletonTitleConfig>;
        readonly default: true;
    };
    readonly paragraph: {
        readonly type: import("vue").PropType<boolean | SkeletonParagraphConfig>;
        readonly default: true;
    };
    readonly round: BooleanConstructor;
}>> & Readonly<{}>, {
    readonly title: boolean | SkeletonTitleConfig;
    readonly round: boolean;
    readonly active: boolean;
    readonly loading: boolean;
    readonly paragraph: boolean | SkeletonParagraphConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
