# 介绍

Aheart UI 是面向产品界面的 Vue 3 组件库。它从小而稳定的基础开始，优先提供清晰的类型、可靠的样式和可持续扩展的文档结构。

当前包聚焦在这些能力：

- Vue 3 与 TypeScript 源码。
- CSS 变量驱动的主题 Token。
- 全量插件安装。
- 命名组件导入。
- 已测试的 Button 组件。
- ES Module 与 CommonJS 构建产物。

组件路线图按照产品 UI 常见类别组织，包括通用、布局、导航、数据录入、数据展示和反馈。

## 在 Codex 中使用 Aheart UI

安装 `aheart-ui` Skill 后，Codex 可以按需求查找组件、读取 API，再按项目已安装的版本编写 Vue 代码。

1. 在你的 Vue 项目根目录打开终端，使用 Node.js 22.20 或更新版本运行：

   ```sh
   npx skills add https://labradorca.github.io/aheart-ui/ai/aheart-ui/SKILL.md --skill aheart-ui -a codex
   ```

2. 用 Codex 打开同一个项目，发送下面这段提示词：

   ```text
   $aheart-ui
   用项目当前安装的 Aheart UI 版本做一个用户列表，支持按姓名筛选、分页和批量归档。
   ```

手动安装、组件检索和常见问题见 [AI 接入指南](./ai-integration)。
