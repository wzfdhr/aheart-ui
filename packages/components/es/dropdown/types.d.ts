import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { MenuItem, MenuClickInfo } from '../menu';
export type DropdownTrigger = 'click' | 'hover' | 'contextMenu';
export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight';
export interface DropdownArrowConfig {
    pointAtCenter?: boolean;
}
export type DropdownArrow = boolean | DropdownArrowConfig;
export type DropdownSemanticPart = 'root' | 'trigger' | 'popup' | 'menu' | 'arrow';
export type DropdownClassNames = Partial<Record<DropdownSemanticPart, string>>;
export type DropdownStyles = Partial<Record<DropdownSemanticPart, StyleValue>>;
export type DropdownRender = (menus: VNodeChild) => VNodeChild;
export type DropdownOpenChangeSource = 'trigger' | 'menu';
export interface DropdownOpenChangeInfo {
    source: DropdownOpenChangeSource;
}
export interface DropdownMenuConfig {
    items?: MenuItem[];
    selectable?: boolean;
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    closeOnClick?: boolean;
}
export type DropdownClickInfo = MenuClickInfo;
export declare const dropdownProps: {
    readonly menu: PropType<DropdownMenuConfig>;
    readonly trigger: {
        readonly type: PropType<DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: PropType<DropdownPlacement>;
        readonly default: "bottomLeft";
    };
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly arrow: {
        readonly type: PropType<DropdownArrow>;
        readonly default: false;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyPopupOnHide: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<DropdownSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<DropdownSemanticPart, StyleValue>>>;
    readonly popupRender: PropType<DropdownRender>;
    readonly dropdownRender: PropType<DropdownRender>;
};
export declare const dropdownEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean, info?: DropdownOpenChangeInfo) => boolean;
    click: (_info: DropdownClickInfo) => boolean;
};
export type DropdownProps = ExtractPropTypes<typeof dropdownProps>;
