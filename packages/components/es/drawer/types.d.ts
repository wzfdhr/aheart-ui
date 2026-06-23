import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue';
export declare const drawerPlacements: readonly ["top", "right", "bottom", "left"];
export declare const drawerSizePresets: readonly ["default", "large"];
export declare const drawerSemanticParts: readonly ["root", "mask", "section", "header", "title", "extra", "body", "footer", "close"];
export type DrawerPlacement = (typeof drawerPlacements)[number];
export type DrawerSizePreset = (typeof drawerSizePresets)[number];
export type DrawerSize = DrawerSizePreset | number | string;
export type DrawerSemanticPart = (typeof drawerSemanticParts)[number];
export interface DrawerSemanticInfo {
    props: Readonly<Record<string, unknown>>;
}
export type DrawerSemanticRecord<T> = Partial<Record<DrawerSemanticPart, T>>;
export type DrawerSemanticConfig<T> = DrawerSemanticRecord<T> | ((info: DrawerSemanticInfo) => DrawerSemanticRecord<T>);
export type DrawerClassNames = DrawerSemanticConfig<string>;
export type DrawerStyles = DrawerSemanticConfig<CSSProperties>;
export type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false;
export type DrawerRenderable = VNodeChild;
export type DrawerRender = (node: DrawerRenderable) => DrawerRenderable;
export type DrawerTitle = DrawerRenderable;
export type DrawerExtra = DrawerRenderable;
export type DrawerFooter = boolean | DrawerRenderable;
export interface DrawerMaskConfig {
    enabled?: boolean;
    blur?: boolean;
    closable?: boolean;
}
export type DrawerMask = boolean | DrawerMaskConfig;
export interface DrawerFocusableConfig {
    trap?: boolean;
    focusTriggerAfterClose?: boolean;
}
export type DrawerClosePlacement = 'start' | 'end';
export type DrawerCloseIcon = VNodeChild;
export interface DrawerClosableConfig {
    closeIcon?: DrawerCloseIcon;
    disabled?: boolean;
    placement?: DrawerClosePlacement;
}
export type DrawerClosable = boolean | DrawerClosableConfig;
export declare const drawerProps: {
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
        readonly type: PropType<DrawerSize>;
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
        readonly type: PropType<DrawerClosable>;
        readonly default: true;
    };
    readonly closeIcon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly mask: {
        readonly type: PropType<DrawerMask>;
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
        readonly type: PropType<DrawerFooter>;
        readonly default: undefined;
    };
    readonly getContainer: {
        readonly type: PropType<DrawerGetContainer>;
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
    readonly classNames: PropType<DrawerClassNames>;
    readonly styles: PropType<DrawerStyles>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyInactivePanel: BooleanConstructor;
};
export declare const drawerEmits: {
    'update:open': (open: boolean) => boolean;
    close: () => boolean;
    afterOpenChange: (open: boolean) => boolean;
};
export type DrawerProps = ExtractPropTypes<typeof drawerProps>;
