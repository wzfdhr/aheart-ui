import { h } from 'vue'
import {
  Draggable,
  DropZone,
  DragOverlay,
  SortableItem,
  SortableList,
  useDraggable,
  useDroppable,
  useSortable
} from '@aheart-ui/dnd'
import type {
  DragData,
  DraggableOptions,
  DroppableOptions,
  KeyboardDragCancelEvent,
  KeyboardDragCancelReason,
  KeyboardDragEvent,
  KeyboardDropEvent,
  SortableChangeContext,
  SortableDropPosition,
  SortableInput,
  SortableMoveEvent,
  SortableMoveLocation,
  SortableMoveRejectEvent,
  SortableMoveRejectReason,
  SortableRevision
} from '@aheart-ui/dnd'

type Row = { id: string; label: string }
const rows: Row[] = [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }]
const revision: SortableRevision = 'consumer-revision'
const input: SortableInput = 'keyboard'
const position: SortableDropPosition = { kind: 'item', itemKey: 'two' }
const location: SortableMoveLocation = { listId: 'source', listLabel: 'Source', index: 0, revision }
const move: SortableMoveEvent = {
  transactionId: 'transaction', sessionId: 'session', input, itemKey: 'one', itemLabel: 'One',
  source: location, target: { ...location, listId: 'target', listLabel: 'Target', index: 1 }, position
}
const reject: SortableMoveRejectEvent = { ...move, reason: 'parent-rejected' }
const change: SortableChangeContext = { transactionId: 'transaction', phase: 'candidate', input }
const drag: DragData = { type: 'task', id: 'one' }
const keyboard: KeyboardDragEvent = { sessionId: 'keyboard', data: drag, source: { label: 'One', scopeKey: 'route' } }
const cancel: KeyboardDragCancelEvent = { ...keyboard, reason: 'cancelled' }
const drop: KeyboardDropEvent = { ...keyboard, target: { label: 'Target', scopeKey: 'route' } }
const reason: SortableMoveRejectReason = reject.reason
const cancelReason: KeyboardDragCancelReason = cancel.reason
void [rows, position, location, move, reject, change, keyboard, cancel, drop, reason, cancelReason]

h(Draggable, { data: drag } satisfies DraggableOptions)
h(DropZone, { accept: 'task' } satisfies DroppableOptions)
h(DragOverlay)
h(SortableItem, { item: rows[0], index: 0 })
h(SortableList, { items: rows, itemKey: 'id', revision, label: 'Rows', itemLabel: item => (item as Row).label })
void useDraggable
void useDroppable
void useSortable
