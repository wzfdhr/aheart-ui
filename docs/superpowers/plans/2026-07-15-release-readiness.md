# Aheart UI Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all three Aheart UI packages reproducibly buildable, packable, and ready for a separately approved first `1.0.0` npm publication.

**Architecture:** A Node ESM release-contract verifier owns package and tarball validation. Existing Vite builds remain authoritative, while package metadata, DnD declaration output, CI, documentation, and generated baselines are aligned around the same three-package contract.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, pnpm 9, Node.js `node:test`, GitHub Actions, Playwright, VitePress.

## Global Constraints

- Do not execute `npm publish`, create a Git tag, or create a GitHub Release.
- Keep `aheart-ui`, `@aheart-ui/dnd`, and `@aheart-ui/ai` at version `1.0.0`.
- Keep English documentation disabled; only update Chinese release documentation.
- Vue remains `>=3.4.0 <4` as a peer dependency.
- Every package must expose ESM, Node-compatible CommonJS, declarations, CSS, and package metadata.
- Every implementation task follows red-green-refactor where executable behavior changes.
- Design director and product manager must approve with `P1=0, P2=0` before merge.

---

### Task 1: Release Contract Verifier

**Files:**
- Create: `scripts/release-contract.mjs`
- Create: `scripts/release-contract.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `validatePackageContract(contract, manifest, files)` and a CLI that packs all public packages.

- [ ] Write Node tests proving missing metadata, missing files, source leakage, and `workspace:` protocols fail.
- [ ] Run `node --test scripts/release-contract.test.mjs` and verify the missing module/API failure.
- [ ] Implement pure validation and the three-package pack CLI using `pnpm --dir ... pack --json`.
- [ ] Add `test:release-contract` and `release:pack` scripts.
- [ ] Run the unit test and confirm it passes.

### Task 2: Public Package Contract And Build Output

**Files:**
- Modify: `packages/components/package.json`
- Modify: `packages/dnd/package.json`
- Modify: `packages/ai/package.json`
- Modify: `packages/dnd/vite.config.ts`
- Delete: `packages/components/index.ts`
- Delete: `packages/utils/index.ts`
- Delete: `packages/utils/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: release verifier from Task 1.
- Produces: three consistent packed manifests and DnD declarations under `es` and `lib`.

- [ ] Run the release verifier and capture failures for missing metadata, missing DnD ESM types, and the AI workspace link.
- [ ] Add repository, homepage, bugs, publishConfig, author, keywords, and consistent ESM, Node, CommonJS, and type exports.
- [ ] Move DnD's first declaration output from ignored `dist` to `es`.
- [ ] Remove the unused utils package and dependency, then run `pnpm install --lockfile-only` followed by `pnpm install --offline`.
- [ ] Build all packages and run the release verifier until all three tarballs pass.

### Task 3: Public Documentation And License

**Files:**
- Create: `LICENSE`
- Create: `CHANGELOG.md`
- Create: `packages/components/README.md`
- Create: `packages/components/LICENSE`
- Create: `packages/dnd/README.md`
- Create: `packages/dnd/LICENSE`
- Create: `packages/ai/README.md`
- Create: `packages/ai/LICENSE`
- Modify: `README.md`
- Modify: `docs/guide/releasing.md`
- Delete: `docs/superpowers/COLLABORATION_HANDOFF.md`

**Interfaces:**
- Produces: accurate npm package pages and a Chinese operator checklist for first publication.

- [ ] Rewrite the root README around the three-package architecture and current 48 Ready entries.
- [ ] Add package-specific install, style, peer dependency, and backend-boundary guidance.
- [ ] Add the MIT license and an unreleased `1.0.0` changelog record.
- [ ] Replace the old core-only release guide with build, pack, auth, publish-order, tag, and post-publish checks.
- [ ] Remove the obsolete 2026-06-22 collaboration handoff whose state is no longer true.

### Task 4: CI And Reproducibility

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: generated files under `packages/components/{es,lib}`, `packages/dnd/{es,lib}`, and `packages/ai/{es,lib}`

**Interfaces:**
- Consumes: package verifier and aligned Vite outputs.
- Produces: one local/CI release gate with deterministic generated artifacts.

- [ ] Add ignored Playwright reports and remove obsolete local `dist` output.
- [ ] Add release contract, generated check, Chromium setup, and E2E steps to CI.
- [ ] Make `release:check` run tests, typecheck, build, docs, package contracts, E2E, generated checks, and whitespace checks.
- [ ] Run two consecutive full builds; require no diff after the first generated baseline.
- [ ] Commit the reproducible generated output needed by the package contract.

### Task 5: Final Review And Delivery

**Files:** Verify only.

- [ ] Run `CI=true corepack pnpm test` and `node --test scripts/release-contract.test.mjs`.
- [ ] Run `corepack pnpm typecheck`, `corepack pnpm build`, and `corepack pnpm docs:build`.
- [ ] Run `corepack pnpm release:pack`, `corepack pnpm test:e2e`, `corepack pnpm check:generated`, and `git diff --check`.
- [ ] Obtain design director and product manager reviews with no P1/P2 findings.
- [ ] Commit, push `codex/release-readiness`, fast-forward merge to `master`, push `master`, and delete the merged branch.
