# Form.List screenshot-first design review

Production candidate `83afe25cbda347f0ab84562d83997530cdec4565`; the last production-only change after the capture set was the non-visual root-name identity correction in `83afe25`. Method: Product Design audit workflow, current-run IAB interaction plus fresh local Chromium captures. All accepted local screenshots were individually opened at original detail from `/private/tmp/aheart-form-list-design-f99a78e/`; the affected non-visual behavior was then rerun in units, full components and the packed consumer.

## Verdict

Scoped design/accessibility P0/P1/P2=`0/0/0` after two repair rounds. The renderless FormList itself adds no assumed list semantics; the official consumer fixture demonstrates labelled controls, error recovery and focus ownership.

## Numbered flow

1. **Initial list — healthy.** `01-initial.png` shows clear hierarchy, grouped operations, stable row cards, readable key diagnostics and unique Email/Phone labels. Disabled boundary controls are visually distinct.
2. **External reverse — healthy.** `02-external-reverse.png` shows Linus/Grace/Ada with their original `item-2/item-1/item-0` keys; no jump, overlap or clipped control is visible.
3. **Error plus move focus — healthy.** `03-error-move-focus.png` shows Grace's field error retained after moving to row one and a visible 2px focus indicator on the enabled fallback “Move down” control.
4. **Nested phone list — healthy.** `04-nested-phone.png` shows the second Grace phone field and its removal action without overlapping the parent row controls; the two phone labels are distinct.
5. **List-level error and deletion — healthy.** Re-captured `05-list-error.png` includes the 4.5:1-gated error, the sole surviving row and disabled boundary operations. Deleting a focused row transfers focus to an adjacent row (or Add when none remains), verified in the accessibility tree and E2E.
6. **Reset — healthy.** `06-reset.png` restores the three original rows without stale errors and exposes new item keys.
7. **Mobile reflow — healthy.** `07-mobile.png` shows a 390px touch viewport with two-column operation buttons, single-column row content and no horizontal clipping. Fresh mobile Chromium/WebKit screenshots and geometry assertions agree.

## Findings and repairs

- Round 1 P2: moving to a boundary disabled the activated button and lost focus. The fixture now moves focus to the same row's enabled opposite-direction action through the event target's `ownerDocument`.
- Round 1 P2: repeated generic Email/Phone and row-action names were ambiguous. Labels and native button accessible names now include the member and phone index; each row is a named article.
- Round 2 P2: inherited danger text measured only 3.03–3.27:1. The new fixture scopes `#b42318`; both field and list error text are enforced at >=4.5:1 in all five browser projects. The older global token remains a D0-D3 audit item rather than being concealed.
- A cropped first attempt at the list-error screenshot was rejected and replaced; only the re-captured file is accepted.

## Evidence limits

Screenshots do not prove screen-reader announcements, async staleness, server-error ownership or resource cleanup; those are covered by accessibility-tree observations, unit tests, hydration tests and browser assertions. Mobile emulation is not physical iOS Safari. No full WCAG claim is made.
