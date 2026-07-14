export type { CascaderKey, CascaderOption, CascaderPath, CascaderValue } from './types';
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
    options: {
        type: import("vue").PropType<import("./types").CascaderOption[]>;
        default: () => never[];
    };
    modelValue: {
        type: import("vue").PropType<import("./types").CascaderPath | import("./types").CascaderPath[]>;
    };
    defaultValue: {
        type: import("vue").PropType<import("./types").CascaderPath | import("./types").CascaderPath[]>;
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
    loadData: {
        type: import("vue").PropType<(option: import("./types").CascaderOption) => Promise<import("./types").CascaderOption[]>>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").CascaderValue) => void;
    clear: () => void;
    "update:modelValue": (value: import("./types").CascaderValue) => void;
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
    options: {
        type: import("vue").PropType<import("./types").CascaderOption[]>;
        default: () => never[];
    };
    modelValue: {
        type: import("vue").PropType<import("./types").CascaderPath | import("./types").CascaderPath[]>;
    };
    defaultValue: {
        type: import("vue").PropType<import("./types").CascaderPath | import("./types").CascaderPath[]>;
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
    loadData: {
        type: import("vue").PropType<(option: import("./types").CascaderOption) => Promise<import("./types").CascaderOption[]>>;
    };
}>> & Readonly<{
    onChange?: ((value: import("./types").CascaderValue) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").CascaderValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    placeholder: string;
    placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    options: import("./types").CascaderOption[];
    autoAdjustOverflow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
