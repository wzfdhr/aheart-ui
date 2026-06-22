import { type TabItem } from './types';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: import("vue").PropType<import("./types").TabsType>;
        readonly default: "line";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly centered: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (key: string) => void;
    "update:activeKey": (key: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: import("vue").PropType<import("./types").TabsType>;
        readonly default: "line";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly centered: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((key: string) => any) | undefined;
    "onUpdate:activeKey"?: ((key: string) => any) | undefined;
}>, {
    readonly type: import("./types").TabsType;
    readonly centered: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, Partial<Record<string, (_: {}) => any>>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
