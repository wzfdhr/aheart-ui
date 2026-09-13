# D4 full collector checkpoint scalability RED

- Candidate at failure: `fea6b6a26c2508f0fff2986330501514f80a96fe`.
- Approved baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.
- First full collector attempt started with the exact candidate and baseline tarball manifests after the bounded contract and preflight gates passed.
- The collector failed during baseline `Tree / 1000 / dynamic`, measured round 2, after 38 checkpoints. It did not produce or claim a performance result.
- Preserved error: `RangeError: Invalid string length` at the failure-path `JSON.stringify(failed)` call.
- The partial report and its run copy were each `533,487,996` bytes; the failed evidence directory occupied about `3.0 GiB`.
- Root cause: every checkpoint embedded the full raw JSON string in the aggregate partial-report index and copied immutable tarball/build/SSR assets into every checkpoint directory.
- RED log: `/private/tmp/aheart-d4-full-final.rXC3WD/run.log` at capture time. The large temporary directory is rebuildable and may be deleted after this record and the GREEN replacement test are committed.

The accepted repair must keep the checkpoint index metadata-only, store each raw payload once as a gzip artifact with raw and compressed hashes/byte counts, reuse one durable copy of immutable package/build inputs, preserve failure cleanup counters, and pass the real injected-failure integration test before another full run.
