# D9 release preparation evidence

## Package versions and isolated consumer

- `aheart-ui@1.1.0` is prepared locally; `@aheart-ui/dnd@1.0.0` and `@aheart-ui/ai@1.0.0` remain the first formal package versions.
- All three packages pass `release:pack` and the isolated D8 consumer with no workspace symlinks.
- The consumer now resolves all ESM imports by absolute paths inside its temporary `node_modules`; CJS imports resolve through a `createRequire` rooted in that same temporary project.
- Local tarball hashes for the current candidate: components `2e263cad466fff8b23883af898d1656ad0f5c588308055889ae89ab13a8899b7`, DnD `f2ffba7d81fbf34ca6f41ff59faa12187a31c2361d6d74b61239ebc3c096ae0f`, AI `f09be0bb5b31d089c7b5d34492cb3361e46c9ab978e31f74f3383044287f102b`.

## Registry check

Read-only registry queries on 2026-09-15 found no published `aheart-ui@1.1.0`, `@aheart-ui/dnd@1.0.0`, or `@aheart-ui/ai@1.0.0`. No publish was attempted; npm login, 2FA and passkey remain a user-operated boundary.

## CI allocation timing

QG5 production specs are excluded from the ordinary browser job and run once in the five-project `qg5-cross-browser` matrix. The CI contract test verifies this routing. The split workflow's longest job remained effectively unchanged: the previous run's browser job was `44.45` minutes and the repaired candidate was `44.57` minutes. QG5 shards stayed around `1.90–2.48` minutes, so the split removed duplicate QG5 execution without claiming a material wall-clock reduction for the serial full browser suite.

Physical iOS Safari evidence and final product acceptance remain open.
