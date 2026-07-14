import type { App, Plugin } from 'vue'
import './style.css'
import Draggable from './draggable.vue'
import DropZone from './drop-zone.vue'
import DragOverlay from './drag-overlay.vue'
import SortableItem from './sortable-item.vue'
import SortableList from './sortable-list.vue'

export type { DragData, DragType, DraggableOptions, DroppableOptions } from './types'
export { useDraggable } from './use-draggable'
export { useDroppable } from './use-droppable'
export { useSortable } from './use-sortable'

const AheartDnd: Plugin = {
  install(app: App) {
    app.component('ADraggable', Draggable)
    app.component('ADropZone', DropZone)
    app.component('ADragOverlay', DragOverlay)
    app.component('ASortableItem', SortableItem)
    app.component('ASortableList', SortableList)
  }
}

export { Draggable, DropZone, DragOverlay, SortableItem, SortableList }
export default AheartDnd
