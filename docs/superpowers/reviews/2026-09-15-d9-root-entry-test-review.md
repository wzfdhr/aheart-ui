# D9 root-entry independent test review

Scoped verdict: P0/P1/P2=`0/0/0` for the root named-import gate.

- Genuine RED retained: unrelated component markers in the root consumer bundle.
- GREEN: copied tarball, no symlink, root ESM/CJS/type entry, Vite build, `50,729` gzip bytes and zero unrelated markers.
- Form-only subpath regression: `32,069` gzip increment, SSR determinism, hydration, interaction and reset all pass.
- Components unit suite remains `117/1485` passing on the master baseline; the root architecture changes typecheck and component build cleanly.

Physical iOS, npm registry and the remaining D9 release gates are not claimed.
