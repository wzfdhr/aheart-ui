import type { ExtractPropTypes, PropType } from 'vue';
import type { MenuItem, MenuClickInfo } from '../menu';
export type DropdownTrigger = 'click' | 'hover';
export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight';
export interface DropdownMenuConfig {
    items?: MenuItem[];
    selectable?: boolean;
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
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
    readonly arrow: BooleanConstructor;
};
export declare const dropdownEmits: {
    'update:open': (open: boolean) => boolean;
    openChange: (open: boolean) => boolean;
    click: (_info: DropdownClickInfo) => boolean;
};
export type DropdownProps = ExtractPropTypes<typeof dropdownProps>;
