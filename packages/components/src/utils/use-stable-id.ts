import { computed, toValue, useId, type MaybeRefOrGetter, type ComputedRef } from 'vue'

/** Returns an explicit id when supplied, otherwise a Vue SSR-safe generated id. */
export const useStableId = (
  explicitId?: MaybeRefOrGetter<string | undefined>,
  prefix = 'aheart'
): ComputedRef<string> => {
  const generatedId = `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '-')}`
  return computed(() => toValue(explicitId) ?? generatedId)
}
