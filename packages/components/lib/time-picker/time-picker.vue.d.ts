import { type Component, type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly defaultValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly hourStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly minuteStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly secondStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly format: {
        readonly type: StringConstructor;
        readonly default: "HH:mm:ss";
    };
    readonly valueFormat: {
        readonly type: StringConstructor;
        readonly default: "HH:mm:ss";
    };
    readonly use12Hours: BooleanConstructor;
    readonly allowClear: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
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
    readonly getPopupContainer: PropType<import("./types").TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly needConfirm: BooleanConstructor;
    readonly disabledTime: PropType<import("..").PickerSingleDisabledTime>;
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string | undefined) => void;
    invalid: (input: string) => void;
    clear: () => void;
    "update:modelValue": (value: string | undefined) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly defaultValue: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly hourStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly minuteStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly secondStep: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly format: {
        readonly type: StringConstructor;
        readonly default: "HH:mm:ss";
    };
    readonly valueFormat: {
        readonly type: StringConstructor;
        readonly default: "HH:mm:ss";
    };
    readonly use12Hours: BooleanConstructor;
    readonly allowClear: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
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
    readonly getPopupContainer: PropType<import("./types").TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly needConfirm: BooleanConstructor;
    readonly disabledTime: PropType<import("..").PickerSingleDisabledTime>;
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
}>> & Readonly<{
    onChange?: ((value: string | undefined) => any) | undefined;
    onInvalid?: ((input: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly format: string;
    readonly defaultOpen: boolean;
    readonly allowClear: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly needConfirm: boolean;
    readonly valueFormat: string;
    readonly readOnly: boolean;
    readonly hourStep: number;
    readonly minuteStep: number;
    readonly secondStep: number;
    readonly use12Hours: boolean;
    readonly hideDisabledOptions: boolean;
    readonly changeOnScroll: boolean;
    readonly showNow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    clearIcon?(_: {}): any;
    suffix?(_: {}): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
