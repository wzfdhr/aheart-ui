# D4 combined full collector GREEN at 8aba4a9

This is the first complete GREEN performance/consumer candidate after the preserved RED sequence. It releases final review and full-repository gates; it is not PR, merge, deployment, or npm-publication evidence.

## Identity

- Candidate commit: `8aba4a91a96efeff62bb73dda1fb9e61bfcff8f5`.
- Candidate tarball SHA-256: `d239167eab6f59e289337b9cc3bf64133e7821e264a274820eec6ebc00b22b7a`.
- Approved baseline commit: `4a7511f9594d0a74906e427e158d02343ba33a22`.
- Approved baseline tarball SHA-256: `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`.
- Full run ID: `full-1789275219248-bd62f5e9f77048`.
- Raw report at capture time: `/private/tmp/aheart-d4-full-final-r11.wSrlIQ/full.json`.
- Raw report bytes / SHA-256: `196735503` / `55f7116f1f0c1ef2ff1931e586d4d55d17e9cb9981ed231df4fdf34565af0653`.
- Environment: Apple M4, concurrency 1, Node 24.17.0, pnpm 9.15.4, Vue 3.5.38, Vite 5.0.12, Playwright 1.61.1, TypeScript 5.3.3.

## Matrix and release result

- Matrix: Tree, TreeSelect and Cascader; 1k/5k/10k; fixed/coarse/dynamic; one discarded warm-up; five measured full and virtual runs in pair-forward-reverse order; forty scroll steps per measured run.
- Checkpoints: `714`.
- Final validator: `passed`; `acceptanceEligible=true`.
- Maximum candidate virtual median: `159.4 ms` (limit 500 ms).
- Maximum candidate mounted virtual rows: `16` (limit 24).
- Candidate gzip: `22724` bytes; baseline gzip: `22552` bytes; delta `172` bytes (limit 12288 bytes).

## 10k first-interaction medians

| Component | Row mode | Full ms | Virtual ms | Ratio |
| --- | --- | ---: | ---: | ---: |
| Tree | fixed | 342.8 | 72.2 | 21.06% |
| Tree | coarse | 340.1 | 68.0 | 19.99% |
| Tree | dynamic | 375.2 | 70.9 | 18.90% |
| TreeSelect | fixed | 685.5 | 111.0 | 16.19% |
| TreeSelect | coarse | 678.4 | 98.0 | 14.45% |
| TreeSelect | dynamic | 737.9 | 95.1 | 12.89% |
| Cascader | fixed | 376.2 | 142.7 | 37.93% |
| Cascader | coarse | 377.4 | 154.6 | 40.96% |
| Cascader | dynamic | 402.4 | 159.4 | 39.61% |

All nine 10k ratios are below the approved 50% limit.

## Browser, SSR and lifecycle evidence

- Chromium 149.0.7827.55: 270/270 observer rounds, actual `longtask` and `layout-shift` support, max scripted-scroll long task `0 ms`, CLS `0`, console/page errors `0/0`.
- Firefox 151.0: 270/270 observer rounds, `supportedEntryTypes` explicitly excludes longtask/layout-shift, console/page errors `0/0`.
- WebKit 26.5: 270/270 observer rounds, `supportedEntryTypes` explicitly excludes longtask/layout-shift, console/page errors `0/0`.
- SSR/hydration: eight boolean combinations, deterministic double render, full server/hydrated snapshots and post-hydration actions passed.
- Iframe: all three components, 110 created resources, active-after-unmount/final-active/Teleport residual/late update/post-unmount interaction all `0`; focus restoration and cleanup passed.
- Cleanup: each side closed 28 Chromium, 28 Firefox, 28 WebKit, 82 recycled pages and one preview server; both temporary consumers were removed.

The candidate must be rerun after any affected production, fixture, contract, generated-output or review-driven change. Documentation-only review records do not retroactively change this package result, but the final PR candidate still requires a frozen-head verification pass.
