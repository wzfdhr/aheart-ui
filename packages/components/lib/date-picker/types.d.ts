import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { AheartLocale, AheartSize, AheartVariant } from '../config';
import type { DatePickerPublicProps, MultiplePickerValue, PickerDisabledDate, PickerFormat, PickerMode, PickerPreset, PickerCalendarChangeInfo, RangePickerPanelValue, RangePickerPart, RangePickerValue, PickerShowTimeOptions, PickerStatus, PickerValue } from '../picker-core/types';
export type DatePickerValue = PickerValue | MultiplePickerValue;
export type DatePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export interface DatePickerCellRenderInfo {
    mode: PickerMode;
    text: string;
    value: string;
    selected: boolean;
    disabled: boolean;
}
export declare const datePickerProps: {
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: PropType<DatePickerValue>;
    readonly defaultValue: PropType<DatePickerValue>;
    readonly picker: {
        readonly type: PropType<PickerMode>;
        readonly default: "date";
    };
    readonly multiple: BooleanConstructor;
    readonly showTime: PropType<boolean | PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<PickerPreset<DatePickerValue>[]>;
    readonly minDate: StringConstructor;
    readonly maxDate: StringConstructor;
    readonly disabledDate: PropType<PickerDisabledDate>;
    readonly defaultPickerValue: StringConstructor;
    readonly pickerValue: StringConstructor;
    readonly format: PropType<PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: StringConstructor;
    readonly size: PropType<AheartSize>;
    readonly status: PropType<PickerStatus>;
    readonly variant: PropType<AheartVariant>;
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
    readonly getPopupContainer: PropType<DatePickerGetPopupContainer>;
    readonly locale: PropType<AheartLocale>;
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo) => VNodeChild>;
};
export declare const datePickerEmits: {
    'update:modelValue': (value: DatePickerValue) => boolean;
    change: (value: DatePickerValue) => boolean;
    openChange: (open: boolean) => boolean;
    panelChange: (value: string, mode: PickerMode) => boolean;
    ok: (value: DatePickerValue) => boolean;
    clear: () => boolean;
    invalid: (input: string) => boolean;
};
export type DatePickerRuntimeProps = ExtractPropTypes<typeof datePickerProps>;
interface DatePickerSupplementalProps {
    id?: string;
    labelledBy?: string;
    ariaLabelledby?: string;
    describedBy?: string;
    ariaDescribedby?: string;
    placeholder?: string;
    locale?: AheartLocale;
    cellRender?: (info: DatePickerCellRenderInfo) => VNodeChild;
    'onUpdate:modelValue'?: (value: DatePickerValue) => void;
    onChange?: (value: DatePickerValue) => void;
    onOpenChange?: (open: boolean) => void;
    onPanelChange?: (value: string, mode: PickerMode) => void;
    onOk?: (value: DatePickerValue) => void;
    onClear?: () => void;
    onInvalid?: (input: string) => void;
}
export type DatePickerProps = DatePickerPublicProps & DatePickerSupplementalProps;
export declare const dateRangePickerProps: {
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly describedBy: StringConstructor;
    readonly ariaDescribedby: StringConstructor;
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly showTime: PropType<boolean | PickerShowTimeOptions>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly presets: PropType<PickerPreset<RangePickerValue>[]>;
    readonly picker: {
        readonly type: PropType<PickerMode>;
        readonly default: "date";
    };
    readonly pickerValue: PropType<RangePickerPanelValue>;
    readonly defaultPickerValue: PropType<RangePickerPanelValue>;
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
    readonly disabledDate: PropType<PickerDisabledDate>;
    readonly format: PropType<PickerFormat>;
    readonly valueFormat: StringConstructor;
    readonly placeholder: PropType<[string, string]>;
    readonly size: PropType<AheartSize>;
    readonly status: PropType<PickerStatus>;
    readonly variant: PropType<AheartVariant>;
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
    readonly getPopupContainer: PropType<DatePickerGetPopupContainer>;
    readonly locale: PropType<AheartLocale>;
    readonly cellRender: PropType<(info: DatePickerCellRenderInfo & {
        range: RangePickerPart;
    }) => VNodeChild>;
};
export declare const dateRangePickerEmits: {
    'update:modelValue': (value: RangePickerValue) => boolean;
    change: (value: RangePickerValue) => boolean;
    openChange: (open: boolean) => boolean;
    panelChange: (value: RangePickerPanelValue, mode: PickerMode) => boolean;
    calendarChange: (value: RangePickerValue, info: PickerCalendarChangeInfo) => boolean;
    ok: (value: RangePickerValue) => boolean;
    clear: () => boolean;
    invalid: (input: string, part: RangePickerPart) => boolean;
};
export type DateRangePickerRuntimeProps = ExtractPropTypes<typeof dateRangePickerProps>;
interface DateRangePickerSupplementalProps {
    id?: string;
    labelledBy?: string;
    ariaLabelledby?: string;
    describedBy?: string;
    ariaDescribedby?: string;
    placeholder?: [string, string];
    locale?: AheartLocale;
    cellRender?: (info: DatePickerCellRenderInfo & {
        range: RangePickerPart;
    }) => VNodeChild;
    'onUpdate:modelValue'?: (value: RangePickerValue) => void;
    onChange?: (value: RangePickerValue) => void;
    onOpenChange?: (open: boolean) => void;
    onPanelChange?: (value: RangePickerPanelValue, mode: PickerMode) => void;
    onCalendarChange?: (value: RangePickerValue, info: PickerCalendarChangeInfo) => void;
    onOk?: (value: RangePickerValue) => void;
    onClear?: () => void;
    onInvalid?: (input: string, part: RangePickerPart) => void;
}
export type DateRangePickerProps = import('../picker-core/types').DateRangePickerPublicProps & DateRangePickerSupplementalProps;
export {};
