import card from './card.vue';
import { type SFCWithInstall } from '../utils/install';
export declare const CardMeta: SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly avatar: import("vue").PropType<import("vue").VNodeChild>;
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly description: import("vue").PropType<import("vue").VNodeChild>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly avatar: import("vue").PropType<import("vue").VNodeChild>;
        readonly title: import("vue").PropType<import("vue").VNodeChild>;
        readonly description: import("vue").PropType<import("vue").VNodeChild>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly avatar: import("vue").PropType<import("vue").VNodeChild>;
    readonly title: import("vue").PropType<import("vue").VNodeChild>;
    readonly description: import("vue").PropType<import("vue").VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CardMetaSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        avatar?(_: {}): any;
        title?(_: {}): any;
        description?(_: {}): any;
        default?(_: {}): any;
    };
})>;
export declare const CardGrid: SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly hoverable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly hoverable: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly hoverable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly hoverable: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly hoverable: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CardGridSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly hoverable: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
type CardComponent = SFCWithInstall<typeof card> & {
    Meta: typeof CardMeta;
    Grid: typeof CardGrid;
};
declare const Card: CardComponent;
export { CardGrid as ACardGrid, CardMeta as ACardMeta };
export type { CardAction, CardClassNames, CardGridClassNames, CardGridProps, CardGridSemanticPart, CardGridStyles, CardMetaClassNames, CardMetaProps, CardMetaSemanticPart, CardMetaStyles, CardProps, CardSemanticPart, CardStyles, CardType, CardVariant } from './types';
export default Card;
