import { type MaybeRefOrGetter, type Ref } from 'vue';
import type { DragData } from './types';
export interface UseDraggableOptions {
    data: MaybeRefOrGetter<DragData>;
    disabled?: MaybeRefOrGetter<boolean | undefined>;
    onDragStart?: () => void;
    onDrop?: () => void;
}
export declare function useDraggable(element: Ref<HTMLElement | undefined>, options: UseDraggableOptions): {
    isDragging: Ref<boolean, boolean>;
};
