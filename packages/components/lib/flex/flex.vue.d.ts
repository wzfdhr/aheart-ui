import { type FlexGap } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly orientation: import("vue").PropType<import("./types").FlexOrientation>;
    readonly wrap: import("vue").PropType<import("./types").FlexWrap>;
    readonly justify: import("vue").PropType<string>;
    readonly align: import("vue").PropType<string>;
    readonly gap: import("vue").PropType<FlexGap>;
    readonly flex: import("vue").PropType<string | number>;
    readonly component: {
        readonly type: import("vue").PropType<string | object | Function>;
        readonly default: "div";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly vertical: BooleanConstructor;
    readonly orientation: import("vue").PropType<import("./types").FlexOrientation>;
    readonly wrap: import("vue").PropType<import("./types").FlexWrap>;
    readonly justify: import("vue").PropType<string>;
    readonly align: import("vue").PropType<string>;
    readonly gap: import("vue").PropType<FlexGap>;
    readonly flex: import("vue").PropType<string | number>;
    readonly component: {
        readonly type: import("vue").PropType<string | object | Function>;
        readonly default: "div";
    };
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
}>> & Readonly<{}>, {
    readonly vertical: boolean;
    readonly component: string | object | Function;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
