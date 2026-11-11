declare const Combobox: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        id: {
            type: import("vue").PropType<string>;
        };
        modelValue: {
            type: import("vue").PropType<import("./types").ComboboxValue>;
        };
        defaultValue: {
            type: import("vue").PropType<import("./types").ComboboxValue>;
        };
        options: {
            type: import("vue").PropType<readonly import("./types").ComboboxOption[]>;
            required: true;
        };
        placeholder: {
            type: import("vue").PropType<string>;
        };
        disabled: {
            type: import("vue").PropType<boolean>;
        };
        getPopupContainer: {
            type: import("vue").PropType<(trigger: HTMLElement) => false | HTMLElement>;
        };
    }>> & Readonly<{
        onChange?: ((value: import("./types").ComboboxValue, option: import("./types").ComboboxOption) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").ComboboxValue | undefined) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: import("./types").ComboboxValue, option: import("./types").ComboboxOption) => void;
        "update:modelValue": (value: import("./types").ComboboxValue | undefined) => void;
    }, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        id: {
            type: import("vue").PropType<string>;
        };
        modelValue: {
            type: import("vue").PropType<import("./types").ComboboxValue>;
        };
        defaultValue: {
            type: import("vue").PropType<import("./types").ComboboxValue>;
        };
        options: {
            type: import("vue").PropType<readonly import("./types").ComboboxOption[]>;
            required: true;
        };
        placeholder: {
            type: import("vue").PropType<string>;
        };
        disabled: {
            type: import("vue").PropType<boolean>;
        };
        getPopupContainer: {
            type: import("vue").PropType<(trigger: HTMLElement) => false | HTMLElement>;
        };
    }>> & Readonly<{
        onChange?: ((value: import("./types").ComboboxValue, option: import("./types").ComboboxOption) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").ComboboxValue | undefined) => any) | undefined;
    }>, {}, {}, {}, {}, {}>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: import("vue").PropType<string>;
    };
    modelValue: {
        type: import("vue").PropType<import("./types").ComboboxValue>;
    };
    defaultValue: {
        type: import("vue").PropType<import("./types").ComboboxValue>;
    };
    options: {
        type: import("vue").PropType<readonly import("./types").ComboboxOption[]>;
        required: true;
    };
    placeholder: {
        type: import("vue").PropType<string>;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
    };
    getPopupContainer: {
        type: import("vue").PropType<(trigger: HTMLElement) => false | HTMLElement>;
    };
}>> & Readonly<{
    onChange?: ((value: import("./types").ComboboxValue, option: import("./types").ComboboxOption) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").ComboboxValue | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").ComboboxValue, option: import("./types").ComboboxOption) => void;
    "update:modelValue": (value: import("./types").ComboboxValue | undefined) => void;
}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        empty?(_: {}): any;
    };
})>;
export type * from './types';
export { Combobox, Combobox as ACombobox };
export default Combobox;
