import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { AheartSize } from '../config';
export type TableKey = string | number;
export type TableRecord = Record<string, unknown>;
export type TableSize = AheartSize;
export type TableSortOrder = 'ascend' | 'descend';
export type TableSelectionType = 'checkbox' | 'radio';
export type TableColumnAlign = 'left' | 'center' | 'right';
export type TableDataIndex = string | number | Array<string | number>;
export type TableFilterValue = string | number | boolean;
export type TableChangeAction = 'paginate' | 'sort' | 'filter';
export interface TableColumnFilter {
    text: string;
    value: TableFilterValue;
}
export interface TableColumn<T extends TableRecord = TableRecord> {
    title: string;
    dataIndex?: keyof T | TableDataIndex;
    key?: string;
    align?: TableColumnAlign;
    width?: string | number;
    className?: string;
    sorter?: boolean | ((a: T, b: T) => number);
    sortOrder?: TableSortOrder;
    defaultSortOrder?: TableSortOrder;
    filters?: TableColumnFilter[];
    filteredValue?: TableFilterValue[];
    defaultFilteredValue?: TableFilterValue[];
    filterMultiple?: boolean;
    ellipsis?: boolean;
    customRender?: (context: {
        text: unknown;
        record: T;
        index: number;
        column: TableColumn<T>;
    }) => VNodeChild;
}
export interface TablePaginationConfig {
    current?: number;
    defaultCurrent?: number;
    pageSize?: number;
    defaultPageSize?: number;
    total?: number;
    simple?: boolean;
    hideOnSinglePage?: boolean;
    showTotal?: boolean;
}
export interface TableSorter<T extends TableRecord = TableRecord> {
    column?: TableColumn<T>;
    columnKey?: string;
    field?: TableDataIndex;
    order?: TableSortOrder;
}
export interface TableChangePagination {
    current: number;
    pageSize: number;
    total: number;
}
export type TableFilters = Record<string, TableFilterValue[]>;
export interface TableChangeExtra<T extends TableRecord = TableRecord> {
    currentDataSource: T[];
    action: TableChangeAction;
}
export interface TableRowSelection {
    selectedRowKeys?: TableKey[];
    defaultSelectedRowKeys?: TableKey[];
    type?: TableSelectionType;
    disabled?: boolean;
}
export interface TableExpandable<T extends TableRecord = TableRecord> {
    expandedRowKeys?: TableKey[];
    defaultExpandedRowKeys?: TableKey[];
    expandedRowRender?: (record: T, index: number) => VNodeChild;
    rowExpandable?: (record: T) => boolean;
}
export declare const tableProps: {
    readonly columns: PropType<TableColumn<TableRecord>[]>;
    readonly dataSource: PropType<TableRecord[]>;
    readonly rowKey: {
        readonly type: PropType<string | ((record: TableRecord) => TableKey)>;
        readonly default: "key";
    };
    readonly bordered: BooleanConstructor;
    readonly loading: BooleanConstructor;
    readonly size: PropType<AheartSize>;
    readonly disabled: {
        readonly type: BooleanConstructor;
        readonly default: undefined;
    };
    readonly pagination: {
        readonly type: PropType<false | TablePaginationConfig>;
        readonly default: undefined;
    };
    readonly rowSelection: PropType<TableRowSelection>;
    readonly expandable: PropType<TableExpandable<TableRecord>>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: StringConstructor;
};
export declare const tableEmits: {
    change: (_pagination: TableChangePagination, _filters: TableFilters, _sorter: TableSorter, _extra: TableChangeExtra) => boolean;
    'update:selectedRowKeys': (keys: TableKey[]) => boolean;
    select: (_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => boolean;
    expand: (_expanded: boolean, _record: TableRecord, _key: TableKey) => boolean;
};
export type TableProps = ExtractPropTypes<typeof tableProps>;
