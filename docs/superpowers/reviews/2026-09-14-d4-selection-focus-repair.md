# Cascader selection-close focus repair

Live screenshot audit found that keyboard search selection emitted one correct path and closed the popup but left actual DOM focus on BODY. This is distinct from Escape, which restored the trigger.

Initial one-nextTick repair passed synchronous cases but independent reviewer `/root/d4_final_evidence_audit` identified delayed controlled acceptance and external-focus-then-blur gaps. Both new assertions failed before the second repair: delayed acceptance left the result focused; external blur wrongly restored trigger.

Current implementation records a selection-owned focus return and consumes it when mergedOpen actually transitions to closed. External focus, pointer/keyboard navigation, new opening/selection, disabled/options changes and unmount retire pending ownership. Cleanup removes owner-document listeners. No extra value/open events are introduced.

Current lifecycle tests: 25 passed, no skips; component typecheck passed. Covered synchronous virtual/full search selection, controlled acceptance/refusal, delayed acceptance, multiple selection, persistent external focus and external-focus-then-blur. The five-browser search regression passed on the earlier synchronous repair; it does not establish browser acceptance of the new ownership logic.

Remaining: independent code re-review, broader/real-browser checks, listener cleanup evidence, regenerated package/gzip budget and final complete candidate gates. No phase closure or final role approval is claimed.

Follow-up: direct source `.blur()` before delayed acceptance was independently identified and reproduced as RED. An owner-document focusout listener now retires ownership while the source is still connected and the popup is still open; accepted-close DOM removal does not trigger that rule. The exact four added capture listeners are verified removed with matching callbacks on unmount after refused close. Lifecycle27/27 and component typecheck pass; component outputs rebuilt. Broader browser/consumer and gzip validation still remain.
