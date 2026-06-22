declare const Radio: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
        readonly value: import("vue").PropType<import("./types").RadioValue>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly label: StringConstructor;
        readonly name: StringConstructor;
    }>> & Readonly<{
        onChange?: ((checked: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (checked: boolean) => void;
        "update:modelValue": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
        readonly value: import("vue").PropType<import("./types").RadioValue>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly label: StringConstructor;
        readonly name: StringConstructor;
    }>> & Readonly<{
        onChange?: ((checked: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: BooleanConstructor;
    readonly value: import("vue").PropType<import("./types").RadioValue>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly label: StringConstructor;
    readonly name: StringConstructor;
}>> & Readonly<{
    onChange?: ((checked: boolean) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean) => void;
    "update:modelValue": (checked: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly modelValue: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const RadioGroup: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<import("./types").RadioValue>;
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: import("vue").PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: import("vue").PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").RadioValue) => void;
    "update:modelValue": (value: import("./types").RadioValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: import("vue").PropType<import("./types").RadioValue>;
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioOption[]>;
        readonly default: () => never[];
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly name: StringConstructor;
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").RadioGroupDirection>;
        readonly default: "horizontal";
    };
    readonly optionType: {
        readonly type: import("vue").PropType<import("./types").RadioOptionType>;
        readonly default: "default";
    };
    readonly buttonStyle: {
        readonly type: import("vue").PropType<import("./types").RadioButtonStyle>;
        readonly default: "outline";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly block: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((value: import("./types").RadioValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").RadioValue) => any) | undefined;
}>, {
    readonly block: boolean;
    readonly disabled: boolean;
    readonly options: import("./types").RadioOption[];
    readonly direction: import("./types").RadioGroupDirection;
    readonly optionType: import("./types").RadioOptionType;
    readonly buttonStyle: import("./types").RadioButtonStyle;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { RadioGroup as ARadioGroup };
export type { RadioButtonStyle, RadioGroupProps, RadioOption, RadioOptionType, RadioProps, RadioValue } from './types';
export default Radio;
