import type { ComponentPublicInstance, InjectionKey, Ref } from 'vue';
import type { DragData } from './types';
import type { SortableMoveResult } from './sortable-registry';
export interface SortableItemData extends DragData {
    type: 'aheart-sortable';
    listId: string;
    group?: string;
    index: number;
}
export interface SortableHandleProps {
    class: string;
    'data-aheart-dnd-handle': string;
    ref: (element: Element | ComponentPublicInstance | null) => void;
    onPointerdown: (event: PointerEvent) => void;
}
export interface SortableContextValue {
    listId: string;
    group?: string;
    disabled: Ref<boolean>;
    move: (source: SortableItemData, targetIndex: number, keyboard?: boolean) => SortableMoveResult | false;
    moveAdjacent: (source: SortableItemData, direction: -1 | 1) => SortableMoveResult | false;
}
export declare const sortableContextKey: InjectionKey<SortableContextValue>;
