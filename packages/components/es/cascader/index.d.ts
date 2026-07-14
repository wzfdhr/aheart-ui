export type { CascaderKey, CascaderOption, CascaderPath, CascaderValue } from './types';
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
    loadData: {
        type: import("vue").PropType<(option: import("./types").CascaderOption) => Promise<import("./types").CascaderOption[]>>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").CascaderValue) => void;
    "update:modelValue": (value: import("./types").CascaderValue) => void;
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
    loadData: {
        type: import("vue").PropType<(option: import("./types").CascaderOption) => Promise<import("./types").CascaderOption[]>>;
    };
}>> & Readonly<{
    onChange?: ((value: import("./types").CascaderValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").CascaderValue) => any) | undefined;
}>, {
    placeholder: string;
    options: import("./types").CascaderOption[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
