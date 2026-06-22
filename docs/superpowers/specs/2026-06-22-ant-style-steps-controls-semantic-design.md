# Ant Style Steps Controls And Semantic Hooks Design

## Context

The current Steps component supports item-driven rendering, `current`, `status`, `direction`, ConfigProvider size, disabled items, and `change`. Ant Design's Steps API also exposes step type variants, an `orientation` alias, title placement, starting number offset, percent progress on the current step, item icons, subtitles, panel content, and semantic class/style hooks.

This design adds the highest-value configuration surface while preserving the existing list/button structure and click behavior.

## Goals

- Add `type="default" | "dot" | "navigation" | "panel" | "inline"`.
- Add `orientation="horizontal" | "vertical"` as an Ant compatibility alias for `direction`.
- Add `titlePlacement="horizontal" | "vertical"`.
- Add `initial` for displayed step numbering.
- Add `percent` for current process step progress.
- Add `StepItem.icon`, `StepItem.subTitle`, and `StepItem.content`.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add semantic `classNames` and `styles` hooks for `root`, `item`, `activeItem`, `button`, `indicator`, `icon`, `content`, `title`, `subTitle`, `description`, and `connector`.
- Keep existing derived status, explicit item status, disabled items, ConfigProvider size, and `change` behavior stable.

## Non-Goals

- Do not implement responsive direction switching in this slice.
- Do not implement arbitrary render-function `progressDot` or `iconRender`.
- Do not add editable workflow logic, form validation integration, or routed navigation.
- Do not add rich Vue node content for titles or descriptions; keep item text fields aligned with existing project patterns.

## API Design

`Steps.type` maps to root classes:

- `default`
- `dot`
- `navigation`
- `panel`
- `inline`

`Steps.orientation` accepts the same values as `direction`. If both are provided, `orientation` wins.

`Steps.titlePlacement` maps to root classes and controls whether title text sits beside or below the indicator.

`Steps.initial` offsets displayed numeric indicators. It does not change the zero-based `current` value or emitted `change` index.

`Steps.percent` attaches a CSS variable and a percentage text to the current step's process icon. It is clamped to `0..100`.

`StepItem.icon` overrides the derived numeric, finish, or error indicator text.

`StepItem.subTitle` renders next to the title.

`StepItem.content` renders below the description and is most useful with `type="panel"` or `type="inline"`.

`Steps.className`, `Steps.rootClassName`, and `Steps.style` attach to the root.

`Steps.classNames` and `Steps.styles` accept semantic maps keyed by:

- `root`
- `item`
- `activeItem`
- `button`
- `indicator`
- `icon`
- `content`
- `title`
- `subTitle`
- `description`
- `connector`

The connector remains implemented through a real element instead of a pseudo element so semantic hooks can target it.

## Behavior

Status calculation remains unchanged unless an item supplies its own status.

Clicking disabled steps or the current step still does not emit `change`.

`type="inline"` keeps descriptions visually compact and favors subtitle/content in a dense row.

`type="dot"` uses a dot-style indicator while preserving accessible button text.

## Testing

Add focused Steps tests before implementation:

- `type`, `orientation`, `titlePlacement`, `initial`, and `percent` render expected classes, number offset, and progress style.
- item `icon`, `subTitle`, and `content` render expected text.
- root and semantic class/style hooks apply to root, item, activeItem, button, indicator, icon, content, title, subTitle, description, and connector parts.
- existing disabled and change behavior remains stable.

Run the focused test first to verify RED, then implement and run Steps tests plus package typecheck.

## Documentation

Update `docs/components/steps.md` with examples for type variants, title placement, progress percent, custom icons/subtitles/content, and semantic styling. Expand API, StepItem, and Events tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no cross-component dependencies beyond existing ConfigProvider.
- Ambiguity check: responsive behavior and arbitrary render functions are explicitly out of scope.
- Type consistency: semantic part names and event names match the API design above.
