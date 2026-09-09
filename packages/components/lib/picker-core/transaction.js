"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const createPickerTransaction = ({ needConfirm, committed }) => {
  let committedValue = committed;
  let draftValue = committed;
  return {
    isConfirmRequired() {
      return typeof needConfirm === "function" ? needConfirm() : needConfirm;
    },
    shouldCommit() {
      return !this.isConfirmRequired();
    },
    shouldStage() {
      return this.isConfirmRequired();
    },
    begin(value) {
      draftValue = value;
      return value;
    },
    apply(value) {
      draftValue = value;
      if (!this.isConfirmRequired())
        committedValue = value;
      return value;
    },
    commit() {
      committedValue = draftValue;
      return committedValue;
    },
    discard() {
      draftValue = committedValue;
      return committedValue;
    },
    syncCommitted(value) {
      committedValue = value;
      draftValue = value;
    },
    canAct(gate = {}) {
      return !gate.disabled && !gate.readOnly;
    },
    snapshot() {
      return { committed: committedValue, draft: draftValue };
    }
  };
};
exports.createPickerTransaction = createPickerTransaction;
