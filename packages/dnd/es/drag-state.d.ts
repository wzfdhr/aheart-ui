import type { DragData } from './types';
export declare const isDragActive: import("vue").ComputedRef<boolean>;
export declare const currentDragData: import("vue").ComputedRef<DragData | undefined>;
export declare const startDrag: (data: DragData) => void;
export declare const endDrag: () => void;
