# Ant Style Spin Controls And Semantic API Design

Date: 2026-06-22

## Context

`ASpin` currently supports a first-pass loading indicator with `spinning`, `size`, `tip`, and default slot wrapping. The next parity gap is Ant Spin's richer control surface for delayed display, custom indicators, fullscreen loading, progress percent text, wrapper class names, and semantic DOM customization.

Reference: Ant Design Spin documentation, `https://ant.design/components/spin/`.

## Goals

- Preserve current `ASpin` behavior for standalone loading and nested content.
- Add Ant-style control props:
  - `delay`
  - `indicator`
  - `percent`
  - `fullscreen`
  - `wrapperClassName`
- Add root and semantic DOM styling hooks:
  - `className`
  - `rootClassName`
  - `style`
  - `classNames`
  - `styles`
- Expose deterministic semantic parts for root, nested section, indicator, dot, tip, percent, and content container.
- Keep this slice local to `ASpin`; do not introduce global indicator configuration yet.

## Non Goals

- Global default Spin indicator configuration through ConfigProvider.
- Portal mounting fullscreen nodes to `document.body`.
- Timer animation for dynamic progress values beyond rendering the provided `percent`.
- Replacing the existing dot with SVG or canvas animation.

## Public API

```ts
export type SpinPercent = number | 'auto'
export type SpinIndicator = VNodeChild | (() => VNodeChild)
export type SpinSemanticPart = 'root' | 'section' | 'indicator' | 'dot' | 'tip' | 'percent' | 'container'

export type SpinClassNames = Partial<Record<SpinSemanticPart, string>>
export type SpinStyles = Partial<Record<SpinSemanticPart, StyleValue>>
```

`SpinProps` additions:

| Prop | Type | Default |
| --- | --- | --- |
| `delay` | `number` | - |
| `indicator` | `SpinIndicator` | - |
| `percent` | `number \| 'auto'` | - |
| `fullscreen` | `boolean` | `false` |
| `wrapperClassName` | `string` | - |
| `className` | `string` | - |
| `rootClassName` | `string` | - |
| `style` | `StyleValue` | - |
| `classNames` | `SpinClassNames` | `{}` |
| `styles` | `SpinStyles` | `{}` |

## Behavior

- `spinning` remains true by default.
- When `delay` is set and `spinning=true`, the visible indicator appears only after the delay elapses.
- When `spinning=false`, pending delay timers are cleared and the indicator is hidden.
- When default slot content exists, `ASpin` renders a nested section with a content container and overlays the indicator only while visible.
- When no default slot content exists, `ASpin` renders as a standalone loading element.
- `indicator` replaces the default dot. If it is a function, call it during render through a small local render component.
- `percent` renders a progress text next to the tip when it is a number. `percent="auto"` renders a stable auto label.
- `fullscreen=true` adds a fullscreen overlay class to the root and still keeps rendering local to the component tree.
- `wrapperClassName` applies to the nested section root for Ant compatibility.
- `className` and `rootClassName` both append to the outer root.
- Semantic `classNames` and `styles` apply to:
  - `root`: outer root
  - `section`: nested wrapper when content exists
  - `indicator`: status node
  - `dot`: default spinner dot
  - `tip`: text tip
  - `percent`: percent text
  - `container`: wrapped content container

## Verification

- Add RED tests for semantic hooks, delayed visibility, custom indicators, fullscreen mode, percent text, wrapper class names, and hidden state.
- Run focused Spin tests for RED and GREEN.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full verification before closing the slice.
