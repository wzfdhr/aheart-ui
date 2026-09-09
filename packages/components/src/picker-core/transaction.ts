export interface PickerTransactionOptions<T> {
  needConfirm: boolean | (() => boolean)
  committed?: T
}

export interface PickerActionGate {
  disabled?: boolean
  readOnly?: boolean
}

export interface PickerTransaction<T> {
  isConfirmRequired(): boolean
  shouldCommit(): boolean
  shouldStage(): boolean
  begin(value: T): T
  apply(value: T): T
  commit(): T | undefined
  discard(): T | undefined
  syncCommitted(value: T | undefined): void
  canAct(gate?: PickerActionGate): boolean
  snapshot(): { committed?: T; draft?: T }
}

export const createPickerTransaction = <T>({ needConfirm, committed }: PickerTransactionOptions<T>): PickerTransaction<T> => {
  let committedValue = committed
  let draftValue = committed
  return {
    isConfirmRequired() {
      return typeof needConfirm === 'function' ? needConfirm() : needConfirm
    },
    shouldCommit() {
      return !this.isConfirmRequired()
    },
    shouldStage() {
      return this.isConfirmRequired()
    },
    begin(value) {
      draftValue = value
      return value
    },
    apply(value) {
      draftValue = value
      if (!this.isConfirmRequired()) committedValue = value
      return value
    },
    commit() {
      committedValue = draftValue
      return committedValue
    },
    discard() {
      draftValue = committedValue
      return committedValue
    },
    syncCommitted(value) {
      committedValue = value
      draftValue = value
    },
    canAct(gate = {}) {
      return !gate.disabled && !gate.readOnly
    },
    snapshot() {
      return { committed: committedValue, draft: draftValue }
    }
  }
}
