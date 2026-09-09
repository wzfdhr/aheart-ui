import type { SortableChangeContext, SortableMoveEvent, SortableMoveRejectEvent, SortableRevision } from './types';
import type { SortableItemData } from './sortable-context';
export interface SortableListController {
    group: () => string | undefined;
    items: () => unknown[];
    update: (items: unknown[], context?: SortableChangeContext) => void;
    keyOf?: (item: unknown) => string;
    revision?: () => SortableRevision;
    scopeKey?: () => string | number | undefined;
    ownerDocument?: () => Document | undefined;
    disabled?: () => boolean;
    label?: () => string;
    itemLabel?: (item: unknown, index: number) => string;
    onMoveStart?: (event: SortableMoveEvent) => void;
    onMoveCommit?: (event: SortableMoveEvent) => void;
    onMoveReject?: (event: SortableMoveRejectEvent) => void;
    onAnnounce?: (message: string) => void;
    onAnnounceNow?: (message: string) => void;
}
export declare function findAdjacentSortableList(sourceListId: string, direction: -1 | 1): {
    listId: string;
    length: number;
} | undefined;
export declare function registerSortableList(listId: string, controller: SortableListController): () => boolean;
export declare function beginSortableSession(source: SortableItemData): SortableItemData;
export declare function closeSortableSession(sessionId: string | undefined): void;
export declare function closeSortableSessionsForList(listId: string): void;
export declare function invalidateSortableRevision(listId: string): void;
export declare function invalidateSortableScope(listId: string): void;
export declare function moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number): boolean;
