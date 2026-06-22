declare const Tabs: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly items: import("vue").PropType<import("./types").TabItem[]>;
        readonly activeKey: StringConstructor;
        readonly defaultActiveKey: StringConstructor;
        readonly type: {
            readonly type: import("vue").PropType<import("./types").TabsType>;
            readonly default: "line";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly centered: BooleanConstructor;
    }>> & Readonly<{
        onChange?: ((key: string) => any) | undefined;
        "onUpdate:activeKey"?: ((key: string) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (key: string) => void;
        "update:activeKey": (key: string) => void;
    }, import("vue").PublicProps, {
        readonly type: import("./types").TabsType;
        readonly centered: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly items: import("vue").PropType<import("./types").TabItem[]>;
        readonly activeKey: StringConstructor;
        readonly defaultActiveKey: StringConstructor;
        readonly type: {
            readonly type: import("vue").PropType<import("./types").TabsType>;
            readonly default: "line";
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly centered: BooleanConstructor;
    }>> & Readonly<{
        onChange?: ((key: string) => any) | undefined;
        "onUpdate:activeKey"?: ((key: string) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: import("./types").TabsType;
        readonly centered: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<import("./types").TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: import("vue").PropType<import("./types").TabsType>;
        readonly default: "line";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly centered: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((key: string) => any) | undefined;
    "onUpdate:activeKey"?: ((key: string) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (key: string) => void;
    "update:activeKey": (key: string) => void;
}, string, {
    readonly type: import("./types").TabsType;
    readonly centered: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: Partial<Record<string, (_: {}) => any>>;
})>;
export default Tabs;
