import { type MenuClickInfo } from '../menu';
import { type DropdownPlacement, type DropdownOpenChangeInfo } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<DropdownPlacement>;
        readonly default: "bottomLeft";
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly type: import("vue").PropType<import("./types").DropdownArrow>;
        readonly default: false;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyPopupOnHide: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").DropdownClassNames>;
    readonly styles: import("vue").PropType<import("./types").DropdownStyles>;
    readonly popupRender: import("vue").PropType<import("./types").DropdownRender>;
    readonly dropdownRender: import("vue").PropType<import("./types").DropdownRender>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (_info: MenuClickInfo) => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean, info?: DropdownOpenChangeInfo | undefined) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<DropdownPlacement>;
        readonly default: "bottomLeft";
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly type: import("vue").PropType<import("./types").DropdownArrow>;
        readonly default: false;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyPopupOnHide: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").DropdownClassNames>;
    readonly styles: import("vue").PropType<import("./types").DropdownStyles>;
    readonly popupRender: import("vue").PropType<import("./types").DropdownRender>;
    readonly dropdownRender: import("vue").PropType<import("./types").DropdownRender>;
}>> & Readonly<{
    onClick?: ((_info: MenuClickInfo) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean, info?: DropdownOpenChangeInfo | undefined) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: DropdownPlacement;
    readonly destroyOnHidden: boolean;
    readonly trigger: import("./types").DropdownTrigger[];
    readonly arrow: import("./types").DropdownArrow;
    readonly autoAdjustOverflow: boolean;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
    readonly defaultOpen: boolean;
    readonly destroyPopupOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
    popup?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
