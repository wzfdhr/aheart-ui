import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { ButtonProps } from '../button/types';
export declare const modalSemanticParts: readonly ["root", "mask", "wrap", "dialog", "header", "title", "body", "footer", "close"];
export type ModalSemanticPart = (typeof modalSemanticParts)[number];
export type ModalClassNames = Partial<Record<ModalSemanticPart, string>>;
export type ModalStyles = Partial<Record<ModalSemanticPart, CSSProperties>>;
export type ModalButtonProps = Partial<ButtonProps>;
export type ModalRenderable = VNodeChild;
export type ModalRender = (node: ModalRenderable) => ModalRenderable;
export interface ModalFooterRenderExtra {
    okButton: ModalRenderable;
    cancelButton: ModalRenderable;
    OkBtn: () => ModalRenderable;
    CancelBtn: () => ModalRenderable;
}
export type ModalFooterRender = (originNode: ModalRenderable, extra: ModalFooterRenderExtra) => ModalRenderable;
export type ModalFooter = boolean | ModalRenderable | ModalFooterRender;
export interface ModalClosableConfig {
    closeIcon?: ModalRenderable;
    disabled?: boolean;
}
export type ModalClosable = boolean | ModalClosableConfig;
export declare const modalProps: {
    readonly open: BooleanConstructor;
    readonly title: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly width: {
        readonly type: PropType<string | number>;
        readonly default: 520;
    };
    readonly centered: BooleanConstructor;
    readonly closable: {
        readonly type: PropType<ModalClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
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
        readonly type: PropType<VNodeChild>;
        readonly default: "OK";
    };
    readonly cancelText: {
        readonly type: PropType<VNodeChild>;
        readonly default: "Cancel";
    };
    readonly okType: {
        readonly type: PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "primary";
    };
    readonly okButtonProps: PropType<Partial<ButtonProps>>;
    readonly cancelButtonProps: PropType<Partial<ButtonProps>>;
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: PropType<ModalFooter>;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly wrapClassName: StringConstructor;
    readonly modalRender: PropType<ModalRender>;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<Partial<Record<"root" | "title" | "close" | "wrap" | "body" | "dialog" | "footer" | "header" | "mask", string>>>;
    readonly styles: PropType<Partial<Record<"root" | "title" | "close" | "wrap" | "body" | "dialog" | "footer" | "header" | "mask", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
};
export declare const modalEmits: {
    'update:open': (open: boolean) => boolean;
    ok: () => boolean;
    cancel: () => boolean;
    close: () => boolean;
    afterOpenChange: (open: boolean) => boolean;
    afterClose: () => boolean;
};
export type ModalProps = ExtractPropTypes<typeof modalProps>;
