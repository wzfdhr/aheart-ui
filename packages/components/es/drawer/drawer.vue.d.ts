import { type CSSProperties, type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly extra: PropType<string | number>;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<import("./types").DrawerSize>;
        readonly default: "default";
    };
    readonly width: {
        readonly type: PropType<string | number>;
        readonly default: undefined;
    };
    readonly height: {
        readonly type: PropType<string | number>;
        readonly default: undefined;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly closable: {
        readonly type: PropType<import("./types").DrawerClosable>;
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
    readonly loading: BooleanConstructor;
    readonly footer: BooleanConstructor;
    readonly getContainer: {
        readonly type: PropType<import("./types").DrawerGetContainer>;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<Partial<Record<"root" | "section" | "title" | "close" | "body" | "footer" | "header" | "mask" | "extra", string>>>;
    readonly styles: PropType<Partial<Record<"root" | "section" | "title" | "close" | "body" | "footer" | "header" | "mask" | "extra", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly extra: PropType<string | number>;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<import("./types").DrawerSize>;
        readonly default: "default";
    };
    readonly width: {
        readonly type: PropType<string | number>;
        readonly default: undefined;
    };
    readonly height: {
        readonly type: PropType<string | number>;
        readonly default: undefined;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
    };
    readonly closable: {
        readonly type: PropType<import("./types").DrawerClosable>;
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
    readonly loading: BooleanConstructor;
    readonly footer: BooleanConstructor;
    readonly getContainer: {
        readonly type: PropType<import("./types").DrawerGetContainer>;
        readonly default: undefined;
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<Partial<Record<"root" | "section" | "title" | "close" | "body" | "footer" | "header" | "mask" | "extra", string>>>;
    readonly styles: PropType<Partial<Record<"root" | "section" | "title" | "close" | "body" | "footer" | "header" | "mask" | "extra", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly closable: import("./types").DrawerClosable;
    readonly closeIcon: VNodeChild;
    readonly size: import("./types").DrawerSize;
    readonly open: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly height: string | number;
    readonly width: string | number;
    readonly zIndex: number;
    readonly placement: "left" | "right" | "bottom" | "top";
    readonly loading: boolean;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly getContainer: import("./types").DrawerGetContainer;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
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
