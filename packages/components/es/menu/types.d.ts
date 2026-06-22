import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';
export type MenuItemType = 'item' | 'group' | 'divider';
export type MenuTriggerSubMenuAction = 'hover' | 'click';
export type MenuSemanticPart = 'root' | 'list' | 'item' | 'itemButton' | 'submenu' | 'submenuTitle' | 'submenuList' | 'group' | 'groupTitle' | 'divider' | 'icon' | 'label' | 'extra' | 'expandIcon';
export type MenuClassNames = Partial<Record<MenuSemanticPart, string>>;
export type MenuStyles = Partial<Record<MenuSemanticPart, StyleValue>>;
export type MenuExpandIcon = VNodeChild | ((info: {
    item: MenuItem;
    isOpen: boolean;
    disabled: boolean;
    level: number;
}) => VNodeChild);
export interface MenuItem {
    key: string;
    label?: VNodeChild;
    icon?: VNodeChild;
    extra?: VNodeChild;
    title?: string;
    disabled?: boolean;
    danger?: boolean;
    dashed?: boolean;
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
    readonly inlineIndent: {
        readonly type: NumberConstructor;
        readonly default: 24;
    };
    readonly forceSubMenuRender: BooleanConstructor;
    readonly triggerSubMenuAction: {
        readonly type: PropType<MenuTriggerSubMenuAction>;
        readonly default: "click";
    };
    readonly expandIcon: PropType<MenuExpandIcon>;
    readonly className: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<MenuSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<MenuSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
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
