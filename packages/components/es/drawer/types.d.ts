import type { ExtractPropTypes, PropType } from 'vue';
export declare const drawerPlacements: readonly ["top", "right", "bottom", "left"];
export type DrawerPlacement = (typeof drawerPlacements)[number];
export declare const drawerProps: {
    readonly open: BooleanConstructor;
    readonly title: StringConstructor;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "top" | "bottom">;
        readonly default: "right";
        readonly validator: (value: string) => boolean;
    };
    readonly width: {
        readonly type: PropType<string | number>;
        readonly default: 378;
    };
    readonly height: {
        readonly type: PropType<string | number>;
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
};
export declare const drawerEmits: {
    'update:open': (open: boolean) => boolean;
    close: () => boolean;
};
export type DrawerProps = ExtractPropTypes<typeof drawerProps>;
