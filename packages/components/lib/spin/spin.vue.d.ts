import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly spinning: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly size: {
        readonly type: PropType<import("../config").AheartSize>;
        readonly default: "middle";
    };
    readonly description: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tip: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly delay: NumberConstructor;
    readonly indicator: PropType<import("./types").SpinIndicator>;
    readonly percent: PropType<import("./types").SpinPercent>;
    readonly fullscreen: BooleanConstructor;
    readonly wrapperClassName: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SpinSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly spinning: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly size: {
        readonly type: PropType<import("../config").AheartSize>;
        readonly default: "middle";
    };
    readonly description: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly tip: {
        type: PropType<VNodeChild>;
        default: undefined;
    };
    readonly delay: NumberConstructor;
    readonly indicator: PropType<import("./types").SpinIndicator>;
    readonly percent: PropType<import("./types").SpinPercent>;
    readonly fullscreen: BooleanConstructor;
    readonly wrapperClassName: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: {
        readonly type: PropType<Partial<Record<import("./types").SpinSemanticPart, string>>>;
        readonly default: () => {};
    };
    readonly styles: {
        readonly type: PropType<Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>>;
        readonly default: () => {};
    };
}>> & Readonly<{}>, {
    readonly description: VNodeChild;
    readonly classNames: Partial<Record<import("./types").SpinSemanticPart, string>>;
    readonly styles: Partial<Record<import("./types").SpinSemanticPart, import("vue").StyleValue>>;
    readonly size: import("../config").AheartSize;
    readonly tip: VNodeChild;
    readonly spinning: boolean;
    readonly fullscreen: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
    description?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
