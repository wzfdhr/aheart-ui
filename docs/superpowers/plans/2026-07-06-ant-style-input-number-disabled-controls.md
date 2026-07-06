# Ant-style InputNumber Disabled Controls Plan

## Phase

InputNumber disabled/read-only controls visibility compatibility.

## Steps

- [x] Add failing tests proving controls are hidden for direct `disabled`,
      inherited ConfigProvider disabled, and `readOnly`.
- [x] Update `showControls` to depend on `controls`, resolved disabled state,
      and `readOnly`.
- [x] Update InputNumber docs for `controls` visibility.
- [x] Regenerate package outputs.
- [x] Run focused and full verification.
- [ ] Commit, push the feature branch, fast-forward merge into `master`, and
      push `master`.
