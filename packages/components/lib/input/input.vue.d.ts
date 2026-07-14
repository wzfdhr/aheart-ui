import type { PropType, VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly addonBefore: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly addonAfter: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<import("./types").InputStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: PropType<import("./types").InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: PropType<import("./types").InputShowCount>;
        readonly default: false;
    };
    readonly count: PropType<import("./types").InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => void;
    input: (value: string) => void;
    clear: () => void;
    "update:modelValue": (value: string) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly addonBefore: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly addonAfter: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<import("./types").InputStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").InputVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: PropType<import("./types").InputAllowClear>;
        readonly default: false;
    };
    readonly maxlength: NumberConstructor;
    readonly showCount: {
        readonly type: PropType<import("./types").InputShowCount>;
        readonly default: false;
    };
    readonly count: PropType<import("./types").InputCountConfig>;
    readonly type: {
        readonly type: StringConstructor;
        readonly default: "text";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").InputSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").InputSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onInput?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly type: string;
    readonly variant: import("./types").InputVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly allowClear: import("./types").InputAllowClear;
    readonly readOnly: boolean;
    readonly prefix: VNodeChild;
    readonly suffix: VNodeChild;
    readonly addonBefore: VNodeChild;
    readonly addonAfter: VNodeChild;
    readonly showCount: import("./types").InputShowCount;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    addonBefore?(_: {}): any;
    prefix?(_: {}): any;
    clearIcon?(_: {}): any;
    suffix?(_: {}): any;
    addonAfter?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
