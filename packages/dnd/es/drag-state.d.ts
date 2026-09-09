import type { DragData } from './types';
export declare const isDragActive: import("vue").ComputedRef<boolean>;
export declare const currentDragData: import("vue").ComputedRef<DragData | undefined>;
export declare const isDragActiveFor: (ownerDocument: Document | undefined) => boolean;
export declare const startDrag: (data: DragData, ownerDocument?: Document) => void;
export declare const endDrag: (ownerDocument?: Document) => void;
export declare const cancelNativeDrag: (ownerWindow: Window | undefined) => void;
