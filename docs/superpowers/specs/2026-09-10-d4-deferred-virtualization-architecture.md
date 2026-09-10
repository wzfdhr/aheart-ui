# Tree / TreeSelect / Cascader deferred virtualization architecture

Status: architecture candidate awaiting independent final review. Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`. Branch: `codex/d4-tree-virtualization`.

## Scope and non-goals

This phase completes the three D4 items explicitly deferred on 2026-09-07:

1. Tree visible-node row virtualization.
2. TreeSelect virtualization through the same Tree engine, including search and checkable modes.
3. Cascader per-column and search-result virtualization.

The phase does not start Form.List, D0-D3 final review, D9 release/device work, npm publication, or aheart-ui v2. It reuses the installed `@tanstack/vue-virtual` dependency and must not add another virtualization engine.

## Public API

```ts
export interface TreeVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}
export type TreeVirtual = boolean | TreeVirtualConfig

export type TreeSelectVirtualConfig = TreeVirtualConfig
export type TreeSelectVirtual = boolean | TreeSelectVirtualConfig

export interface CascaderVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}
export type CascaderVirtual = boolean | CascaderVirtualConfig
```

Tree, TreeSelect and Cascader add `virtual?: ...`; all default to `false`. `true` and `{}` explicitly enable virtualization. There is no automatic item-count threshold, ConfigProvider switch, public TanStack instance, `scrollToIndex`, infinite loading, horizontal virtualization of Cascader column containers, or consumer-supplied range extractor.

| Component | `height` | `estimateSize` | `overscan` | Meaning |
| --- | ---: | ---: | ---: | --- |
| Tree | 320 | 28 | 4 | Maximum vertical tree viewport; the actual surface may be shorter for small data. |
| TreeSelect | 256 | 28 | 4 | Maximum internal Tree viewport below the fixed search field. |
| Cascader | 256 | 32 | 4 | Maximum height of each option column or the search-result viewport. |

`height` and `estimateSize` are CSS pixels. `overscan` is the number of extra logical items rendered on each side of the visible range and must be a non-negative safe integer. The two size fields must be finite and positive. Invalid fields warn in development and fall back individually. A runtime value that is neither boolean nor a plain configuration object disables virtualization with a development warning. Inputs are never mutated. Coarse-pointer 44px rows, zoom, fonts and content are measured after hydration; estimates never crop row content.

## Tree data and semantic model

The full `TreeIndex` remains authoritative for identity, parent/child relations, disabled inheritance, check/half-check state and lazy loading. Expansion produces one complete logical visible-node sequence. The virtualizer receives only that sequence and never becomes the data model.

The non-virtual path keeps the existing recursive `tree / treeitem / group` DOM byte-for-byte except for inert plumbing required to share row rendering. The virtual path renders a single window beneath the existing `role="tree"`. Each mounted row remains a `treeitem` contained by that tree and explicitly carries the full logical `aria-level`, sibling-relative `aria-posinset` and `aria-setsize`, plus existing selected, checked, expanded, busy and disabled state. The virtual path omits stale `aria-owns` references because recursive group elements are not mounted. Stable DOM IDs and keys use `treeKeyToken`; numeric `1` and string `"1"` remain distinct.

This follows WAI-ARIA 1.2: a treeitem must be contained in or owned by a tree/group; explicit level is appropriate when DOM ancestry no longer represents hierarchy, and explicit set position/size is required when only a portion of a set is present. The virtual paths use real DOM focus and do not depend on an indirect active-descendant relationship through the existing dialog popup.

## Focus, keyboard and scroll ownership

Tree keyboard calculations use the full logical visible-node sequence, not `querySelectorAll` over the mounted window. ArrowUp/Down, Home/End, ArrowRight/Left, Enter and Space retain current behavior, including disabled-node handling and closest-visible-ancestor recovery.

The adapter tracks three distinct identities: the row containing actual DOM focus (including a switcher, checkbox or retry descendant), the stable roving-Tab entry (`tabindex="0"`), and a temporary programmatic navigation target. `rangeExtractor` pins the valid union of those identities. The roving entry remains pinned even after focus leaves the widget, so Tab or Shift+Tab can re-enter a mounted entry; it is not released merely because the row is outside the viewport. If collapse, search or data replacement removes that logical row, the adapter first pins and mounts the closest visible ancestor or first enabled row, atomically moves `tabindex="0"`, and only then releases the old row. Thus virtual mode always has exactly one mounted roving entry when an enabled visible node exists.

Before focusing a window-external target, the adapter requests an internal instant `scrollToIndex`, waits for the stable-key row to mount, transfers the roving entry and then focuses it. The public API never exposes that method. Programmatic navigation may replace the temporary pin only after the target is mounted. User wheel, pointer, touch, or focus moving outside the component cancels stale navigation and must never steal focus back. Unit and browser tests cover a focused retry/checkbox descendant, blur followed by Tab/Shift+Tab re-entry, and user focus movement while an asynchronous mount is pending.

TreeSelect and Cascader virtual paths use real DOM focus exclusively. Their triggers do not output `aria-activedescendant` while virtualization is enabled, because the existing `aria-controls` target is a dialog and this phase does not replace it with a different composite widget model. Opening from the trigger and ArrowDown/ArrowUp from a search field request a mounted enabled treeitem/option and then transfer real focus. Returning to a search input, closing, focus leaving the component, or recycling a logical key cancels pending focus. The non-virtual path retains its existing markup/behavior and is regression-tested separately.

Tree owns one vertical viewport in standalone mode. In TreeSelect virtual mode, the popup stops being a vertical scroller: its optional search input remains fixed and the internal Tree viewport is the sole vertical scroll owner. This prevents nested vertical scrolling.

The existing floating helper only provides placement/flip/shift and cannot be treated as a height provider. TreeSelect and Cascader therefore share a private, non-public popup viewport-budget helper. After final placement it uses the trigger/popup `ownerDocument.defaultView`, visual viewport or document viewport, trigger rectangle, placement side and the existing 8px viewport padding to compute available block size. TreeSelect subtracts measured border, padding, search height and gap; the Tree viewport is a flex child with `min-block-size: 0` and may shrink below configured `height`. Cascader subtracts its own chrome/search field and applies the remaining budget to every column or the search-result viewport. The virtualizer's observed `clientHeight`, not the configured maximum, drives the mounted range. Virtual mode has exactly one vertical scroller in TreeSelect and one per Cascader column (or one search-result scroller); the popup/columns wrapper retains only necessary horizontal scrolling. Short-viewports, large fonts and 200% zoom must keep the search field and final logical item reachable.

## Expansion, selection, checking and lazy loading

Expansion and data updates rebuild the logical visible sequence by stable key. Measurements are retained only for keys that still represent the same row; search/data replacements invalidate affected caches. Controlled `expandedKeys`, `selectedKeys`, `checkedKeys`, TreeSelect value and open state remain parent-authoritative. A rejected update cannot create an optimistic window or selected/check state.

Selection, full-subtree checking, half-check calculation, disabled inheritance and TreeSelect selected tags always use the full logical index. Search filters display a virtualized filtered tree while checkable semantics still use the full shared index.

Lazy work is tied to logical expansion, not viewport presence. Scrolling an expanded loading node out of the window does not abort it. Collapse, disabled state, tree/options replacement, loader replacement, popup close where already defined, and unmount preserve the existing cancellation and stale-response rules. Retry stays attached to the same stable node key after recycling.

## Cascader multi-list model

Each visible Cascader column is an internal child component with its own virtualizer, scroll element, measurement cache and cleanup lifecycle. A key combines the complete typed path prefix with `cascaderKeyToken(option.value)`; column index alone is never an identity. Column creation/removal, active-path replacement and lazy children updates cannot reuse another column's measurements.

The parent owns `activePath`, `focusedPath`, selected paths, loading/error paths and lazy request generations. Keyboard movement computes the target from the full logical column, asks that column to mount it, and only then transfers real DOM focus. ArrowRight/Enter/Space may create a new column; ArrowLeft restores the typed-key parent in the previous column. Every column keeps one stable roving entry pinned after blur, plus actual-focus and pending-target pins under the same transfer rules as Tree. The virtual Cascader trigger never publishes an active-descendant reference.

When `showSearch` is active, the flattened leaf results are also virtualized under the same explicit `virtual` setting using full typed path keys. Search mode owns an `activeSearchPath` over the complete enabled/disabled result sequence, one roving entry, actual-focus and pending-target pins, and a mount-then-focus interface. The search input's ArrowDown/ArrowUp enters the first/last enabled result. Within results, ArrowUp/Down follows the complete sequence and skips disabled items, Home/End reaches the first/last enabled result, Enter/Space selects, and Escape closes and restores the trigger. Natural Tab order contains only the pinned roving result: Tab from the search input enters it, Shift+Tab returns to the search input, and Tab from the result may leave the popup without trapping focus. A 10k tail result must be reachable and selectable using the keyboard (for example End then Enter), without a mouse-scroll substitute.

Changing the query preserves `activeSearchPath` only if the same typed path remains enabled; otherwise it transfers to the first enabled result before recycling the old row. No results keep focus in the search input and expose the existing status. Clearing the query while focus is in a result first cancels old navigation, mounts the selected/active-path option or first enabled option in column mode, and transfers focus; clearing while the search input owns focus keeps it there. Switching modes invalidates old result measurements and active IDs. This phase does not leave a 10k search result as full DOM. Search does not trigger network requests or invent unloaded descendants.

## Measurement, SSR and realm safety

Adapters use stable `getItemKey`, `rangeExtractor`, `initialRect`, `measureElement` or `resizeItem`, and internal instant `scrollToIndex`. Every observer, ResizeObserver, requestAnimationFrame, timer and computed style lookup comes from the actual scroll element's `ownerDocument.defaultView`. Close, disable, data replacement and unmount disable observers and cancel pending realm work.

SSR uses the normalized configuration and deterministic initial rectangle to render the same initial window as the client's first tree. No media query, global window, measured height or random ID may affect the first client tree. SSR and the hydration-first client render never perform a realm-capability fallback: absence of `window`, `defaultView`, observers or a mounted scroll element is expected before mount. Measurement and capability checks start only after hydration. Repeated render-to-string calls must be byte-stable and hydration must have zero mismatch/error diagnostics.

After hydration, full-DOM fallback is allowed only when the mounted scroll element is detached or has no `ownerDocument.defaultView`, or when the actual realm lacks the observation/scheduling primitives required by the adapter and no same-realm resize/scroll fallback can be installed. The fallback transition preserves focus and state and is tested separately from SSR. Existing data-contract errors are not swallowed: duplicate typed keys and cyclic input continue to fail through `createTreeIndex` exactly as the non-virtual path does, rather than being converted into recursive full DOM. Production must not throw solely because optional runtime observation cannot initialize.

## Test and acceptance contract

Every new capability starts with a genuine failing test. Existing behavior that already passes is recorded as compatibility evidence, not fabricated as a defect.

### Unit and SSR

- Default false/full DOM, true/empty config, per-field fallback, input immutability and public barrel types.
- Stable typed keys, bounded rows, overscan, focused pin, programmatic target mount, user-scroll cancellation and cache invalidation.
- Expansion/collapse, controlled rejection, selection, strict/cascading check, half-check, disabled boundaries and unknown keys against the complete logical model.
- Lazy loading outside the viewport, collapse/disable/replacement/close/unmount cancellation, retry and stale response isolation.
- TreeSelect search, no-result state, checkable/full-index semantics, tags, clear, controlled value/open, virtual trigger without `aria-activedescendant`, real-focus transfer, roving Tab re-entry and single scroll owner.
- Cascader independent columns, deep active path, typed paths, multiple/disabled, dynamic rows, virtual trigger without `aria-activedescendant`, complete search-result keyboard model, mode-switch real focus, lazy success/error/retry/AbortSignal/stale response.
- Deterministic SSR initial windows, real hydration, no capability fallback/observer before hydration, post-hydration realm fallback, duplicate/cycle errors and owner-realm cleanup.

### Browser and visual

- Desktop/mobile Chromium, desktop Firefox, desktop WebKit and mobile WebKit.
- Keyboard traversal beyond the mounted window, focus retention, ARIA ID validity and controlled rejection.
- Tree expansion/check/lazy retry; TreeSelect search/checkable/tags; Cascader multi-column/left-right/lazy/search/multiple.
- Dynamic 28/32/44px rows, long labels, font/width changes, short and narrow viewports, 200% zoom, accessible final items, single vertical scroll ownership and no horizontal content loss.
- iframe Teleport, popup close/reopen, SPA/unmount cleanup, zero pageerror/console error.
- Screenshot-first Product Design audit of default/virtual desktop, mobile, loading/error, deep columns and search states; every final screenshot is freshly captured and opened.

### Consumer, performance and release

- Real tgz without workspace links: ESM/CJS, CSS, declarations, SSR/hydration and default/virtual combinations for all three components.
- Same production consumer measures 1k/5k/10k fixed/coarse/dynamic data, expanded Tree, TreeSelect search/checkable, Cascader deep columns/search/lazy.
- Under default configuration, stable Tree/TreeSelect windows are at most 24 treeitems including overscan and one focus pin; each Cascader column/search window is at most 24 options. Empty/status content and structural spacers are counted separately.
- 10k virtual first interaction median is no more than 50% of the same-machine full DOM path and no more than 500ms; scripted scrolling has no long task over 100ms and CLS is at most 0.1.
- The same `Tree + TreeSelect + Cascader` production consumer gzip delta against D8 master `4a7511f9594d0a74906e427e158d02343ba33a22` is at most 12KiB. Exceeding it is P2. No new dependency or lockfile drift is accepted.
- Full repository unit/typecheck, deterministic double build, generated-output check, docs build, release pack, complete E2E and five-browser QG5 must pass with no new skip.

The performance protocol is fixed before implementation. Baseline and candidate are packed from clean worktrees and installed without workspace links into the same consumer using Node 24.17.0, pnpm 9.15.4, Vue 3.5.38, Vite 5.0.12 production mode and the repository-pinned Chromium. Each mode gets one discarded warm-up and five measured runs in alternating full/virtual order; the report records browser build, CPU model, concurrency and raw samples, then compares medians.

Fixtures are deterministic: Tree uses both 10k roots and 100 expanded roots with 99 children each; TreeSelect uses the same tree with checkable state and a query matching at least 5k nodes; Cascader uses 10k siblings, five deep columns of 2k options, and 10k flattened search leaves. Fixed rows use current desktop minima; coarse rows use 44px; dynamic data makes every tenth label wrap to two lines. No network is included except the separately timed lazy scenario.

For inline Tree, first-interaction timing starts immediately before Vue mount and ends after the first enabled treeitem is actionable, Vue has flushed, and two owner-realm animation frames complete. For TreeSelect/Cascader it starts immediately before a trusted trigger click with reduced motion enabled and ends after the popup target is actionable plus the same two-frame stabilization. Full and virtual modes use identical data, styles and actions. The scrolling sample runs 20 evenly spaced offsets from start to end and then the same sequence back. Before the first write it starts observers. After every individual `scrollTop` write it waits for Vue to flush, waits at least two `ownerDocument.defaultView.requestAnimationFrame` callbacks, asserts that the expected viewport has mounted content with no blank gap, and records the offset plus per-step elapsed time before advancing. Observers stop only after the final offset has met the same stabilization rule. Chromium records `PerformanceObserver` long tasks and layout shifts across that complete interval; Firefox/WebKit run the same per-offset scroll/keyboard assertions, elapsed-time trace, screenshots and zero console/pageerror checks without a conditional skip or a fabricated unsupported long-task value.

The bundle comparison imports Tree, TreeSelect, Cascader and their public CSS from the packed package, externalizes Vue identically, minifies with the same Vite/esbuild configuration, and sums every emitted JavaScript and CSS asset. Gzip is Node `gzipSync` at level 9 over exact emitted bytes; the report stores the file list, raw bytes, per-file gzip bytes and total for baseline/candidate. Candidate minus baseline is the stated 12KiB gate.

## Review and delivery flow

1. Independent architecture review closes all P1/P2 in this document.
2. A separate test author creates Tree RED, then the sole implementation worker completes Tree GREEN.
3. Repeat RED/GREEN for TreeSelect, then Cascader; implementation ownership remains single-threaded for overlapping shared files.
4. After each component: independent development review, testing, screenshot-first design review where UI changed, and product acceptance. Any implementation change reruns affected reviews.
5. Freeze one three-component candidate; rerun the entire phase and full repository gates. Do not reuse Select/D4 historical greens.
6. Push one final PR only after local gates and four-role reports pass with P0/P1/P2=`0/0/0`.
7. Require exact-head push/PR CI, squash merge, master CI, Pages and live deployed interaction verification. Preserve the branch unless the user later requests deletion.

Any unresolved P1/P2 returns to the repair loop. Failure to preserve the native tree semantics, focus identity, deterministic hydration or lazy cancellation stops the candidate and returns to architecture review rather than silently falling back to a different widget model.

## Primary references

- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria/): treeitem required context and explicit level/set metadata for partial DOM.
- [WAI-ARIA Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/): keyboard and declared hierarchy patterns.
- [TanStack Virtualizer API](https://tanstack.com/virtual/latest/docs/api/virtualizer): stable keys, range extraction, dynamic measurement, initial rectangles and internal scrolling.
