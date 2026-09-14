# D4 Node 24 and browser prerequisite verification

- Frozen consumer candidate: `b1a8d49b8e0308b3645e85778993d70af270151d`.
- Raw report: `/private/tmp/aheart-d4-exact-node24-c81GQg/full-release.json` (local evidence, not a portable artifact URL).
- Reopened with `node scripts/d4-deferred-consumer.mjs --report /private/tmp/aheart-d4-exact-node24-c81GQg/full-release.json --require-release`: exit 0, `status: passed`, `acceptanceEligible: true`, no failures.
- Follow-up CI-only repair moves browser installation before `pnpm test`, which includes real consumer browser integration tests. No component or collector implementation changed.
- RED: `node --test --test-name-pattern='integration tests rebuild' scripts/d4-deferred-consumer.test.mjs` failed with `real consumer integration tests require browsers before pnpm test` before the workflow edit.
- GREEN: `node --test scripts/d4-deferred-consumer.test.mjs`: 91 passed, 0 failed, 0 skipped after the workflow edit.
- The full consumer result belongs to the frozen candidate above; it is not evidence of remote CI success on the follow-up commit. Remote CI, independent final review, merge, master, Pages and live acceptance remain separate gates.
