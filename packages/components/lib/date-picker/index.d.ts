declare const _default: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
        default: string;
    };
    format: {
        type: import("vue").PropType<string>;
        default: string;
    };
    modelValue: {
        type: import("vue").PropType<string>;
    };
    defaultValue: {
        type: import("vue").PropType<string>;
    };
    readOnly: {
        type: import("vue").PropType<boolean>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Date) => boolean>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string | undefined) => void;
    "update:modelValue": (value: string | undefined) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
        default: string;
    };
    format: {
        type: import("vue").PropType<string>;
        default: string;
    };
    modelValue: {
        type: import("vue").PropType<string>;
    };
    defaultValue: {
        type: import("vue").PropType<string>;
    };
    readOnly: {
        type: import("vue").PropType<boolean>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Date) => boolean>;
    };
}>> & Readonly<{
    onChange?: ((value: string | undefined) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    placeholder: string;
    format: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
