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

使用 Node.js 22.20 或更新版本，在你的 Vue 项目目录运行：

```sh
npx skills add https://labradorca.github.io/aheart-ui/ai/aheart-ui/SKILL.md --skill aheart-ui -a codex
```

也可以<a :href="withBase('/ai/aheart-ui/SKILL.md')" download>下载 SKILL.md</a>，放到项目的 `.agents/skills/aheart-ui/SKILL.md`。

## 在 Codex 里使用

```text
用 Aheart UI 做一个用户列表。支持按姓名筛选、分页和批量操作。
使用项目当前安装的组件版本，按文档接入。
```

Codex 可以从 Table 的文档确认分页模式和行选择事件，用 Input 处理姓名筛选。页面需要独立的分页控件时，可以再查 Pagination。

## 组件索引

<a :href="withBase('/ai/search-index.json')">search-index.json</a> 提供中英文组件名、用途、分类和所属 npm 包。条目的 `markdownPath` 和 `docsPath` 都相对于索引 URL，分别指向原始 Markdown 和交互文档。也可以从 <a :href="withBase('/llms.txt')">llms.txt</a> 发现这些入口。

索引里的 `documentedVersion` 来自构建文档时的包清单。使用候选版本或新版 API 前，请核对项目的已安装版本和包导出。
