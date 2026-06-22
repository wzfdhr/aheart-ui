import { type MenuClickInfo } from '../menu';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (_info: MenuClickInfo) => void;
    "update:open": (open: boolean) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly menu: import("vue").PropType<import("./types").DropdownMenuConfig>;
    readonly trigger: {
        readonly type: import("vue").PropType<import("./types").DropdownTrigger[]>;
        readonly default: () => string[];
    };
    readonly placement: {
        readonly type: import("vue").PropType<import("./types").DropdownPlacement>;
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
}>> & Readonly<{
    onClick?: ((_info: MenuClickInfo) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: import("./types").DropdownPlacement;
    readonly trigger: import("./types").DropdownTrigger[];
    readonly defaultOpen: boolean;
    readonly arrow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
