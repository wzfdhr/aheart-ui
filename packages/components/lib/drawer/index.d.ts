declare const Drawer: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: StringConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
            readonly default: "right";
            readonly validator: (value: string) => boolean;
        };
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 378;
        };
        readonly height: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 378;
        };
        readonly closable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly mask: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly maskClosable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly footer: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: () => void;
        "update:open": (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly closable: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly open: boolean;
        readonly placement: "left" | "right" | "top" | "bottom";
        readonly width: string | number;
        readonly height: string | number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly destroyOnClose: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: StringConstructor;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
            readonly default: "right";
            readonly validator: (value: string) => boolean;
        };
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 378;
        };
        readonly height: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 378;
        };
        readonly closable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly mask: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly maskClosable: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly footer: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly closable: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly open: boolean;
        readonly placement: "left" | "right" | "top" | "bottom";
        readonly width: string | number;
        readonly height: string | number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly destroyOnClose: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
    };
    readonly closable: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly mask: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly maskClosable: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly footer: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
}, string, {
    readonly closable: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly open: boolean;
    readonly placement: "left" | "right" | "top" | "bottom";
    readonly width: string | number;
    readonly height: string | number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly destroyOnClose: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        title?(_: {}): any;
        extra?(_: {}): any;
        default?(_: {}): any;
        footer?(_: {}): any;
    };
})>;
export default Drawer;
export type { DrawerPlacement, DrawerProps } from './types';
