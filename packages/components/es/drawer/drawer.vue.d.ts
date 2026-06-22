import { type CSSProperties } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly extra: import("vue").PropType<string | number>;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<import("./types").DrawerSize>;
        readonly default: "default";
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
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
    readonly loading: BooleanConstructor;
    readonly footer: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<CSSProperties>;
    readonly rootStyle: import("vue").PropType<CSSProperties>;
    readonly classNames: import("vue").PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "extra" | "root", string>>>;
    readonly styles: import("vue").PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "extra" | "root", CSSProperties>>>;
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
    readonly extra: import("vue").PropType<string | number>;
    readonly placement: {
        readonly type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: import("vue").PropType<import("./types").DrawerSize>;
        readonly default: "default";
    };
    readonly width: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly height: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: undefined;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 1000;
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
    readonly loading: BooleanConstructor;
    readonly footer: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<CSSProperties>;
    readonly rootStyle: import("vue").PropType<CSSProperties>;
    readonly classNames: import("vue").PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "extra" | "root", string>>>;
    readonly styles: import("vue").PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "extra" | "root", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly closable: boolean;
    readonly footer: boolean;
    readonly mask: boolean;
    readonly size: import("./types").DrawerSize;
    readonly loading: boolean;
    readonly width: string | number;
    readonly height: string | number;
    readonly open: boolean;
    readonly placement: "left" | "right" | "top" | "bottom";
    readonly zIndex: number;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
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
