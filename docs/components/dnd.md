<script setup lang="ts">
import { ref } from 'vue'

const todo = ref([{ id: 'plan', title: '整理需求' }, { id: 'review', title: '产品审核' }])
const done = ref([{ id: 'release', title: '准备发布' }])
</script>

# DnD 拖拽 <span class="aheart-status aheart-status--ready">Ready</span>

`@aheart-ui/dnd` 基于 Pragmatic Drag and Drop 提供 Vue 受控拖拽能力。它不修改业务数据，所有排序和跨容器移动都通过 `v-model:items` 回传。

## 安装

```ts
import AheartDnd from '@aheart-ui/dnd'
import '@aheart-ui/dnd/style.css'

app.use(AheartDnd)
```

也可单独使用 `Draggable`、`DropZone`、`SortableList`、`SortableItem`、`DragOverlay` 与对应组合式 API。

## 列表排序

<ASortableList v-model:items="todo" item-key="id">
  <template #item="{ item }">
    <div style="padding: 8px 12px; border: 1px solid var(--aheart-color-border); border-radius: 4px; background: var(--aheart-color-bg);">{{ item.title }}</div>
  </template>
</ASortableList>
<ADragOverlay />

```vue
<ASortableList v-model:items="items" item-key="id">
  <template #item="{ item }">{{ item.title }}</template>
</ASortableList>
<ADragOverlay />
```

条目获得焦点后，可使用 `Alt + ArrowUp` 或 `Alt + ArrowDown` 完成同列表移动；组件会通过 live region 宣布结果。

## 跨容器移动

<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
  <ASortableList v-model:items="todo" item-key="id" group="tasks">
    <template #item="{ item }"><div style="padding: 8px; border: 1px solid var(--aheart-color-border); border-radius: 4px;">{{ item.title }}</div></template>
  </ASortableList>
  <ASortableList v-model:items="done" item-key="id" group="tasks">
    <template #item="{ item }"><div style="padding: 8px; border: 1px solid var(--aheart-color-border); border-radius: 4px;">{{ item.title }}</div></template>
  </ASortableList>
</div>

跨容器移动必须为两个列表显式设置相同且非空的 `group`；未设置 `group` 的列表仅支持自身排序，不会彼此接收条目。不同 `group` 会拒绝放置。

## API

| 组件 | 说明 |
| --- | --- |
| `Draggable` | 将插槽内容注册为可拖动元素，`data` 必须包含业务拖拽数据；`disabled` 可禁用拖动。 |
| `DropZone` | 放置区域，`accept` 可限制允许的 `data.type`；`disabled` 可禁用放置。 |
| `SortableList` | 受控排序列表，使用 `v-model:items`、`item-key` 与可选 `group`；跨容器时必须为双方设置相同的非空 `group`，`disabled` 可禁用排序与接收。 |
| `SortableItem` | `SortableList` 内部条目；也可用于定制条目结构。 |
| `DragOverlay` | 在拖动期间展示可自定义的浮层内容。 |

| 组合式 API | 说明 |
| --- | --- |
| `useDraggable` | 注册一个可拖动元素。 |
| `useDroppable` | 注册一个可放置元素。 |
| `useSortable` | 同时注册拖动源和放置目标；源数据为 `data`，目标数据使用 `dropData`。 |
