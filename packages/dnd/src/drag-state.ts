import { computed, shallowRef } from 'vue'
import type { DragData } from './types'

const activeDragData = shallowRef<DragData | undefined>()
const activeByDocument = new WeakMap<Document, DragData>()
const globalDocument = () => typeof globalThis !== 'undefined' && 'document' in globalThis ? (globalThis as typeof globalThis & { document?: Document }).document : undefined

export const isDragActive = computed(() => activeDragData.value !== undefined)
export const currentDragData = computed(() => activeDragData.value)
export const isDragActiveFor = (ownerDocument: Document | undefined) => ownerDocument ? activeByDocument.has(ownerDocument) : activeDragData.value !== undefined

export const startDrag = (data: DragData, ownerDocument?: Document) => {
  if (ownerDocument) {
    activeByDocument.set(ownerDocument, data)
    if (ownerDocument === globalDocument()) activeDragData.value = data
    return
  }
  const document = globalDocument()
  if (document) activeByDocument.set(document, data)
  activeDragData.value = data
}

export const endDrag = (ownerDocument?: Document) => {
  if (ownerDocument) {
    activeByDocument.delete(ownerDocument)
    if (ownerDocument === globalDocument()) activeDragData.value = undefined
    return
  }
  const document = globalDocument()
  if (document) activeByDocument.delete(document)
  activeDragData.value = undefined
}

export const cancelNativeDrag = (ownerWindow: Window | undefined) => {
  if (!ownerWindow) return
  const event = ownerWindow.document.createEvent('MouseEvent')
  event.initEvent('dragend', true, true)
  ownerWindow.dispatchEvent(event)
}
