# Ant-style InputNumber Input Event Plan

## Phase

InputNumber raw input event compatibility.

## Steps

- [x] Add a failing test that typing emits `input` with raw text while `change` is deferred by default.
- [x] Add an `input` emit validator.
- [x] Emit raw text from `handleInput` without changing existing value commit rules.
- [x] Update InputNumber docs for the `input` event and native listener note.
- [x] Regenerate package outputs.
- [x] Run focused and full verification.
- [ ] Commit, push the feature branch, fast-forward merge into `master`, and push `master`.
