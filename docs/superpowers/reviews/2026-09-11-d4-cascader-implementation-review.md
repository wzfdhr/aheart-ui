# D4 Cascader virtualization implementation review

Reviewed production candidate: `7964d860aca96a1b6ae73958cfb65eb7d559ba30`.

Verdict: **PASS. P0/P1/P2 = `0/0/0`.** The independent implementation review accepts this candidate for the Cascader functional substage. All findings raised in the reviewed implementation, ownership, measurement and geometry rounds are closed on this candidate. This verdict does **not** close the combined Tree/TreeSelect/Cascader delivery stage or award another reviewer's design, test-manager or product-manager approval.

## Scope and architecture

The implementation follows the [approved deferred virtualization architecture](../specs/2026-09-10-d4-deferred-virtualization-architecture.md), its [architecture review](2026-09-10-d4-deferred-virtualization-architecture-review.md), and the [Cascader-specific preflight](2026-09-11-d4-cascader-virtualization-architecture-preflight.md). The preflight was approved before Cascader implementation and independently established the genuine RED and compatibility boundaries. Architecture approval was not treated as implementation acceptance.

The reviewed contract is:

- Public opt-in `virtual?: CascaderVirtual`, with only `height`, `estimateSize` and `overscan`; defaults are `256 / 32 / 4`. Omitted/false retains the default full-DOM path. Field validation, caller immutability and foreign-realm plain configuration objects are covered without adding a public engine or scroll API.
- One private virtual list per complete typed column prefix, plus an independent search list. Full typed paths distinguish numeric/string values and equal leaf values under different parents. Selection, disabled ancestry, loaded options and request state remain parent-owned logical data.
- The existing combobox/dialog/native-button model is retained. Virtual mode uses real focus and roving entry points; it does not introduce an invalid tree/listbox ownership claim through the dialog or expose the virtualizer to consumers.
- The installed virtualization dependency is reused. This work does not introduce another engine, horizontal virtualization, automatic count thresholds, a ConfigProvider virtualization switch or v2 scope.
- Popup placement, available-height budgeting, internal measured zero height, column/search scroll ownership, deterministic SSR and mounted owner-realm capability selection remain distinct concerns.

The scoped implementation is in `packages/components/src/cascader/`, its public type exports and the previously reviewed private popup-budget integration. Tree and TreeSelect retain their own implementation/acceptance records; the affected TreeSelect controls below are regression evidence, not a substitute for those records.

## Final source review

### Identity, measurement and viewport ownership

The configured large-column/search fixtures render bounded windows while logical navigation and selection use the full data. Per-prefix component instances and typed row keys prevent measurement or focus cache reuse across unrelated branches. Row observers are retired by captured stable identity; suspended replacement/reorder remains bounded and maps current options safely.

Measured border-box/layout sizes, including fractional values, feed the engine used for row starts and total extent. The rejected uniform-subset broadcast, fabricated fractional padding and separate DOM prefix-sum geometry are absent. Controlled tests verify growth/shrink, mixed measurements, engine/DOM agreement and idle quiescence. Measured internal zero budget remains separate from positive public configuration normalization.

Row/viewport observers and scheduling use the mounted element's owner realm. SSR and the first hydration render retain deterministic virtual output before mounted capability fallback is selected. Empty virtual search results unmount the search owner and leave one compact status; restoring results creates a fresh owner. Capability fallback retains functional focus/selection behavior in the tested combinations.

### Lazy keyboard focus and lifecycle

The final keyboard focus owner records request, load generation, mode generation, navigation identity, source, owner document and full typed path. Panel capture and row handlers share the same render-blur predicate, including actual disabled/loading state and current row/path identity. An enabled source's explicit blur or a later deliberate departure is not treated as native loading-render loss. BODY recovery for an owned request requires recorded permitted render loss.

Restoration occurs after complete request/lifecycle/path/focus checks. `try/finally` retires the supplied owner; idempotent disposal removes named listener identities and current scheduling handles, while compare-and-clear protects a newer owner. Options/loader replacement, accepted close, disable, unmount, programmatic branch changes and concrete user departure retire stale work. Focus-only cancellation does not abort an otherwise valid loader.

RAF is selected only with its same-realm cancellation partner; otherwise a paired timer is used. With RAF, the render-loss window closes through one follow-up timer, or one second RAF when the timer pair is unavailable. It does not rearm indefinitely. Tests cover cancellation between phases, partial capabilities, old callbacks, newer same-key owners and synchronous unmount from inside a loader. The supported owner scheduler cases are distinguished from arbitrary deletion of standard APIs required by unrelated dependencies.

### Geometry and current navigation

Branch growth and search-to-columns restoration explicitly update floating placement after Vue's structural patch. Column reveal clamps horizontal movement to the current viewport, temporarily uses instant scrolling and restores the prior inline scroll behavior. Stable browser checks use the intersection of window, panel client box, columns client box and own-column client box; window containment alone is not accepted as row visibility.

