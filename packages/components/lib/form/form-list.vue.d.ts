import { type FormListSlotProps, type FormNamePath } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly name: {
        readonly type: import("vue").PropType<FormNamePath>;
        readonly required: true;
    };
    readonly initialValue: import("vue").PropType<unknown[]>;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly name: {
        readonly type: import("vue").PropType<FormNamePath>;
        readonly required: true;
    };
    readonly initialValue: import("vue").PropType<unknown[]>;
    readonly rules: import("vue").PropType<import("./types").FormRule[]>;
    readonly preserve: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
}>> & Readonly<{}>, {
    readonly preserve: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, Readonly<{
    default?: ((props: FormListSlotProps) => unknown) | undefined;
}> & {
    default?: ((props: FormListSlotProps) => unknown) | undefined;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
