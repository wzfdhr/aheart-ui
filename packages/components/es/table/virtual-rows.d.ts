import type { TableKey, TableRecord } from './types';
export interface VirtualRow<T extends TableRecord = TableRecord> {
    key: TableKey;
    record: T;
    index: number;
}
export interface VirtualRange {
    start: number;
    end: number;
    top: number;
    bottom: number;
}
export declare function getVirtualRange(count: number, scrollTop: number, height: number, estimate: number, overscan: number, measured: Map<number, number>): VirtualRange;
