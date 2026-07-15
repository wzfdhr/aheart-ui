import { type Component, type PropType, type VNodeChild } from 'vue';
import type { RangePickerPart, RangePickerValue } from '../picker-core/types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly placeholder: PropType<[string, string]>;
    readonly disabledTime: PropType<import("../picker-core/types").PickerDisabledTime>;
    readonly allowEmpty: {
        readonly type: PropType<[boolean, boolean]>;
        readonly default: () => boolean[];
    };
    readonly order: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly separator: PropType<VNodeChild>;
    readonly presets: PropType<import("../picker-core/types").PickerPreset<RangePickerValue>[]>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
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
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core/types").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
}>, {
    focus: (part?: RangePickerPart) => void | undefined;
    blur: () => void | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: RangePickerValue) => void;
    invalid: (input: string, part: RangePickerPart) => void;
    clear: () => void;
    ok: (value: RangePickerValue) => void;
    "update:modelValue": (value: RangePickerValue) => void;
    openChange: (open: boolean) => void;
    calendarChange: (value: RangePickerValue, info: {
        range: RangePickerPart;
    }) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly placeholder: PropType<[string, string]>;
    readonly disabledTime: PropType<import("../picker-core/types").PickerDisabledTime>;
    readonly allowEmpty: {
        readonly type: PropType<[boolean, boolean]>;
        readonly default: () => boolean[];
    };
    readonly order: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly separator: PropType<VNodeChild>;
    readonly presets: PropType<import("../picker-core/types").PickerPreset<RangePickerValue>[]>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
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
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core/types").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
}>> & Readonly<{
    onChange?: ((value: RangePickerValue) => any) | undefined;
    onInvalid?: ((input: string, part: RangePickerPart) => any) | undefined;
    onClear?: (() => any) | undefined;
    onOk?: ((value: RangePickerValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RangePickerValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onCalendarChange?: ((value: RangePickerValue, info: {
        range: RangePickerPart;
    }) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly order: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly format: string;
    readonly defaultOpen: boolean;
    readonly allowClear: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly needConfirm: boolean;
    readonly valueFormat: string;
    readonly readOnly: boolean;
    readonly allowEmpty: [boolean, boolean];
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
    separator?(_: {}): any;
    suffix?(_: {}): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
