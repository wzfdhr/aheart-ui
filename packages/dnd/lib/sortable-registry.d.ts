import type { SortableItemData } from './sortable-context';
interface SortableListController {
    group: () => string | undefined;
    disabled: () => boolean;
    items: () => unknown[];
    update: (items: unknown[]) => void;
    announce: (message: string) => void;
}
export interface SortableMoveResult {
    targetListId: string;
    targetIndex: number;
    crossedList: boolean;
}
export declare function registerSortableList(listId: string, controller: SortableListController): () => boolean;
export declare function moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number): false | {
    targetListId: string;
    targetIndex: number;
    crossedList: false;
} | {
    targetListId: string;
    targetIndex: number;
    crossedList: true;
};
export declare function moveSortableItemToAdjacentList(source: SortableItemData, direction: -1 | 1): false | {
    targetListId: string;
    targetIndex: number;
    crossedList: false;
} | {
    targetListId: string;
    targetIndex: number;
    crossedList: true;
};
export {};
