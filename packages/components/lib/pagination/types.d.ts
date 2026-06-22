import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type PaginationAlign = 'start' | 'center' | 'end';
export type PaginationItemType = 'page' | 'prev' | 'next';
export type PaginationItemRender = (page: number, type: PaginationItemType, originalElement: string) => string | number;
export type PaginationShowTotal = (total: number, range: [number, number]) => string | number;
export type PaginationSemanticPart = 'root' | 'total' | 'prev' | 'next' | 'page' | 'activePage' | 'sizeChanger' | 'quickJumper';
export type PaginationClassNames = Partial<Record<PaginationSemanticPart, string>>;
export type PaginationStyles = Partial<Record<PaginationSemanticPart, StyleValue>>;
export declare const paginationProps: {
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
    readonly size: PropType<AheartSize>;
    readonly simple: BooleanConstructor;
    readonly hideOnSinglePage: BooleanConstructor;
    readonly showTotal: {
        readonly type: PropType<boolean | PaginationShowTotal>;
        readonly default: false;
    };
    readonly align: PropType<PaginationAlign>;
    readonly showLessItems: BooleanConstructor;
    readonly showSizeChanger: BooleanConstructor;
    readonly pageSizeOptions: {
        readonly type: PropType<(string | number)[]>;
        readonly default: () => number[];
    };
    readonly showQuickJumper: BooleanConstructor;
    readonly itemRender: PropType<PaginationItemRender>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<PaginationSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<PaginationSemanticPart, StyleValue>>>;
};
export declare const paginationEmits: {
    'update:current': (current: number) => boolean;
    'update:pageSize': (pageSize: number) => boolean;
    change: (current: number, pageSize: number) => boolean;
    showSizeChange: (current: number, pageSize: number) => boolean;
};
export type PaginationProps = ExtractPropTypes<typeof paginationProps>;
