declare const Input: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: StringConstructor;
        readonly placeholder: StringConstructor;
        readonly prefix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly suffix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly addonBefore: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly addonAfter: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").InputStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").InputVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").InputAllowClear>;
            readonly default: false;
        };
        readonly maxlength: NumberConstructor;
        readonly showCount: {
            readonly type: import("vue").PropType<import("./types").InputShowCount>;
            readonly default: false;
        };
        readonly count: import("vue").PropType<import("./types").InputCountConfig>;
        readonly type: {
            readonly type: StringConstructor;
            readonly default: "text";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: string) => void;
        input: (value: string) => void;
        clear: () => void;
        "update:modelValue": (value: string) => void;
        pressEnter: (event: KeyboardEvent) => void;
    }, import("vue").PublicProps, {
        readonly type: string;
        readonly variant: import("./types").InputVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: import("./types").InputAllowClear;
        readonly readOnly: boolean;
        readonly prefix: import("vue").VNodeChild;
        readonly suffix: import("vue").VNodeChild;
        readonly addonBefore: import("vue").VNodeChild;
        readonly addonAfter: import("vue").VNodeChild;
        readonly showCount: import("./types").InputShowCount;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: StringConstructor;
        readonly placeholder: StringConstructor;
        readonly prefix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly suffix: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly addonBefore: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly addonAfter: {
            type: import("vue").PropType<import("vue").VNodeChild>;
            default: undefined;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").InputStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").InputVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").InputAllowClear>;
            readonly default: false;
        };
        readonly maxlength: NumberConstructor;
        readonly showCount: {
            readonly type: import("vue").PropType<import("./types").InputShowCount>;
            readonly default: false;
        };
        readonly count: import("vue").PropType<import("./types").InputCountConfig>;
        readonly type: {
            readonly type: StringConstructor;
            readonly default: "text";
        };
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: string;
        readonly variant: import("./types").InputVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: import("./types").InputAllowClear;
        readonly readOnly: boolean;
        readonly prefix: import("vue").VNodeChild;
        readonly suffix: import("vue").VNodeChild;
        readonly addonBefore: import("vue").VNodeChild;
        readonly addonAfter: import("vue").VNodeChild;
        readonly showCount: import("./types").InputShowCount;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly addonBefore: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly addonAfter: {
        type: import("vue").PropType<import("vue").VNodeChild>;
        default: undefined;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").InputShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    clear: () => void;
    "update:modelValue": (value: string) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, {
    readonly type: string;
    readonly variant: import("./types").InputVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly allowClear: import("./types").InputAllowClear;
    readonly readOnly: boolean;
    readonly prefix: import("vue").VNodeChild;
    readonly suffix: import("vue").VNodeChild;
    readonly addonBefore: import("vue").VNodeChild;
    readonly addonAfter: import("vue").VNodeChild;
    readonly showCount: import("./types").InputShowCount;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        addonBefore?(_: {}): any;
        prefix?(_: {}): any;
        clearIcon?(_: {}): any;
        suffix?(_: {}): any;
        addonAfter?(_: {}): any;
    };
})>;
export default Input;
