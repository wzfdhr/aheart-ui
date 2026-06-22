declare const Drawer: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: StringConstructor;
        readonly extra: import("vue").PropType<string | number>;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top">;
            readonly default: "right";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<import("./types").DrawerSize>;
            readonly default: "default";
        };
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: undefined;
        };
        readonly height: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: undefined;
        };
        readonly zIndex: {
            readonly type: NumberConstructor;
            readonly default: 1000;
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
        readonly loading: BooleanConstructor;
        readonly footer: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", string>>>;
        readonly styles: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", import("vue").CSSProperties>>>;
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: () => void;
        "update:open": (open: boolean) => void;
        afterOpenChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly closable: boolean;
        readonly size: import("./types").DrawerSize;
        readonly open: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly loading: boolean;
        readonly width: string | number;
        readonly height: string | number;
        readonly placement: "left" | "right" | "bottom" | "top";
        readonly zIndex: number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
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
        readonly extra: import("vue").PropType<string | number>;
        readonly placement: {
            readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top">;
            readonly default: "right";
            readonly validator: (value: string) => boolean;
        };
        readonly size: {
            readonly type: import("vue").PropType<import("./types").DrawerSize>;
            readonly default: "default";
        };
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: undefined;
        };
        readonly height: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: undefined;
        };
        readonly zIndex: {
            readonly type: NumberConstructor;
            readonly default: 1000;
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
        readonly loading: BooleanConstructor;
        readonly footer: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", string>>>;
        readonly styles: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", import("vue").CSSProperties>>>;
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly closable: boolean;
        readonly size: import("./types").DrawerSize;
        readonly open: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly loading: boolean;
        readonly width: string | number;
        readonly height: string | number;
        readonly placement: "left" | "right" | "bottom" | "top";
        readonly zIndex: number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly extra: import("vue").PropType<string | number>;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<import("./types").DrawerSize>;
        readonly default: "default";
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
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
    readonly loading: BooleanConstructor;
    readonly footer: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").CSSProperties>;
    readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly classNames: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", string>>>;
    readonly styles: import("vue").PropType<Partial<Record<"root" | "title" | "close" | "body" | "footer" | "header" | "section" | "mask" | "extra", import("vue").CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
}, string, {
    readonly closable: boolean;
    readonly size: import("./types").DrawerSize;
    readonly open: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly loading: boolean;
    readonly width: string | number;
    readonly height: string | number;
    readonly placement: "left" | "right" | "bottom" | "top";
    readonly zIndex: number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
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
