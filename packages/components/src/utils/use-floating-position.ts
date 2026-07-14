import {
  arrow as floatingArrow,
  autoUpdate,
  computePosition,
  flip,
  offset as floatingOffset,
  shift as floatingShift,
  type AutoUpdateOptions,
  type Middleware,
  type Placement,
  type Side,
  type Strategy
} from '@floating-ui/dom'
import {
  computed,
  onScopeDispose,
  ref,
  toValue,
  watchEffect,
  type CSSProperties,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import type { FloatingPlacement } from './floating'

type ElementSource = MaybeRefOrGetter<HTMLElement | null | undefined>

export interface UseFloatingPositionOptions {
  reference: ElementSource
  floating: ElementSource
  arrow?: ElementSource
  open?: MaybeRefOrGetter<boolean | undefined>
  placement?: MaybeRefOrGetter<FloatingPlacement | undefined>
  strategy?: MaybeRefOrGetter<Strategy | undefined>
  offset?: MaybeRefOrGetter<number | undefined>
  autoAdjustOverflow?: MaybeRefOrGetter<boolean | undefined>
  shift?: MaybeRefOrGetter<boolean | undefined>
  arrowSize?: MaybeRefOrGetter<number | undefined>
  autoUpdateOptions?: AutoUpdateOptions
}

export interface UseFloatingPositionReturn {
  placement: Ref<FloatingPlacement>
  popupStyle: Ref<CSSProperties>
  arrowStyle: Ref<CSSProperties>
  arrowStaticSide: ComputedRef<Side>
  update: () => Promise<void>
}

const placementToFloatingUI: Record<FloatingPlacement, Placement> = {
  top: 'top',
  topLeft: 'top-start',
  topRight: 'top-end',
  bottom: 'bottom',
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  left: 'left',
  leftTop: 'left-start',
  leftBottom: 'left-end',
  right: 'right',
  rightTop: 'right-start',
  rightBottom: 'right-end'
}

const placementFromFloatingUI = Object.fromEntries(
  Object.entries(placementToFloatingUI).map(([aheartPlacement, floatingPlacement]) => [
    floatingPlacement,
    aheartPlacement
  ])
) as Record<Placement, FloatingPlacement>

const oppositeSide: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
}

export const toFloatingUIPlacement = (placement: FloatingPlacement): Placement =>
  placementToFloatingUI[placement]

export const fromFloatingUIPlacement = (placement: Placement): FloatingPlacement =>
  placementFromFloatingUI[placement]

export const getFloatingArrowStaticSide = (placement: FloatingPlacement): Side =>
  oppositeSide[toFloatingUIPlacement(placement).split('-')[0] as Side]

const px = (value: number) => `${Math.round(value * 100) / 100}px`

export function useFloatingPosition(options: UseFloatingPositionOptions): UseFloatingPositionReturn {
  const initialPlacement = toValue(options.placement) ?? 'bottomLeft'
  const placement = ref<FloatingPlacement>(initialPlacement)
  const popupStyle = ref<CSSProperties>({
    position: toValue(options.strategy) ?? 'absolute',
    left: '0px',
    top: '0px'
  })
  const arrowStyle = ref<CSSProperties>({})
  const arrowStaticSide = computed(() => getFloatingArrowStaticSide(placement.value))
  let updateId = 0

  const update = async () => {
    const reference = toValue(options.reference)
    const floating = toValue(options.floating)

    if (
      typeof window === 'undefined' ||
      toValue(options.open) === false ||
      !reference ||
      !floating
    ) {
      return
    }

    const currentUpdateId = ++updateId
    const arrowElement = options.arrow ? toValue(options.arrow) : undefined
    const middleware: Middleware[] = [floatingOffset(toValue(options.offset) ?? 8)]

    if (toValue(options.autoAdjustOverflow) !== false) {
      middleware.push(flip())
    }

    if (toValue(options.shift) !== false) {
      middleware.push(floatingShift({ padding: 8 }))
    }

    if (arrowElement) {
      middleware.push(floatingArrow({ element: arrowElement, padding: 4 }))
    }

    const result = await computePosition(reference, floating, {
      placement: toFloatingUIPlacement(toValue(options.placement) ?? 'bottomLeft'),
      strategy: toValue(options.strategy) ?? 'absolute',
      middleware
    })

    if (
      currentUpdateId !== updateId ||
      toValue(options.open) === false ||
      reference !== toValue(options.reference) ||
      floating !== toValue(options.floating)
    ) {
      return
    }

    placement.value = fromFloatingUIPlacement(result.placement)
    popupStyle.value = {
      position: result.strategy,
      left: px(result.x),
      top: px(result.y)
    }

    const arrowData = result.middlewareData.arrow
    if (!arrowElement || !arrowData) {
      arrowStyle.value = {}
      return
    }

    const staticSide = getFloatingArrowStaticSide(placement.value)
    const size = toValue(options.arrowSize) ?? 8
    arrowStyle.value = {
      ...(arrowData.x === undefined ? {} : { left: px(arrowData.x) }),
      ...(arrowData.y === undefined ? {} : { top: px(arrowData.y) }),
      [staticSide]: px(-size / 2)
    }
  }

  watchEffect((onCleanup) => {
    const reference = toValue(options.reference)
    const floating = toValue(options.floating)
    const open = toValue(options.open) !== false

    toValue(options.placement)
    toValue(options.strategy)
    toValue(options.offset)
    toValue(options.autoAdjustOverflow)
    toValue(options.shift)
    toValue(options.arrowSize)
    if (options.arrow) toValue(options.arrow)

    if (typeof window === 'undefined' || !open || !reference || !floating) {
      return
    }

    const cleanup = autoUpdate(reference, floating, update, options.autoUpdateOptions)
    onCleanup(() => {
      updateId += 1
      cleanup()
    })
  })

  onScopeDispose(() => {
    updateId += 1
  })

  return {
    placement,
    popupStyle,
    arrowStyle,
    arrowStaticSide,
    update
  }
}
