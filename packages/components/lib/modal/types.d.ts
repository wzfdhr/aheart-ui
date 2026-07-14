import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { ButtonProps } from '../button/types';
import type { GridBreakpoint } from '../grid/types';
export declare const modalSemanticParts: readonly ["root", "mask", "wrap", "wrapper", "dialog", "container", "header", "title", "body", "footer", "close"];
export type ModalSemanticPart = (typeof modalSemanticParts)[number];
export interface ModalSemanticInfo {
    props: Readonly<Record<string, unknown>>;
}
export type ModalSemanticRecord<T> = Partial<Record<ModalSemanticPart, T>>;
export type ModalSemanticConfig<T> = ModalSemanticRecord<T> | ((info: ModalSemanticInfo) => ModalSemanticRecord<T>);
export type ModalClassNames = ModalSemanticConfig<string>;
export type ModalStyles = ModalSemanticConfig<CSSProperties>;
export type ModalButtonProps = Partial<ButtonProps>;
export type ModalRenderable = VNodeChild;
export type ModalRender = (node: ModalRenderable) => ModalRenderable;
export type ModalResponsiveWidth = Partial<Record<GridBreakpoint, number | string>>;
export type ModalWidth = number | string | ModalResponsiveWidth;
export type ModalGetContainer = HTMLElement | string | (() => HTMLElement) | false;
export interface ModalMaskConfig {
    enabled?: boolean;
    blur?: boolean;
    closable?: boolean;
}
export type ModalMask = boolean | ModalMaskConfig;
export interface ModalFocusableConfig {
    trap?: boolean;
    focusTriggerAfterClose?: boolean;
}
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
    onClose?: () => void;
    afterClose?: () => void;
}
export type ModalClosable = boolean | ModalClosableConfig;
export declare const modalProps: {
    readonly open: BooleanConstructor;
    readonly title: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly width: {
        readonly type: PropType<ModalWidth>;
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
        readonly type: PropType<ModalMask>;
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
        readonly default: undefined;
    };
    readonly cancelText: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
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
    readonly getContainer: {
        readonly type: PropType<ModalGetContainer>;
        readonly default: undefined;
    };
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<ModalClassNames>;
    readonly styles: PropType<ModalStyles>;
    readonly focusable: PropType<ModalFocusableConfig>;
    readonly focusTriggerAfterClose: {
        readonly type: PropType<boolean | undefined>;
        readonly default: undefined;
    };
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
