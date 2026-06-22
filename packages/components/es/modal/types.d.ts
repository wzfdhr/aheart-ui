import type { ExtractPropTypes, PropType } from 'vue';
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
        readonly type: PropType<"success" | "warning" | "default" | "link" | "text" | "primary" | "dashed" | "danger">;
        readonly default: "primary";
    };
    readonly footer: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly destroyOnClose: BooleanConstructor;
};
export declare const modalEmits: {
    'update:open': (open: boolean) => boolean;
    ok: () => boolean;
    cancel: () => boolean;
    close: () => boolean;
};
export type ModalProps = ExtractPropTypes<typeof modalProps>;
