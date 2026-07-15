import type { Component, ExtractPropTypes, ExtractPublicPropTypes, PropType, VNodeChild } from 'vue';
import type { AheartSize, AheartVariant } from '../config';
import type { PickerStatus } from '../picker-core/types';
import type { PickerDisabledTime, PickerDisabledTimeConfig, PickerPreset, PickerSingleDisabledTime, RangePickerPart, RangePickerValue } from '../picker-core/types';
export type DisabledTimeConfig = PickerDisabledTimeConfig;
/** @deprecated Use the structured disabled-time callbacks instead. */
export type LegacyDisabledTime = (value: string) => boolean;
export type TimePickerDisabledTime = PickerSingleDisabledTime;
export type TimePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export declare const timePickerProps: {
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
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
    readonly getPopupContainer: PropType<TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly needConfirm: BooleanConstructor;
    readonly disabledTime: PropType<PickerSingleDisabledTime>;
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly status: PropType<PickerStatus>;
    readonly variant: PropType<AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
};
export declare const timePickerEmits: {
    'update:modelValue': (value: string | undefined) => boolean;
    change: (value: string | undefined) => boolean;
    openChange: (open: boolean) => boolean;
    clear: () => boolean;
    invalid: (input: string) => boolean;
};
export type TimePickerRuntimeProps = ExtractPropTypes<typeof timePickerProps>;
interface TimePickerSupplementalProps {
    'onUpdate:modelValue'?: (value: string | undefined) => void;
    onChange?: (value: string | undefined) => void;
    onOpenChange?: (open: boolean) => void;
    onClear?: () => void;
    onInvalid?: (input: string) => void;
}
export type TimePickerProps = ExtractPublicPropTypes<typeof timePickerProps> & TimePickerSupplementalProps;
export declare const timeRangePickerProps: {
    readonly modelValue: PropType<RangePickerValue>;
    readonly defaultValue: PropType<RangePickerValue>;
    readonly placeholder: PropType<[string, string]>;
    readonly disabledTime: PropType<PickerDisabledTime>;
    readonly allowEmpty: {
        readonly type: PropType<[boolean, boolean]>;
        readonly default: () => boolean[];
    };
    readonly order: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly separator: PropType<VNodeChild>;
    readonly presets: PropType<PickerPreset<RangePickerValue>[]>;
    readonly needConfirm: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
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
    readonly getPopupContainer: PropType<TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly hideDisabledOptions: BooleanConstructor;
    readonly changeOnScroll: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly status: PropType<PickerStatus>;
    readonly variant: PropType<AheartVariant>;
    readonly prefix: PropType<VNodeChild>;
    readonly suffixIcon: PropType<VNodeChild | Component>;
    readonly clearIcon: PropType<VNodeChild | Component>;
    readonly renderExtraFooter: PropType<() => VNodeChild>;
};
export declare const timeRangePickerEmits: {
    'update:modelValue': (value: RangePickerValue) => boolean;
    change: (value: RangePickerValue) => boolean;
    calendarChange: (value: RangePickerValue, info: {
        range: RangePickerPart;
    }) => boolean;
    openChange: (open: boolean) => boolean;
    clear: () => boolean;
    invalid: (input: string, part: RangePickerPart) => boolean;
    ok: (value: RangePickerValue) => boolean;
};
export type TimeRangePickerRuntimeProps = ExtractPropTypes<typeof timeRangePickerProps>;
interface TimeRangePickerSupplementalProps {
    'onUpdate:modelValue'?: (value: RangePickerValue) => void;
    onChange?: (value: RangePickerValue) => void;
    onCalendarChange?: (value: RangePickerValue, info: {
        range: RangePickerPart;
    }) => void;
    onOpenChange?: (open: boolean) => void;
    onClear?: () => void;
    onInvalid?: (input: string, part: RangePickerPart) => void;
    onOk?: (value: RangePickerValue) => void;
}
export type TimeRangePickerProps = ExtractPublicPropTypes<typeof timeRangePickerProps> & TimeRangePickerSupplementalProps;
export {};
