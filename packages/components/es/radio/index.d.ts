declare const Radio: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly checked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultChecked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly value: {
            readonly type: import("vue").PropType<import("./types").RadioValue>;
            readonly default: undefined;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly autoFocus: BooleanConstructor;
        readonly label: StringConstructor;
        readonly name: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (checked: boolean, event: Event) => void;
        "update:modelValue": (checked: boolean) => void;
        "update:checked": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly value: import("./types").RadioValue;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly autoFocus: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly checked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly defaultChecked: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly value: {
            readonly type: import("vue").PropType<import("./types").RadioValue>;
            readonly default: undefined;
        };
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly autoFocus: BooleanConstructor;
        readonly label: StringConstructor;
        readonly name: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((checked: boolean, event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
    }, {}, {}, {}, {
        readonly disabled: boolean;
        readonly value: import("./types").RadioValue;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly autoFocus: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly checked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultChecked: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly autoFocus: BooleanConstructor;
    readonly label: StringConstructor;
    readonly name: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").RadioSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((checked: boolean, event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {
    focus: () => void;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (checked: boolean, event: Event) => void;
    "update:modelValue": (checked: boolean) => void;
    "update:checked": (checked: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly value: import("./types").RadioValue;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly autoFocus: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const RadioGroup: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioRawOption[]>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").RadioValue) => void;
    "update:modelValue": (value: import("./types").RadioValue) => void;
    "update:value": (value: import("./types").RadioValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").RadioValue>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").RadioRawOption[]>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>> & Readonly<{
    onChange?: ((value: import("./types").RadioValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").RadioValue) => any) | undefined;
    "onUpdate:value"?: ((value: import("./types").RadioValue) => any) | undefined;
}>, {
    readonly block: boolean;
    readonly disabled: boolean;
    readonly direction: import("./types").RadioGroupDirection;
    readonly value: import("./types").RadioValue;
    readonly modelValue: import("./types").RadioValue;
    readonly defaultValue: import("./types").RadioValue;
    readonly options: import("./types").RadioRawOption[];
    readonly buttonStyle: import("./types").RadioButtonStyle;
    readonly optionType: import("./types").RadioOptionType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { RadioGroup as ARadioGroup };
export type { RadioButtonStyle, RadioGroupProps, RadioOption, RadioOptionType, RadioProps, RadioValue } from './types';
export default Radio;
