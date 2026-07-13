# 发布

每次发布 `aheart-ui` 前，都从仓库根目录执行以下检查：

```bash
corepack pnpm release:check
rm -rf /tmp/aheart-ui-pack
mkdir -p /tmp/aheart-ui-pack
corepack pnpm --dir packages/components pack --json --pack-destination /tmp/aheart-ui-pack
git status --short
```

`release:check` 会运行测试、类型检查、组件构建、VitePress 构建、已生成产物检查和 Git 空白检查。`pack` 命令会在 `/tmp/aheart-ui-pack` 创建可检查的发布 tarball，不会修改仓库中的发布包。

## 检查 tarball

检查 tarball 内容，确认其中包含：

- `es/index.js`、`lib/index.js` 及其声明文件。
- `es/style.css` 和 `lib/style.css`。
- `package.json`。
- 组件的已构建模块和声明文件。

发布包只包含 `es` 和 `lib` 目录中的构建产物；Vue 作为 peer dependency，不会被打进组件包。

## 已生成产物

当本次预期的源代码改动导致 `packages/components/es` 或 `packages/components/lib` 发生变化时，提交这些生成文件。构建造成的无关声明文件排序变化不属于预期改动，必须从提交中排除。提交前使用 `git status --short` 和 `git diff` 复核范围。
