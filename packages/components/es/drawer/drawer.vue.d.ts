declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
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
    readonly footer: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 378;
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
    readonly footer: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {
    readonly closable: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly open: boolean;
    readonly placement: "left" | "right" | "top" | "bottom";
    readonly width: string | number;
    readonly height: string | number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly destroyOnClose: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    title?(_: {}): any;
    extra?(_: {}): any;
    default?(_: {}): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
