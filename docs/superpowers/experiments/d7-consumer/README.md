# D7 real-package consumer

This fixture is deliberately outside the pnpm workspace at runtime. The runner copies it and a packed `@aheart-ui/dnd` tarball into a fresh `mkdtemp` directory, installs with npm, and asserts that the installed package is not a workspace symlink.

The consumer covers the frozen D7 public surface: exact public types, ESM/CJS entry points, CSS, byte-identical SSR, hydration without warnings, generic keyboard grab/cancel/drop, stable-key sortable movement, controlled cross-list rollback, and iframe owner-document cleanup.

Run the red proof before the final build:

```sh
node scripts/d7-dnd-consumer.mjs \
  --phase red \
  --tarball /path/to/aheart-ui-dnd.tgz \
  --out docs/superpowers/evidence/d7/consumer/red
```

Run the same command with `--phase green` and a newly built tarball for the final evidence. The result records Node, pnpm, tarball SHA-256, temporary consumer root, symlink status, and each gate separately.
