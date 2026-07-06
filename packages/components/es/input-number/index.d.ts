declare const InputNumber: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").InputNumberValue>;
        readonly value: import("vue").PropType<import("./types").InputNumberValue>;
        readonly defaultValue: import("vue").PropType<import("./types").InputNumberValue>;
        readonly autoFocus: BooleanConstructor;
        readonly placeholder: StringConstructor;
        readonly prefix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly suffix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").InputNumberStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").InputNumberVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly min: NumberConstructor;
        readonly max: NumberConstructor;
        readonly step: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 1;
        };
        readonly precision: NumberConstructor;
        readonly decimalSeparator: StringConstructor;
        readonly stringMode: BooleanConstructor;
        readonly formatter: import("vue").PropType<(value: import("./types").InputNumberValue | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
        readonly parser: import("vue").PropType<(displayValue: string) => import("./types").InputNumberValue | undefined>;
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly controls: {
            readonly type: import("vue").PropType<import("./types").InputNumberControls>;
            readonly default: true;
        };
        readonly changeOnBlur: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly changeOnWheel: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").InputNumberClassNames>;
        readonly styles: import("vue").PropType<import("./types").InputNumberStyles>;
    }>> & Readonly<{
        onChange?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
        onStep?: ((value: import("./types").InputNumberValue, info: import("./types").InputNumberStepInfo) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {
        focus: (options?: import("./types").InputNumberFocusOptions | undefined) => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: import("./types").InputNumberValue | undefined) => void;
        step: (value: import("./types").InputNumberValue, info: import("./types").InputNumberStepInfo) => void;
        "update:modelValue": (value: import("./types").InputNumberValue | undefined) => void;
        pressEnter: (event: KeyboardEvent) => void;
    }, import("vue").PublicProps, {
        readonly variant: import("./types").InputNumberVariant;
        readonly disabled: boolean;
        readonly step: string | number;
        readonly bordered: boolean;
        readonly keyboard: boolean;
        readonly prefix: import("vue").VNodeChild;
        readonly suffix: import("vue").VNodeChild;
        readonly readOnly: boolean;
        readonly autoFocus: boolean;
        readonly stringMode: boolean;
        readonly controls: import("./types").InputNumberControls;
        readonly changeOnBlur: boolean;
        readonly changeOnWheel: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").InputNumberValue>;
        readonly value: import("vue").PropType<import("./types").InputNumberValue>;
        readonly defaultValue: import("vue").PropType<import("./types").InputNumberValue>;
        readonly autoFocus: BooleanConstructor;
        readonly placeholder: StringConstructor;
        readonly prefix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly suffix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").InputNumberStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").InputNumberVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly min: NumberConstructor;
        readonly max: NumberConstructor;
        readonly step: {
            readonly type: import("vue").PropType<string | number>;
            readonly default: 1;
        };
        readonly precision: NumberConstructor;
        readonly decimalSeparator: StringConstructor;
        readonly stringMode: BooleanConstructor;
        readonly formatter: import("vue").PropType<(value: import("./types").InputNumberValue | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
        readonly parser: import("vue").PropType<(displayValue: string) => import("./types").InputNumberValue | undefined>;
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly controls: {
            readonly type: import("vue").PropType<import("./types").InputNumberControls>;
            readonly default: true;
        };
        readonly changeOnBlur: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly changeOnWheel: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<import("./types").InputNumberClassNames>;
        readonly styles: import("vue").PropType<import("./types").InputNumberStyles>;
    }>> & Readonly<{
        onChange?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
        onStep?: ((value: import("./types").InputNumberValue, info: import("./types").InputNumberStepInfo) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {
        focus: (options?: import("./types").InputNumberFocusOptions | undefined) => void;
        blur: () => void;
        nativeElement: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
    }, {}, {}, {}, {
        readonly variant: import("./types").InputNumberVariant;
        readonly disabled: boolean;
        readonly step: string | number;
        readonly bordered: boolean;
        readonly keyboard: boolean;
        readonly prefix: import("vue").VNodeChild;
        readonly suffix: import("vue").VNodeChild;
        readonly readOnly: boolean;
        readonly autoFocus: boolean;
        readonly stringMode: boolean;
        readonly controls: import("./types").InputNumberControls;
        readonly changeOnBlur: boolean;
        readonly changeOnWheel: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: import("vue").PropType<import("./types").InputNumberValue>;
    readonly value: import("vue").PropType<import("./types").InputNumberValue>;
    readonly defaultValue: import("vue").PropType<import("./types").InputNumberValue>;
    readonly autoFocus: BooleanConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputNumberStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: import("vue").PropType<string | number>;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly stringMode: BooleanConstructor;
    readonly formatter: import("vue").PropType<(value: import("./types").InputNumberValue | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: import("vue").PropType<(displayValue: string) => import("./types").InputNumberValue | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: import("vue").PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnBlur: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<import("./types").InputNumberClassNames>;
    readonly styles: import("vue").PropType<import("./types").InputNumberStyles>;
}>> & Readonly<{
    onChange?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
    onStep?: ((value: import("./types").InputNumberValue, info: import("./types").InputNumberStepInfo) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").InputNumberValue | undefined) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    focus: (options?: import("./types").InputNumberFocusOptions | undefined) => void;
    blur: () => void;
    nativeElement: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").InputNumberValue | undefined) => void;
    step: (value: import("./types").InputNumberValue, info: import("./types").InputNumberStepInfo) => void;
    "update:modelValue": (value: import("./types").InputNumberValue | undefined) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, {
    readonly variant: import("./types").InputNumberVariant;
    readonly disabled: boolean;
    readonly step: string | number;
    readonly bordered: boolean;
    readonly keyboard: boolean;
    readonly prefix: import("vue").VNodeChild;
    readonly suffix: import("vue").VNodeChild;
    readonly readOnly: boolean;
    readonly autoFocus: boolean;
    readonly stringMode: boolean;
    readonly controls: import("./types").InputNumberControls;
    readonly changeOnBlur: boolean;
    readonly changeOnWheel: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prefix?(_: {}): any;
        suffix?(_: {}): any;
        increaseIcon?(_: {}): any;
        decreaseIcon?(_: {}): any;
    };
})>;
export default InputNumber;
