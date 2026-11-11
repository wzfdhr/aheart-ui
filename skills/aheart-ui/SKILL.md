---
name: aheart-ui
description: Find documented Aheart UI components and check their versioned APIs. Use when choosing, integrating, or troubleshooting Aheart UI components in a Vue 3 application.
---

# Aheart UI

1. Check the target app's `package.json`, lockfile, component imports, and stylesheet imports. Follow its existing registration and import conventions.
2. Fetch the [component index](https://labradorca.github.io/aheart-ui/ai/search-index.json). Match component keys, Chinese and English names, and descriptions. For a multi-part request, search by capabilities such as `筛选`, `分页`, and `行选择` individually. In an Aheart UI source checkout, use `docs/.vitepress/data/components.ts` and `docs/components/` as the local sources.
3. Resolve the selected entries' `markdownPath` values relative to the index URL. Read those pages for the exact props, events, slots, and examples. `docsPath` points to the interactive reference. Examples using global `A`-prefixed tags depend on plugin registration. With local registration in `<script setup>`, use the named export from the entry's `packageName` and render it by its imported name.
4. Treat `packages[packageName].documentedVersion` as the version in the documentation build. Check the installed package's type declarations and `exports` for any API or subpath before using it. For a new install, confirm the desired version is available in the project's registry. Use the package's documented root imports and the index's `styleImport` when the app has no existing style setup, and load the core stylesheet for shared tokens when using `@aheart-ui/ai`.
5. Reuse the app's data and state conventions. For a filtered, paginated table with bulk actions, check Table's pagination mode and row-selection events first. Add standalone Pagination when the page owns its paginator. Run the app's type check or build and exercise the affected interactions when available.
