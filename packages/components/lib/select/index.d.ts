declare const Select: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly name: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
        readonly options: import("vue").PropType<import("./types").SelectOption[]>;
        readonly placeholder: StringConstructor;
        readonly prefix: StringConstructor;
        readonly suffixIcon: StringConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").SelectStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").SelectVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: BooleanConstructor;
        readonly mode: import("vue").PropType<import("./types").SelectMode>;
        readonly showSearch: BooleanConstructor;
        readonly searchValue: StringConstructor;
        readonly filterOption: {
            readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
            readonly default: undefined;
        };
        readonly notFoundContent: {
            readonly type: StringConstructor;
            readonly default: "Not Found";
        };
        readonly maxCount: NumberConstructor;
    }>> & Readonly<{
        onSearch?: ((value: string) => any) | undefined;
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        search: (value: string) => void;
        change: (value: import("./types").SelectValue) => void;
        clear: () => void;
        "update:modelValue": (value: import("./types").SelectValue) => void;
    }, import("vue").PublicProps, {
        readonly variant: import("./types").SelectVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: boolean;
        readonly showSearch: boolean;
        readonly filterOption: import("./types").SelectFilterOption;
        readonly notFoundContent: string;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly name: StringConstructor;
        readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
        readonly options: import("vue").PropType<import("./types").SelectOption[]>;
        readonly placeholder: StringConstructor;
        readonly prefix: StringConstructor;
        readonly suffixIcon: StringConstructor;
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly status: import("vue").PropType<import("./types").SelectStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").SelectVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: BooleanConstructor;
        readonly mode: import("vue").PropType<import("./types").SelectMode>;
        readonly showSearch: BooleanConstructor;
        readonly searchValue: StringConstructor;
        readonly filterOption: {
            readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
            readonly default: undefined;
        };
        readonly notFoundContent: {
            readonly type: StringConstructor;
            readonly default: "Not Found";
        };
        readonly maxCount: NumberConstructor;
    }>> & Readonly<{
        onSearch?: ((value: string) => any) | undefined;
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly variant: import("./types").SelectVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: boolean;
        readonly showSearch: boolean;
        readonly filterOption: import("./types").SelectFilterOption;
        readonly notFoundContent: string;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: import("vue").PropType<import("./types").SelectValue>;
    readonly options: import("vue").PropType<import("./types").SelectOption[]>;
    readonly placeholder: StringConstructor;
    readonly prefix: StringConstructor;
    readonly suffixIcon: StringConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: import("vue").PropType<import("./types").SelectStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: BooleanConstructor;
    readonly mode: import("vue").PropType<import("./types").SelectMode>;
    readonly showSearch: BooleanConstructor;
    readonly searchValue: StringConstructor;
    readonly filterOption: {
        readonly type: import("vue").PropType<import("./types").SelectFilterOption>;
        readonly default: undefined;
    };
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
}>> & Readonly<{
    onSearch?: ((value: string) => any) | undefined;
    onChange?: ((value: import("./types").SelectValue) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (value: string) => void;
    change: (value: import("./types").SelectValue) => void;
    clear: () => void;
    "update:modelValue": (value: import("./types").SelectValue) => void;
}, string, {
    readonly variant: import("./types").SelectVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly allowClear: boolean;
    readonly showSearch: boolean;
    readonly filterOption: import("./types").SelectFilterOption;
    readonly notFoundContent: string;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        prefix?(_: {}): any;
        suffixIcon?(_: {}): any;
    };
})>;
export default Select;
