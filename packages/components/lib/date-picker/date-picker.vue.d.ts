import { type PropType, type VNodeChild } from 'vue';
import type { DatePickerValue, DatePickerCellRenderInfo } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: PropType<DatePickerValue>;
    readonly defaultValue: PropType<DatePickerValue>;
    readonly picker: {
        readonly type: PropType<import("..").PickerMode>;
        readonly default: "date";
    };
    readonly multiple: BooleanConstructor;
    readonly showTime: PropType<boolean | import("..").PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<import("..").PickerPreset<DatePickerValue>[]>;
    readonly minDate: StringConstructor;
    readonly maxDate: StringConstructor;
    readonly disabledDate: PropType<import("..").PickerDisabledDate>;
    readonly defaultPickerValue: StringConstructor;
    readonly pickerValue: StringConstructor;
    readonly format: PropType<import("..").PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core").PickerStatus>;
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
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo) => VNodeChild>;
}>, {
    focus: () => void | undefined;
    blur: () => void | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: DatePickerValue) => void;
    invalid: (input: string) => void;
    clear: () => void;
    ok: (value: DatePickerValue) => void;
    "update:modelValue": (value: DatePickerValue) => void;
    openChange: (open: boolean) => void;
    panelChange: (value: string, mode: import("..").PickerMode) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: PropType<DatePickerValue>;
    readonly defaultValue: PropType<DatePickerValue>;
    readonly picker: {
        readonly type: PropType<import("..").PickerMode>;
        readonly default: "date";
    };
    readonly multiple: BooleanConstructor;
    readonly showTime: PropType<boolean | import("..").PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<import("..").PickerPreset<DatePickerValue>[]>;
    readonly minDate: StringConstructor;
    readonly maxDate: StringConstructor;
    readonly disabledDate: PropType<import("..").PickerDisabledDate>;
    readonly defaultPickerValue: StringConstructor;
    readonly pickerValue: StringConstructor;
    readonly format: PropType<import("..").PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly status: PropType<import("../picker-core").PickerStatus>;
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
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo) => VNodeChild>;
}>> & Readonly<{
    onChange?: ((value: DatePickerValue) => any) | undefined;
    onInvalid?: ((input: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    onOk?: ((value: DatePickerValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: DatePickerValue) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onPanelChange?: ((value: string, mode: import("..").PickerMode) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly multiple: boolean;
    readonly disabled: boolean;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly defaultOpen: boolean;
    readonly allowClear: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly picker: import("..").PickerMode;
    readonly needConfirm: boolean;
    readonly readOnly: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    tag?(_: {
        value: string;
    }): any;
    suffix?(_: {}): any;
    cell?(_: {
        mode: import("..").PickerMode;
        text: string;
        value: string;
        selected: boolean;
        disabled: boolean;
    }): any;
    footer?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
