import { type SelectOption, type SelectValue } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: import("vue").PropType<SelectValue>;
    readonly options: import("vue").PropType<SelectOption[]>;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (value: string) => void;
    change: (value: SelectValue) => void;
    clear: () => void;
    "update:modelValue": (value: SelectValue) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: import("vue").PropType<SelectValue>;
    readonly options: import("vue").PropType<SelectOption[]>;
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
    onChange?: ((value: SelectValue) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: SelectValue) => any) | undefined;
}>, {
    readonly variant: import("./types").SelectVariant;
    readonly disabled: boolean;
    readonly bordered: boolean;
    readonly allowClear: boolean;
    readonly showSearch: boolean;
    readonly filterOption: import("./types").SelectFilterOption;
    readonly notFoundContent: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    suffixIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
