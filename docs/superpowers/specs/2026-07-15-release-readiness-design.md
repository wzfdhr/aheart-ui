# Aheart UI Release Readiness Design

## Goal

Prepare `aheart-ui`, `@aheart-ui/dnd`, and `@aheart-ui/ai` for a first `1.0.0` publication without publishing to npm in this phase.

## Scope

- Keep all three public packages at version `1.0.0`.
- Add consistent repository, homepage, bugs, funding-free public metadata and npm publish configuration.
- Give every tarball a package-specific README, MIT license, ESM entry, CommonJS entry, type entry, and stylesheet.
- Remove the unused `@aheart-ui/utils` workspace package and legacy `packages/components/index.ts` demo.
- Generate DnD declarations into both `es` and `lib`; stop producing ignored `dist` declarations.
- Add a deterministic release-contract verifier that packs all three packages and validates their contents and packed manifests.
- Extend local and CI quality gates to include package contracts, generated-output drift, documentation, and Playwright.
- Refresh the root README, Chinese release guide, and changelog to describe the actual three-package product.

Publishing, npm authentication, GitHub Releases, tags, and registry provenance are explicitly outside this phase. They require a separate human-approved release action after this branch is merged.

## Package Contract

Every public package must expose:

- `import` through `es/index.js`;
- `require` through `lib/index.js`;
- TypeScript declarations through `es/index.d.ts`;
- `./style.css` through `es/style.css`;
- built-module escape hatches through `./es/*` and `./lib/*`;
- `./package.json` for tooling inspection.

Each build writes `es/package.json` with `type: module` and `lib/package.json` with `type: commonjs`, so direct built-module imports retain the intended JavaScript format.

The packed manifest must not contain `workspace:` protocols. Scoped packages use `publishConfig.access = "public"`; all packages use the public npm registry. Vue remains a peer dependency and must not be bundled.

## Release Contract Verifier

Create a Node ESM module with pure validation functions and a CLI entry. The CLI will:

1. Create a temporary directory outside the repository.
2. Run `pnpm --dir <package> pack --json --pack-destination <temp>` for each public package.
3. Validate required file paths from pnpm's JSON result.
4. Read the packed `package/package.json` from the tarball.
5. Reject unresolved `workspace:` protocols, missing metadata, missing exports, wrong versions, and unexpected source/test files.
6. Remove the temporary directory even on failure.

Unit tests use Node's built-in `node:test` and exercise the pure manifest/file validation before the CLI is wired into `release:pack`.

## Build Reproducibility

Vite remains the build system. The DnD declaration plugin is aligned with AI so both `es` and `lib` receive declarations. After configuration changes, run two consecutive full builds and require the second build to produce no additional diff. Commit the complete reproducible generated baseline once; later feature branches continue to exclude unrelated build drift.

## CI And Release Flow

The normal CI job runs install, typecheck, unit tests, build, generated-output check, docs build, package contract verification, Playwright browser installation, and E2E tests. The local `release:check` mirrors the same order. A successful check means “publishable artifact verified”, not “published”.

## Documentation

The root README describes all three public packages and current component coverage. Package READMEs contain installation and entry-point examples appropriate to each package. `CHANGELOG.md` records the prepared `1.0.0` scope. The Chinese release guide defines the exact pre-publish, registry-authentication, tag, and post-publish verification steps while making clear that this phase does not execute them.

## Acceptance

- Three tarballs are created and validated without repository changes.
- All tarballs contain README, LICENSE, package metadata, ESM, CommonJS, declarations, and CSS.
- No packed manifest contains `workspace:`.
- `pnpm release:check` passes from a clean checkout.
- Two consecutive builds are deterministic.
- Design review and product review both report `P1=0, P2=0` before merge.
