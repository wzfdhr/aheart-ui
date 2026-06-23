import { type CSSProperties, type PropType, type VNodeChild } from 'vue';
import { type ModalFocusableConfig, type ModalRender, type ModalWidth } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").ModalClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly mask: {
        readonly type: PropType<import("./types").ModalMask>;
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
    readonly okButtonProps: PropType<Partial<import("../button/types").ButtonProps>>;
    readonly cancelButtonProps: PropType<Partial<import("../button/types").ButtonProps>>;
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: PropType<import("./types").ModalFooter>;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly wrapClassName: StringConstructor;
    readonly modalRender: PropType<ModalRender>;
    readonly getContainer: {
        readonly type: PropType<import("./types").ModalGetContainer>;
        readonly default: undefined;
    };
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<import("./types").ModalClassNames>;
    readonly styles: PropType<import("./types").ModalStyles>;
    readonly focusable: PropType<ModalFocusableConfig>;
    readonly focusTriggerAfterClose: {
        readonly type: PropType<boolean | undefined>;
        readonly default: undefined;
    };
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    cancel: () => void;
    afterClose: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
    ok: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        readonly type: PropType<import("./types").ModalClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly mask: {
        readonly type: PropType<import("./types").ModalMask>;
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
    readonly okButtonProps: PropType<Partial<import("../button/types").ButtonProps>>;
    readonly cancelButtonProps: PropType<Partial<import("../button/types").ButtonProps>>;
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: PropType<import("./types").ModalFooter>;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly wrapClassName: StringConstructor;
    readonly modalRender: PropType<ModalRender>;
    readonly getContainer: {
        readonly type: PropType<import("./types").ModalGetContainer>;
        readonly default: undefined;
    };
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<import("./types").ModalClassNames>;
    readonly styles: PropType<import("./types").ModalStyles>;
    readonly focusable: PropType<ModalFocusableConfig>;
    readonly focusTriggerAfterClose: {
        readonly type: PropType<boolean | undefined>;
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
}>, {
    readonly title: VNodeChild;
    readonly closable: import("./types").ModalClosable;
    readonly closeIcon: VNodeChild;
    readonly open: boolean;
    readonly footer: import("./types").ModalFooter;
    readonly mask: import("./types").ModalMask;
    readonly width: ModalWidth;
    readonly zIndex: number;
    readonly loading: boolean;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
    readonly centered: boolean;
    readonly confirmLoading: boolean;
    readonly okText: VNodeChild;
    readonly cancelText: VNodeChild;
    readonly okType: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
    readonly getContainer: import("./types").ModalGetContainer;
    readonly focusTriggerAfterClose: boolean | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    title?(_: {}): any;
    default?(_: {}): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
