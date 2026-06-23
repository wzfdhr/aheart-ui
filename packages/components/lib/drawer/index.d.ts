declare const Drawer: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly extra: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
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
            readonly type: import("vue").PropType<import("./types").DrawerClosable>;
            readonly default: true;
        };
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly mask: {
            readonly type: import("vue").PropType<import("./types").DrawerMask>;
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
        readonly focusable: import("vue").PropType<import("./types").DrawerFocusableConfig>;
        readonly loading: BooleanConstructor;
        readonly footer: {
            readonly type: import("vue").PropType<import("./types").DrawerFooter>;
            readonly default: undefined;
        };
        readonly getContainer: {
            readonly type: import("vue").PropType<import("./types").DrawerGetContainer>;
            readonly default: undefined;
        };
        readonly push: {
            readonly type: import("vue").PropType<import("./types").DrawerPush>;
            readonly default: undefined;
        };
        readonly resizable: {
            readonly type: import("vue").PropType<import("./types").DrawerResizable>;
            readonly default: false;
        };
        readonly maxSize: {
            readonly type: NumberConstructor;
            readonly default: undefined;
        };
        readonly drawerRender: import("vue").PropType<import("./types").DrawerRender>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly bodyStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly headerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly footerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly maskStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly drawerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly contentWrapperStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<import("./types").DrawerClassNames>;
        readonly styles: import("vue").PropType<import("./types").DrawerStyles>;
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
        readonly destroyInactivePanel: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: () => void;
        "update:open": (open: boolean) => void;
        afterOpenChange: (open: boolean) => void;
    }, import("vue").PublicProps, {
        readonly title: import("vue").VNodeChild;
        readonly closable: import("./types").DrawerClosable;
        readonly closeIcon: import("vue").VNodeChild;
        readonly push: import("./types").DrawerPush;
        readonly size: import("./types").DrawerSize;
        readonly open: boolean;
        readonly footer: import("./types").DrawerFooter;
        readonly mask: import("./types").DrawerMask;
        readonly height: string | number;
        readonly width: string | number;
        readonly zIndex: number;
        readonly placement: "left" | "right" | "bottom" | "top";
        readonly loading: boolean;
        readonly extra: import("vue").VNodeChild;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly getContainer: import("./types").DrawerGetContainer;
        readonly resizable: import("./types").DrawerResizable;
        readonly maxSize: number;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
        readonly destroyInactivePanel: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly extra: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
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
            readonly type: import("vue").PropType<import("./types").DrawerClosable>;
            readonly default: true;
        };
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly mask: {
            readonly type: import("vue").PropType<import("./types").DrawerMask>;
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
        readonly focusable: import("vue").PropType<import("./types").DrawerFocusableConfig>;
        readonly loading: BooleanConstructor;
        readonly footer: {
            readonly type: import("vue").PropType<import("./types").DrawerFooter>;
            readonly default: undefined;
        };
        readonly getContainer: {
            readonly type: import("vue").PropType<import("./types").DrawerGetContainer>;
            readonly default: undefined;
        };
        readonly push: {
            readonly type: import("vue").PropType<import("./types").DrawerPush>;
            readonly default: undefined;
        };
        readonly resizable: {
            readonly type: import("vue").PropType<import("./types").DrawerResizable>;
            readonly default: false;
        };
        readonly maxSize: {
            readonly type: NumberConstructor;
            readonly default: undefined;
        };
        readonly drawerRender: import("vue").PropType<import("./types").DrawerRender>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly bodyStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly headerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly footerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly maskStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly drawerStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly contentWrapperStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<import("./types").DrawerClassNames>;
        readonly styles: import("vue").PropType<import("./types").DrawerStyles>;
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
        readonly destroyInactivePanel: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly title: import("vue").VNodeChild;
        readonly closable: import("./types").DrawerClosable;
        readonly closeIcon: import("vue").VNodeChild;
        readonly push: import("./types").DrawerPush;
        readonly size: import("./types").DrawerSize;
        readonly open: boolean;
        readonly footer: import("./types").DrawerFooter;
        readonly mask: import("./types").DrawerMask;
        readonly height: string | number;
        readonly width: string | number;
        readonly zIndex: number;
        readonly placement: "left" | "right" | "bottom" | "top";
        readonly loading: boolean;
        readonly extra: import("vue").VNodeChild;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly getContainer: import("./types").DrawerGetContainer;
        readonly resizable: import("./types").DrawerResizable;
        readonly maxSize: number;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
        readonly destroyInactivePanel: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
    readonly extra: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
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
        readonly type: import("vue").PropType<import("./types").DrawerClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
    readonly mask: {
        readonly type: import("vue").PropType<import("./types").DrawerMask>;
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
    readonly focusable: import("vue").PropType<import("./types").DrawerFocusableConfig>;
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: import("vue").PropType<import("./types").DrawerFooter>;
        readonly default: undefined;
    };
    readonly getContainer: {
        readonly type: import("vue").PropType<import("./types").DrawerGetContainer>;
        readonly default: undefined;
    };
    readonly push: {
        readonly type: import("vue").PropType<import("./types").DrawerPush>;
        readonly default: undefined;
    };
    readonly resizable: {
        readonly type: import("vue").PropType<import("./types").DrawerResizable>;
        readonly default: false;
    };
    readonly maxSize: {
        readonly type: NumberConstructor;
        readonly default: undefined;
    };
    readonly drawerRender: import("vue").PropType<import("./types").DrawerRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").CSSProperties>;
    readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly bodyStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly headerStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly footerStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly maskStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly drawerStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly contentWrapperStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly classNames: import("vue").PropType<import("./types").DrawerClassNames>;
    readonly styles: import("vue").PropType<import("./types").DrawerStyles>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyInactivePanel: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
}, string, {
    readonly title: import("vue").VNodeChild;
    readonly closable: import("./types").DrawerClosable;
    readonly closeIcon: import("vue").VNodeChild;
    readonly push: import("./types").DrawerPush;
    readonly size: import("./types").DrawerSize;
    readonly open: boolean;
    readonly footer: import("./types").DrawerFooter;
    readonly mask: import("./types").DrawerMask;
    readonly height: string | number;
    readonly width: string | number;
    readonly zIndex: number;
    readonly placement: "left" | "right" | "bottom" | "top";
    readonly loading: boolean;
    readonly extra: import("vue").VNodeChild;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly getContainer: import("./types").DrawerGetContainer;
    readonly resizable: import("./types").DrawerResizable;
    readonly maxSize: number;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
    readonly destroyInactivePanel: boolean;
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
