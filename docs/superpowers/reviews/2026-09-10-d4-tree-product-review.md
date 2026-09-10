# Tree virtual independent product review

Reviewer: independent Astra High product manager. Candidate: `d9a2ac3e4e76a23ba678160435e182cab16d68ea`; baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.

Initial product verdict: P0/P1/P2=`0/0/2`, not released to TreeSelect RED. These are evidence gaps for the Tree functional substage, not established new production defects.

| P2 evidence gap | Required closure |
| --- | --- |
| Virtual loading/error/keyboard retry lacks browser and visual proof. Existing virtual lazy unit tests cover offscreen/cancellation; the legacy retry tests do not enable virtual. | In the same virtual Tree, demonstrate loading, first failure, keyboard retry and success; check busy/error, focus after the error button disappears, accessible children and no runtime errors. Capture and open loading/error/success images. |
| Hydration diagnostic capture is incomplete. Existing errorHandler does not capture Vue warnings or console hydration mismatch messages. | Capture Vue warnHandler and console warning/error channels in the existing hydration test; retain stable SSR bytes, matching initial window and no pre-hydration observation. Record direct first-pass success as supplemental proof rather than fabricated RED. |

The reviewer accepted the supported scope of default full DOM compatibility, full logical check/selection data, typed keys, actual window coverage, keyboard endpoints and Tab re-entry, inherited disabled, dynamic row geometry and cache/lifecycle repairs. All four final PNGs were opened by the reviewer. The reported 87 unit tests, 13 developer diagnostics and 40 browser tests prove those covered scenarios, not the missing lazy/hydration diagnostic paths.

Clean candidate generated-output and deterministic double-build results were accepted. Earlier whole-components 1258 and scripts 90 counts remain evidence from their actual run point, not reassigned to the final candidate.

Only the two gaps above are required before the next component's RED stage. The final combined consumer, production performance/gzip, whole-repository candidate, PR/CI, merge, master/Pages and online acceptance obligations remain pending and are not waived by this substage review.

## Supplemental evidence and resulting repair

The independent hydration test now captures Vue warnHandler and console warning/error in addition to errorHandler, restoring all hooks in finally. It passed on the first supplemental run; the full Tree/TreeSelect suite remained 87/87. This is added evidence, not a fabricated RED defect.

The new ninth browser scenario exercised the same real virtual Tree through pending load, initial failure, keyboard Enter retry and successful children. Independent run `r15` was `40 passed / 5 failed`: all five projects reached successful children but lost actual focus to BODY when the retry button disappeared. This is a confirmed functional P2, not a locator or evidence-only failure. Its trace/video/error-context files remain under `/tmp/aheart-d4-tree-results-r15`; the source must repair retry focus and rerun all 45 cases before product re-review.