The final `cancelPendingReveal` argument is private and defaults to false. Only virtual/default ArrowLeft passes true, advancing `revealGeneration` before revealing the parent. A late last-column continuation can no longer override the newer parent reveal. Child entry, normal row movement and search restoration retain the default behavior and do not inadvertently cancel their active layout reveal. Options, close and search cancellation guards remain intact.

### Visual state compatibility

The accepted 2px primary focus outline survives the documented VitePress important-rule conflict. Ordinary focus fill is separated from the stronger outline selector so the selected background remains visible. Error labels and retry badges share the Tree-style 70% danger / 30% text mix; the measured default ratios are approximately `5.306` on white, `4.866` on fill and `4.737` on selected background. Explicit diagnostic dark tokens and forced-color mapping were checked; this is not a universal guarantee for arbitrary consumer themes.

The separate [design review](2026-09-11-d4-cascader-design-review.md) owns screenshot acceptance. The [visual evidence index](../evidence/d4-cascader-virtual/README.md) distinguishes accepted `audit-7964d86/` captures from rejected earlier folders. Screenshots do not replace unit, hydration, resource-cleanup or package verification.

## Genuine RED/GREEN history

The first test-only contract/fixture commits, including `745093a` and `eda0118b`, preceded the first opt-in implementation `ab1c1e2`. Commit existence alone is not counted as an executed RED result. The following independently inspected or executed counterexamples drove the subsequent acceptance rounds; earlier partial GREEN results did not waive later failures.

| Boundary | Executed RED / rejected candidate evidence | Verified correction and final coverage |
| --- | --- | --- |
| Measurement, cache and focus foundations | `4559a63`: suspended replacement error, engine/DOM disagreement, pending-pin/blur failures and observer/idle leaks; `d7f0b39`: fractional inflation, lazy focus cancellation and paused-observer/timer gaps. | Subsequent recovery suites retain those controls; final bounded rendering, logical identity, measurement and lifecycle checks pass. |
| Authoritative row sizes | `eb7d5d2`: a locally uniform subset overwrote another row's measurement; transformed visual height was stored as layout height. | `b9da6a2` removed broadcast and used authoritative layout/border-box input; fractional, mixed-size and engine/DOM checks pass. |
| Safari scheduler retirement | The first `b9da6a2` independent scheduler expansion reproduced uncancelled work on suspend and overlapping deferred batches. | `f38296f` coalesced pending work and included scheduling cleanup in suspension. Original and refined handle controls pass. |
| Empty search owner | `481286a` on the pre-fix source: unit `1/1` RED and five-browser `5/5` RED because an empty virtual owner remained mounted. | `7dd9146` unmounted it; `9ea5909` only repaired an e2e `const` binding to permit reassignment. Empty-owner disposal and clean restoration pass. |
| Visible focus and selected state | `b4685c2`: five-project `10/10` RED for absent focus outline. `2f7becc`: five-project `5/5` RED when stronger focus specificity replaced selected background. | `278cc9c` separated fill and outline precedence. Selected/focus combinations, layout invariance and owner-specific keyboard focus pass. |
| Lazy error recovery without stealing focus | `60092df` restored focus before guards and failed virtual/default outside-focus-then-BODY controls. `46e49b2` repaired that theft but failed natural error focus recovery in all five browser projects. | The final scoped owner preserves normal recovery and rejects deliberate departure. Tests check actual focus, not merely child existence or locator-assisted refocusing. |
| Owner validity and universal cleanup | `b51eaf4`: explicit blur was broadly exempted, anonymous keydown callbacks accumulated, early returns/default unmount leaked owners. `769069e`: pre-patch blur, programmatic navigation and synchronous loader-unmount races remained. | `1cae19f` added the shared validity predicate, disposable named callbacks, compare-and-clear, `try/finally` and reentrant lifecycle checks. Those independent counterexamples pass. |
| Partial capabilities and post-RAF timing | `1cae19f`: an iframe RAF remained pending when cancellation support was absent. | `2c13a41` paired scheduling/cancellation APIs; `8ffcb875` bounded the required post-RAF native-render-loss interval. Exact-handle and phase/isolation tests pass. |
| Deep popup positioning and full row visibility | `b1ca674`: five-browser `5/5` RED for deep panel overflow. `2055440` passed those narrow checks, but stable independent samples found search-clear overflow in five projects and only `54.9%` root-row visibility in both mobile engines. | `8fb9d57` fixed search-clear repositioning and bidirectional column reveal. Final independent full-intersection measurements pass. |
| Stale asynchronous horizontal reveal | On `8fb9d57`, ArrowLeft wrote scroll `0`, then an older positioning continuation wrote `180`, hiding the focused root; close/options/search controls already passed. | `44d183a` froze the regression; `7964d86` supersedes pending reveal only on ArrowLeft. Final virtual/default controls retain scroll `0` and the prior inline scroll style. |

