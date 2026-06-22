import { type CSSProperties } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
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
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<CSSProperties>;
    readonly rootStyle: import("vue").PropType<CSSProperties>;
    readonly classNames: import("vue").PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", string>>>;
    readonly styles: import("vue").PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => void;
    close: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
    ok: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        readonly type: import("vue").PropType<"success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger">;
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
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<CSSProperties>;
    readonly rootStyle: import("vue").PropType<CSSProperties>;
    readonly classNames: import("vue").PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", string>>>;
    readonly styles: import("vue").PropType<Partial<Record<"close" | "body" | "dialog" | "footer" | "header" | "title" | "mask" | "root" | "wrap", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
    onOk?: (() => any) | undefined;
}>, {
    readonly closable: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly open: boolean;
    readonly loading: boolean;
    readonly width: string | number;
    readonly zIndex: number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
    readonly centered: boolean;
    readonly confirmLoading: boolean;
    readonly okText: string;
    readonly cancelText: string;
    readonly okType: "success" | "warning" | "default" | "link" | "text" | "dashed" | "primary" | "danger";
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
