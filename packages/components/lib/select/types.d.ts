import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
import { type FloatingPlacement } from '../utils/floating';
export type SelectStatus = 'error' | 'warning';
export type SelectPrimitiveValue = string | number;
export type SelectMode = 'multiple' | 'tags';
export type SelectValue = SelectPrimitiveValue | SelectPrimitiveValue[];
export type SelectVariant = 'outlined' | 'borderless' | 'filled' | 'underlined';
export type SelectAllowClear = boolean | {
    clearIcon?: VNodeChild;
};
export type SelectPlacement = FloatingPlacement;
export type SelectGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export interface SelectOptionRenderInfo {
    index: number;
}
export interface SelectTagRenderInfo {
    label: string;
    value: SelectPrimitiveValue;
    closable: boolean;
    onClose: () => void;
}
export type SelectOptionRender = (option: SelectOption, info: SelectOptionRenderInfo) => VNodeChild;
export type SelectTagRender = (info: SelectTagRenderInfo) => VNodeChild;
export type SelectSemanticPart = 'root' | 'prefix' | 'search' | 'selector' | 'option' | 'notFound' | 'clear' | 'suffix' | 'loading' | 'selection' | 'tag' | 'tagRemove' | 'popup' | 'list';
export type SelectClassNames = Partial<Record<SelectSemanticPart, string>>;
export type SelectStyles = Partial<Record<SelectSemanticPart, StyleValue>>;
export interface SelectOption {
    label: string;
    value: SelectPrimitiveValue;
    disabled?: boolean;
}
export type SelectRawOption = SelectOption | Record<string, unknown>;
export interface SelectFieldNames {
    label?: string;
    value?: string;
    disabled?: string;
}
export type SelectFilterOption = boolean | ((inputValue: string, option: SelectOption) => boolean);
export interface SelectFilterSortInfo {
    searchValue: string;
}
export type SelectFilterSort = (optionA: SelectOption, optionB: SelectOption, info: SelectFilterSortInfo) => number;
export declare const selectProps: {
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
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly status: PropType<SelectStatus>;
    readonly variant: {
        readonly type: PropType<SelectVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly allowClear: {
        readonly type: PropType<SelectAllowClear>;
        readonly default: false;
    };
    readonly mode: PropType<SelectMode>;
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
    readonly getPopupContainer: PropType<SelectGetPopupContainer>;
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
        readonly type: PropType<SelectFilterOption>;
        readonly default: undefined;
    };
    readonly filterSort: PropType<SelectFilterSort>;
    readonly fieldNames: PropType<SelectFieldNames>;
    readonly notFoundContent: {
        readonly type: StringConstructor;
        readonly default: "Not Found";
    };
    readonly maxCount: NumberConstructor;
    readonly maxTagCount: NumberConstructor;
    readonly optionRender: PropType<SelectOptionRender>;
    readonly tagRender: PropType<SelectTagRender>;
    readonly loading: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<SelectSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<SelectSemanticPart, StyleValue>>>;
        readonly default: () => {};
    };
};
export declare const selectEmits: {
    'update:modelValue': (value: SelectValue) => boolean;
    change: (value: SelectValue) => boolean;
    clear: () => boolean;
    search: (value: string) => boolean;
    focus: (event: FocusEvent) => boolean;
    blur: (event: FocusEvent) => boolean;
    openChange: (open: boolean) => boolean;
};
export type SelectProps = ExtractPropTypes<typeof selectProps>;
