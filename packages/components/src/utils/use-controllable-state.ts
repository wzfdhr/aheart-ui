import { computed, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseControllableStateOptions<T> {
  /** Presence of this property opts into controlled mode, including an undefined value. */
  controlled?: MaybeRefOrGetter<T | undefined>
  /** Overrides property-presence detection when controlledness changes at runtime. */
  isControlled?: MaybeRefOrGetter<boolean>
  defaultValue?: MaybeRefOrGetter<T | undefined>
  onChange?: (value: T | undefined) => void
}

export interface UseControllableStateReturn<T> {
  state: Readonly<Ref<T | undefined>>
  isControlled: Readonly<Ref<boolean>>
  setState: (
    next: T | undefined | ((current: T | undefined) => T | undefined),
    options?: { force?: boolean }
  ) => boolean
}

/**
 * Small internal state bridge for controls that support both v-model and defaults.
 * Controlled state is always read from its owner, so rejected update events cannot
 * leave an optimistic value behind.
 */
export const useControllableState = <T>(
  options: UseControllableStateOptions<T>
): UseControllableStateReturn<T> => {
  const controlledByPresence = Object.prototype.hasOwnProperty.call(options, 'controlled')
  const isControlled = computed(() => options.isControlled === undefined
    ? controlledByPresence
    : toValue(options.isControlled))
  const uncontrolled = ref(toValue(options.defaultValue)) as Ref<T | undefined>
  const state = computed<T | undefined>(() => (
    isControlled.value ? toValue(options.controlled) : uncontrolled.value
  ))

  watch(
    [isControlled, () => toValue(options.controlled)],
    ([controlled, value]) => {
      if (controlled) uncontrolled.value = value
    },
    { flush: 'sync', immediate: true }
  )

  const setState = (
    next: T | undefined | ((current: T | undefined) => T | undefined),
    setOptions: { force?: boolean } = {}
  ) => {
    const value = typeof next === 'function'
      ? (next as (current: T | undefined) => T | undefined)(state.value)
      : next

    // `force` preserves public event notifications for an explicit user action;
    // the default path deduplicates state-only writes.
    if (!setOptions.force && Object.is(value, state.value)) {
      return false
    }

    if (!isControlled.value) {
      uncontrolled.value = value
    }
    options.onChange?.(value)
    return true
  }

  return { state, isControlled, setState }
}
