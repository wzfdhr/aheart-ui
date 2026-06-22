declare const Radio: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly modelValue: BooleanConstructor;
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
export default Radio;
