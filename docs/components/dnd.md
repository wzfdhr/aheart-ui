<script setup lang="ts">
import { ref } from 'vue'

const mounted = ref(true)
const todo = ref([{ id: 'plan', title: '整理需求' }, { id: 'review', title: '产品审核' }, { id: 'release', title: '准备发布' }])
const done = ref([{ id: 'retro', title: '发布复盘' }])
const empty = ref<Record<string, unknown>[]>([])
const disabled = ref([{ id: 'locked', title: '锁定任务', disabled: true }])
const rejected = ref([{ id: 'blocked', title: '仅接收审计项' }])
const legacy = ref([{ id: 'legacy-a', title: '旧用法 A' }, { id: 'legacy-b', title: '旧用法 B' }, { id: 'legacy-c', title: '旧用法 C' }])
const scrollSource = ref(Array.from({ length: 12 }, (_, index) => ({ id: `scroll-${index + 1}`, title: `滚动任务 ${index + 1}` })))
const scrollTarget = ref<Record<string, unknown>[]>([])
const status = ref('可拖拽；禁用或分组不匹配时保持原位')
const todoUpdates = ref(0)
const todoChanges = ref(0)
const doneUpdates = ref(0)
const doneChanges = ref(0)
const emptyUpdates = ref(0)
const emptyChanges = ref(0)
const disabledUpdates = ref(0)
const disabledChanges = ref(0)
const rejectedUpdates = ref(0)
const rejectedChanges = ref(0)
const legacyUpdates = ref(0)
const legacyChanges = ref(0)
</script>

<style>
.qg2-dnd-drop-list .aheart-dnd-sortable-list {
  min-height: 48px;
}

.qg2-dnd-workbench .aheart-dnd-sortable-list {
  list-style: none !important;
}

.qg2-dnd-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 6px 8px;
  border: 1px solid #d9e1ea;
  border-radius: 4px;
  background: #fff;
}

.qg2-dnd-handle {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #c8d1dc;
  border-radius: 4px;
  color: #536273;
  background: #f7f9fb;
}

.qg2-dnd-handle:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 2px;
}

.qg2-dnd-item-body {
  min-width: 0;
}

.qg2-dnd-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.qg2-dnd-primary-grid,
.qg2-dnd-secondary-grid {
  display: grid;
  gap: 8px;
}

