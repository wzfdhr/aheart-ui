import { type MenuClickInfo } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<import("./types").MenuItem[]>;
    readonly mode: {
        readonly type: import("vue").PropType<import("./types").MenuMode>;
        readonly default: "vertical";
    };
    readonly theme: {
        readonly type: import("vue").PropType<import("./types").MenuTheme>;
        readonly default: "light";
    };
    readonly selectedKeys: import("vue").PropType<string[]>;
    readonly defaultSelectedKeys: {
        readonly type: import("vue").PropType<string[]>;
        readonly default: () => never[];
    };
    readonly openKeys: import("vue").PropType<string[]>;
    readonly defaultOpenKeys: {
        readonly type: import("vue").PropType<string[]>;
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
        readonly type: import("vue").PropType<import("./types").MenuTriggerSubMenuAction>;
        readonly default: "click";
    };
    readonly expandIcon: import("vue").PropType<import("./types").MenuExpandIcon>;
    readonly className: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MenuSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MenuSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (_info: MenuClickInfo) => void;
    select: (_info: import("./types").MenuSelectInfo) => void;
    openChange: (keys: string[]) => void;
    deselect: (_info: import("./types").MenuSelectInfo) => void;
    "update:selectedKeys": (keys: string[]) => void;
    "update:openKeys": (keys: string[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<import("./types").MenuItem[]>;
    readonly mode: {
        readonly type: import("vue").PropType<import("./types").MenuMode>;
        readonly default: "vertical";
    };
    readonly theme: {
        readonly type: import("vue").PropType<import("./types").MenuTheme>;
        readonly default: "light";
    };
    readonly selectedKeys: import("vue").PropType<string[]>;
    readonly defaultSelectedKeys: {
        readonly type: import("vue").PropType<string[]>;
        readonly default: () => never[];
    };
    readonly openKeys: import("vue").PropType<string[]>;
    readonly defaultOpenKeys: {
        readonly type: import("vue").PropType<string[]>;
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
        readonly type: import("vue").PropType<import("./types").MenuTriggerSubMenuAction>;
        readonly default: "click";
    };
    readonly expandIcon: import("vue").PropType<import("./types").MenuExpandIcon>;
    readonly className: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MenuSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: import("vue").PropType<Partial<Record<import("./types").MenuSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>> & Readonly<{
    onClick?: ((_info: MenuClickInfo) => any) | undefined;
    onSelect?: ((_info: import("./types").MenuSelectInfo) => any) | undefined;
    onOpenChange?: ((keys: string[]) => any) | undefined;
    onDeselect?: ((_info: import("./types").MenuSelectInfo) => any) | undefined;
    "onUpdate:selectedKeys"?: ((keys: string[]) => any) | undefined;
    "onUpdate:openKeys"?: ((keys: string[]) => any) | undefined;
}>, {
    readonly classNames: Partial<Record<import("./types").MenuSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").MenuSemanticPart, import("vue").StyleValue>>;
    readonly multiple: boolean;
    readonly disabled: boolean;
    readonly mode: import("./types").MenuMode;
    readonly theme: import("./types").MenuTheme;
    readonly defaultSelectedKeys: string[];
    readonly defaultOpenKeys: string[];
    readonly selectable: boolean;
    readonly inlineCollapsed: boolean;
    readonly inlineIndent: number;
    readonly forceSubMenuRender: boolean;
    readonly triggerSubMenuAction: import("./types").MenuTriggerSubMenuAction;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
