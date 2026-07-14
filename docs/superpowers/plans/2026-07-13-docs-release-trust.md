# Documentation And Release Trust Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete every public English component route, correct the repository README, and make the published package contract verifiable before new runtime components are added.

**Architecture:** Keep the existing VitePress site as the only demo surface. English component pages mirror the existing Chinese pages and use the same globally registered Aheart UI components. Release checks stay at the workspace root and validate the component package, generated output, documentation build, and Git cleanliness without introducing a publishing service.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, VitePress, pnpm workspace, Node.js scripts.

## Completion Record

M0 completed on 2026-07-14. The pinned pnpm 9 runtime requires `corepack pnpm --dir docs build` for documentation commands and `corepack pnpm --dir packages/components pack` for packaging; the original filtered pack form is not supported by pnpm 9. A reproducible generated-output baseline was synchronized in its own build-only commit after two identical pinned builds, and the release guide records the limited exception. Final verification: `CI=true corepack pnpm release:check` passed with 37 test files and 608 tests.

## Global Constraints

- Continue on `codex/consolidated-ant-style-foundation`; do not create another demo or playground directory.
- Preserve all existing Chinese component pages and public component APIs.
- Every Ready component in `docs/.vitepress/data/components.ts` must resolve to an existing Chinese and English Markdown page.
- English demos must use the existing global `<A... />` component names registered by the VitePress theme.
- Keep Vue external to package builds and keep `vue` as a peer dependency compatible with Vue 3.4 and 3.5.
- Do not commit unrelated generated declaration ordering drift.
- Every task ends with `git diff --check`; the milestone ends with the full quality gate from the approved roadmap.

---

### Task 1: Complete English Component Documentation

**Files:**
- Create: missing `docs/en/components/*.md` pages corresponding one-to-one with `docs/components/*.md`.
- Verify: `docs/.vitepress/config.ts` and `docs/.vitepress/data/components.ts` routes.

**Interfaces:**
- Consumes: global Aheart UI component registration from `docs/.vitepress/theme/index.ts`.
- Produces: one existing English Markdown file for every Ready component slug and a successful English documentation build.

- [ ] **Step 1: Compute the missing English slug list**

Run:

```bash
comm -23 \
  <(find docs/components -maxdepth 1 -name '*.md' -exec basename {} \; | sort) \
  <(find docs/en/components -maxdepth 1 -name '*.md' -exec basename {} \; | sort)
```

Expected before implementation: 36 filenames, from `alert.md` through `typography.md`, excluding the existing `button.md` and `overview.md`.

- [ ] **Step 2: Create each missing English page**

For each slug, use its Chinese page as the API source and create an English page with this exact structure:

````markdown
# ComponentName <span class="aheart-status aheart-status--ready">Ready</span>

One concise English sentence describing the component.

## Basic Usage

<div class="aheart-demo-panel">
  <!-- A live example using the same valid props and slots as the Chinese page. -->
</div>

