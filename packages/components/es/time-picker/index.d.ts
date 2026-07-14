export * from './types';
declare const _default: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "bottomLeft";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly needConfirm: BooleanConstructor;
    readonly disabledTime: import("vue").PropType<import("./types").TimePickerDisabledTime>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string | undefined) => void;
    clear: () => void;
    "update:modelValue": (value: string | undefined) => void;
    openChange: (open: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        readonly type: import("vue").PropType<"left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom">;
        readonly default: "bottomLeft";
        readonly validator: (value: string) => boolean;
    };
    readonly autoAdjustOverflow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly getPopupContainer: import("vue").PropType<import("./types").TimePickerGetPopupContainer>;
    readonly showNow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly needConfirm: BooleanConstructor;
    readonly disabledTime: import("vue").PropType<import("./types").TimePickerDisabledTime>;
}>> & Readonly<{
    onChange?: ((value: string | undefined) => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    readonly open: boolean;
    readonly disabled: boolean;
    readonly placeholder: string;
    readonly placement: "left" | "right" | "bottom" | "top" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    readonly format: string;
    readonly defaultOpen: boolean;
    readonly allowClear: boolean;
    readonly autoAdjustOverflow: boolean;
    readonly readOnly: boolean;
    readonly hourStep: number;
    readonly minuteStep: number;
    readonly secondStep: number;
    readonly use12Hours: boolean;
    readonly showNow: boolean;
    readonly needConfirm: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default _default;
