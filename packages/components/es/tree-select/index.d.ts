declare const _default: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    multiple: {
        type: import("vue").PropType<boolean>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
        default: string;
    };
    modelValue: {
        type: import("vue").PropType<import("..").TreeKey | import("..").TreeKey[]>;
    };
    defaultValue: {
        type: import("vue").PropType<import("..").TreeKey | import("..").TreeKey[]>;
    };
    showSearch: {
        type: import("vue").PropType<boolean>;
    };
    treeData: {
        type: import("vue").PropType<import("..").TreeNodeData[]>;
        default: () => never[];
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("..").TreeKey | import("..").TreeKey[] | undefined) => void;
    "update:modelValue": (value: import("..").TreeKey | import("..").TreeKey[] | undefined) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    multiple: {
        type: import("vue").PropType<boolean>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
        default: string;
    };
    modelValue: {
        type: import("vue").PropType<import("..").TreeKey | import("..").TreeKey[]>;
    };
    defaultValue: {
        type: import("vue").PropType<import("..").TreeKey | import("..").TreeKey[]>;
    };
    showSearch: {
        type: import("vue").PropType<boolean>;
    };
    treeData: {
        type: import("vue").PropType<import("..").TreeNodeData[]>;
        default: () => never[];
    };
}>> & Readonly<{
    onChange?: ((value: import("..").TreeKey | import("..").TreeKey[] | undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("..").TreeKey | import("..").TreeKey[] | undefined) => any) | undefined;
}>, {
    placeholder: string;
    treeData: import("..").TreeNodeData[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
