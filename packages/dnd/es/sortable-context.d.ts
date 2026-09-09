import type { ComponentPublicInstance, InjectionKey, Ref } from 'vue';
import type { DragData, SortableRevision } from './types';
export interface SortableItemData extends DragData {
    type: 'aheart-sortable';
    listId: string;
    group?: string;
    index: number;
    itemKey?: string;
    revision?: SortableRevision;
    sessionId?: string;
    scopeKey?: string | number;
    input?: 'pointer' | 'touch' | 'keyboard';
    keyboard?: boolean;
    position?: {
        kind: 'item';
        itemKey: string;
    } | {
        kind: 'end';
    };
    sessionSnapshot?: Record<string, {
        revision: SortableRevision;
        keys: string[];
    }>;
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
    scopeKey?: string | number;
    disabled: Ref<boolean>;
    move: (source: SortableItemData, targetIndex: number, keyboard?: boolean) => void;
}
export declare const sortableContextKey: InjectionKey<SortableContextValue>;
