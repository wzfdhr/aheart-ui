# Ant-style InputNumber Native Attributes Plan

## Phase

InputNumber native input attribute compatibility.

## Steps

- [x] Add failing tests for native input attribute/listener pass-through.
- [x] Disable automatic attribute inheritance on the root.
- [x] Split attrs so `class`/`style` stay on root and remaining native attrs bind to the input.
- [x] Resolve `type` and `inputmode` from attrs with current defaults as fallback.
- [x] Document native input attribute forwarding in the InputNumber API docs.
- [x] Regenerate package outputs.
- [x] Run focused and full verification.
- [ ] Commit, push the feature branch, fast-forward merge into `master`, and push `master`.
