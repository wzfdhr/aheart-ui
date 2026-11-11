import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import {
  canRestoreOverlayFocus,
  getRecentPointerTarget,
  isTopmost,
  lockBodyScroll,
  prepareOverlayDocument,
  refreshOverlayStack,
  registerOverlay,
  unlockBodyScroll
} from './overlay-controller'
import { useOverlayPortal } from './use-overlay-portal'

interface UseDialogLayerOptions {
  id: symbol
  content: Readonly<Ref<HTMLElement | null>>
  getContainer: () => HTMLElement | string | (() => HTMLElement) | false | undefined
  getZIndex: () => number
  escapeEnabled: () => boolean
  onEscape: () => void
}

/** Own stack registration and the scroll lock until the caller finishes its exit. */
export function useDialogLayer(options: UseDialogLayerOptions) {
  const target = computed(() => {
    const container = options.getContainer()
    if (typeof container === 'function') return typeof window === 'undefined' ? false : container()
    return container ?? (typeof document === 'undefined' ? false : document.body)
  })
  const portal = useOverlayPortal(() => target.value)
  const effectiveZIndex = ref(options.getZIndex())

  let trigger: HTMLElement | null = null
  let focusBeforeClose: Element | null = null
  let registration: { ownerDocument: Document; unregister: () => void } | undefined
  const resolveDocument = () => {
    const container = target.value
    return options.content.value?.ownerDocument ??
      trigger?.ownerDocument ??
      (typeof container === 'object' ? container.ownerDocument : document)
  }
  const getActiveDocument = () => registration?.ownerDocument ?? resolveDocument()

  const register = () => {
    if (registration) return
    const ownerDocument = resolveDocument()
    const unregister = registerOverlay({
      id: options.id,
      document: ownerDocument,
      getTrigger: () => trigger,
      getContent: () => options.content.value,
      escapeEnabled: options.escapeEnabled,
      getBaseZIndex: options.getZIndex,
      onZIndexChange: (zIndex) => { effectiveZIndex.value = zIndex },
      onEscape: options.onEscape
    })
    lockBodyScroll(ownerDocument)
    registration = { ownerDocument, unregister }
  }

  const unregister = () => {
    if (!registration) return
    registration.unregister()
    unlockBodyScroll(registration.ownerDocument)
    registration = undefined
  }
  onBeforeUnmount(() => {
    unregister()
    trigger = null
    focusBeforeClose = null
  })

  watch(options.getZIndex, (zIndex) => {
    if (registration) refreshOverlayStack(registration.ownerDocument)
    else effectiveZIndex.value = zIndex
  })

  const captureTrigger = () => {
    focusBeforeClose = null
    const ownerDocument = resolveDocument()
    const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
    const pointerTarget = getRecentPointerTarget(ownerDocument)
    const active = ownerDocument.activeElement
    trigger = HTMLElementConstructor && pointerTarget instanceof HTMLElementConstructor
      ? pointerTarget
      : HTMLElementConstructor && active instanceof HTMLElementConstructor ? active : null
  }

  const captureFocusBeforeClose = (isLeaving: () => boolean) => {
    const ownerDocument = getActiveDocument()
    const active = ownerDocument.activeElement
    const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
    focusBeforeClose = active
    if (!HTMLElementConstructor || !(active instanceof HTMLElementConstructor) || !options.content.value?.contains(active)) return
    void nextTick(() => {
      if (focusBeforeClose === active && isLeaving() && isTopmost(options.id, ownerDocument) &&
        active.isConnected && canRestoreOverlayFocus(ownerDocument, active)) {
        active.focus()
      }
    })
  }

  const restoreTriggerFocus = (enabled: boolean) => {
    if (enabled && trigger?.isConnected && canRestoreOverlayFocus(trigger.ownerDocument, focusBeforeClose, options.content.value)) {
      trigger.focus()
    }
    focusBeforeClose = null
  }

  return {
    ...portal,
    effectiveZIndex,
    getActiveDocument,
    register,
    unregister,
    prepare: () => prepareOverlayDocument(resolveDocument()),
    isTopmost: () => isTopmost(options.id, getActiveDocument()),
    captureTrigger,
    captureFocusBeforeClose,
    restoreTriggerFocus
  }
}
