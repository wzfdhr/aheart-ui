# Release

Before releasing `aheart-ui`, run the following checks from the repository root:

```bash
corepack pnpm release:check
rm -rf /tmp/aheart-ui-pack
mkdir -p /tmp/aheart-ui-pack
corepack pnpm --dir packages/components pack --json --pack-destination /tmp/aheart-ui-pack
git status --short
```

`release:check` runs tests, type checking, the component build, the VitePress build, generated-output verification, and Git whitespace validation. The `pack` command creates an inspectable release tarball in `/tmp/aheart-ui-pack` without changing the repository package.

## Inspect the tarball

Inspect the tarball contents and confirm that it includes:

- `es/index.js`, `lib/index.js`, and their declaration files.
- `es/style.css` and `lib/style.css`.
- `package.json`.
- Built component modules and declaration files.

The published package contains only build output from `es` and `lib`; Vue is a peer dependency and is not bundled into the component package.

## Generated output

Commit changes under `packages/components/es` or `packages/components/lib` only when an intended source change caused them. Declaration-order changes created by a build that are unrelated to the intended work must be excluded from the commit. Review the scope with `git status --short` and `git diff` before committing.

Synchronize a committed generated baseline only after two clean builds with pinned dependencies produce identical output and the baseline is stale. Make this a dedicated build-only synchronization commit and record checksum and diff evidence; all other output unrelated to the intended change remains excluded.
