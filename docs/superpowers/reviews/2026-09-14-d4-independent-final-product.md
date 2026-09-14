# D4 independent final product acceptance

Date: 2026-09-14. Reviewer: `/root/d4_final_product_acceptance`, independent of component implementation and test authorship.

## Candidate and method

Production candidate `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`; inspected HEAD `ad95912` differs only in evidence Markdown. Scope is the deferred Tree, TreeSelect and Cascader virtualization defined by the September 10 architecture and delivery matrix.

This is a product evidence review, not a personally executed browser session. I read the architecture, delivery matrix, current public types and Cascader selection-close ownership code; inspected real consumer scenario/event records and the strict gzip supplement; and read independent development/test-manager reports. Fresh interactive observations below are explicitly attributed to the independent design reviewer. I made no production changes or builds and did not operate that reviewer's browser.

## User-task acceptance

| User task | Current evidence and product assessment |
| --- | --- |
| Opt into large-data rendering without changing ordinary consumers | Public virtual configuration remains opt-in, with TreeSelect aliases to Tree configuration; architecture retains existing default behavior. Independent dev/test reviews cover normalization and default compatibility. Accepted functional boundary. |
| Browse and select a large Tree, then collapse and reopen a branch | Current real consumer records execute `flat-roots-10000` selection and `expanded-100x99` collapse/re-expand. Independent design steps 9–12 now confirm checking, visible End navigation to row00999, lazy error and retry recovery to operable children. Accepted for this observed scope. |
| Search and check TreeSelect data while the parent may refuse a change | `search-5000-controlled` records check/search and controlled refusal. Independent design steps 13–19 now confirm empty-search recovery, rejected check leaving state unchanged, accepted check updating tags, Escape focus restoration, lazy retry/selection restoring combobox focus and a fitting open panel at390×600. Accepted for this observed scope. |
| Navigate a deep Cascader and choose a search result by keyboard | Current consumer covers five deep columns, keyboard actions and controlled refusal. Independent design reviewer reports freshly observing empty search, recovery, Enter selecting sibling998 and actual focus returning to the combobox on current preview 5191; disabled999 remains unavailable. The previously observed BODY-focus defect has a current runtime disposition. |
| Recover a failed Cascader load and safely close pending work | Current consumer event history contains lazy pending/error/retry/resolve, Escape cancellation and late resolution. Independent design reviewer freshly observed first-load failure, visible retry and Enter recovery to a focused child. Accepted for observed task. |
| Reach deep choices on a narrow display | Independent design reviewer confirms five-column keyboard navigation at390×844 and End reaching visible Level4 1999. After resizing an already-open desktop panel, a subsequent navigation was needed to reveal the previously focused fifth column; automatic focus visibility across arbitrary resizing is not established. Native200% three-component tail reachability and editable TreeSelect search are now independently reviewed in the supplement. |
| Gain a measurable large-data benefit | Current full report has 714 checkpoints and recorded release validator pass, with 27 fixed/coarse/dynamic cases. Published measured maxima are 196ms for 10k virtual interaction and 43.96% virtual/full ratio, within 500ms/50% requirements. This is recorded benchmark evidence, not a universal device guarantee. |
| Install the package and use SSR/iframe environments | Full report binds tgz `0981133a62906536bcfcea9c05ffdf966a59ebfe9ddf09706a3962d6cf6d78d3`, eight hydration combinations, and iframe resources 105→0. Independent test-manager inspection supports package/runtime gates. |

## Evidence and delivery limits

Raw full report: `/private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json`. Strict supplement: `/private/tmp/aheart-d4-gzip-strict-c608a9b/gzip-supplement.json`; its recorded increment is 12,261 bytes against the unchanged 12,288-byte limit. The independent development reviewer reopened both build outputs. The 27-byte margin is accepted for this candidate only.

Independent reports: `2026-09-14-d4-independent-final-dev.md` and `2026-09-14-d4-independent-final-test.md`. The latter establishes both a9734e3 push/PR CI runs, complete E2E 808 passed/127 existing skips, and QG5 62 passed/3 existing skips. Those existing skips are not presented as passing tests. Later merge heads require their own CI.

## Current verdict

**Product acceptance PASS for production c608a9b within this D4 scope; open scoped P0/P1/P2=0/0/0.** The completed `2026-09-14-d4-independent-final-design.md` records19 original steps and20 freshly captured, individually opened screenshots across all three components, followed by steps20–24 independently reviewing five native200% captures. This reviewer read the report and its supplemental verdict; browser execution and image inspection remain attributed to their authors.

The completed `2026-09-14-d4-native-zoom-supplement.md` now records Chrome's native200% readout, visible Cascader final enabled root, Tree row00999, and TreeSelect node00998 with its search field visible and editable. The main agent resumed on the user-restored local page and records Escape focus restoration and restoring100% zoom. The independent design reviewer reopened all five captures and accepted the bounded three-component tail/search reachability supplement without an additional P0/P1/P2. The prior zoom evidence gap is therefore closed for those tasks. Runtime focus and zoom-reset actions are attributed to the main agent's accessibility observations, not inferred from still images. No every-browser zoom, physical-device or full assistive-technology claim is made.

Product acceptance does not establish delivery closure: matching-head CI, squash merge, master CI, Pages and deployed interaction checks remain separately required. Form.List, D0–D3 follow-up, D9 physical-device and npm release work remain later optimization tasks; v2 remains paused.
