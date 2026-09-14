# D9 root named-import package architecture

Status: architecture and implementation spike. This contract covers only root-entry tree shaking; it does not close D9 publication, coverage, CI decomposition, physical iOS or npm gates.

## Contract

- The default plugin remains available from the package root and registers every component synchronously.
- Root named exports remain synchronous component objects and preserve the existing public names/types.
- Component implementation modules no longer import their CSS as hidden side effects. Consumers import the documented `aheart-ui/style.css` entry; subpath consumers keep the same explicit CSS contract.
- Generated `es/package.json` and `lib/package.json` declare `sideEffects: false`, allowing bundlers to remove unused component modules from root named imports. The package root retains its CSS side-effect declaration.
- The build retains compatibility `*/style.css.js` stubs for wildcard deep paths while the real stylesheet remains `es/style.css` / `lib/style.css`.
- A real copied-tgz consumer with no workspace symlink must import `{ Form, FormItem, FormList }` from the package root, typecheck, build with Vite, and contain no Table/Cascader/TreeSelect/Upload markers in its bundle.
