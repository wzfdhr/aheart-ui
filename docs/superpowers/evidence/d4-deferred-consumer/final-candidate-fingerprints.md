# D4 final production evidence fingerprints

Production commit: `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`.
Completed dual-CI head: `a9734e392adb9282346fe1abe41c11c28318dfd4`.
The subsequent `ad95912` correction changes only the observer-summary Markdown. It does not change the package or collector.

| Artifact | SHA256 |
| --- | --- |
| `/private/tmp/aheart-d4-listeners-Nt2N5y/aheart-ui-1.0.0.tgz` | `0981133a62906536bcfcea9c05ffdf966a59ebfe9ddf09706a3962d6cf6d78d3` |
| `/private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json` | `27a96f80924ee98ee88cb58db14b35312d926a25913ff06d6a90552d2bb99be6` |
| `/private/tmp/aheart-d4-gzip-strict-c608a9b/gzip-supplement.json` | `0e76a3f5838857c903f051396dbd42251a0f723a6900ceb8fc41b2a38ac97465` |
| `/private/tmp/aheart-d4-ci-a9734e3-pr.log` | `ab5a1154a81b3e60e77f527232ccc2fdffac699dd98d93f284029870e13755fc` |
| `/private/tmp/aheart-d4-ci-a9734e3-push.log` | `81e445b6f43ec5a66e8097bafb5d2080b0d3275633d1607949a881506196e411` |

These local paths are evidence locations, not portable download links. The raw report binds durable package, lock, module and browser artifacts; the gzip supplement separately binds first/repeat bundle manifests. Final review reports and any later merge-head CI remain separate requirements.
