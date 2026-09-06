import type { FormNamePath } from './types';
export declare const normalizeNamePath: (name: FormNamePath) => FormNamePath;
export declare const namePathKey: (name: FormNamePath) => string;
export declare const namePathLabel: (name: FormNamePath) => string;
export declare const getNamePathValue: (model: Record<string, unknown>, name: FormNamePath) => unknown;
export declare const setNamePathValue: (model: Record<string, unknown>, name: FormNamePath, value: unknown) => void;
export declare const deleteNamePathValue: (model: Record<string, unknown>, name: FormNamePath) => void;
