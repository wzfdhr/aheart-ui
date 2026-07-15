import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { AheartLocale, AheartSize, AheartVariant } from '../config';
import type { DatePickerPublicProps, MultiplePickerValue, PickerDisabledDate, PickerFormat, PickerMode, PickerPreset, PickerShowTimeOptions, PickerStatus, PickerValue } from '../picker-core/types';
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
export {};
