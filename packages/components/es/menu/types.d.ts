import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';
export type MenuItemType = 'item' | 'group' | 'divider';
export interface MenuItem {
    key: string;
    label?: string;
    icon?: VNodeChild;
    disabled?: boolean;
    danger?: boolean;
    type?: MenuItemType;
    children?: MenuItem[];
}
export interface MenuClickInfo {
    key: string;
    keyPath: string[];
    item: MenuItem;
}
export interface MenuSelectInfo extends MenuClickInfo {
    selectedKeys: string[];
}
export declare const menuProps: {
    readonly items: PropType<MenuItem[]>;
    readonly mode: {
        readonly type: PropType<MenuMode>;
        readonly default: "vertical";
    };
    readonly theme: {
        readonly type: PropType<MenuTheme>;
        readonly default: "light";
    };
    readonly selectedKeys: PropType<string[]>;
    readonly defaultSelectedKeys: {
        readonly type: PropType<string[]>;
        readonly default: () => never[];
    };
    readonly openKeys: PropType<string[]>;
    readonly defaultOpenKeys: {
        readonly type: PropType<string[]>;
        readonly default: () => never[];
    };
    readonly multiple: BooleanConstructor;
    readonly selectable: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly inlineCollapsed: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
};
export declare const menuEmits: {
    click: (_info: MenuClickInfo) => boolean;
    select: (_info: MenuSelectInfo) => boolean;
    deselect: (_info: MenuSelectInfo) => boolean;
    openChange: (keys: string[]) => boolean;
    'update:selectedKeys': (keys: string[]) => boolean;
    'update:openKeys': (keys: string[]) => boolean;
};
export type MenuProps = ExtractPropTypes<typeof menuProps>;
