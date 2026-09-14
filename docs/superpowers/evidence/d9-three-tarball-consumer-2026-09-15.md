# D9 three-tarball consumer evidence

An isolated consumer with no workspace symlinks was installed from freshly packed `aheart-ui`, `@aheart-ui/dnd` and `@aheart-ui/ai` tarballs. The D8 consumer runner passed package-file, public type, ESM/CJS import, CSS, plugin installation, reducer, deterministic SSR, hydration, chat lifecycle, workbench, AIForm and primitive tree-shaking checks.

Local run (Node `v24.17.0`, npm `11.13.0`, pnpm `9.15.4`):

| package | files | tarball SHA-256 |
| --- | ---: | --- |
| `aheart-ui@1.0.0` | 1047 | `c461de4de459b446382ca469ca806f38ffe6073cf1d62a75fce6d229174653ba` |
| `@aheart-ui/dnd@1.0.0` | 79 | `f2ffba7d81fbf34ca6f41ff59faa12187a31c2361d6d74b61239ebc3c096ae0f` |
| `@aheart-ui/ai@1.0.0` | 115 | `ef5c2c712a26b2b74ffc6782d26b3630c46023d24d04a6d5e1b45f0895e0915e` |

The CI consumer job now runs the same three-tarball D8 runner in addition to the root-entry and Form.List consumers. This evidence is local to the repair candidate until its exact-head PR and post-merge master run pass.
