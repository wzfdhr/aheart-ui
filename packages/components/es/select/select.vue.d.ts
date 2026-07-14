import { type PropType, type VNodeChild } from 'vue';
import { type SelectFieldNames, type SelectRawOption, type SelectValue } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: PropType<SelectValue>;
    readonly defaultValue: PropType<SelectValue>;
    readonly options: PropType<SelectRawOption[]>;
    readonly placeholder: StringConstructor;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild>;
    readonly loadingIcon: PropType<VNodeChild>;
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<import("./types").SelectStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: PropType<import("./types").SelectAllowClear>;
        readonly default: false;
    };
    readonly mode: PropType<import("./types").SelectMode>;
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "bottomLeft";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: PropType<import("./types").SelectGetPopupContainer>;
    readonly popupMatchSelectWidth: {
        readonly type: PropType<number | boolean>;
        readonly default: true;
    };
    readonly showSearch: BooleanConstructor;
    readonly searchValue: StringConstructor;
    readonly optionFilterProp: {
        readonly type: StringConstructor;
        readonly default: "label";
    };
    readonly filterOption: {
        readonly type: PropType<import("./types").SelectFilterOption>;
        readonly default: undefined;
    };
    readonly filterSort: PropType<import("./types").SelectFilterSort>;
    readonly fieldNames: PropType<SelectFieldNames>;
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
    readonly maxTagCount: NumberConstructor;
    readonly optionRender: PropType<import("./types").SelectOptionRender>;
    readonly tagRender: PropType<import("./types").SelectTagRender>;
    readonly loading: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SelectSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {
    focus: () => void | undefined;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    search: (value: string) => void;
    blur: (event: FocusEvent) => void;
    change: (value: SelectValue) => void;
    focus: (event: FocusEvent) => void;
    clear: () => void;
    "update:modelValue": (value: SelectValue) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly name: StringConstructor;
    readonly modelValue: PropType<SelectValue>;
    readonly defaultValue: PropType<SelectValue>;
    readonly options: PropType<SelectRawOption[]>;
    readonly placeholder: StringConstructor;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild>;
    readonly loadingIcon: PropType<VNodeChild>;
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<import("./types").SelectStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: PropType<import("./types").SelectAllowClear>;
        readonly default: false;
    };
    readonly mode: PropType<import("./types").SelectMode>;
    readonly open: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly defaultOpen: BooleanConstructor;
    readonly placement: {
        readonly type: PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "bottomLeft";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: PropType<import("./types").SelectGetPopupContainer>;
    readonly popupMatchSelectWidth: {
        readonly type: PropType<number | boolean>;
        readonly default: true;
    };
    readonly showSearch: BooleanConstructor;
    readonly searchValue: StringConstructor;
    readonly optionFilterProp: {
        readonly type: StringConstructor;
        readonly default: "label";
    };
    readonly filterOption: {
        readonly type: PropType<import("./types").SelectFilterOption>;
        readonly default: undefined;
    };
    readonly filterSort: PropType<import("./types").SelectFilterSort>;
    readonly fieldNames: PropType<SelectFieldNames>;
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
    readonly maxTagCount: NumberConstructor;
    readonly optionRender: PropType<import("./types").SelectOptionRender>;
    readonly tagRender: PropType<import("./types").SelectTagRender>;
    readonly loading: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SelectSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{
    onSearch?: ((value: string) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: SelectValue) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: SelectValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly variant: import("./types").SelectVariant;
    readonly classNames: Partial<Record<import("./types").SelectSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SelectSemanticPart, import("vue").StyleValue>>;
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly showSearch: boolean;
    readonly defaultOpen: boolean;
    readonly allowClear: import("./types").SelectAllowClear;
    readonly autoAdjustOverflow: boolean;
    readonly popupMatchSelectWidth: number | boolean;
    readonly optionFilterProp: string;
    readonly filterOption: import("./types").SelectFilterOption;
    readonly notFoundContent: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    clearIcon?(_: {}): any;
    loadingIcon?(_: {}): any;
    suffixIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
