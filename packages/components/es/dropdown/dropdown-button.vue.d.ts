import { type PropType, type VNodeChild } from 'vue';
import { type DropdownOpenChangeInfo } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly menu: PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: PropType<import("./types").DropdownPlacement>;
        readonly default: "bottomRight";
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly type: PropType<import("./types").DropdownArrow>;
        readonly default: false;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyPopupOnHide: BooleanConstructor;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").DropdownClassNames>;
    readonly styles: PropType<import("./types").DropdownStyles>;
    readonly popupRender: PropType<import("./types").DropdownRender>;
    readonly dropdownRender: PropType<import("./types").DropdownRender>;
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
        readonly type: PropType<import("../button/types").ButtonLoading>;
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
    readonly style: PropType<import("vue").StyleValue>;
    readonly buttonsRender: PropType<import("./types").DropdownButtonRender>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean, info?: DropdownOpenChangeInfo | undefined) => void;
    menuClick: (_info: import("../menu").MenuClickInfo) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly menu: PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: PropType<import("./types").DropdownPlacement>;
        readonly default: "bottomRight";
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly type: PropType<import("./types").DropdownArrow>;
        readonly default: false;
    };
    readonly destroyOnHidden: BooleanConstructor;
    readonly destroyPopupOnHide: BooleanConstructor;
    readonly overlayClassName: StringConstructor;
    readonly overlayStyle: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").DropdownClassNames>;
    readonly styles: PropType<import("./types").DropdownStyles>;
    readonly popupRender: PropType<import("./types").DropdownRender>;
    readonly dropdownRender: PropType<import("./types").DropdownRender>;
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
        readonly type: PropType<import("../button/types").ButtonLoading>;
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
    readonly style: PropType<import("vue").StyleValue>;
    readonly buttonsRender: PropType<import("./types").DropdownButtonRender>;
}>> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean, info?: DropdownOpenChangeInfo | undefined) => any) | undefined;
    onMenuClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
}>, {
    readonly icon: VNodeChild;
    readonly type: "success" | "warning" | "link" | "default" | "text" | "dashed" | "primary" | "danger";
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: import("./types").DropdownPlacement;
    readonly danger: boolean;
    readonly nativeType: "reset" | "submit" | "button";
    readonly loading: import("../button/types").ButtonLoading;
    readonly destroyOnHidden: boolean;
    readonly trigger: import("./types").DropdownTrigger[];
    readonly arrow: import("./types").DropdownArrow;
    readonly autoAdjustOverflow: boolean;
    readonly mouseEnterDelay: number;
    readonly mouseLeaveDelay: number;
    readonly defaultOpen: boolean;
    readonly destroyPopupOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
