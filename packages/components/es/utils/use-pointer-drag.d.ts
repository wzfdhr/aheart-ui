export type PointerDragEndReason = 'end' | 'cancel' | 'blur' | 'unmount';
export interface PointerDragOptions {
    cursor?: string | (() => string);
    onMove: (event: PointerEvent) => void;
    onEnd?: (reason: PointerDragEndReason) => void;
}
export declare const usePointerDrag: (options: PointerDragOptions) => {
    isDragging: import("vue").Ref<boolean, boolean>;
    start: (event: PointerEvent) => void;
    stop: (reason?: PointerDragEndReason) => void;
};
