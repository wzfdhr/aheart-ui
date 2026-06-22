import { type FlexGap } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly wrap: import("vue").PropType<string | boolean>;
    readonly justify: import("vue").PropType<import("./types").FlexJustify>;
    readonly align: import("vue").PropType<import("./types").FlexAlign>;
    readonly gap: import("vue").PropType<FlexGap>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly wrap: import("vue").PropType<string | boolean>;
    readonly justify: import("vue").PropType<import("./types").FlexJustify>;
    readonly align: import("vue").PropType<import("./types").FlexAlign>;
    readonly gap: import("vue").PropType<FlexGap>;
}>> & Readonly<{}>, {
    readonly vertical: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
