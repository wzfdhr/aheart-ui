declare const Tag: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly color: {
            readonly type: import("vue").PropType<string>;
            readonly default: "default";
        };
        readonly closable: BooleanConstructor;
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: (event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly closable: boolean;
        readonly color: string;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly color: {
            readonly type: import("vue").PropType<string>;
            readonly default: "default";
        };
        readonly closable: BooleanConstructor;
    }>> & Readonly<{
        onClose?: ((event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly closable: boolean;
        readonly color: string;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly color: {
        readonly type: import("vue").PropType<string>;
        readonly default: "default";
    };
    readonly closable: BooleanConstructor;
}>> & Readonly<{
    onClose?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: MouseEvent) => void;
}, string, {
    readonly closable: boolean;
    readonly color: string;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Tag;
