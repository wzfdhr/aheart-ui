# Cascader live screenshot audit — partial

Candidate: `2304e83`. Tool: Codex in-app browser. Method: Product Design audit, freshly captured and individually reopened local PNGs. This is the implementing agent's visual observation, not independent design sign-off.

1. Initial state: healthy within inspected desktop viewport; separate labels identify default, virtual, controlled and lazy examples.
   ![Initial](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/01-cascader-start.png)
2. Open virtual panel: healthy; search, branch affordances and scrollbar are visible; panel stays within viewport. Partial bottom rows indicate scrollable content, not a missing action.
   ![Open](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/02-cascader-open.png)
3. Down then End: healthy; actual accessibility focus reaches Sibling 0998 and skips disabled Sibling 0999. The focus ring and target row are visible at the scrolled end.
   ![End](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/03-cascader-end.png)
4. Escape: healthy; popup disappears, collapsed trigger regains actual accessibility focus, and no selection event is submitted.
   ![Escape](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/04-cascader-escape.png)

5. Search with no matching path: healthy; explicit empty-state copy appears and search remains focused/editable.
   ![Empty search](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/05-cascader-empty.png)
6. Replace query with `0998`: healthy; matching full path returns without closing or reopening the popup.
   ![Search recovery](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/06-cascader-search.png)

7. Down then Enter on the recovered search result: selection commits once with the complete path and popup closes. **P2 pending reproduction:** actual DOM focus is BODY, not the trigger. The screenshot border must not be interpreted as focus evidence. Escape previously restored focus correctly.
   ![Selected result](/private/tmp/aheart-d4-focus-candidate-IewdvX/design-audit/07-cascader-selected.png)

The first six steps had no actionable issue; step 7 has an unresolved keyboard continuation issue. Limits: mobile/reflow, deep columns, controlled refusal, lazy failure/retry, Tree/TreeSelect, assistive technology and full contrast compliance are not proven by this partial screenshot set. Complete phase design and product acceptance remain open.
