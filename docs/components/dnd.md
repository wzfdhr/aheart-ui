<script setup lang="ts">
import { ref } from 'vue'

const mounted = ref(true)
const todo = ref([{ id: 'plan', title: '整理需求' }, { id: 'review', title: '产品审核' }, { id: 'release', title: '准备发布' }])
const done = ref([{ id: 'retro', title: '发布复盘' }])
const empty = ref<Record<string, unknown>[]>([])
const disabled = ref([{ id: 'locked', title: '锁定任务', disabled: true }])
const rejected = ref([{ id: 'blocked', title: '仅接收审计项' }])
const scrollSource = ref([{ id: 'scroll', title: '滚动任务' }])
const scrollTarget = ref<Record<string, unknown>[]>([])
const status = ref('等待交互；目标保持不变')
const todoUpdates = ref(0)
const todoChanges = ref(0)
const disabledUpdates = ref(0)
const disabledChanges = ref(0)
const rejectedUpdates = ref(0)
const rejectedChanges = ref(0)
</script>

<style>
.qg2-dnd-drop-list .aheart-dnd-sortable-list {
  min-height: 48px;
}
</style>

# DnD 拖拽 <span class="aheart-status aheart-status--ready">已完成</span>

`@aheart-ui/dnd` 基于 Pragmatic Drag and Drop 提供 Vue 受控拖拽能力。它不修改业务数据，所有排序和跨容器移动都通过 `v-model:items` 回传。

## 安装

```ts
import AheartDnd from '@aheart-ui/dnd'
import '@aheart-ui/dnd/style.css'

app.use(AheartDnd)
```

也可单独使用 `Draggable`、`DropZone`、`SortableList`、`SortableItem`、`DragOverlay` 与对应组合式 API。

## 交互工作台

<div v-if="mounted" data-testid="dnd-fixture" data-mounted="true" style="display: grid; gap: 8px; padding: 16px; border: 1px solid #d9e1ea; border-radius: 8px; background: #fff;">
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #536273; font-size: 13px;">
    <span>受控拖拽台 · Alt + ↑/↓ 支持键盘排序</span>
    <span data-testid="dnd-status" aria-live="polite" style="color: #1677ff;">{{ status }}</span>
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>待处理 <span data-testid="dnd-todo-count">{{ todo.length }}</span></strong>
      <div data-testid="dnd-todo-list"><ASortableList v-model:items="todo" item-key="id" group="tasks" @update:items="todoUpdates++" @change="todoChanges++; status = '同列表排序已更新'">
        <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px; background: #fff;">{{ item.title }}</div></template>
      </ASortableList><span data-testid="dnd-todo-events">update {{ todoUpdates }} / change {{ todoChanges }}</span></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>已完成 <span data-testid="dnd-done-count">{{ done.length }}</span></strong>
      <div data-testid="dnd-done-list"><ASortableList v-model:items="done" item-key="id" group="tasks" @change="status = '跨列表移动已更新'">
        <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px; background: #fff;">{{ item.title }}</div></template>
      </ASortableList></div>
    </section>
  </div>

  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>空列表 <span data-testid="dnd-empty-count">{{ empty.length }}</span></strong>
      <div data-testid="dnd-empty-list" class="qg2-dnd-drop-list"><ASortableList v-model:items="empty" item-key="id" group="tasks" @change="status = '空列表已接收条目'">
        <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px;">{{ item.title }}</div></template>
      </ASortableList></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>禁用目标 <span>{{ disabled.length }}</span></strong>
      <div data-testid="dnd-disabled-list"><ASortableList v-model:items="disabled" item-key="id" group="tasks" disabled @update:items="disabledUpdates++" @change="disabledChanges++">
        <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px; color: #8a96a3;">{{ item.title }}</div></template>
      </ASortableList><span data-testid="dnd-disabled-events">update {{ disabledUpdates }} / change {{ disabledChanges }}</span></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>父级拒绝 <span>{{ rejected.length }}</span></strong>
      <div data-testid="dnd-reject-list"><ASortableList v-model:items="rejected" item-key="id" group="audit" @update:items="rejectedUpdates++" @change="rejectedChanges++">
        <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px;">{{ item.title }}</div></template>
      </ASortableList><span data-testid="dnd-reject-events">update {{ rejectedUpdates }} / change {{ rejectedChanges }}</span></div>
    </section>
  </div>

  <div data-testid="dnd-scroll-region" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 112px; overflow: auto; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
    <div data-testid="dnd-scroll-source"><ASortableList v-model:items="scrollSource" item-key="id" group="scroll" @change="status = '嵌套滚动移动已更新'">
      <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px;">{{ item.title }}</div></template>
    </ASortableList></div>
    <div data-testid="dnd-scroll-target" class="qg2-dnd-drop-list"><ASortableList v-model:items="scrollTarget" item-key="id" group="scroll">
      <template #item="{ item }"><div style="padding: 8px; border: 1px solid #d9e1ea; border-radius: 4px;">{{ item.title }}</div></template>
    </ASortableList></div>
  </div>

  <div style="display: flex; gap: 8px;">
    <button type="button" @click="mounted = false">卸载 DnD</button>
  </div>
  <ADragOverlay />
</div>
<div v-else data-testid="dnd-fixture" data-mounted="false" style="display: grid; gap: 8px; padding: 16px; border: 1px dashed #d9e1ea; border-radius: 8px;">
  <span>DnD fixture 已卸载</span>
  <button type="button" @click="mounted = true">重新挂载 DnD</button>
</div>

```vue
<ASortableList v-model:items="items" item-key="id">
  <template #item="{ item }">{{ item.title }}</template>
</ASortableList>
<ADragOverlay />
```

拖动柄保持在条目本身，跨列表要求双方显式使用同一非空 `group`；示例还包含空列表、禁用列表、不同 `group` 的父级拒绝、嵌套滚动容器和卸载/重挂状态。

条目获得焦点后，可使用 `Alt + ArrowUp` 或 `Alt + ArrowDown` 完成同列表移动；组件会通过 live region 宣布结果。

## 跨容器移动

<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
  <ASortableList v-model:items="todo" item-key="id" group="tasks"><template #item="{ item }">{{ item.title }}</template></ASortableList>
  <ASortableList v-model:items="done" item-key="id" group="tasks"><template #item="{ item }">{{ item.title }}</template></ASortableList>
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
