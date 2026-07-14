export type DragData = Record<string, unknown> & {
    type?: string;
};
export type DragType = string;
export interface DraggableOptions {
    data: DragData;
    disabled?: boolean;
}
export interface DroppableOptions {
    data?: DragData;
    accept?: DragType | DragType[];
    disabled?: boolean;
}
