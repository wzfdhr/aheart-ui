# 发布

本页定义 Aheart UI 三个 npm 包的首次 `1.0.0` 发布流程。日常开发与发布准备不得执行真实发布。

## 发布前门禁

从干净的 `master` 执行：

```bash
corepack pnpm install --frozen-lockfile
CI=true corepack pnpm release:check
git status --short
```

验收要求：

- 单元测试、类型检查、三包构建和中文文档构建通过。
- Playwright 桌面与移动端用例无失败。
- 三个 tarball 均通过 release contract。
- 构建后 `es/lib` 无漂移，Git 工作区保持干净。

## 检查 tarball

```bash
corepack pnpm release:pack
```

验证器会临时打包并检查：

- `aheart-ui@1.0.0`
- `@aheart-ui/dnd@1.0.0`
- `@aheart-ui/ai@1.0.0`

每个包必须包含 README、LICENSE、package.json、ESM、Node/SSR 可用的 CommonJS、TypeScript 声明和样式；不得包含源码、测试或未解析的 `workspace:` 协议。`es/package.json` 与 `lib/package.json` 必须分别声明 `module` 和 `commonjs` 模块类型。

## 正式发布

以下步骤只能在负责人明确批准后执行。先把 `CHANGELOG.md` 的 Unreleased 替换为实际发布日期，提交发布版本，并从该提交创建本地 tag：

```bash
git status --short
CI=true corepack pnpm release:check
git tag -a v1.0.0 -m "Aheart UI v1.0.0"
```

随后保持在同一提交发布三个包：

```bash
npm whoami
npm config get registry
corepack pnpm --dir packages/components publish --access public
corepack pnpm --dir packages/dnd publish --access public
corepack pnpm --dir packages/ai publish --access public
```

发布顺序固定为核心包、DnD、AI。发布前确认 registry 为 `https://registry.npmjs.org/`，账号拥有 `@aheart-ui` scope 的发布权限，并启用 npm 要求的二次验证。任一包失败时停止后续发布，不移动或重建 tag。

## 发布后验证

```bash
npm view aheart-ui@1.0.0 version
npm view @aheart-ui/dnd@1.0.0 version
npm view @aheart-ui/ai@1.0.0 version
```

随后在空目录安装三个包，验证 ESM、CommonJS、类型和样式入口。确认无误后推送同一 tag 并创建 GitHub Release：

```bash
git push origin v1.0.0
```

Git tag、GitHub Release 与 npm tarball 必须来自同一提交。

## 生成产物策略

源代码变化引起的 `es/lib` 输出必须随阶段提交。完整构建连续执行两次后，第二次不得产生任何差异。任何与当前源码无关的声明顺序漂移都必须先查明原因，不能通过暂存文件绕过检查。
