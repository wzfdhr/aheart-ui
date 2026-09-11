# D4 Cascader virtualization design review

Reviewed production candidate: `7964d860aca96a1b6ae73958cfb65eb7d559ba30`.

Verdict: **PASS. P0/P1/P2 = `0/0/0`.** This is the screenshot-first design and accessibility review for the Cascader functional substage. It does not close the combined Tree/TreeSelect/Cascader performance, consumer, packaging, PR, merge or deployment gates.

## Audit scope

The user task is to select and recover a typed Cascader path across large virtual columns, search, controlled refusal, lazy loading, responsive geometry and dynamic row heights without losing native button semantics or actual keyboard focus. The accessibility target is visible keyboard focus, readable status/error text, bounded and reachable content, and stable focus/overlay geometry under the retained dialog-plus-buttons model.

The final evidence is indexed in [D4 Cascader visual evidence](../evidence/d4-cascader-virtual/README.md). All 13 accepted screenshots were captured from the in-app source preview at the reviewed candidate, saved locally, and individually reopened before this verdict. Earlier candidate folders are explicitly retained as rejected RED history.

## Numbered flow and health

1. **Default fixture — healthy.** Default full DOM and opt-in virtual fields remain visually distinct and aligned.
2. **Open 1k virtual column — healthy.** Search, rows and scrollbar form one compact panel; the mounted window is visually stable.
3. **Keyboard End — healthy.** The last enabled row is visible and has a 2px solid primary focus ring.
4. **10k search End — healthy.** The final enabled result is fully visible and remains focused.
5. **No-result search — healthy.** The old 10k virtual owner is unmounted; the panel contracts to a clear centered status with no blank scroll region.
6. **Lazy first failure — healthy.** The retry row retains actual focus, exposes retry wording, and uses a measured text/background contrast ratio of `4.866457121528835`.
7. **Keyboard retry success — healthy.** Pressing Enter on the retained error row loads the child and transfers focus to it.
8. **Controlled rejection — healthy.** Requested path and accepted path remain visibly distinguishable; no optimistic accepted value appears.
9. **Five deep columns — healthy.** The panel remains within viewport padding and the deepest focused row is fully inside the visible columns region.
10. **ArrowLeft to root — healthy.** Repeated left navigation restores `scrollLeft=0`; the entire root row and focus ring remain visible after pending positioning work settles.
11. **24px dynamic rows — healthy under stress.** Long labels remeasure without overlap; the visible focus ring remains attached to the logical row.
12. **Over-height row reachability — healthy.** A 240px row in a 180px column can be vertically scrolled to expose the remaining text; content is not discarded.
13. **Selected plus focused — healthy.** The selected background `rgb(230, 244, 255)` remains while the 2px focus ring is present.

## Strengths

- Native buttons, real focus and a single roving tab stop remain understandable without converting the component into an ARIA grid or tree.
- Search, empty, error, retry and controlled-refusal states have distinct, stable visual outcomes.
- Focus is no longer represented by a low-contrast fill alone; selected state and focus state compose instead of overwriting one another.
- Wide/deep content uses bounded horizontal navigation and repositioning while dynamic rows retain vertical reachability.

## Resolved audit findings

- Stale no-result virtual owner and blank panel: fixed by unmounting the empty search list.
- Invisible option focus: fixed with a host-resistant 2px focus outline.
- Selected background overwritten by focus: fixed by separating normal focus fill from the high-specificity outline rule.
- Lazy error focus loss and keyboard retry failure: fixed with request-scoped focus ownership and bounded render-blur handling.
- Error/retry contrast below 4.5:1: fixed with the same danger/text mix used by Tree; final measured ratio is `4.866457121528835` on the actual fill background.
- Deep panel/focus outside the viewport, search-clear repositioning, mobile ArrowLeft clipping and stale async reveal: fixed with generation-scoped positioning and column reveal.

## Evidence limits

- The screenshots are desktop in-app-browser captures. Mobile Chromium and mobile WebKit are covered by the independent five-project automation and stable rectangle sampling, not by a physical-device screenshot in this audit.
- Screenshots do not prove screen-reader announcement behavior, SSR/hydration, iframe cleanup, package exports, performance or memory cleanup. Those remain separate automated/consumer/final-stage gates.
- The 24px long-label case is a deliberate stress fixture. A row taller than its 180px viewport requires vertical scrolling; the second screenshot proves reachability, not simultaneous visibility of the entire row.

## Recommendation

Release the Cascader functional substage to independent test-manager and product-manager acceptance. Preserve all rejected screenshot folders and RED logs as audit history. Do not describe the combined D4 virtualization phase as delivered until the shared consumer, performance, package, final-review, PR, CI, merge and Pages gates pass.
