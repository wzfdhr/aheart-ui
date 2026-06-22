declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly total: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly current: NumberConstructor;
    readonly defaultCurrent: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly pageSize: NumberConstructor;
    readonly defaultPageSize: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly simple: BooleanConstructor;
    readonly hideOnSinglePage: BooleanConstructor;
    readonly showTotal: BooleanConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (current: number, pageSize: number) => void;
    "update:current": (current: number) => void;
    "update:pageSize": (pageSize: number) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly total: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly current: NumberConstructor;
    readonly defaultCurrent: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly pageSize: NumberConstructor;
    readonly defaultPageSize: {
        readonly type: NumberConstructor;
        readonly default: 10;
    };
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly simple: BooleanConstructor;
    readonly hideOnSinglePage: BooleanConstructor;
    readonly showTotal: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((current: number, pageSize: number) => any) | undefined;
    "onUpdate:current"?: ((current: number) => any) | undefined;
    "onUpdate:pageSize"?: ((pageSize: number) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly total: number;
    readonly defaultCurrent: number;
    readonly defaultPageSize: number;
    readonly simple: boolean;
    readonly hideOnSinglePage: boolean;
    readonly showTotal: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
