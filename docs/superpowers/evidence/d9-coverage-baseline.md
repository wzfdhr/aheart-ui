# D9 coverage baseline and gate

Candidate: current `codex/d9-quality-gates` branch from master `6c8ef64`.

Command:

```text
corepack pnpm@9.15.4 --filter aheart-ui exec vitest run --environment jsdom --coverage
corepack pnpm@9.15.4 --filter @aheart-ui/dnd exec vitest run --environment jsdom --coverage
corepack pnpm@9.15.4 --filter @aheart-ui/ai exec vitest run --environment jsdom --coverage
```

All three suites passed. V8 branch coverage from the filtered `src/**/*.{ts,vue}` reports:

| Package | Branches | Lines |
| --- | ---: | ---: |
| aheart-ui components | 88.36% | recorded in `packages/components/coverage/coverage-summary.json` |
| DnD | 80.37% | 91.90% |
| AI | 86.22% | 96.41% |

The package Vitest configs exclude generated `es/lib` and test files, use the V8 provider, emit text/JSON summaries, and enforce `branches: 80`. The first coverage invocation without `--environment jsdom` was a tooling RED (`document is not defined`) and is excluded; the corrected command above is the authoritative GREEN.
