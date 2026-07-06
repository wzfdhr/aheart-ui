# Ant-style InputNumber Addons Plan

## Phase

InputNumber `addonBefore` and `addonAfter` compatibility.

## Steps

- [x] Add failing tests that prove `addonBefore` and `addonAfter` render before
      and after the input control, including numeric zero content.
- [x] Add `addonBefore` and `addonAfter` renderable props to InputNumber types.
- [x] Render addon containers in `input-number.vue` without changing existing
      prefix, suffix, controls, or input forwarding behavior.
- [x] Add addon container styles.
- [x] Update InputNumber docs API table.
- [x] Regenerate package outputs.
- [x] Run focused and full verification.
- [ ] Commit, push the feature branch, fast-forward merge into `master`, and
      push `master`.
