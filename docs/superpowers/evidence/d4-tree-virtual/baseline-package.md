# Deferred virtualization baseline package

This is baseline preparation for the approved three-component consumer/performance protocol, not candidate performance or release acceptance.

- Detached checkout: `/private/tmp/aheart-d4-baseline-jb3qGf`.
- Baseline commit: `4a7511f9594d0a74906e427e158d02343ba33a22`.
- Git tree: `c9c137d4d0199f9d105395cfd5e24a56598ce98f`.
- Toolchain verified: Node `24.17.0`, pnpm `9.15.4`, Vue `3.5.38`, Vite `5.0.12`.
- Frozen dependency install and isolated components build passed; the shared development checkout and preview were not rebuilt or restarted.
- Stable external tarball: `/private/tmp/aheart-d4-baseline-evidence-F5VN6u/repacked/aheart-ui-1.0.0.tgz`.
- SHA-256: `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`.
- Logs, original artifact and metadata: `/private/tmp/aheart-d4-baseline-evidence-F5VN6u/`.

Initial logs/artifacts were untracked inside the baseline checkout; they were moved outside it without deletion. Git status was then confirmed clean both before and after repacking to the external destination. The original and clean-checkout repacked tarballs are byte-identical (`cmp` exit 0), with the same SHA-256. The main thread independently checked the original tarball hash and absence of tracked baseline modifications; independent test-worker logs retain the final clean status and byte comparison.

The baseline checkout and evidence are deliberately retained. No registry publication, candidate measurement, full/virtual speed claim, gzip-delta result or physical-device acceptance is implied.
