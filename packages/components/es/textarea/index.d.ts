declare const Textarea: import("../utils/install").SFCWithInstall<{
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        readonly id: StringConstructor;
        readonly modelValue: StringConstructor;
        readonly placeholder: StringConstructor;
        readonly rows: {
            readonly type: NumberConstructor;
            readonly default: 3;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").TextareaStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").TextareaVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").TextareaAllowClear>;
            readonly default: false;
        };
        readonly maxlength: NumberConstructor;
        readonly showCount: {
            readonly type: import("vue").PropType<import("./types").TextareaShowCount>;
            readonly default: false;
        };
        readonly count: import("vue").PropType<import("./types").TextareaCountConfig>;
        readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, import("vue").StyleValue>>>;
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
        readonly variant: import("./types").TextareaVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: import("./types").TextareaAllowClear;
        readonly readOnly: boolean;
        readonly rows: number;
        readonly showCount: import("./types").TextareaShowCount;
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
        readonly rows: {
            readonly type: NumberConstructor;
            readonly default: 3;
        };
        readonly size: import("vue").PropType<import("../config").AheartSize>;
        readonly disabled: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly readOnly: BooleanConstructor;
        readonly status: import("vue").PropType<import("./types").TextareaStatus>;
        readonly variant: {
            readonly type: import("vue").PropType<import("./types").TextareaVariant>;
            readonly default: undefined;
        };
        readonly bordered: {
            readonly type: BooleanConstructor;
            readonly default: undefined;
        };
        readonly allowClear: {
            readonly type: import("vue").PropType<import("./types").TextareaAllowClear>;
            readonly default: false;
        };
        readonly maxlength: NumberConstructor;
        readonly showCount: {
            readonly type: import("vue").PropType<import("./types").TextareaShowCount>;
            readonly default: false;
        };
        readonly count: import("vue").PropType<import("./types").TextareaCountConfig>;
        readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
        readonly className: StringConstructor;
        readonly rootClassName: StringConstructor;
        readonly style: import("vue").PropType<import("vue").StyleValue>;
        readonly classNames: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, string>>>;
        readonly styles: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, import("vue").StyleValue>>>;
    }>> & Readonly<{
        onChange?: ((value: string) => any) | undefined;
        onInput?: ((value: string) => any) | undefined;
        onClear?: (() => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
    }>, {}, {}, {}, {}, {
        readonly variant: import("./types").TextareaVariant;
        readonly disabled: boolean;
        readonly bordered: boolean;
        readonly allowClear: import("./types").TextareaAllowClear;
        readonly readOnly: boolean;
        readonly rows: number;
        readonly showCount: import("./types").TextareaShowCount;
    }>;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly rows: {
        readonly type: NumberConstructor;
        readonly default: 3;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").TextareaStatus>;
    readonly variant: {
        readonly type: import("vue").PropType<import("./types").TextareaVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: import("vue").PropType<import("./types").TextareaAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: import("vue").PropType<import("./types").TextareaShowCount>;
        readonly default: false;
    };
    readonly count: import("vue").PropType<import("./types").TextareaCountConfig>;
    readonly autoSize: import("vue").PropType<boolean | import("./types").TextareaAutoSizeConfig>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").TextareaSemanticPart, import("vue").StyleValue>>>;
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
    readonly variant: import("./types").TextareaVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly allowClear: import("./types").TextareaAllowClear;
    readonly readOnly: boolean;
    readonly rows: number;
    readonly showCount: import("./types").TextareaShowCount;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
    $slots: {
        clearIcon?(_: {}): any;
    };
})>;
export type * from './types';
export default Textarea;
