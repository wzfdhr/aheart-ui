import { type PropType } from 'vue';
import { type TableColumn, type TableFilters, type TableKey, type TableRecord } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly columns: PropType<TableColumn<TableRecord>[]>;
    readonly dataSource: PropType<TableRecord[]>;
    readonly rowKey: {
        readonly type: PropType<string | ((record: TableRecord) => TableKey)>;
        readonly default: "key";
    };
    readonly bordered: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly pagination: {
        readonly type: PropType<false | import("./types").TablePaginationConfig>;
        readonly default: undefined;
    };
    readonly rowSelection: PropType<import("./types").TableRowSelection>;
    readonly expandable: PropType<import("./types").TableExpandable<TableRecord>>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: StringConstructor;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_pagination: import("./types").TableChangePagination, _filters: TableFilters, _sorter: import("./types").TableSorter<TableRecord>, _extra: import("./types").TableChangeExtra<TableRecord>) => void;
    select: (_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => void;
    "update:selectedRowKeys": (keys: TableKey[]) => void;
    expand: (_expanded: boolean, _record: TableRecord, _key: TableKey) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly columns: PropType<TableColumn<TableRecord>[]>;
    readonly dataSource: PropType<TableRecord[]>;
    readonly rowKey: {
        readonly type: PropType<string | ((record: TableRecord) => TableKey)>;
        readonly default: "key";
    };
    readonly bordered: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<import("../config").AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly pagination: {
        readonly type: PropType<false | import("./types").TablePaginationConfig>;
        readonly default: undefined;
    };
    readonly rowSelection: PropType<import("./types").TableRowSelection>;
    readonly expandable: PropType<import("./types").TableExpandable<TableRecord>>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: StringConstructor;
}>> & Readonly<{
    onChange?: ((_pagination: import("./types").TableChangePagination, _filters: TableFilters, _sorter: import("./types").TableSorter<TableRecord>, _extra: import("./types").TableChangeExtra<TableRecord>) => any) | undefined;
    onSelect?: ((_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => any) | undefined;
    "onUpdate:selectedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
    onExpand?: ((_expanded: boolean, _record: TableRecord, _key: TableKey) => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly pagination: false | import("./types").TablePaginationConfig;
    readonly rowKey: string | ((record: TableRecord) => TableKey);
    readonly showHeader: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
