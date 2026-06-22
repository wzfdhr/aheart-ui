import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { ButtonProps } from '../button/types';
export declare const modalSemanticParts: readonly ["root", "mask", "wrap", "dialog", "header", "title", "body", "footer", "close"];
export type ModalSemanticPart = (typeof modalSemanticParts)[number];
export type ModalClassNames = Partial<Record<ModalSemanticPart, string>>;
export type ModalStyles = Partial<Record<ModalSemanticPart, CSSProperties>>;
export type ModalButtonProps = Partial<ButtonProps>;
export declare const modalProps: {
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly width: {
        readonly type: PropType<string | number>;
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
        readonly type: PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
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
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", string>>>;
    readonly styles: PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", CSSProperties>>>;
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
};
export type ModalProps = ExtractPropTypes<typeof modalProps>;
