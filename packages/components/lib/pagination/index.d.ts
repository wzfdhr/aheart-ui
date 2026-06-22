declare const Pagination: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
    readonly showTotal: {
        readonly type: import("vue").PropType<boolean | import("./types").PaginationShowTotal>;
        readonly default: false;
    };
    readonly align: import("vue").PropType<import("./types").PaginationAlign>;
    readonly showLessItems: BooleanConstructor;
    readonly showSizeChanger: BooleanConstructor;
    readonly pageSizeOptions: {
        readonly type: import("vue").PropType<(string | number)[]>;
        readonly default: () => number[];
    };
    readonly showQuickJumper: BooleanConstructor;
    readonly itemRender: import("vue").PropType<import("./types").PaginationItemRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").PaginationSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").PaginationSemanticPart, import("vue").StyleValue>>>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (current: number, pageSize: number) => void;
    "update:current": (current: number) => void;
    "update:pageSize": (pageSize: number) => void;
    showSizeChange: (current: number, pageSize: number) => void;
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
    readonly showTotal: {
        readonly type: import("vue").PropType<boolean | import("./types").PaginationShowTotal>;
        readonly default: false;
    };
    readonly align: import("vue").PropType<import("./types").PaginationAlign>;
    readonly showLessItems: BooleanConstructor;
    readonly showSizeChanger: BooleanConstructor;
    readonly pageSizeOptions: {
        readonly type: import("vue").PropType<(string | number)[]>;
        readonly default: () => number[];
    };
    readonly showQuickJumper: BooleanConstructor;
    readonly itemRender: import("vue").PropType<import("./types").PaginationItemRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").PaginationSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").PaginationSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((current: number, pageSize: number) => any) | undefined;
    "onUpdate:current"?: ((current: number) => any) | undefined;
    "onUpdate:pageSize"?: ((pageSize: number) => any) | undefined;
    onShowSizeChange?: ((current: number, pageSize: number) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly total: number;
    readonly defaultCurrent: number;
    readonly defaultPageSize: number;
    readonly simple: boolean;
    readonly hideOnSinglePage: boolean;
    readonly showTotal: boolean | import("./types").PaginationShowTotal;
    readonly showLessItems: boolean;
    readonly showSizeChanger: boolean;
    readonly pageSizeOptions: (string | number)[];
    readonly showQuickJumper: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Pagination;
