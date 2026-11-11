# @aheart-ui/dnd

Aheart UI 的 Vue 3 通用拖拽包，提供 Draggable、DropZone、SortableList、SortableItem、DragOverlay 与组合式 API。

## 安装

```bash
pnpm add @aheart-ui/dnd vue
```

```ts
import { SortableList } from '@aheart-ui/dnd'
import '@aheart-ui/dnd/style.css'
```

拖拽组件支持指针操作和键盘替代路径。Vue `>=3.4.0 <4` 由业务应用提供。

## 1.1 候选按需入口

```ts
import { SortableList, SortableItem } from '@aheart-ui/dnd/sortable'
import '@aheart-ui/dnd/sortable/style.css'
```

需要独立拖放或拖动预览时可从 `/draggable`、`/droppable` 或 `/drag-overlay` 导入，并加载相应的 `/style.css`。旧根入口与 `style.css` 可用于逐步迁移。

完整用法见[中文 DnD 文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/dnd.md)。
