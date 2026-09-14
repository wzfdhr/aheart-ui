import type { ComputedRef, InjectionKey } from 'vue'
import type { FormNamePath } from './types'

export interface FormListNameContext {
  prefix: ComputedRef<FormNamePath>
  resolveName: (name: FormNamePath) => FormNamePath
  resolveOwner: (name: FormNamePath) => string
}

export const formListNameContextKey: InjectionKey<FormListNameContext> = Symbol('aheart-form-list-name-context')
