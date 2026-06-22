import { type PropType, type VNodeChild } from 'vue';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly count: PropType<VNodeChild>;
    readonly dot: BooleanConstructor;
    readonly status: PropType<import("./types").BadgeStatus>;
    readonly text: PropType<VNodeChild>;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: PropType<import("./types").BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: PropType<import("./types").BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly count: PropType<VNodeChild>;
    readonly dot: BooleanConstructor;
    readonly status: PropType<import("./types").BadgeStatus>;
    readonly text: PropType<VNodeChild>;
    readonly overflowCount: {
        readonly type: NumberConstructor;
        readonly default: 99;
    };
    readonly showZero: BooleanConstructor;
    readonly size: {
        readonly type: PropType<import("./types").BadgeSize>;
        readonly default: "medium";
    };
    readonly offset: PropType<import("./types").BadgeOffset>;
    readonly color: StringConstructor;
    readonly title: StringConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<Partial<Record<import("./types").BadgeSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<import("./types").BadgeSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{}>, {
    readonly size: import("./types").BadgeSize;
    readonly dot: boolean;
    readonly overflowCount: number;
    readonly showZero: boolean;
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
