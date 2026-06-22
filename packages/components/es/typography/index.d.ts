declare const Typography: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
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
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
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
    }>> & Readonly<{}>, {}, {}, {}, {}, {
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
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        readonly disabled: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly code: boolean;
        readonly strong: boolean;
        readonly delete: boolean;
        readonly italic: boolean;
        readonly keyboard: boolean;
        readonly underline: boolean;
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
        readonly disabled: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly code: boolean;
        readonly strong: boolean;
        readonly delete: boolean;
        readonly italic: boolean;
        readonly keyboard: boolean;
        readonly underline: boolean;
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
    readonly disabled: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly disabled: boolean;
    readonly code: boolean;
    readonly strong: boolean;
    readonly delete: boolean;
    readonly italic: boolean;
    readonly keyboard: boolean;
    readonly underline: boolean;
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
        readonly ellipsis: BooleanConstructor;
        readonly disabled: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly strong: boolean;
        readonly italic: boolean;
        readonly ellipsis: boolean;
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
        readonly ellipsis: BooleanConstructor;
        readonly disabled: BooleanConstructor;
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly strong: boolean;
        readonly italic: boolean;
        readonly ellipsis: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly type: import("vue").PropType<import("./types").TypographyType>;
    readonly strong: BooleanConstructor;
    readonly italic: BooleanConstructor;
    readonly ellipsis: BooleanConstructor;
    readonly disabled: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly disabled: boolean;
    readonly strong: boolean;
    readonly italic: boolean;
    readonly ellipsis: boolean;
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
    }>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly underline: boolean;
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
    }>> & Readonly<{}>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly underline: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly disabled: BooleanConstructor;
    readonly underline: BooleanConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    readonly disabled: boolean;
    readonly underline: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export { Title, Text, Paragraph, Link };
export default Typography;