The early lazy implementation summary reported a stage-A focus pass with contrast around `2.997`, but its original test-results path was overwritten by a later parser failure. That overwritten file is not treated as independently preserved RED evidence. Contrast closure is supported by independent computed-color checks and fresh browser measurements. Color-sRGB parsing corrections preserved the `4.5` threshold and added finite/channel-count checks.

## Final independent execution at 7964d86

These results were executed on the reviewed source candidate, rather than inferred from production commits or delegated completion messages.

| Check | Result | Local raw record |
| --- | --- | --- |
| Full committed Cascader unit/lifecycle/SSR/hydration suite | **135/135**, 17 files | `/tmp/d4-cascader-796-review.TofJ9W/maintained-isolated.log` |
| Recovery 8–13 subset | **40/40** within the full run; recovery13 **4/4** | Same maintained record |
| Affected TreeSelect lifecycle/recovery/retry-focus controls | **24/24** | `/tmp/d4-cascader-796-review.TofJ9W/treeselect.log` |
| Cascader virtual public types | **vue-tsc --noEmit exit 0** | `/tmp/d4-cascader-796-review.TofJ9W/cascader-types.log` |
| TreeSelect virtual public types | **vue-tsc --noEmit exit 0** | `/tmp/d4-cascader-796-review.TofJ9W/tree-select-types.log` |
| Independent focus-owner/scheduler counterexamples | **23/23** | `/tmp/d4-cascader-796-review.TofJ9W/owner.log` |
| Independent asynchronous reveal controls | **5/5**, including virtual/default ArrowLeft and close/options/search | `/tmp/d4-cascader-796-review.TofJ9W/reveal.log` |
| New geometry 10 + original deep-column 5 | **15/15** across five browser projects | `/tmp/d4-cascader-796-review.TofJ9W/browser15.log` |
| Additional stable browser traversal | **40/40 states**, no pageerrors | `/tmp/d4-cascader-796-review.TofJ9W/geometry-stable.log` |

The browser projects were desktop Chromium, mobile Chromium, Firefox, desktop WebKit and mobile WebKit. The additional traversal covered depth expansion, ArrowLeft return, rapid ArrowRight return, empty-search resize and clear-to-five restoration. It waited at least 20 frames and a stable suffix, checked horizontal and vertical panel bounds, and required at least `0.99` visible ratio through all relevant clipping boxes. After search clearing, the input's focus was preserved and the separately labelled active-path target was measured; it was not falsely reported as the focused row.

Representative final values: a 720px panel in a 775px viewport spans `8..728`; the mobile focused root spans `33..186` inside the columns viewport `33..373`. These replace the rejected overflow and partial-root measurements.

The local raw paths above are session investigation records, not portable CI artifacts. This document records their provenance and results without pretending they were published or archived by this authoring task. Committed tests reproduce the maintained contracts; durable visual captures are separately indexed in the repository. Combined-delivery evidence archival remains a separate responsibility.

## Harness integrity and review limits

The initial custom single-fork full-suite configuration encountered duplicate `enableAutoUnmount` registration across test files. An ESM alias alone did not resolve the shared-process state. The accepted full run used explicit file-isolated forks with at most two workers and passed all 135 tests without editing assertions or suppressing the error. `maintained-isolated.log` is the authoritative full-run result; earlier harness attempts remain distinct.

Native disabled-button blur is not faithfully reproduced by every jsdom path. Controlled event/scheduler cases were therefore paired with real browser recovery and geometry evidence; synthetic render-loss signals were not presented as visual proof. Owner handle probes capture the actual callback/handle identity and exclude unrelated, intentionally reusable overlay registrations. Post-RAF tests wait for the intended follow-up before issuing a late-blur assertion; they do not redefine every BODY focus state as recoverable.

Final browser verification used an isolated detached checkout at `7964d86` and a source preview on independent port 5468. It did not use an old dist, run a build or operate port 5371. The preview and temporary checkout/dependency links were cleaned up after verification. Before/after source/shared-helper/e2e hashes matched, and all execution processes reached terminal states. The pre-existing `es/style.css`, `lib/style.css` and evidence/design work were preserved.

## Functional substage versus combined delivery

**Accepted here:** Cascader implementation and its independent developer regression boundary at `7964d86`, with no remaining P0/P1/P2 findings. The companion design report, independent test-manager review and product acceptance keep their own authority and evidence.

**Not certified by this report:** combined Tree/TreeSelect/Cascader performance and memory budgets; package/packed-consumer verification; generated `es/lib` rebuild and determinism; joint gzip/consumer/release checks; full combined regression and final review; PR/CI completion; merge; npm publication; Pages deployment or deployed/manual acceptance. No v2 or other deferred milestone is added to this scope.

The Cascader functional substage may proceed through its remaining independent sign-offs. The combined D4 virtualization delivery must not be described as complete until its separate consumer, performance, packaging, review and delivery gates have passed.
