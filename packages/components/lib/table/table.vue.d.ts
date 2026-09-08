import { type PropType, type VNodeChild } from 'vue';
import { type TableFilters, type TableKey, type TableRecord } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly columns: PropType<any[]>;
    readonly dataSource: PropType<TableRecord[]>;
    readonly dataMode: PropType<import("./types").TableDataMode>;
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
    readonly rowSelection: PropType<any>;
    readonly expandable: PropType<any>;
    readonly scroll: PropType<import("./types").TableScroll>;
    readonly sticky: PropType<import("./types").TableSticky>;
    readonly virtual: {
        readonly type: PropType<import("./types").TableVirtual>;
        readonly default: false;
    };
    readonly error: PropType<boolean | {
        message?: VNodeChild;
        retryText?: VNodeChild;
    }>;
    readonly getPopupContainer: PropType<(triggerNode: HTMLElement) => false | HTMLElement>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (_pagination: import("./types").TableChangePagination, _filters: TableFilters, _sorter: import("./types").TableSorter<TableRecord>, _extra: import("./types").TableChangeExtra<TableRecord>) => void;
    select: (_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => void;
    "update:selectedRowKeys": (keys: TableKey[]) => void;
    "update:expandedRowKeys": (keys: TableKey[]) => void;
    selectAll: (_selected: boolean, keys: TableKey[], rows: TableRecord[]) => void;
    expand: (_expanded: boolean, _record: TableRecord, _key: TableKey) => void;
    filterDropdownOpenChange: (_columnKey: string, _open: boolean) => void;
    retry: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly columns: PropType<any[]>;
    readonly dataSource: PropType<TableRecord[]>;
    readonly dataMode: PropType<import("./types").TableDataMode>;
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
    readonly rowSelection: PropType<any>;
    readonly expandable: PropType<any>;
    readonly scroll: PropType<import("./types").TableScroll>;
    readonly sticky: PropType<import("./types").TableSticky>;
    readonly virtual: {
        readonly type: PropType<import("./types").TableVirtual>;
        readonly default: false;
    };
    readonly error: PropType<boolean | {
        message?: VNodeChild;
        retryText?: VNodeChild;
    }>;
    readonly getPopupContainer: PropType<(triggerNode: HTMLElement) => false | HTMLElement>;
    readonly showHeader: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly emptyText: {
        readonly type: PropType<VNodeChild>;
        readonly default: undefined;
    };
}>> & Readonly<{
    onChange?: ((_pagination: import("./types").TableChangePagination, _filters: TableFilters, _sorter: import("./types").TableSorter<TableRecord>, _extra: import("./types").TableChangeExtra<TableRecord>) => any) | undefined;
    onSelect?: ((_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => any) | undefined;
    "onUpdate:selectedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
    "onUpdate:expandedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
    onSelectAll?: ((_selected: boolean, keys: TableKey[], rows: TableRecord[]) => any) | undefined;
    onExpand?: ((_expanded: boolean, _record: TableRecord, _key: TableKey) => any) | undefined;
    onFilterDropdownOpenChange?: ((_columnKey: string, _open: boolean) => any) | undefined;
    onRetry?: (() => any) | undefined;
}>, {
    readonly disabled: boolean;
    readonly emptyText: VNodeChild;
    readonly pagination: false | import("./types").TablePaginationConfig;
    readonly loading: boolean;
    readonly bordered: boolean;
    readonly virtual: import("./types").TableVirtual;
    readonly rowKey: string | ((record: TableRecord) => TableKey);
    readonly showHeader: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
