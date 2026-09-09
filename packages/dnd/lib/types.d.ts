export type DragData = Record<string, unknown> & {
    type?: string;
};
export type DragType = string;
export type SortableRevision = string | number;
export type SortableInput = 'pointer' | 'touch' | 'keyboard';
export type SortableDropPosition = {
    kind: 'item';
    itemKey: string;
} | {
    kind: 'end';
};
export type SortableMoveRejectReason = 'stale-revision' | 'source-missing' | 'target-missing' | 'duplicate-key' | 'group-mismatch' | 'disabled' | 'invalid-position' | 'parent-rejected' | 'rollback-rejected' | 'unmounted' | 'cancelled';
export interface SortableMoveLocation {
    listId: string;
    listLabel: string;
    index: number;
    revision: SortableRevision;
}
export interface SortableMoveEvent {
    transactionId: string;
    sessionId: string;
    input: SortableInput;
    itemKey: string;
    itemLabel: string;
    source: SortableMoveLocation;
    target: SortableMoveLocation;
    position: SortableDropPosition;
}
export interface SortableMoveRejectEvent extends SortableMoveEvent {
    reason: SortableMoveRejectReason;
}
export interface SortableChangeContext {
    transactionId: string;
    phase: 'candidate' | 'rollback';
    input: SortableInput;
}
export type KeyboardDragCancelReason = 'cancelled' | 'replaced' | 'unmounted' | 'scope-changed' | 'page-hidden' | 'owner-detached';
export interface KeyboardDragEvent {
    sessionId: string;
    data: DragData;
    source: {
        label: string;
        scopeKey?: string | number;
    };
}
export interface KeyboardDragCancelEvent extends KeyboardDragEvent {
    reason: KeyboardDragCancelReason;
}
export interface KeyboardDropEvent extends KeyboardDragEvent {
    target: {
        label: string;
        scopeKey?: string | number;
    };
}
export interface DraggableOptions {
    data: DragData;
    disabled?: boolean;
    keyboard?: boolean;
    label?: string;
    scopeKey?: string | number;
    tag?: string;
}
export interface DroppableOptions {
    data?: DragData;
    accept?: DragType | DragType[];
    disabled?: boolean;
    keyboard?: boolean;
    label?: string;
    scopeKey?: string | number;
    tag?: string;
}
