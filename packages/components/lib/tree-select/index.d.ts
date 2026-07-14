declare const _default: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    open: {
        type: import("vue").PropType<boolean>;
    };
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
    placement: {
        type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        default: string;
    };
    id: {
        type: import("vue").PropType<string>;
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
    defaultOpen: {
        type: import("vue").PropType<boolean>;
    };
    allowClear: {
        type: import("vue").PropType<boolean>;
    };
    maxTagCount: {
        type: import("vue").PropType<number>;
    };
    autoAdjustOverflow: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    };
    labelledBy: {
        type: import("vue").PropType<string>;
    };
    ariaLabelledby: {
        type: import("vue").PropType<string>;
    };
    treeData: {
        type: import("vue").PropType<import("..").TreeNodeData[]>;
        default: () => never[];
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("..").TreeKey | import("..").TreeKey[] | undefined) => void;
    clear: () => void;
    "update:modelValue": (value: import("..").TreeKey | import("..").TreeKey[] | undefined) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    open: {
        type: import("vue").PropType<boolean>;
    };
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
    placement: {
        type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        default: string;
    };
    id: {
        type: import("vue").PropType<string>;
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
    defaultOpen: {
        type: import("vue").PropType<boolean>;
    };
    allowClear: {
        type: import("vue").PropType<boolean>;
    };
    maxTagCount: {
        type: import("vue").PropType<number>;
    };
    autoAdjustOverflow: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    };
    labelledBy: {
        type: import("vue").PropType<string>;
    };
    ariaLabelledby: {
        type: import("vue").PropType<string>;
    };
    treeData: {
        type: import("vue").PropType<import("..").TreeNodeData[]>;
        default: () => never[];
    };
}>> & Readonly<{
    onChange?: ((value: import("..").TreeKey | import("..").TreeKey[] | undefined) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("..").TreeKey | import("..").TreeKey[] | undefined) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    placeholder: string;
    placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    autoAdjustOverflow: boolean;
    treeData: import("..").TreeNodeData[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
