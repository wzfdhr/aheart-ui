---
title: AI 接入
description: 让 Codex 查找 Aheart UI 组件，读取实际 API，并按项目版本生成 Vue 代码。
---

<script setup>
import { withBase } from 'vitepress'
</script>

# AI 接入

让 Codex 按需求查找 Aheart UI 组件，读取用法和 API，再按项目安装的版本编写 Vue 代码。

## 安装 Skill

在要接入 Aheart UI 的 Vue 项目根目录打开终端，使用 Node.js 22.20 或更新版本运行：

```sh
npx skills add https://labradorca.github.io/aheart-ui/ai/aheart-ui/SKILL.md --skill aheart-ui -a codex
```

安装完成后，项目中会有 `.agents/skills/aheart-ui/SKILL.md`。也可以<a :href="withBase('/ai/aheart-ui/SKILL.md')" download>下载 SKILL.md</a>，手动放到同一路径。项目需要安装组件包时，见 [Aheart UI 安装指南](./installation)。

## 在 Codex 里使用

用 Codex 打开刚才的 Vue 项目，在对话里发送下面这段。第一行 `$aheart-ui` 指定本次使用这个 Skill。

```text
$aheart-ui
在这个 Vue 项目里做一个用户列表，支持按姓名筛选、分页，以及勾选多条记录后批量归档。
按项目安装的 Aheart UI 版本实现，并验证这三个操作。
```

Codex 会按需求查找组件，例如用 Input 做姓名筛选，再从 Table 文档确认分页与行选择的写法。只想先选组件时，可以在 `$aheart-ui` 后写「我要做一个可筛选、可分页的用户列表，先给我组件建议、文档链接和最小 Vue 示例」。

如果 Codex 找不到 `aheart-ui`，检查当前项目中的 `.agents/skills/aheart-ui/SKILL.md`，再重启 Codex。使用 Codex CLI 时，也可以用 `/skills` 查看可用的 Skill。

## 组件索引

<a :href="withBase('/ai/search-index.json')">search-index.json</a> 提供中英文组件名、用途、分类和所属 npm 包。条目的 `markdownPath` 和 `docsPath` 都相对于索引 URL，分别指向原始 Markdown 和交互文档。也可以从 <a :href="withBase('/llms.txt')">llms.txt</a> 发现这些入口。

索引里的 `documentedVersion` 来自构建文档时的包清单。使用候选版本或新版 API 前，请核对项目的已安装版本和包导出。
