declare const Checkbox: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
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
export default Checkbox;