```vue
<template>
  <!-- The same example as the live panel. -->
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
````

Translate every public API row, slot, event, semantic DOM entry, and token section present in the Chinese source. Do not invent props or omit documented public behavior. Interactive examples that need state must use a VitePress-compatible `<script setup lang="ts">` block.

- [ ] **Step 3: Verify route completeness**

Run the same `comm -23` command from Step 1.

Expected: no output.

- [ ] **Step 4: Build documentation**

Run:

```bash
corepack pnpm docs:build
```

Expected: VitePress exits 0 with all Chinese and English routes generated.

- [ ] **Step 5: Verify whitespace and commit**

Run:

```bash
git diff --check
git add docs/en/components
git commit -m "docs: complete English component reference"
```

Expected: a commit containing only the missing English component pages.

---

### Task 2: Correct Public Package And Release Documentation

**Files:**
- Modify: `README.md`.
- Modify: `package.json`.
- Modify: `packages/components/package.json`.
- Modify: `docs/.vitepress/config.ts`.
- Create: `docs/guide/releasing.md`.
- Create: `docs/en/guide/releasing.md`.

**Interfaces:**
- Consumes: existing package outputs `packages/components/es` and `packages/components/lib`.
- Produces: stable root, style, built-module, and package metadata exports plus a reproducible `release:check` command.

- [ ] **Step 1: Add release-check scripts**

Set the root scripts to include:

```json
{
  "check:generated": "git diff --exit-code -- packages/components/es packages/components/lib",
  "release:check": "pnpm test && pnpm typecheck && pnpm build && pnpm docs:build && pnpm check:generated && git diff --check"
}
```

Keep every existing root script unchanged.

- [ ] **Step 2: Tighten the component package contract**

Keep the existing root export and built-module wildcard exports, then add:

```json
{
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.js"
    },
    "./style.css": "./es/style.css",
    "./es/*": "./es/*",
    "./lib/*": "./lib/*",
    "./package.json": "./package.json"
  },
  "files": ["es", "lib"],
  "peerDependencies": {
    "vue": ">=3.4.0 <4"
  }
}
```

Do not add runtime dependencies or include Vue in the bundle.

- [ ] **Step 3: Rewrite the README around the real repository**

The README must document:

1. Vue 3, TypeScript, Vite, Vitest, VitePress, and pnpm workspace.
2. The existing component categories rather than Button-only content.
3. Full installation with `import AheartUI from 'aheart-ui'`, `import 'aheart-ui/style.css'`, and `app.use(AheartUI)`.
4. Named component installation with `import { Button } from 'aheart-ui'` and `app.use(Button)`.
5. `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm docs:build`, and `pnpm release:check`.
6. The single VitePress documentation site and the actual `packages/components` and `packages/utils` ownership.
7. The roadmap order: internationalization, Splitter, advanced inputs, drag and drop, then AI packages.

Remove all statements claiming the default plugin, Button props, Button styles, or multi-component implementation are missing.

- [ ] **Step 4: Add bilingual release checklists**

Both release pages must require:

```bash
corepack pnpm release:check
rm -rf /tmp/aheart-ui-pack
mkdir -p /tmp/aheart-ui-pack
corepack pnpm --filter ./packages/components pack --json --pack-destination /tmp/aheart-ui-pack
git status --short
```

Document that generated `es` and `lib` changes are committed only when caused by the intended source change, and unrelated declaration-order changes are excluded from the commit. Add `Release` / `发布` sidebar entries beneath the theme guide in each locale.

- [ ] **Step 5: Verify package metadata and documentation**

Run:

```bash
corepack pnpm --filter ./packages/components build
rm -rf /tmp/aheart-ui-pack
mkdir -p /tmp/aheart-ui-pack
corepack pnpm --filter ./packages/components pack --json --pack-destination /tmp/aheart-ui-pack
corepack pnpm docs:build
git diff --check
```

Expected: all commands exit 0; the dry run includes `es/style.css`, `lib/style.css`, both root entries, declarations, and package metadata.

- [ ] **Step 6: Commit the public contract**

Run:

```bash
git add README.md package.json packages/components/package.json docs/.vitepress/config.ts docs/guide/releasing.md docs/en/guide/releasing.md packages/components/es packages/components/lib
git commit -m "chore: define release quality gate"
```

Expected: one commit containing the public documentation, package metadata, release scripts, and only intentional generated output.

---

### Task 3: Milestone Verification And Integration Readiness

**Files:**
- Verify only; do not add source files.

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: evidence that M0 is ready for branch review and integration.

- [ ] **Step 1: Run the component suite**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test
```

Expected: 37 test files and 607 tests pass.

- [ ] **Step 2: Run typecheck and builds**

Run:

```bash
corepack pnpm --filter ./packages/components typecheck
corepack pnpm --filter ./packages/components build
corepack pnpm docs:build
```

Expected: all commands exit 0.

- [ ] **Step 3: Verify routes and repository cleanliness**

Run:

```bash
comm -23 \
  <(find docs/components -maxdepth 1 -name '*.md' -exec basename {} \; | sort) \
  <(find docs/en/components -maxdepth 1 -name '*.md' -exec basename {} \; | sort)
git diff --check
git status --short --branch
```

Expected: no missing filenames, no whitespace errors, and no uncommitted files.
