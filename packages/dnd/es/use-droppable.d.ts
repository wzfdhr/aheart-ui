import { type MaybeRefOrGetter, type Ref } from 'vue';
import type { DragData, DragType } from './types';
export interface UseDroppableOptions {
    data?: MaybeRefOrGetter<DragData | undefined>;
    accept?: MaybeRefOrGetter<DragType | DragType[] | undefined>;
    disabled?: MaybeRefOrGetter<boolean | undefined>;
    onDrop?: (data: DragData) => void;
}
export declare function useDroppable(element: Ref<HTMLElement | undefined>, options: UseDroppableOptions): void;
