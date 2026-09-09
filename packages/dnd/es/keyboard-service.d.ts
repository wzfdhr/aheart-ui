import type { DragData, KeyboardDragCancelEvent, KeyboardDragEvent, KeyboardDropEvent } from './types';
type Registration = {
    element: HTMLElement;
    getData: () => DragData;
    getLabel: () => string;
    getScope: () => string | number | undefined;
    isDisabled: () => boolean;
    accepts?: (data: DragData) => boolean;
    onGrab: (event: KeyboardDragEvent) => void;
    onCancel?: (event: KeyboardDragCancelEvent) => void;
    onDrop?: (data: DragData, event: KeyboardDropEvent) => void;
    kind?: 'source' | 'zone';
};
export declare function registerKeyboardSource(registration: Omit<Registration, 'accepts' | 'onDrop'>): () => void;
export declare function registerKeyboardZone(registration: Registration): () => void;
export declare function cancelKeyboardScope(ownerDocument: Document, scopeKey: string | number | undefined): void;
export {};
