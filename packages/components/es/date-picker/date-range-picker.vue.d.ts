import { type PropType, type VNodeChild } from 'vue';
import type { RangePickerPart, RangePickerValue } from '../picker-core/types';
import { type DatePickerCellRenderInfo } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly showTime: PropType<boolean | import("../picker-core/types").PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<import("../picker-core/types").PickerPreset<RangePickerValue>[]>;
    readonly picker: {
        readonly type: PropType<import("../picker-core/types").PickerMode>;
        readonly default: "date";
    };
    readonly pickerValue: PropType<import("../picker-core/types").RangePickerPanelValue>;
    readonly defaultPickerValue: PropType<import("../picker-core/types").RangePickerPanelValue>;
    readonly allowEmpty: {
        readonly type: PropType<[boolean, boolean]>;
        readonly default: () => boolean[];
    };
    readonly order: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly separator: PropType<VNodeChild>;
    readonly minDate: StringConstructor;
    readonly maxDate: StringConstructor;
    readonly disabledDate: PropType<import("../picker-core/types").PickerDisabledDate>;
    readonly format: PropType<import("../picker-core/types").PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: PropType<[string, string]>;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core/types").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild>;
    readonly allowClear: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
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
    readonly getPopupContainer: PropType<import("./types").DatePickerGetPopupContainer>;
    readonly locale: PropType<import("../config").AheartLocale>;
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo & {
        range: RangePickerPart;
    }) => VNodeChild>;
}>, {
    focus: (part?: RangePickerPart) => void | undefined;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: RangePickerValue) => void;
    invalid: (input: string, part: RangePickerPart) => void;
    clear: () => void;
    ok: (value: RangePickerValue) => void;
    "update:modelValue": (value: RangePickerValue) => void;
    openChange: (open: boolean) => void;
    panelChange: (value: import("../picker-core/types").RangePickerPanelValue, mode: import("../picker-core/types").PickerMode) => void;
    calendarChange: (value: RangePickerValue, info: import("../picker-core/types").PickerCalendarChangeInfo) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly showTime: PropType<boolean | import("../picker-core/types").PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<import("../picker-core/types").PickerPreset<RangePickerValue>[]>;
    readonly picker: {
        readonly type: PropType<import("../picker-core/types").PickerMode>;
        readonly default: "date";
    };
    readonly pickerValue: PropType<import("../picker-core/types").RangePickerPanelValue>;
    readonly defaultPickerValue: PropType<import("../picker-core/types").RangePickerPanelValue>;
    readonly allowEmpty: {
        readonly type: PropType<[boolean, boolean]>;
        readonly default: () => boolean[];
    };
    readonly order: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly separator: PropType<VNodeChild>;
    readonly minDate: StringConstructor;
    readonly maxDate: StringConstructor;
    readonly disabledDate: PropType<import("../picker-core/types").PickerDisabledDate>;
    readonly format: PropType<import("../picker-core/types").PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: PropType<[string, string]>;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core/types").PickerStatus>;
    readonly variant: PropType<import("../config").AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild>;
    readonly allowClear: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
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
    readonly getPopupContainer: PropType<import("./types").DatePickerGetPopupContainer>;
    readonly locale: PropType<import("../config").AheartLocale>;
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo & {
        range: RangePickerPart;
    }) => VNodeChild>;
}>> & Readonly<{
    onChange?: ((value: RangePickerValue) => any) | undefined;
    onInvalid?: ((input: string, part: RangePickerPart) => any) | undefined;
    onClear?: (() => any) | undefined;
    onOk?: ((value: RangePickerValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RangePickerValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onPanelChange?: ((value: import("../picker-core/types").RangePickerPanelValue, mode: import("../picker-core/types").PickerMode) => any) | undefined;
    onCalendarChange?: ((value: RangePickerValue, info: import("../picker-core/types").PickerCalendarChangeInfo) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly order: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly defaultOpen: boolean;
    readonly allowClear: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly picker: import("../picker-core/types").PickerMode;
    readonly needConfirm: boolean;
    readonly readOnly: boolean;
    readonly allowEmpty: [boolean, boolean];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    separator?(_: {}): any;
    suffix?(_: {}): any;
    cell?(_: {
        mode: import("../picker-core/types").PickerMode;
        text: string;
        value: string;
        selected: boolean;
        disabled: boolean;
        range: RangePickerPart;
    }): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
