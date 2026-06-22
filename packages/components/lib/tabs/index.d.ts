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
        readonly tabPlacement: import("vue").PropType<import("./types").TabsPlacement>;
        readonly tabPosition: import("vue").PropType<import("./types").TabsPosition>;
        readonly tabBarExtraContent: import("vue").PropType<import("./types").TabsExtraContent>;
        readonly tabBarGutter: NumberConstructor;
        readonly tabBarStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly indicator: import("vue").PropType<import("./types").TabsIndicatorConfig>;
        readonly animated: {
            readonly type: import("vue").PropType<import("./types").TabsAnimated>;
            readonly default: false;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((key: string) => any) | undefined;
        "onUpdate:activeKey"?: ((key: string) => any) | undefined;
        onTabClick?: ((key: string, event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (key: string) => void;
        "update:activeKey": (key: string) => void;
        tabClick: (key: string, event: MouseEvent) => void;
    }, import("vue").PublicProps, {
        readonly type: import("./types").TabsType;
        readonly centered: boolean;
        readonly animated: import("./types").TabsAnimated;
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
        readonly tabPlacement: import("vue").PropType<import("./types").TabsPlacement>;
        readonly tabPosition: import("vue").PropType<import("./types").TabsPosition>;
        readonly tabBarExtraContent: import("vue").PropType<import("./types").TabsExtraContent>;
        readonly tabBarGutter: NumberConstructor;
        readonly tabBarStyle: import("vue").PropType<import("vue").StyleValue>;
        readonly indicator: import("vue").PropType<import("./types").TabsIndicatorConfig>;
        readonly animated: {
            readonly type: import("vue").PropType<import("./types").TabsAnimated>;
            readonly default: false;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((key: string) => any) | undefined;
        "onUpdate:activeKey"?: ((key: string) => any) | undefined;
        onTabClick?: ((key: string, event: MouseEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: import("./types").TabsType;
        readonly centered: boolean;
        readonly animated: import("./types").TabsAnimated;
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
    readonly tabPlacement: import("vue").PropType<import("./types").TabsPlacement>;
    readonly tabPosition: import("vue").PropType<import("./types").TabsPosition>;
    readonly tabBarExtraContent: import("vue").PropType<import("./types").TabsExtraContent>;
    readonly tabBarGutter: NumberConstructor;
    readonly tabBarStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly indicator: import("vue").PropType<import("./types").TabsIndicatorConfig>;
    readonly animated: {
        readonly type: import("vue").PropType<import("./types").TabsAnimated>;
        readonly default: false;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").TabsSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((key: string) => any) | undefined;
    "onUpdate:activeKey"?: ((key: string) => any) | undefined;
    onTabClick?: ((key: string, event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (key: string) => void;
    "update:activeKey": (key: string) => void;
    tabClick: (key: string, event: MouseEvent) => void;
}, string, {
    readonly type: import("./types").TabsType;
    readonly centered: boolean;
    readonly animated: import("./types").TabsAnimated;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: Partial<Record<string, (_: {}) => any>> & {
        extraLeft?(_: {}): any;
        extraRight?(_: {}): any;
    };
})>;
export default Tabs;
