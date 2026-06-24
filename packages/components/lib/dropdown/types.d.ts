import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import { type ButtonLoading } from '../button/types';
import type { MenuItem, MenuClickInfo } from '../menu';
export type DropdownTrigger = 'click' | 'hover' | 'contextMenu';
export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight';
export interface DropdownArrowConfig {
    pointAtCenter?: boolean;
}
export type DropdownArrow = boolean | DropdownArrowConfig;
export type DropdownSemanticPart = 'root' | 'trigger' | 'popup' | 'menu' | 'arrow';
export interface DropdownSemanticInfo {
    open: boolean;
    placement: DropdownPlacement;
}
export type DropdownSemanticClassNames = Partial<Record<DropdownSemanticPart, string>>;
export type DropdownSemanticStyles = Partial<Record<DropdownSemanticPart, StyleValue>>;
export type DropdownClassNames = DropdownSemanticClassNames | ((info: DropdownSemanticInfo) => DropdownSemanticClassNames);
export type DropdownStyles = DropdownSemanticStyles | ((info: DropdownSemanticInfo) => DropdownSemanticStyles);
export type DropdownRender = (menus: VNodeChild) => VNodeChild;
export type DropdownGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export type DropdownOpenChangeSource = 'trigger' | 'menu';
export type DropdownButtonRender = (buttons: VNodeChild[]) => VNodeChild[];
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
    readonly getPopupContainer: PropType<DropdownGetPopupContainer>;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
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
    readonly classNames: PropType<DropdownClassNames>;
    readonly styles: PropType<DropdownStyles>;
    readonly popupRender: PropType<DropdownRender>;
    readonly dropdownRender: PropType<DropdownRender>;
};
export declare const dropdownEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean, info?: DropdownOpenChangeInfo) => boolean;
    click: (_info: DropdownClickInfo) => boolean;
};
export type DropdownProps = ExtractPropTypes<typeof dropdownProps>;
export declare const dropdownButtonProps: {
    readonly menu: PropType<DropdownMenuConfig>;
    readonly trigger: {
        readonly type: PropType<DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: PropType<DropdownPlacement>;
        readonly default: "bottomRight";
    };
    readonly getPopupContainer: PropType<DropdownGetPopupContainer>;
    readonly mouseEnterDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
    };
    readonly mouseLeaveDelay: {
        readonly type: NumberConstructor;
        readonly default: 0.1;
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
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<StyleValue>;
    readonly classNames: PropType<DropdownClassNames>;
    readonly styles: PropType<DropdownStyles>;
    readonly popupRender: PropType<DropdownRender>;
    readonly dropdownRender: PropType<DropdownRender>;
    readonly type: {
        readonly type: PropType<"success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger">;
        readonly default: "default";
        readonly validator: (value: string) => boolean;
    };
    readonly size: {
        readonly type: PropType<"small" | "normal" | "middle" | "large" | "mini">;
        readonly validator: (value: string) => boolean;
    };
    readonly nativeType: {
        readonly type: PropType<"reset" | "submit" | "button">;
        readonly default: "button";
        readonly validator: (value: string) => boolean;
    };
    readonly htmlType: {
        readonly type: PropType<"reset" | "submit" | "button">;
        readonly validator: (value: string) => boolean;
    };
    readonly danger: BooleanConstructor;
    readonly loading: {
        readonly type: PropType<ButtonLoading>;
        readonly default: false;
    };
    readonly icon: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
    readonly href: StringConstructor;
    readonly target: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly buttonsRender: PropType<DropdownButtonRender>;
};
export declare const dropdownButtonEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean, info?: DropdownOpenChangeInfo) => boolean;
    click: (event: MouseEvent) => boolean;
    menuClick: (_info: DropdownClickInfo) => boolean;
};
export type DropdownButtonProps = ExtractPropTypes<typeof dropdownButtonProps>;
