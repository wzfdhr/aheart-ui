declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly count: import("vue").PropType<string | number>;
    readonly dot: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").BadgeStatus>;
    readonly text: StringConstructor;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: import("vue").PropType<import("./types").BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: import("vue").PropType<import("./types").BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly count: import("vue").PropType<string | number>;
    readonly dot: BooleanConstructor;
    readonly status: import("vue").PropType<import("./types").BadgeStatus>;
    readonly text: StringConstructor;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: import("vue").PropType<import("./types").BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: import("vue").PropType<import("./types").BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {
    readonly dot: boolean;
    readonly overflowCount: number;
    readonly showZero: boolean;
    readonly size: import("./types").BadgeSize;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, {
    default?(_: {}): any;
    count?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
