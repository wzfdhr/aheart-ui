declare const Skeleton: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly loading: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly active: BooleanConstructor;
        readonly avatar: import("vue").PropType<boolean | import("./types").SkeletonAvatarConfig>;
        readonly title: {
            readonly type: import("vue").PropType<boolean | import("./types").SkeletonTitleConfig>;
            readonly default: true;
        };
        readonly paragraph: {
            readonly type: import("vue").PropType<boolean | import("./types").SkeletonParagraphConfig>;
            readonly default: true;
        };
        readonly round: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly title: boolean | import("./types").SkeletonTitleConfig;
        readonly round: boolean;
        readonly loading: boolean;
        readonly active: boolean;
        readonly paragraph: boolean | import("./types").SkeletonParagraphConfig;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly loading: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly active: BooleanConstructor;
        readonly avatar: import("vue").PropType<boolean | import("./types").SkeletonAvatarConfig>;
        readonly title: {
            readonly type: import("vue").PropType<boolean | import("./types").SkeletonTitleConfig>;
            readonly default: true;
        };
        readonly paragraph: {
            readonly type: import("vue").PropType<boolean | import("./types").SkeletonParagraphConfig>;
            readonly default: true;
        };
        readonly round: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly title: boolean | import("./types").SkeletonTitleConfig;
        readonly round: boolean;
        readonly loading: boolean;
        readonly active: boolean;
        readonly paragraph: boolean | import("./types").SkeletonParagraphConfig;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly loading: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly active: BooleanConstructor;
    readonly avatar: import("vue").PropType<boolean | import("./types").SkeletonAvatarConfig>;
    readonly title: {
        readonly type: import("vue").PropType<boolean | import("./types").SkeletonTitleConfig>;
        readonly default: true;
    };
    readonly paragraph: {
        readonly type: import("vue").PropType<boolean | import("./types").SkeletonParagraphConfig>;
        readonly default: true;
    };
    readonly round: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly title: boolean | import("./types").SkeletonTitleConfig;
    readonly round: boolean;
    readonly loading: boolean;
    readonly active: boolean;
    readonly paragraph: boolean | import("./types").SkeletonParagraphConfig;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Skeleton;
export type { SkeletonAvatarConfig, SkeletonAvatarShape, SkeletonParagraphConfig, SkeletonProps, SkeletonTitleConfig } from './types';
