import type { PropType, StyleValue, VNodeChild } from 'vue';
import type { InputNumberFocusOptions, InputNumberValue } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: PropType<InputNumberValue>;
    readonly value: PropType<InputNumberValue>;
    readonly defaultValue: PropType<InputNumberValue>;
    readonly autoFocus: BooleanConstructor;
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
    readonly mode: {
        readonly type: PropType<import("./types").InputNumberMode>;
        readonly default: "input";
    };
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
        readonly type: PropType<string | number>;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly stringMode: BooleanConstructor;
    readonly formatter: PropType<(value: InputNumberValue | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => InputNumberValue | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnBlur: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<import("./types").InputNumberClassNames>;
    readonly styles: PropType<import("./types").InputNumberStyles>;
}>, {
    focus: (options?: InputNumberFocusOptions | undefined) => void;
    blur: () => void;
    nativeElement: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: InputNumberValue | undefined) => void;
    step: (value: InputNumberValue, info: import("./types").InputNumberStepInfo) => void;
    "update:modelValue": (value: InputNumberValue | undefined) => void;
    pressEnter: (event: KeyboardEvent) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly id: StringConstructor;
    readonly modelValue: PropType<InputNumberValue>;
    readonly value: PropType<InputNumberValue>;
    readonly defaultValue: PropType<InputNumberValue>;
    readonly autoFocus: BooleanConstructor;
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
    readonly mode: {
        readonly type: PropType<import("./types").InputNumberMode>;
        readonly default: "input";
    };
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
        readonly type: PropType<string | number>;
        readonly default: 1;
    };
    readonly precision: NumberConstructor;
    readonly decimalSeparator: StringConstructor;
    readonly stringMode: BooleanConstructor;
    readonly formatter: PropType<(value: InputNumberValue | undefined, info: import("./types").InputNumberFormatterInfo) => string>;
    readonly parser: PropType<(displayValue: string) => InputNumberValue | undefined>;
    readonly keyboard: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly controls: {
        readonly type: PropType<import("./types").InputNumberControls>;
        readonly default: true;
    };
    readonly changeOnBlur: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly changeOnWheel: BooleanConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<import("./types").InputNumberClassNames>;
    readonly styles: PropType<import("./types").InputNumberStyles>;
}>> & Readonly<{
    onChange?: ((value: InputNumberValue | undefined) => any) | undefined;
    onStep?: ((value: InputNumberValue, info: import("./types").InputNumberStepInfo) => any) | undefined;
    "onUpdate:modelValue"?: ((value: InputNumberValue | undefined) => any) | undefined;
    onPressEnter?: ((event: KeyboardEvent) => any) | undefined;
}>, {
    readonly variant: import("./types").InputNumberVariant;
    readonly disabled: boolean;
    readonly mode: import("./types").InputNumberMode;
    readonly step: string | number;
    readonly bordered: boolean;
    readonly keyboard: boolean;
    readonly prefix: VNodeChild;
    readonly suffix: VNodeChild;
    readonly readOnly: boolean;
    readonly autoFocus: boolean;
    readonly stringMode: boolean;
    readonly controls: import("./types").InputNumberControls;
    readonly changeOnBlur: boolean;
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
