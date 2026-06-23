import { type CSSProperties, type PropType, type VNodeChild } from 'vue';
import { type DrawerFocusableConfig, type DrawerRender } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly extra: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
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
        readonly type: PropType<import("./types").DrawerMask>;
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
    readonly focusable: PropType<DrawerFocusableConfig>;
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: PropType<import("./types").DrawerFooter>;
        readonly default: undefined;
    };
    readonly getContainer: {
        readonly type: PropType<import("./types").DrawerGetContainer>;
        readonly default: undefined;
    };
    readonly drawerRender: PropType<DrawerRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly bodyStyle: PropType<CSSProperties>;
    readonly headerStyle: PropType<CSSProperties>;
    readonly footerStyle: PropType<CSSProperties>;
    readonly maskStyle: PropType<CSSProperties>;
    readonly drawerStyle: PropType<CSSProperties>;
    readonly contentWrapperStyle: PropType<CSSProperties>;
    readonly classNames: PropType<import("./types").DrawerClassNames>;
    readonly styles: PropType<import("./types").DrawerStyles>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyInactivePanel: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "update:open": (open: boolean) => void;
    afterOpenChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly open: BooleanConstructor;
    readonly title: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly extra: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
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
        readonly type: PropType<import("./types").DrawerMask>;
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
    readonly focusable: PropType<DrawerFocusableConfig>;
    readonly loading: BooleanConstructor;
    readonly footer: {
        readonly type: PropType<import("./types").DrawerFooter>;
        readonly default: undefined;
    };
    readonly getContainer: {
        readonly type: PropType<import("./types").DrawerGetContainer>;
        readonly default: undefined;
    };
    readonly drawerRender: PropType<DrawerRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly bodyStyle: PropType<CSSProperties>;
    readonly headerStyle: PropType<CSSProperties>;
    readonly footerStyle: PropType<CSSProperties>;
    readonly maskStyle: PropType<CSSProperties>;
    readonly drawerStyle: PropType<CSSProperties>;
    readonly contentWrapperStyle: PropType<CSSProperties>;
    readonly classNames: PropType<import("./types").DrawerClassNames>;
    readonly styles: PropType<import("./types").DrawerStyles>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyInactivePanel: BooleanConstructor;
}>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onAfterOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly title: VNodeChild;
    readonly closable: import("./types").DrawerClosable;
    readonly closeIcon: VNodeChild;
    readonly size: import("./types").DrawerSize;
    readonly open: boolean;
    readonly footer: import("./types").DrawerFooter;
    readonly mask: import("./types").DrawerMask;
    readonly height: string | number;
    readonly width: string | number;
    readonly zIndex: number;
    readonly placement: "left" | "right" | "bottom" | "top";
    readonly loading: boolean;
    readonly extra: VNodeChild;
    readonly maskClosable: boolean;
    readonly keyboard: boolean;
    readonly getContainer: import("./types").DrawerGetContainer;
    readonly forceRender: boolean;
    readonly destroyOnClose: boolean;
    readonly destroyOnHidden: boolean;
    readonly destroyInactivePanel: boolean;
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
