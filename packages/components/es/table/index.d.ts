declare const Table: import("../utils/install").SFCWithInstall<import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly columns: import("vue").PropType<any[]>;
    readonly dataSource: import("vue").PropType<import("./types").TableRecord[]>;
    readonly dataMode: import("vue").PropType<import("./types").TableDataMode>;
    readonly rowKey: {
        readonly type: import("vue").PropType<string | ((record: import("./types").TableRecord) => import("./types").TableKey)>;
        readonly default: "key";
    };
    readonly bordered: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly pagination: {
        readonly type: import("vue").PropType<false | import("./types").TablePaginationConfig>;
        readonly default: undefined;
    };
    readonly rowSelection: import("vue").PropType<any>;
    readonly expandable: import("vue").PropType<any>;
    readonly scroll: import("vue").PropType<import("./types").TableScroll>;
    readonly sticky: import("vue").PropType<import("./types").TableSticky>;
    readonly virtual: {
        readonly type: import("vue").PropType<import("./types").TableVirtual>;
        readonly default: false;
    };
    readonly error: import("vue").PropType<boolean | {
        message?: import("vue").VNodeChild;
        retryText?: import("vue").VNodeChild;
    }>;
    readonly getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => false | HTMLElement>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_pagination: import("./types").TableChangePagination, _filters: import("./types").TableFilters, _sorter: import("./types").TableSorter<import("./types").TableRecord>, _extra: import("./types").TableChangeExtra<import("./types").TableRecord>) => void;
    select: (_key: import("./types").TableKey, _selected: boolean, _record: import("./types").TableRecord, _selectedRowKeys: import("./types").TableKey[]) => void;
    "update:selectedRowKeys": (keys: import("./types").TableKey[]) => void;
    "update:expandedRowKeys": (keys: import("./types").TableKey[]) => void;
    selectAll: (_selected: boolean, keys: import("./types").TableKey[], rows: import("./types").TableRecord[]) => void;
    expand: (_expanded: boolean, _record: import("./types").TableRecord, _key: import("./types").TableKey) => void;
    filterDropdownOpenChange: (_columnKey: string, _open: boolean) => void;
    retry: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly columns: import("vue").PropType<any[]>;
    readonly dataSource: import("vue").PropType<import("./types").TableRecord[]>;
    readonly dataMode: import("vue").PropType<import("./types").TableDataMode>;
    readonly rowKey: {
        readonly type: import("vue").PropType<string | ((record: import("./types").TableRecord) => import("./types").TableKey)>;
        readonly default: "key";
    };
    readonly bordered: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly pagination: {
        readonly type: import("vue").PropType<false | import("./types").TablePaginationConfig>;
        readonly default: undefined;
    };
    readonly rowSelection: import("vue").PropType<any>;
    readonly expandable: import("vue").PropType<any>;
    readonly scroll: import("vue").PropType<import("./types").TableScroll>;
    readonly sticky: import("vue").PropType<import("./types").TableSticky>;
    readonly virtual: {
        readonly type: import("vue").PropType<import("./types").TableVirtual>;
        readonly default: false;
    };
    readonly error: import("vue").PropType<boolean | {
        message?: import("vue").VNodeChild;
        retryText?: import("vue").VNodeChild;
    }>;
    readonly getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => false | HTMLElement>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: {
        readonly type: import("vue").PropType<import("vue").VNodeChild>;
        readonly default: undefined;
    };
}>> & Readonly<{
    onChange?: ((_pagination: import("./types").TableChangePagination, _filters: import("./types").TableFilters, _sorter: import("./types").TableSorter<import("./types").TableRecord>, _extra: import("./types").TableChangeExtra<import("./types").TableRecord>) => any) | undefined;
    onSelect?: ((_key: import("./types").TableKey, _selected: boolean, _record: import("./types").TableRecord, _selectedRowKeys: import("./types").TableKey[]) => any) | undefined;
    "onUpdate:selectedRowKeys"?: ((keys: import("./types").TableKey[]) => any) | undefined;
    "onUpdate:expandedRowKeys"?: ((keys: import("./types").TableKey[]) => any) | undefined;
    onSelectAll?: ((_selected: boolean, keys: import("./types").TableKey[], rows: import("./types").TableRecord[]) => any) | undefined;
    onExpand?: ((_expanded: boolean, _record: import("./types").TableRecord, _key: import("./types").TableKey) => any) | undefined;
    onFilterDropdownOpenChange?: ((_columnKey: string, _open: boolean) => any) | undefined;
    onRetry?: (() => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly emptyText: import("vue").VNodeChild;
    readonly pagination: false | import("./types").TablePaginationConfig;
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly virtual: import("./types").TableVirtual;
    readonly rowKey: string | ((record: import("./types").TableRecord) => import("./types").TableKey);
    readonly showHeader: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>>;
export default Table;
export type * from './types';
