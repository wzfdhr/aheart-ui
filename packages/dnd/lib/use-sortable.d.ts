import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DragData, DragType } from './types';
export interface UseSortableOptions {
    data: MaybeRefOrGetter<DragData>;
    dropData?: MaybeRefOrGetter<DragData | undefined>;
    accept?: MaybeRefOrGetter<DragType | DragType[] | undefined>;
    disabled?: MaybeRefOrGetter<boolean | undefined>;
    onDragStart?: () => void;
    onDrop?: (data: DragData) => void;
}
export declare function useSortable(element: Ref<HTMLElement | undefined>, options: UseSortableOptions): {
    isDragging: Ref<boolean, boolean>;
};
