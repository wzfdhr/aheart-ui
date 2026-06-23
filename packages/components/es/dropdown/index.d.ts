declare const Dropdown: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
        readonly trigger: {
            readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
            readonly default: () => string[];
        };
        readonly placement: {
            readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
            readonly default: "bottomLeft";
        };
        readonly getPopupContainer: import("vue").PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, import("vue").StyleValue>>>;
        readonly popupRender: import("vue").PropType<import("./types").DropdownRender>;
        readonly dropdownRender: import("vue").PropType<import("./types").DropdownRender>;
    }>> & Readonly<{
        onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean, info?: import("./types").DropdownOpenChangeInfo | undefined) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        click: (_info: import("../menu").MenuClickInfo) => void;
        "update:open": (open: boolean) => void;
        openChange: (open: boolean, info?: import("./types").DropdownOpenChangeInfo | undefined) => void;
    }, import("vue").PublicProps, {
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: import("./types").DropdownPlacement;
        readonly destroyOnHidden: boolean;
        readonly trigger: import("./types").DropdownTrigger[];
        readonly arrow: import("./types").DropdownArrow;
        readonly defaultOpen: boolean;
        readonly destroyPopupOnHide: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
        readonly trigger: {
            readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
            readonly default: () => string[];
        };
        readonly placement: {
            readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
            readonly default: "bottomLeft";
        };
        readonly getPopupContainer: import("vue").PropType<import("./types").DropdownGetPopupContainer>;
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
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, import("vue").StyleValue>>>;
        readonly popupRender: import("vue").PropType<import("./types").DropdownRender>;
        readonly dropdownRender: import("vue").PropType<import("./types").DropdownRender>;
    }>> & Readonly<{
        onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
        "onUpdate:open"?: ((open: boolean) => any) | undefined;
        onOpenChange?: ((open: boolean, info?: import("./types").DropdownOpenChangeInfo | undefined) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly open: boolean;
        readonly disabled: boolean;
        readonly placement: import("./types").DropdownPlacement;
        readonly destroyOnHidden: boolean;
        readonly trigger: import("./types").DropdownTrigger[];
        readonly arrow: import("./types").DropdownArrow;
        readonly defaultOpen: boolean;
        readonly destroyPopupOnHide: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
        readonly default: "bottomLeft";
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").DropdownGetPopupContainer>;
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
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").DropdownSemanticPart, import("vue").StyleValue>>>;
    readonly popupRender: import("vue").PropType<import("./types").DropdownRender>;
    readonly dropdownRender: import("vue").PropType<import("./types").DropdownRender>;
}>> & Readonly<{
    onClick?: ((_info: import("../menu").MenuClickInfo) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean, info?: import("./types").DropdownOpenChangeInfo | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (_info: import("../menu").MenuClickInfo) => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean, info?: import("./types").DropdownOpenChangeInfo | undefined) => void;
}, string, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: import("./types").DropdownPlacement;
    readonly destroyOnHidden: boolean;
    readonly trigger: import("./types").DropdownTrigger[];
    readonly arrow: import("./types").DropdownArrow;
    readonly defaultOpen: boolean;
    readonly destroyPopupOnHide: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
        popup?(_: {}): any;
    };
})>;
export default Dropdown;
export type { DropdownClickInfo, DropdownMenuConfig, DropdownPlacement, DropdownProps, DropdownTrigger } from './types';
