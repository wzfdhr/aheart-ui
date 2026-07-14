import type { PropType } from 'vue';
export type TreeKey = string | number;
export interface TreeNodeData {
    key: TreeKey;
    title: string;
    disabled?: boolean;
    children?: TreeNodeData[];
}
export declare const treeProps: {
    treeData: {
        type: PropType<TreeNodeData[]>;
        default: () => never[];
    };
    expandedKeys: PropType<TreeKey[]>;
    defaultExpandedKeys: {
        type: PropType<TreeKey[]>;
        default: () => never[];
    };
    selectedKeys: PropType<TreeKey[]>;
    defaultSelectedKeys: {
        type: PropType<TreeKey[]>;
        default: () => never[];
    };
    checkedKeys: PropType<TreeKey[]>;
    defaultCheckedKeys: {
        type: PropType<TreeKey[]>;
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
};
