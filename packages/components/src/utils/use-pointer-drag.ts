import { onBeforeUnmount, ref } from 'vue'

export type PointerDragEndReason = 'end' | 'cancel' | 'blur' | 'unmount'

export interface PointerDragOptions {
  cursor?: string
  onMove: (event: PointerEvent) => void
  onEnd?: (reason: PointerDragEndReason) => void
}

export const usePointerDrag = (options: PointerDragOptions) => {
  const isDragging = ref(false)
  let animationFrame: number | undefined
  let latestEvent: PointerEvent | undefined
  let activePointerId: number | undefined
  let dragShield: HTMLDivElement | undefined
  let previousCursor = ''
  let previousUserSelect = ''

  const getDocument = () => (typeof document === 'undefined' ? undefined : document)

  const cancelFrame = () => {
    if (animationFrame === undefined) {
      return
    }

    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(animationFrame)
    } else {
      clearTimeout(animationFrame)
    }

    animationFrame = undefined
  }

  const removeShield = () => {
    dragShield?.remove()
    dragShield = undefined
  }

  const restoreDocument = () => {
    const currentDocument = getDocument()

    if (!currentDocument) {
      return
    }

    currentDocument.body.style.cursor = previousCursor
    currentDocument.body.style.userSelect = previousUserSelect
  }

  const stop = (reason: PointerDragEndReason = 'end') => {
    const currentDocument = getDocument()

    if (!isDragging.value || !currentDocument) {
      return
    }

    if (reason === 'end' && latestEvent) {
      cancelFrame()
      const finalEvent = latestEvent
      latestEvent = undefined
      options.onMove(finalEvent)
    } else {
      cancelFrame()
      latestEvent = undefined
    }

    currentDocument.removeEventListener('pointermove', handleMove)
    currentDocument.removeEventListener('pointerup', handlePointerUp)
    currentDocument.removeEventListener('pointercancel', handlePointerCancel)
    window.removeEventListener('blur', handleWindowBlur)
    removeShield()
    restoreDocument()
    isDragging.value = false
    activePointerId = undefined
    options.onEnd?.(reason)
  }

  const flushMove = () => {
    animationFrame = undefined

    const moveEvent = latestEvent
    latestEvent = undefined

    if (moveEvent) {
      options.onMove(moveEvent)
    }
  }

  const scheduleMove = () => {
    if (animationFrame !== undefined) {
      return
    }

    animationFrame = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame(flushMove)
      : window.setTimeout(flushMove, 16)
  }

  function handleMove(event: Event) {
    if (!isDragging.value || !isActivePointer(event)) {
      return
    }

    event.preventDefault()
    latestEvent = event as PointerEvent
    scheduleMove()
  }

  function handlePointerUp(event: Event) {
    if (!isActivePointer(event)) {
      return
    }

    stop('end')
  }

  function handlePointerCancel(event: Event) {
    if (!isActivePointer(event)) {
      return
    }

    stop('cancel')
  }

  function handleWindowBlur() {
    stop('blur')
  }

  function isActivePointer(event: Event) {
    const pointerId = (event as PointerEvent).pointerId
    return pointerId === undefined || activePointerId === pointerId
  }

  const createShield = (currentDocument: Document) => {
    const shield = currentDocument.createElement('div')
    shield.dataset.aheartDragShield = 'true'
    shield.style.position = 'fixed'
    shield.style.inset = '0'
    shield.style.zIndex = '2147483647'
    shield.style.cursor = options.cursor ?? 'default'
    shield.style.pointerEvents = 'all'
    shield.style.background = 'transparent'
    currentDocument.body.appendChild(shield)
    dragShield = shield
  }

  const start = (event: PointerEvent) => {
    const currentDocument = getDocument()

    if (!currentDocument || isDragging.value || event.button !== 0) {
      return
    }

    event.preventDefault()
    isDragging.value = true
    activePointerId = event.pointerId
    previousCursor = currentDocument.body.style.cursor
    previousUserSelect = currentDocument.body.style.userSelect
    currentDocument.body.style.cursor = options.cursor ?? 'default'
    currentDocument.body.style.userSelect = 'none'
    createShield(currentDocument)
    ;(event.currentTarget as Element | null)?.setPointerCapture?.(event.pointerId)
    currentDocument.addEventListener('pointermove', handleMove)
    currentDocument.addEventListener('pointerup', handlePointerUp)
    currentDocument.addEventListener('pointercancel', handlePointerCancel)
    window.addEventListener('blur', handleWindowBlur)
  }

  onBeforeUnmount(() => stop('unmount'))

  return {
    isDragging,
    start,
    stop
  }
}
