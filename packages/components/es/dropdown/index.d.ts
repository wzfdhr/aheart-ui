declare const Dropdown: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
        readonly trigger: {
            readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
            readonly default: () => string[];
        };
        readonly placement: {
            readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
            readonly default: "bottomLeft";
        };
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly arrow: BooleanConstructor;
    }>> & Readonly<{
        onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        click: (_info: import("../menu").MenuClickInfo) => void;
        "update:open": (open: boolean) => void;
        openChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly open: boolean;
        readonly placement: import("./types").DropdownPlacement;
        readonly trigger: import("./types").DropdownTrigger[];
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
        readonly trigger: {
            readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
            readonly default: () => string[];
        };
        readonly placement: {
            readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
            readonly default: "bottomLeft";
        };
        readonly open: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultOpen: BooleanConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly arrow: BooleanConstructor;
    }>> & Readonly<{
        onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly open: boolean;
        readonly placement: import("./types").DropdownPlacement;
        readonly trigger: import("./types").DropdownTrigger[];
        readonly defaultOpen: boolean;
        readonly arrow: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
        readonly default: "bottomLeft";
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly arrow: BooleanConstructor;
}>> & Readonly<{
    onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (_info: import("../menu").MenuClickInfo) => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly open: boolean;
    readonly placement: import("./types").DropdownPlacement;
    readonly trigger: import("./types").DropdownTrigger[];
    readonly defaultOpen: boolean;
    readonly arrow: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export default Dropdown;
export type { DropdownClickInfo, DropdownMenuConfig, DropdownPlacement, DropdownProps, DropdownTrigger } from './types';
