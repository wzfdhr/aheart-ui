import type { PropType, VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<import("./types").InputNumberStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly formatter: PropType<(value: number | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").InputNumberSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").InputNumberSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: number | undefined) => void;
    step: (value: number, info: import("./types").InputNumberStepInfo) => void;
    "update:modelValue": (value: number | undefined) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: NumberConstructor;
    readonly placeholder: StringConstructor;
    readonly prefix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly suffix: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly readOnly: BooleanConstructor;
    readonly status: PropType<import("./types").InputNumberStatus>;
    readonly variant: {
        readonly type: PropType<import("./types").InputNumberVariant>;
        readonly default: undefined;
    };
    readonly bordered: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly min: NumberConstructor;
    readonly max: NumberConstructor;
    readonly step: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly formatter: PropType<(value: number | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => number | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").InputNumberSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").InputNumberSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((value: number | undefined) => any) | undefined;
    onStep?: ((value: number, info: import("./types").InputNumberStepInfo) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | undefined) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly variant: import("./types").InputNumberVariant;
    readonly disabled: boolean;
    readonly step: number;
    readonly bordered: boolean;
    readonly keyboard: boolean;
    readonly prefix: VNodeChild;
    readonly suffix: VNodeChild;
    readonly readOnly: boolean;
    readonly controls: import("./types").InputNumberControls;
    readonly changeOnWheel: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    prefix?(_: {}): any;
    suffix?(_: {}): any;
    increaseIcon?(_: {}): any;
    decreaseIcon?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
