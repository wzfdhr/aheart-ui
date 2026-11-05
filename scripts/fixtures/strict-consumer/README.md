Run the strict consumer gate after building:

```sh
corepack pnpm release:pack --pack-destination test-results/release-tarballs
corepack pnpm check:consumer-types
```

The gate installs all three library tarballs into fresh npm consumers, verifies
that the packages are not symlinks, and checks root imports, Card props/slots and
aliases, every shipped `es`/`lib` declaration, and the minimal Button import repro.
All checks use `strict: true` and `skipLibCheck: false`, with the installed workspace
Vue version and Vue 3.5.44. TypeScript 5.9.3 supplies Vue's `NoInfer` intrinsic;
the repository's TypeScript 5.3 build compiler does not have it.

`--pack-dir` selects the library tarballs and `--out` selects the evidence directory.
Results include tarball hashes, installed versions, declaration counts and each
compiler exit code. Consumer directories and logs are retained for diagnosis.

On macOS external volumes, the declaration scanner records and excludes only
AppleDouble files with a matching source file and a verified magic/version
header. A `._` filename alone never suppresses a declaration or syntax error.

For offline validation, `--vue-pack-dir <directory>` optionally accepts upstream
Vue tarballs at `<directory>/<version>/*.tgz`. Pack `vue` and its `@vue/*`
dependencies from the installed version with `npm pack --ignore-scripts`; only
matching Vue packages may override registry dependencies. This does not override
the three library tarballs. CI uses ordinary registry installation.
