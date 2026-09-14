# Form.List genuine RED

Baseline: master `19a0bf88c7701071f2b788845a030751cfd249c3`; branch `codex/form-list-optimization`. Production Form code was unchanged when this RED was captured.

Command:

```sh
corepack pnpm@9.15.4 --dir packages/components exec vitest run --environment jsdom \
  src/form/__tests__/form-list.test.ts \
  src/form/__tests__/form-list.ssr.test.ts
```

Valid RED result: exit 1; 2 failed files, 9 failed tests, 0 passing tests. `form-list.test.ts` collected all eight behavior/API tests and `form-list.ssr.test.ts` collected its deterministic-render test. Every failure was the expected missing-capability boundary: `FormList` was `undefined` in the form and public entries. No production file exported or implemented FormList.

An earlier attempt contained a test syntax error and is explicitly excluded from evidence. The test was corrected without changing production code, then the command above was rerun to obtain this valid RED.

The maintained RED suite covers public/install exports, append/insert/multi-remove/move, stable keys and focused DOM, synchronous and server error remap, nested relative lists/items, initialValue/reset/preserve, external reference reorder, async stale completion, invalid/non-array no-ops and deterministic SSR output. Further focused tests may be added during GREEN review, but this record must not be rewritten as proof they already pass.
