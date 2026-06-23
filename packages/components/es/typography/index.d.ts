declare const Typography: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Title: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly level: {
            readonly type: import("vue").PropType<import("./types").TitleLevel>;
            readonly default: 1;
            readonly validator: (value: number) => boolean;
        };
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly disabled: BooleanConstructor;
        readonly mark: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly mark: boolean;
        readonly level: import("./types").TitleLevel;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly level: {
            readonly type: import("vue").PropType<import("./types").TitleLevel>;
            readonly default: 1;
            readonly validator: (value: number) => boolean;
        };
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly disabled: BooleanConstructor;
        readonly mark: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly mark: boolean;
        readonly level: import("./types").TitleLevel;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly level: {
        readonly type: import("vue").PropType<import("./types").TitleLevel>;
        readonly default: 1;
        readonly validator: (value: number) => boolean;
    };
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly disabled: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
    readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly disabled: boolean;
    readonly mark: boolean;
    readonly level: import("./types").TitleLevel;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Text: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly strong: BooleanConstructor;
        readonly italic: BooleanConstructor;
        readonly code: BooleanConstructor;
        readonly keyboard: BooleanConstructor;
        readonly delete: BooleanConstructor;
        readonly underline: BooleanConstructor;
        readonly mark: BooleanConstructor;
        readonly disabled: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly italic: boolean;
        readonly underline: boolean;
        readonly disabled: boolean;
        readonly code: boolean;
        readonly mark: boolean;
        readonly strong: boolean;
        readonly delete: boolean;
        readonly keyboard: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly strong: BooleanConstructor;
        readonly italic: BooleanConstructor;
        readonly code: BooleanConstructor;
        readonly keyboard: BooleanConstructor;
        readonly delete: BooleanConstructor;
        readonly underline: BooleanConstructor;
        readonly mark: BooleanConstructor;
        readonly disabled: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly italic: boolean;
        readonly underline: boolean;
        readonly disabled: boolean;
        readonly code: boolean;
        readonly mark: boolean;
        readonly strong: boolean;
        readonly delete: boolean;
        readonly keyboard: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly code: BooleanConstructor;
    readonly keyboard: BooleanConstructor;
    readonly delete: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
    readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly italic: boolean;
    readonly underline: boolean;
    readonly disabled: boolean;
    readonly code: boolean;
    readonly mark: boolean;
    readonly strong: boolean;
    readonly delete: boolean;
    readonly keyboard: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Paragraph: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly strong: BooleanConstructor;
        readonly italic: BooleanConstructor;
        readonly ellipsis: import("vue").PropType<import("./types").TypographyEllipsis>;
        readonly mark: BooleanConstructor;
        readonly disabled: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly italic: boolean;
        readonly disabled: boolean;
        readonly mark: boolean;
        readonly strong: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly type: import("vue").PropType<import("./types").TypographyType>;
        readonly strong: BooleanConstructor;
        readonly italic: BooleanConstructor;
        readonly ellipsis: import("vue").PropType<import("./types").TypographyEllipsis>;
        readonly mark: BooleanConstructor;
        readonly disabled: BooleanConstructor;
        readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
        readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly italic: boolean;
        readonly disabled: boolean;
        readonly mark: boolean;
        readonly strong: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly ellipsis: import("vue").PropType<import("./types").TypographyEllipsis>;
    readonly mark: BooleanConstructor;
    readonly disabled: BooleanConstructor;
    readonly copyable: import("vue").PropType<import("./types").TypographyCopyable>;
    readonly actions: import("vue").PropType<import("./types").TypographyActionsConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly italic: boolean;
    readonly disabled: boolean;
    readonly mark: boolean;
    readonly strong: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
declare const Link: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly disabled: BooleanConstructor;
        readonly underline: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly underline: boolean;
        readonly disabled: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly href: StringConstructor;
        readonly target: StringConstructor;
        readonly disabled: BooleanConstructor;
        readonly underline: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
        readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly underline: boolean;
        readonly disabled: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly disabled: BooleanConstructor;
    readonly underline: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").TypographyClassNames>;
    readonly styles: import("vue").PropType<import("./types").TypographyStyles>;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly underline: boolean;
    readonly disabled: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export { Title, Text, Paragraph, Link };
export default Typography;
export type { LinkProps, ParagraphProps, TextProps, TitleProps, TypographyActionPlacement, TypographyActionsConfig, TypographyClassNames, TypographyCopyable, TypographyCopyableConfig, TypographyCopyableIcon, TypographyCopyableTooltip, TypographyEllipsis, TypographyEllipsisConfig, TypographyProps, TypographySemanticClassNames, TypographySemanticInfo, TypographySemanticPart, TypographySemanticStyles, TypographyStyles, TypographyType } from './types';
