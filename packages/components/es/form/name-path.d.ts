import type { FormNamePath } from './types';
export declare const normalizeNamePath: (name: FormNamePath) => FormNamePath;
export declare const namePathSegments: (name: FormNamePath) => Array<string | number>;
export declare const resolveNamePath: (prefix: FormNamePath | undefined, name: FormNamePath) => FormNamePath;
export declare const matchListDescendant: (name: FormNamePath, listName: FormNamePath) => {
    index: number;
    tail: (string | number)[];
} | undefined;
export declare const remapListDescendant: (name: FormNamePath, listName: FormNamePath, oldIndexToNewIndex: ReadonlyMap<number, number>) => FormNamePath | undefined;
export declare const namePathKey: (name: FormNamePath) => string;
export declare const namePathLabel: (name: FormNamePath) => string;
export declare const getNamePathValue: (model: Record<string, unknown>, name: FormNamePath) => unknown;
export declare const setNamePathValue: (model: Record<string, unknown>, name: FormNamePath, value: unknown) => void;
export declare const deleteNamePathValue: (model: Record<string, unknown>, name: FormNamePath) => void;