.qg2-dnd-primary-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.qg2-dnd-secondary-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.qg2-dnd-state-hint {
  display: block;
  color: #667085;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .qg2-dnd-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .qg2-dnd-primary-grid,
  .qg2-dnd-secondary-grid {
    grid-template-columns: minmax(0, 1fr);
  }
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

<div v-if="mounted" data-testid="dnd-fixture" data-mounted="true" class="aheart-demo-panel qg2-dnd-workbench" style="display: grid; gap: 8px;">
  <div class="qg2-dnd-toolbar" style="color: #536273; font-size: 13px;">
    <span>受控拖拽台 · 移动端使用拖动柄 · Alt + ↑/↓ 支持键盘排序</span>
    <span data-testid="dnd-status" aria-live="polite" style="color: #1677ff;">{{ status }}</span>
  </div>

  <div class="qg2-dnd-primary-grid">
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>待处理 <span data-testid="dnd-todo-count">{{ todo.length }}</span></strong>
      <div data-testid="dnd-todo-list"><ASortableList v-model:items="todo" item-key="id" group="tasks" @update:items="todoUpdates++" @change="todoChanges++; status = '同列表排序已更新'">
        <template #item="{ item, handleProps }"><div :data-item-id="item.id" class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList><span data-testid="dnd-todo-events">update {{ todoUpdates }} / change {{ todoChanges }}</span></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>已完成 <span data-testid="dnd-done-count">{{ done.length }}</span></strong>
      <div data-testid="dnd-done-list"><ASortableList v-model:items="done" item-key="id" group="tasks" @update:items="doneUpdates++" @change="doneChanges++; status = '跨列表移动已更新'">
        <template #item="{ item, handleProps }"><div :data-item-id="item.id" class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList><span data-testid="dnd-done-events">update {{ doneUpdates }} / change {{ doneChanges }}</span></div>
    </section>
  </div>

  <div class="qg2-dnd-secondary-grid">
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>空列表 <span data-testid="dnd-empty-count">{{ empty.length }}</span></strong>
      <div data-testid="dnd-empty-list" class="qg2-dnd-drop-list"><ASortableList v-model:items="empty" item-key="id" group="tasks" @update:items="emptyUpdates++" @change="emptyChanges++; status = '空列表已接收条目'">
        <template #item="{ item, handleProps }"><div :data-item-id="item.id" class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList><span data-testid="dnd-empty-events">update {{ emptyUpdates }} / change {{ emptyChanges }}</span></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>禁用目标 <span>{{ disabled.length }}</span></strong>
      <small data-testid="dnd-disabled-hint" class="qg2-dnd-state-hint">已禁用，不接收拖拽</small>
      <div data-testid="dnd-disabled-list"><ASortableList v-model:items="disabled" item-key="id" group="tasks" disabled @update:items="disabledUpdates++" @change="disabledChanges++">
        <template #item="{ item, handleProps }"><div class="qg2-dnd-item" style="color: #8a96a3;"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle" disabled><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList><span data-testid="dnd-disabled-events">update {{ disabledUpdates }} / change {{ disabledChanges }}</span></div>
    </section>
    <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
      <strong>父级拒绝 <span>{{ rejected.length }}</span></strong>
      <small data-testid="dnd-reject-hint" class="qg2-dnd-state-hint">仅接收 audit 分组</small>
      <div data-testid="dnd-reject-list"><ASortableList v-model:items="rejected" item-key="id" group="audit" @update:items="rejectedUpdates++" @change="rejectedChanges++">
        <template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList><span data-testid="dnd-reject-events">update {{ rejectedUpdates }} / change {{ rejectedChanges }}</span></div>
    </section>
  </div>

  <section style="display: grid; gap: 8px; padding: 8px; border: 1px solid #e5eaf0; border-radius: 6px;">
    <strong>旧用法桌面兼容</strong>
    <small class="qg2-dnd-state-hint">未绑定 handleProps；桌面仍可整项拖动，移动端正文保持原生滚动。</small>
    <div data-testid="dnd-legacy-list"><ASortableList v-model:items="legacy" item-key="id" @update:items="legacyUpdates++" @change="legacyChanges++">
      <template #item="{ item }"><div :data-item-id="item.id" class="qg2-dnd-item" style="grid-template-columns: minmax(0, 1fr);"><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
    </ASortableList><span data-testid="dnd-legacy-events">update {{ legacyUpdates }} / change {{ legacyChanges }}</span></div>
  </section>

  <div data-testid="dnd-scroll-outer" style="height: 160px; overflow: auto; border: 1px solid #e5eaf0; border-radius: 6px;">
    <div data-testid="dnd-scroll-region" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; height: 160px; overflow: auto; padding: 8px;">
      <div data-testid="dnd-scroll-source"><ASortableList v-model:items="scrollSource" item-key="id" group="scroll" @change="status = '嵌套滚动移动已更新'">
        <template #item="{ item, handleProps }"><div :data-item-id="item.id" class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList></div>
      <div data-testid="dnd-scroll-target" class="qg2-dnd-drop-list"><ASortableList v-model:items="scrollTarget" item-key="id" group="scroll">
        <template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span data-dnd-item-body class="qg2-dnd-item-body">{{ item.title }}</span></div></template>
      </ASortableList></div>
    </div>
    <div style="height: 220px; padding: 12px; color: #667085; font-size: 12px;">内层到达边界后继续滚动外层区域</div>
  </div>

  <div style="display: flex; gap: 8px;">
    <AButton size="small" @click="mounted = false">卸载 DnD</AButton>
  </div>
  <ADragOverlay />
</div>
<div v-else data-testid="dnd-fixture" data-mounted="false" class="aheart-demo-panel" style="display: grid; gap: 8px; border-style: dashed;">
  <span>DnD fixture 已卸载</span>
  <AButton size="small" @click="mounted = true">重新挂载 DnD</AButton>
</div>

```vue
<ASortableList v-model:items="items" item-key="id">
  <template #item="{ item, handleProps }">
    <div class="qg2-dnd-item">
      <button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle">
        <AIcon name="grip-vertical" :size="16" />
      </button>
      <span>{{ item.title }}</span>
    </div>
  </template>
</ASortableList>
<ADragOverlay />
```

`#item` 插槽提供 `{ item, index, handleProps }`。把 `handleProps` 完整绑定到一个可见按钮后，该按钮会成为桌面原生拖拽和移动触摸排序的唯一起手区；条目正文保持浏览器原生滚动。没有绑定 `handleProps` 的旧用法仍保留桌面整项拖拽，但移动端不会伪装成可触摸排序。

条目获得焦点后，可使用 `Alt + ArrowUp` 或 `Alt + ArrowDown` 完成同列表移动；组件会通过 live region 宣布结果。

## 跨容器移动

<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
  <ASortableList v-model:items="todo" item-key="id" group="tasks"><template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span>{{ item.title }}</span></div></template></ASortableList>
  <ASortableList v-model:items="done" item-key="id" group="tasks"><template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span>{{ item.title }}</span></div></template></ASortableList>
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

| `SortableList` 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `#item` | `{ item, index, handleProps }` | `handleProps` 绑定到单个拖动柄；仅该元素接管移动触摸，正文继续原生滚动。键盘用户聚焦条目后使用 `Alt + ArrowUp/ArrowDown`。 |

| 组合式 API | 说明 |
| --- | --- |
| `useDraggable` | 注册一个可拖动元素。 |
| `useDroppable` | 注册一个可放置元素。 |
| `useSortable` | 同时注册拖动源和放置目标；源数据为 `data`，目标数据使用 `dropData`。 |
