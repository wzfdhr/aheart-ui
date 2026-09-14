# D4 deferred virtualization final product-manager acceptance

Date: 2026-09-13. Accepted production candidate: `cf2a24c1460187041f622ddd0a01831076f91ab0`. Browser-test closeout: `3618e16bcdf7bdf3439ae3255529cc934588e4a3`.

## Product decision

**PASS. Combined D4 Tree, TreeSelect and Cascader virtualization product acceptance is complete with P0/P1/P2 = `0/0/0`.** This releases creation of a normal Ready PR after the review-metadata head is frozen and re-attested. It does not authorize bypassing PR CI or claim merge/deployment completion.

## User-task acceptance

1. Tree users can browse 1k/10k hierarchies, expand/collapse, check linked nodes, navigate Home/End, retain real focus through recycling, recover from lazy errors and read wrapped dynamic rows. Wide mobile content stays inside the Tree frame instead of expanding the document.
2. TreeSelect users can open/search/select large trees, preserve selected tags and disabled boundaries, move between search and actual tree focus, reject controlled changes without optimistic state, retry lazy loads and close/reopen without stale ownership.
3. Cascader users can traverse typed paths and five large columns, search 10k leaves, use Left/Right/Home/End/Enter, distinguish selection from focus, recover a lazy load and keep long dynamic labels reachable through component-owned scrolling.
4. Default non-virtual behavior remains available and was included in unit, browser, SSR and real consumer comparisons. Virtualization is explicit rather than silently enabled by data size.
5. The final screenshot-first design audit passed after rejecting and repairing a real Tree mobile overflow capture. It covered desktop/mobile Tree, TreeSelect and Cascader default, 10k, dynamic label, multi-column, lazy error/retry and selection/focus states.
6. Quantitative product constraints passed: max virtual window 22/24, max 10k median 179.9/500ms, all 10k ratios at or below 42.45%/50%, Chromium scroll long task 0/100ms, CLS 0/0.1 and consumer gzip delta 172/12,288 bytes.
7. Trust and recovery constraints passed: complete E2E 808/127/0, no new skip site, SSR 8/8, iframe owner-realm focus/Teleport/lazy cleanup, zero residual resources and isolated real tgz ESM/CJS/CSS/types installation.

## Evidence reviewed

- [Final architecture contract](../specs/2026-09-10-d4-deferred-virtualization-architecture.md).
- [Final development review](2026-09-13-d4-final-dev-review.md).
- [Final screenshot-first design review](2026-09-13-d4-final-design-review.md).
- [Final test-manager review](2026-09-13-d4-final-test-manager-review.md).
- [Final code evidence](../evidence/d4-deferred-consumer/final-code-green-4f6831e.md).
- Component-specific Tree, TreeSelect and Cascader development/design/test/product reports, including their rejected RED histories.

## Explicit boundaries

PR creation, exact-head CI, squash merge, master CI, Pages and live deployed interaction remain uncompleted until externally observed. Physical iOS Safari, npm authentication/publication, Form.List, D0-D3 final audit, D9 and aheart-ui v2 are outside this acceptance. Mobile WebKit and intent to publish are not substitutes for those gates.

Product-manager verdict: **accept D4 functional and quality scope; authorize PR delivery sequence only.**

## Final repair acceptance supplement

The final long-task repair removes duplicate internal measurement writes without removing real subpixel changes or changing any user-visible task. The exact previously failing round is now 83.7ms first interaction, 45.1ms maximum scroll step and zero long tasks. The complete collector and repository gates pass, while all REDs remain documented. The later WebKit test fix waits for the same five user-visible geometry conditions to converge and does not lower them. Product acceptance is therefore restored for candidate `cf2a24c`/`3618e16`, with P0/P1/P2=`0/0/0`; PR CI, merge, master CI, Pages and live verification remain separate.
