import { toValue } from 'vue'
import { useFloatingDismiss, type UseFloatingDismissOptions } from './use-floating-dismiss'
import { useFloatingPosition, type UseFloatingPositionOptions } from './use-floating-position'
import { useOverlayPortal } from './use-overlay-portal'

type PopupContainer = (trigger: HTMLElement) => HTMLElement | false

interface UseFloatingLayerOptions {
  reference: UseFloatingPositionOptions['reference']
  floating: UseFloatingPositionOptions['floating']
  getPopupContainer?: () => PopupContainer | undefined
  position: Omit<UseFloatingPositionOptions, 'reference' | 'floating'>
  dismiss: Omit<UseFloatingDismissOptions, 'floating' | 'trigger'>
}

/** Bind an anchored panel to positioning, Teleport and the document's dismiss stack. */
export function useFloatingLayer({ reference, floating, getPopupContainer, position, dismiss }: UseFloatingLayerOptions) {
  const portal = useOverlayPortal(() => {
    const trigger = toValue(reference)
    if (!trigger) return false
    const resolveContainer = getPopupContainer?.()
    return resolveContainer ? resolveContainer(trigger) : trigger.ownerDocument.body
  })
  const floatingPosition = useFloatingPosition({ ...position, reference, floating })
  useFloatingDismiss({ ...dismiss, trigger: reference, floating })

  return { ...portal, floatingPosition }
}
