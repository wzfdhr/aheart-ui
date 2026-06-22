declare const Checkbox: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
        readonly value: import("vue").PropType<import("./types").CheckboxValue>;
        readonly name: StringConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly indeterminate: BooleanConstructor;
        readonly label: StringConstructor;
    }>> & Readonly<{
        onChange?: ((checked: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (checked: boolean) => void;
        "update:modelValue": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
        readonly indeterminate: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
        readonly value: import("vue").PropType<import("./types").CheckboxValue>;
        readonly name: StringConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly indeterminate: BooleanConstructor;
        readonly label: StringConstructor;
    }>> & Readonly<{
        onChange?: ((checked: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
        readonly indeterminate: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: BooleanConstructor;
    readonly value: import("vue").PropType<import("./types").CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
}>> & Readonly<{
    onChange?: ((checked: boolean) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean) => void;
    "update:modelValue": (checked: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly modelValue: boolean;
    readonly indeterminate: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const CheckboxGroup: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: () => never[];
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").CheckboxValue[]) => void;
    "update:modelValue": (value: import("./types").CheckboxValue[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: () => never[];
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").CheckboxGroupDirection>;
        readonly default: "horizontal";
    };
}>> & Readonly<{
    onChange?: ((value: import("./types").CheckboxValue[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").CheckboxValue[]) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly modelValue: import("./types").CheckboxValue[];
    readonly options: import("./types").CheckboxOption[];
    readonly direction: import("./types").CheckboxGroupDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { CheckboxGroup as ACheckboxGroup };
export type { CheckboxGroupProps, CheckboxOption, CheckboxProps, CheckboxValue } from './types';
export default Checkbox;
