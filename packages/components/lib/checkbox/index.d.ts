declare const Checkbox: import("../utils/install").SFCWithInstall<{
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
        readonly value: import("vue").PropType<import("./types").CheckboxValue>;
        readonly name: StringConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly indeterminate: BooleanConstructor;
        readonly label: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((checked: boolean, event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLLabelElement | undefined, HTMLLabelElement | undefined>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        blur: (event: FocusEvent) => void;
        change: (checked: boolean, event: Event) => void;
        focus: (event: FocusEvent) => void;
        "update:modelValue": (checked: boolean) => void;
        "update:checked": (checked: boolean) => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly indeterminate: boolean;
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
        readonly value: import("vue").PropType<import("./types").CheckboxValue>;
        readonly name: StringConstructor;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly indeterminate: BooleanConstructor;
        readonly label: StringConstructor;
        readonly title: StringConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((checked: boolean, event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
        "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLLabelElement | undefined, HTMLLabelElement | undefined>;
    }, {}, {}, {}, {
        readonly disabled: boolean;
        readonly modelValue: boolean;
        readonly checked: boolean;
        readonly defaultChecked: boolean;
        readonly indeterminate: boolean;
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
    readonly value: import("vue").PropType<import("./types").CheckboxValue>;
    readonly name: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly indeterminate: BooleanConstructor;
    readonly label: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").CheckboxSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((checked: boolean, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {
    focus: () => void;
    blur: () => void;
    nativeElement: import("vue").Ref<HTMLLabelElement | undefined, HTMLLabelElement | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => void;
    change: (checked: boolean, event: Event) => void;
    focus: (event: FocusEvent) => void;
    "update:modelValue": (checked: boolean) => void;
    "update:checked": (checked: boolean) => void;
}, string, {
    readonly disabled: boolean;
    readonly modelValue: boolean;
    readonly checked: boolean;
    readonly defaultChecked: boolean;
    readonly indeterminate: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {}): any;
    };
})>;
export declare const CheckboxGroup: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxRawOption[]>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").CheckboxValue[]) => void;
    "update:modelValue": (value: import("./types").CheckboxValue[]) => void;
    "update:value": (value: import("./types").CheckboxValue[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly value: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly defaultValue: {
        readonly type: import("vue").PropType<import("./types").CheckboxValue[]>;
        readonly default: undefined;
    };
    readonly options: {
        readonly type: import("vue").PropType<import("./types").CheckboxRawOption[]>;
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
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>> & Readonly<{
    onChange?: ((value: import("./types").CheckboxValue[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").CheckboxValue[]) => any) | undefined;
    "onUpdate:value"?: ((value: import("./types").CheckboxValue[]) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly direction: import("./types").CheckboxGroupDirection;
    readonly value: import("./types").CheckboxValue[];
    readonly modelValue: import("./types").CheckboxValue[];
    readonly defaultValue: import("./types").CheckboxValue[];
    readonly options: import("./types").CheckboxRawOption[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export { CheckboxGroup as ACheckboxGroup };
export type { CheckboxGroupProps, CheckboxOption, CheckboxProps, CheckboxValue } from './types';
export default Checkbox;
