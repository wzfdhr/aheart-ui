import { type TreeKey, type TreeNodeData } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    treeData: {
        type: import("vue").PropType<TreeNodeData[]>;
        default: () => never[];
    };
    expandedKeys: import("vue").PropType<TreeKey[]>;
    defaultExpandedKeys: {
        type: import("vue").PropType<TreeKey[]>;
        default: () => never[];
    };
    selectedKeys: import("vue").PropType<TreeKey[]>;
    defaultSelectedKeys: {
        type: import("vue").PropType<TreeKey[]>;
        default: () => never[];
    };
    checkedKeys: import("vue").PropType<TreeKey[]>;
    defaultCheckedKeys: {
        type: import("vue").PropType<TreeKey[]>;
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
    select: (keys: TreeKey[], node: TreeNodeData) => void;
    "update:selectedKeys": (keys: TreeKey[]) => void;
    expand: (keys: TreeKey[], node: TreeNodeData) => void;
    check: (keys: TreeKey[], node: TreeNodeData) => void;
    "update:expandedKeys": (keys: TreeKey[]) => void;
    "update:checkedKeys": (keys: TreeKey[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    treeData: {
        type: import("vue").PropType<TreeNodeData[]>;
        default: () => never[];
    };
    expandedKeys: import("vue").PropType<TreeKey[]>;
    defaultExpandedKeys: {
        type: import("vue").PropType<TreeKey[]>;
        default: () => never[];
    };
    selectedKeys: import("vue").PropType<TreeKey[]>;
    defaultSelectedKeys: {
        type: import("vue").PropType<TreeKey[]>;
        default: () => never[];
    };
    checkedKeys: import("vue").PropType<TreeKey[]>;
    defaultCheckedKeys: {
        type: import("vue").PropType<TreeKey[]>;
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
    onSelect?: ((keys: TreeKey[], node: TreeNodeData) => any) | undefined;
    "onUpdate:selectedKeys"?: ((keys: TreeKey[]) => any) | undefined;
    onExpand?: ((keys: TreeKey[], node: TreeNodeData) => any) | undefined;
    onCheck?: ((keys: TreeKey[], node: TreeNodeData) => any) | undefined;
    "onUpdate:expandedKeys"?: ((keys: TreeKey[]) => any) | undefined;
    "onUpdate:checkedKeys"?: ((keys: TreeKey[]) => any) | undefined;
}>, {
    multiple: boolean;
    disabled: boolean;
    defaultSelectedKeys: TreeKey[];
    selectable: boolean;
    checkable: boolean;
    treeData: TreeNodeData[];
    defaultExpandedKeys: TreeKey[];
    defaultCheckedKeys: TreeKey[];
    defaultExpandAll: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
