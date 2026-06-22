import { type PropType } from 'vue';
import { type SkeletonAvatarConfig, type SkeletonButtonConfig, type SkeletonImageConfig, type SkeletonInputConfig, type SkeletonNodeConfig, type SkeletonParagraphConfig, type SkeletonTitleConfig } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SkeletonSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SkeletonSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SkeletonSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SkeletonSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {
    readonly title: boolean | SkeletonTitleConfig;
    readonly classNames: Partial<Record<import("./types").SkeletonSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SkeletonSemanticPart, import("vue").StyleValue>>;
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
