export type { TreeKey, TreeNodeData } from './types';
declare const _default: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    treeData: {
        type: import("vue").PropType<import("./types").TreeNodeData[]>;
        default: () => never[];
    };
    expandedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultExpandedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    selectedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultSelectedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    checkedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultCheckedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    defaultExpandAll: BooleanConstructor;
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    multiple: BooleanConstructor;
    checkable: BooleanConstructor;
    disabled: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => void;
    check: (keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => void;
    "update:selectedKeys": (keys: import("./types").TreeKey[]) => void;
    expand: (keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => void;
    "update:expandedKeys": (keys: import("./types").TreeKey[]) => void;
    "update:checkedKeys": (keys: import("./types").TreeKey[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    treeData: {
        type: import("vue").PropType<import("./types").TreeNodeData[]>;
        default: () => never[];
    };
    expandedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultExpandedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    selectedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultSelectedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    checkedKeys: import("vue").PropType<import("./types").TreeKey[]>;
    defaultCheckedKeys: {
        type: import("vue").PropType<import("./types").TreeKey[]>;
        default: () => never[];
    };
    defaultExpandAll: BooleanConstructor;
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    multiple: BooleanConstructor;
    checkable: BooleanConstructor;
    disabled: BooleanConstructor;
}>> & Readonly<{
    onSelect?: ((keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => any) | undefined;
    onCheck?: ((keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => any) | undefined;
    "onUpdate:selectedKeys"?: ((keys: import("./types").TreeKey[]) => any) | undefined;
    onExpand?: ((keys: import("./types").TreeKey[], node: import("./types").TreeNodeData) => any) | undefined;
    "onUpdate:expandedKeys"?: ((keys: import("./types").TreeKey[]) => any) | undefined;
    "onUpdate:checkedKeys"?: ((keys: import("./types").TreeKey[]) => any) | undefined;
}>, {
    multiple: boolean;
    disabled: boolean;
    defaultSelectedKeys: import("./types").TreeKey[];
    selectable: boolean;
    checkable: boolean;
    treeData: import("./types").TreeNodeData[];
    defaultExpandedKeys: import("./types").TreeKey[];
    defaultCheckedKeys: import("./types").TreeKey[];
    defaultExpandAll: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
