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
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onSearch?: ((value: string) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
        onClear?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
        change: (value: import("./types").SelectValue) => void;
        search: (value: string) => void;
        "update:modelValue": (value: import("./types").SelectValue) => void;
        clear: () => void;
    }, import("vue").PublicProps, {
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly variant: import("./types").SelectVariant;
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
        onChange?: ((value: import("./types").SelectValue) => any) | undefined;
        onSearch?: ((value: string) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
        onClear?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly variant: import("./types").SelectVariant;
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
    onChange?: ((value: import("./types").SelectValue) => any) | undefined;
    onSearch?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("./types").SelectValue) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: import("./types").SelectValue) => void;
    search: (value: string) => void;
    "update:modelValue": (value: import("./types").SelectValue) => void;
    clear: () => void;
}, string, {
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly variant: import("./types").SelectVariant;
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
