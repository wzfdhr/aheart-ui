/** Internal pagination state normalization shared by Table and Pagination. */
export declare const normalizeTotal: (total: number) => number;
export declare const normalizePageSize: (size: number) => number;
export declare const getPageCount: (total: number, size: number) => number;
export declare const normalizeCurrent: (current: number, total: number, size: number) => number;
