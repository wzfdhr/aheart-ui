import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
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
    readonly showTotal: BooleanConstructor;
};
export declare const paginationEmits: {
    'update:current': (current: number) => boolean;
    'update:pageSize': (pageSize: number) => boolean;
    change: (current: number, pageSize: number) => boolean;
};
export type PaginationProps = ExtractPropTypes<typeof paginationProps>;
