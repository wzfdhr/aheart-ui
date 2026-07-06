declare const InputNumber: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: NumberConstructor;
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
        readonly formatter: import("vue").PropType<(value: number | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
        readonly parser: import("vue").PropType<(displayValue: string) => number | undefined>;
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly controls: {
            readonly type: import("vue").PropType<import("./types").InputNumberControls>;
            readonly default: true;
        };
        readonly changeOnWheel: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((value: number | undefined) => any) | undefined;
        onStep?: ((value: number, info: import("./types").InputNumberStepInfo) => any) | undefined;
        "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: number | undefined) => void;
        step: (value: number, info: import("./types").InputNumberStepInfo) => void;
        "update:modelValue": (value: number | undefined) => void;
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
        readonly controls: import("./types").InputNumberControls;
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
        readonly modelValue: NumberConstructor;
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
        readonly formatter: import("vue").PropType<(value: number | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
        readonly parser: import("vue").PropType<(displayValue: string) => number | undefined>;
        readonly keyboard: {
            readonly type: BooleanConstructor;
            readonly default: true;
        };
        readonly controls: {
            readonly type: import("vue").PropType<import("./types").InputNumberControls>;
            readonly default: true;
        };
        readonly changeOnWheel: BooleanConstructor;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((value: number | undefined) => any) | undefined;
        onStep?: ((value: number, info: import("./types").InputNumberStepInfo) => any) | undefined;
        "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly variant: import("./types").InputNumberVariant;
        readonly disabled: boolean;
        readonly step: string | number;
        readonly bordered: boolean;
        readonly keyboard: boolean;
        readonly prefix: import("vue").VNodeChild;
        readonly suffix: import("vue").VNodeChild;
        readonly readOnly: boolean;
        readonly controls: import("./types").InputNumberControls;
        readonly changeOnWheel: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
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
    readonly formatter: import("vue").PropType<(value: number | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: import("vue").PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: import("vue").PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").InputNumberSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((value: number | undefined) => any) | undefined;
    onStep?: ((value: number, info: import("./types").InputNumberStepInfo) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: number | undefined) => void;
    step: (value: number, info: import("./types").InputNumberStepInfo) => void;
    "update:modelValue": (value: number | undefined) => void;
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
    readonly controls: import("./types").InputNumberControls;
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
