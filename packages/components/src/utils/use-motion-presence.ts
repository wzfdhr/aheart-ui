import { computed, onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export type MotionPresencePhase = 'hidden' | 'enter' | 'entered' | 'leave'

interface MotionPresenceOptions {
  forceRender?: MaybeRefOrGetter<boolean | undefined>
  destroyOnHidden?: MaybeRefOrGetter<boolean>
  duration: number
}

const requestFrame = (callback: FrameRequestCallback) =>
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(callback)
    : (setTimeout(() => callback(Date.now()), 0) as unknown as number)

const cancelFrame = (frame: number | undefined) => {
  if (frame === undefined) return
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
  else clearTimeout(frame)
}

const reducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useMotionPresence(visible: MaybeRefOrGetter<boolean>, options: MotionPresenceOptions) {
  const initiallyVisible = toValue(visible)
  const mounted = ref(initiallyVisible || Boolean(toValue(options.forceRender)))
  const phase = ref<MotionPresencePhase>(initiallyVisible ? 'entered' : 'hidden')
  let enterFrame: number | undefined
  let leaveTimer: ReturnType<typeof setTimeout> | undefined

  const clearPending = () => {
    cancelFrame(enterFrame)
    enterFrame = undefined
    if (leaveTimer !== undefined) clearTimeout(leaveTimer)
    leaveTimer = undefined
  }

  const beginEnter = () => {
    clearPending()
    mounted.value = true
    phase.value = 'enter'
    enterFrame = requestFrame(() => {
      enterFrame = undefined
      if (toValue(visible)) phase.value = 'entered'
    })
  }

  const beginLeave = () => {
    clearPending()
    if (!mounted.value) return
    phase.value = 'leave'
    leaveTimer = setTimeout(() => {
      leaveTimer = undefined
      phase.value = 'hidden'
      if (toValue(options.destroyOnHidden) && !toValue(options.forceRender)) mounted.value = false
    }, reducedMotion() ? 0 : options.duration)
  }

  watch(
    [() => toValue(visible), () => Boolean(toValue(options.forceRender))],
    ([isVisible, forceRender]) => {
      if (isVisible) beginEnter()
      else if (forceRender && !mounted.value) {
        clearPending()
        mounted.value = true
        phase.value = 'hidden'
      } else beginLeave()
    }
  )

  onBeforeUnmount(clearPending)

  return { isMounted: computed(() => mounted.value), phase }
}
