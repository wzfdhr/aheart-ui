import type { ExtractPropTypes, PropType } from 'vue';
export interface DisabledTimeConfig {
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}
export type LegacyDisabledTime = (value: string) => boolean;
export type TimePickerDisabledTime = LegacyDisabledTime | DisabledTimeConfig | (() => DisabledTimeConfig);
export type TimePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export declare const timePickerProps: {
    readonly id: StringConstructor;
    readonly labelledBy: StringConstructor;
    readonly ariaLabelledby: StringConstructor;
    readonly modelValue: StringConstructor;
    readonly defaultValue: StringConstructor;
    readonly placeholder: {
        readonly type: StringConstructor;
        readonly default: "Select time";
    };
    readonly disabled: BooleanConstructor;
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
        readonly default: "HH:mm";
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
    readonly disabledTime: PropType<TimePickerDisabledTime>;
};
export declare const timePickerEmits: {
    'update:modelValue': (value: string | undefined) => boolean;
    change: (value: string | undefined) => boolean;
    openChange: (open: boolean) => boolean;
    clear: () => boolean;
};
export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>;
