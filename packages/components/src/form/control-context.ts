import { computed, inject, type AriaAttributes, type ComputedRef, type InjectionKey } from 'vue'

export interface FormControlContext {
  controlId: ComputedRef<string | undefined>
  labelledBy: ComputedRef<string | undefined>
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  status: ComputedRef<string | undefined>
  change: () => void
  blur: () => void
}

export const formControlKey: InjectionKey<FormControlContext> = Symbol('aheart-form-control')
const controlCounts = new WeakMap<FormControlContext, number>()
export const useFormControl = () => {
  const context = inject(formControlKey, undefined)
  if (!context) return undefined
  const index = controlCounts.get(context) ?? 0
  controlCounts.set(context, index + 1)
  return {
    ...context,
    controlId: computed(() => {
      const id = context.controlId.value
      return id && index ? `${id}-${index}` : id
    })
  }
}
export const mergeAriaIds = (...values: Array<unknown>) => {
  const ids = values.filter((value): value is string => typeof value === 'string').flatMap((value) => value.split(/\s+/)).filter(Boolean)
  return ids.length ? [...new Set(ids)].join(' ') : undefined
}
export const formAriaInvalid = (explicit: unknown, status: string | undefined): AriaAttributes['aria-invalid'] =>
  explicit !== undefined ? explicit as AriaAttributes['aria-invalid'] : status === 'error' ? 'true' : undefined
