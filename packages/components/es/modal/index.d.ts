declare const Modal: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly width: {
            readonly type: import("vue").PropType<import("./types").ModalWidth>;
            readonly default: 520;
        };
        readonly centered: BooleanConstructor;
        readonly closable: {
            readonly type: import("vue").PropType<import("./types").ModalClosable>;
            readonly default: true;
        };
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly mask: {
            readonly type: import("vue").PropType<import("./types").ModalMask>;
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
        readonly confirmLoading: BooleanConstructor;
        readonly okText: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: "OK";
        };
        readonly cancelText: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: "Cancel";
        };
        readonly okType: {
            readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
            readonly default: "primary";
        };
        readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly zIndex: {
            readonly type: NumberConstructor;
            readonly default: 1000;
        };
        readonly loading: BooleanConstructor;
        readonly footer: {
            readonly type: import("vue").PropType<import("./types").ModalFooter>;
            readonly default: true;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly wrapClassName: StringConstructor;
        readonly modalRender: import("vue").PropType<import("./types").ModalRender>;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<import("./types").ModalClassNames>;
        readonly styles: import("vue").PropType<import("./types").ModalStyles>;
        readonly focusable: import("vue").PropType<import("./types").ModalFocusableConfig>;
        readonly focusTriggerAfterClose: {
            readonly type: import("vue").PropType<boolean | undefined>;
            readonly default: undefined;
        };
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        onCancel?: (() => any) | undefined;
        onAfterClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
        onOk?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        close: () => void;
        cancel: () => void;
        afterClose: () => void;
        "update:open": (open: boolean) => void;
        afterOpenChange: (open: boolean) => void;
        ok: () => void;
    }, import("vue").PublicProps, {
        readonly title: import("vue").VNodeChild;
        readonly closable: import("./types").ModalClosable;
        readonly closeIcon: import("vue").VNodeChild;
        readonly open: boolean;
        readonly footer: import("./types").ModalFooter;
        readonly mask: import("./types").ModalMask;
        readonly width: import("./types").ModalWidth;
        readonly zIndex: number;
        readonly loading: boolean;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
        readonly centered: boolean;
        readonly confirmLoading: boolean;
        readonly okText: import("vue").VNodeChild;
        readonly cancelText: import("vue").VNodeChild;
        readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly focusTriggerAfterClose: boolean | undefined;
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
        readonly width: {
            readonly type: import("vue").PropType<import("./types").ModalWidth>;
            readonly default: 520;
        };
        readonly centered: BooleanConstructor;
        readonly closable: {
            readonly type: import("vue").PropType<import("./types").ModalClosable>;
            readonly default: true;
        };
        readonly closeIcon: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: undefined;
        };
        readonly mask: {
            readonly type: import("vue").PropType<import("./types").ModalMask>;
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
        readonly confirmLoading: BooleanConstructor;
        readonly okText: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: "OK";
        };
        readonly cancelText: {
            readonly type: import("vue").PropType<import("vue").VNodeChild>;
            readonly default: "Cancel";
        };
        readonly okType: {
            readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
            readonly default: "primary";
        };
        readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
        readonly zIndex: {
            readonly type: NumberConstructor;
            readonly default: 1000;
        };
        readonly loading: BooleanConstructor;
        readonly footer: {
            readonly type: import("vue").PropType<import("./types").ModalFooter>;
            readonly default: true;
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly wrapClassName: StringConstructor;
        readonly modalRender: import("vue").PropType<import("./types").ModalRender>;
        readonly style: import("vue").PropType<import("vue").CSSProperties>;
        readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
        readonly classNames: import("vue").PropType<import("./types").ModalClassNames>;
        readonly styles: import("vue").PropType<import("./types").ModalStyles>;
        readonly focusable: import("vue").PropType<import("./types").ModalFocusableConfig>;
        readonly focusTriggerAfterClose: {
            readonly type: import("vue").PropType<boolean | undefined>;
            readonly default: undefined;
        };
        readonly forceRender: BooleanConstructor;
        readonly destroyOnClose: BooleanConstructor;
        readonly destroyOnHidden: BooleanConstructor;
    }>> & Readonly<{
        onClose?: (() => any) | undefined;
        onCancel?: (() => any) | undefined;
        onAfterClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onAfterOpenChange?: ((open: boolean) => any) | undefined;
        onOk?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly title: import("vue").VNodeChild;
        readonly closable: import("./types").ModalClosable;
        readonly closeIcon: import("vue").VNodeChild;
        readonly open: boolean;
        readonly footer: import("./types").ModalFooter;
        readonly mask: import("./types").ModalMask;
        readonly width: import("./types").ModalWidth;
        readonly zIndex: number;
        readonly loading: boolean;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly forceRender: boolean;
        readonly destroyOnClose: boolean;
        readonly destroyOnHidden: boolean;
        readonly centered: boolean;
        readonly confirmLoading: boolean;
        readonly okText: import("vue").VNodeChild;
        readonly cancelText: import("vue").VNodeChild;
        readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
        readonly focusTriggerAfterClose: boolean | undefined;
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
    readonly width: {
        readonly type: import("vue").PropType<import("./types").ModalWidth>;
        readonly default: 520;
    };
    readonly centered: BooleanConstructor;
    readonly closable: {
        readonly type: import("vue").PropType<import("./types").ModalClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
    readonly mask: {
        readonly type: import("vue").PropType<import("./types").ModalMask>;
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
    readonly confirmLoading: BooleanConstructor;
    readonly okText: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: import("vue").PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "primary";
    };
    readonly okButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
    readonly cancelButtonProps: import("vue").PropType<Partial<import("../button/types").ButtonProps>>;
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: import("vue").PropType<import("./types").ModalFooter>;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly wrapClassName: StringConstructor;
    readonly modalRender: import("vue").PropType<import("./types").ModalRender>;
    readonly style: import("vue").PropType<import("vue").CSSProperties>;
    readonly rootStyle: import("vue").PropType<import("vue").CSSProperties>;
    readonly classNames: import("vue").PropType<import("./types").ModalClassNames>;
    readonly styles: import("vue").PropType<import("./types").ModalStyles>;
    readonly focusable: import("vue").PropType<import("./types").ModalFocusableConfig>;
    readonly focusTriggerAfterClose: {
        readonly type: import("vue").PropType<boolean | undefined>;
        readonly default: undefined;
    };
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    onCancel?: (() => any) | undefined;
    onAfterClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
    onOk?: (() => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    cancel: () => void;
    afterClose: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
    ok: () => void;
}, string, {
    readonly title: import("vue").VNodeChild;
    readonly closable: import("./types").ModalClosable;
    readonly closeIcon: import("vue").VNodeChild;
    readonly open: boolean;
    readonly footer: import("./types").ModalFooter;
    readonly mask: import("./types").ModalMask;
    readonly width: import("./types").ModalWidth;
    readonly zIndex: number;
    readonly loading: boolean;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
    readonly centered: boolean;
    readonly confirmLoading: boolean;
    readonly okText: import("vue").VNodeChild;
    readonly cancelText: import("vue").VNodeChild;
    readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
    readonly focusTriggerAfterClose: boolean | undefined;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        title?(_: {}): any;
        default?(_: {}): any;
        footer?(_: {}): any;
    };
})>;
export default Modal;
export type { ModalProps } from './types';
