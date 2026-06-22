declare const Modal: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly open: BooleanConstructor;
        readonly title: StringConstructor;
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 520;
        };
        readonly centered: BooleanConstructor;
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
        readonly confirmLoading: BooleanConstructor;
        readonly okText: {
            readonly type: StringConstructor;
            readonly default: "OK";
        };
        readonly cancelText: {
            readonly type: StringConstructor;
            readonly default: "Cancel";
        };
        readonly okType: {
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
            readonly default: "primary";
        };
        readonly footer: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly destroyOnClose: BooleanConstructor;
    }>> & Readonly<{
        onCancel?: (() => any) | undefined;
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOk?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        cancel: () => void;
        close: () => void;
        "update:open": (open: boolean) => void;
        ok: () => void;
    }, import("vue").PublicProps, {
        readonly closable: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly open: boolean;
        readonly width: string | number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly destroyOnClose: boolean;
        readonly centered: boolean;
        readonly confirmLoading: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
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
        readonly width: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 520;
        };
        readonly centered: BooleanConstructor;
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
        readonly confirmLoading: BooleanConstructor;
        readonly okText: {
            readonly type: StringConstructor;
            readonly default: "OK";
        };
        readonly cancelText: {
            readonly type: StringConstructor;
            readonly default: "Cancel";
        };
        readonly okType: {
            readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
            readonly default: "primary";
        };
        readonly footer: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly destroyOnClose: BooleanConstructor;
    }>> & Readonly<{
        onCancel?: (() => any) | undefined;
        onClose?: (() => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOk?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly closable: boolean;
        readonly footer: boolean;
        readonly mask: boolean;
        readonly open: boolean;
        readonly width: string | number;
        readonly maskClosable: boolean;
        readonly keyboard: boolean;
        readonly destroyOnClose: boolean;
        readonly centered: boolean;
        readonly confirmLoading: boolean;
        readonly okText: string;
        readonly cancelText: string;
        readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 520;
    };
    readonly centered: BooleanConstructor;
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
    readonly confirmLoading: BooleanConstructor;
    readonly okText: {
        readonly type: StringConstructor;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: StringConstructor;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
        readonly default: "primary";
    };
    readonly footer: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly destroyOnClose: BooleanConstructor;
}>> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOk?: (() => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => void;
    close: () => void;
    "update:open": (open: boolean) => void;
    ok: () => void;
}, string, {
    readonly closable: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly open: boolean;
    readonly width: string | number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly destroyOnClose: boolean;
    readonly centered: boolean;
    readonly confirmLoading: boolean;
    readonly okText: string;
    readonly cancelText: string;
    readonly okType: "success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger";
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        title?(_: {}): any;
        default?(_: {}): any;
        footer?(_: {}): any;
    };
})>;
export default Modal;
export type { ModalProps } from './types';
