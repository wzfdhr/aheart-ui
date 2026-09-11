# D4 Cascader virtualization visual evidence

The accepted screenshot-first audit is `audit-7964d86/`, captured from the source preview at production candidate `7964d860aca96a1b6ae73958cfb65eb7d559ba30`. Every accepted image was saved from the in-app browser and opened again from disk before review.

Earlier folders are retained as RED history and must not be presented as accepted design evidence:

- `audit-f38296f/`: stale virtual search owner left a large blank no-result panel.
- `audit-7dd9146/`: keyboard option focus had no visible outline.
- `audit-278cc9c/`: lazy-load failure lost focus and used insufficient-contrast error text.
- `audit-8ffcb87/`: five-column growth could place the panel and focused deepest row outside the viewport.

Accepted evidence:

1. `01-default.jpg` — default and virtual controls at rest.
2. `02-virtual-1k-open.jpg` — bounded 1k virtual column.
3. `03-keyboard-tail-focus.jpg` — End reaches the final enabled item with a visible 2px focus ring.
4. `04-search-10k-tail.jpg` — bounded 10k search and final enabled result.
5. `05-empty-search.jpg` — compact no-result state with no stale scroll owner.
6. `06-lazy-error-focused.jpg` — failed lazy row retains actual focus, retry wording and accessible error contrast.
7. `07-lazy-retry-success.jpg` — Enter retry succeeds and moves focus to the loaded child.
8. `08-controlled-rejection.jpg` — rejected update leaves the accepted value authoritative while logging the requested path.
9. `09-five-columns-deep-visible.jpg` — five-column panel stays inside the viewport and exposes the deepest focused row.
10. `10-arrowleft-root-visible.jpg` — repeated ArrowLeft restores the complete root row without a stale reveal.
11. `11-long-label-font24-short.jpg` — 24px long-label dynamic rows in the short viewport.
12. `12-long-label-scroll-reachable.jpg` — the remainder of an over-height dynamic row remains vertically reachable.
13. `13-selected-focus.jpg` — selected background and keyboard focus ring remain simultaneously visible.

The accepted screenshot set is desktop in-app-browser evidence. Mobile Chromium and mobile WebKit behavior is supported by the separate five-project browser and stable-geometry runs; screenshots alone are not used to claim screen-reader or physical-device compliance.
