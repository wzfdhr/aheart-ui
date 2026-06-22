declare const Input: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: StringConstructor;
        readonly placeholder: StringConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").InputStatus>;
        readonly allowClear: BooleanConstructor;
        readonly maxlength: NumberConstructor;
        readonly showCount: BooleanConstructor;
        readonly type: {
            readonly type: StringConstructor;
            readonly default: "text";
        };
    }>> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onClear?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: string) => void;
        input: (value: string) => void;
        "update:modelValue": (value: string) => void;
        clear: () => void;
    }, import("vue").PublicProps, {
        readonly type: string;
        readonly disabled: boolean;
        readonly allowClear: boolean;
        readonly showCount: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: StringConstructor;
        readonly placeholder: StringConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").InputStatus>;
        readonly allowClear: BooleanConstructor;
        readonly maxlength: NumberConstructor;
        readonly showCount: BooleanConstructor;
        readonly type: {
            readonly type: StringConstructor;
            readonly default: "text";
        };
    }>> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onClear?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly type: string;
        readonly disabled: boolean;
        readonly allowClear: boolean;
        readonly showCount: boolean;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").InputStatus>;
    readonly allowClear: BooleanConstructor;
    readonly maxlength: NumberConstructor;
    readonly showCount: BooleanConstructor;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    "update:modelValue": (value: string) => void;
    clear: () => void;
}, string, {
    readonly type: string;
    readonly disabled: boolean;
    readonly allowClear: boolean;
    readonly showCount: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prefix?(_: {}): any;
        suffix?(_: {}): any;
    };
})>;
export default Input;
