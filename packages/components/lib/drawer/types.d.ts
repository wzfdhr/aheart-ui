import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
export declare const drawerPlacements: readonly ["top", "right", "bottom", "left"];
export declare const drawerSizePresets: readonly ["default", "large"];
export declare const drawerSemanticParts: readonly ["root", "mask", "section", "header", "title", "extra", "body", "footer", "close"];
export type DrawerPlacement = (typeof drawerPlacements)[number];
export type DrawerSizePreset = (typeof drawerSizePresets)[number];
export type DrawerSize = DrawerSizePreset | number | string;
export type DrawerSemanticPart = (typeof drawerSemanticParts)[number];
export type DrawerClassNames = Partial<Record<DrawerSemanticPart, string>>;
export type DrawerStyles = Partial<Record<DrawerSemanticPart, CSSProperties>>;
export declare const drawerProps: {
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly extra: PropType<string | number>;
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
    readonly style: PropType<CSSProperties>;
    readonly rootStyle: PropType<CSSProperties>;
    readonly classNames: PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "root" | "extra", string>>>;
    readonly styles: PropType<Partial<Record<"close" | "body" | "footer" | "header" | "section" | "title" | "mask" | "root" | "extra", CSSProperties>>>;
    readonly forceRender: BooleanConstructor;
    readonly destroyOnClose: BooleanConstructor;
    readonly destroyOnHidden: BooleanConstructor;
};
export declare const drawerEmits: {
    'update:open': (open: boolean) => boolean;
    close: () => boolean;
    afterOpenChange: (open: boolean) => boolean;
};
export type DrawerProps = ExtractPropTypes<typeof drawerProps>;
