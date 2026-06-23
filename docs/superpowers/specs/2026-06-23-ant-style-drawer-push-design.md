# Ant Style Drawer Push Design

## Context

Aheart Drawer already supports Ant-style mounting, renderable header/footer content, configurable close controls, mask controls, focus management, semantic styling, style aliases, and destroy aliases. Ant Design Drawer also exposes `push` for nested drawers so an open child drawer can move its parent panel aside.

Reference: Ant Design Drawer documentation, `https://ant.design/components/drawer/`.

## Goal

Add nested Drawer push behavior to `ADrawer` with Ant-compatible `push` prop support.

## Behavior

- `push` accepts `boolean | { distance?: number | string }`.
- `push` defaults to enabled with distance `180`.
- `push={false}` disables parent movement when child drawers open.
- When any nested child `ADrawer` is open, the parent panel moves by the resolved push distance.
- Direction follows the parent placement:
  - `right`: `translateX(-distance)`
  - `left`: `translateX(distance)`
  - `top`: `translateY(distance)`
  - `bottom`: `translateY(-distance)`
- Number distances become pixel lengths.
- String distances are used as CSS lengths; negative string distances use `calc(0px - distance)`.
- Existing panel transforms from `style`, `drawerStyle`, `contentWrapperStyle`, or `styles.section` are preserved before the push transform.
- Teleport does not break nesting because Vue provide/inject follows the component tree.
- Existing close, focus, mask, mount, lifecycle, size, style alias, semantic class/style, and destroy behavior stays unchanged.

## Files

- `packages/components/src/drawer/types.ts`: add `DrawerPushConfig`, `DrawerPush`, and the `push` prop.
- `packages/components/src/drawer/drawer.vue`: add local nested drawer context, child open tracking, push transform resolution, and panel style transform merging.
- `packages/components/src/drawer/__tests__/drawer.test.ts`: add default push, disabled push, custom distance/placement, and transform-preservation tests.
- `docs/components/drawer.md`: document `push` and `DrawerPushConfig`.
- Generated component outputs under `packages/components/es/drawer` and `packages/components/lib/drawer` are refreshed by the component build.

## Testing

- Focused Drawer tests must prove default nested push behavior, `push={false}`, custom distance/placement, and transform preservation.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice only adds Drawer nested push behavior.
- Consistency check: `DrawerPushConfig`, `DrawerPush`, `push`, and `distance` names are consistent across tests, source, docs, and generated output.
