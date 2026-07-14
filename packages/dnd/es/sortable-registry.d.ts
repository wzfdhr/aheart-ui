import type { SortableItemData } from './sortable-context';
interface SortableListController {
    group: () => string | undefined;
    items: () => unknown[];
    update: (items: unknown[]) => void;
}
export declare function registerSortableList(listId: string, controller: SortableListController): () => boolean;
export declare function moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number): boolean;
export {};
