<script setup lang="ts">
import { createApp, h, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Draggable as D7Draggable, DropZone as D7DropZone, SortableList as D7SortableList } from '@aheart-ui/dnd'

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

const d7GenericDrops = ref(0)
const d7GenericKeyboardDrops = ref(0)
const d7GenericCancelReason = ref('')
const d7ScopeCancelReason = ref('')
const d7GenericDisabled = ref(false)
const d7Route = ref('d7-route-a')
const d7StaleRevision = ref(1)
const d7StaleSource = ref([{ id: 'stale-source', title: '过期源' }])
const d7StaleTarget = ref([{ id: 'stale-target', title: '过期目标' }])
const d7StaleUpdateCount = ref(0)
const d7StaleRejectReason = ref('')
const d7RollbackSource = ref([{ id: 'rollback-source', title: '待回滚源', note: '' }])
const d7RollbackTarget = ref([{ id: 'rollback-target', title: '目标保留字段', note: '' }])
const d7RollbackRejectReason = ref('')
const d7RollbackRejectCount = ref(0)
const d7RollbackEvents = ref<string[]>([])
const d7RollbackPayload = ref('')
const d7RollbackResult = ref('等待受控移动')
const d7RollbackField = ref('等待并发字段验证')
const d7RollbackProcess = ref('等待事务过程')
const d7DuplicateItems = ref([{ id: 'duplicate', title: '重复一' }, { id: 'duplicate', title: '重复二' }])
const d7DuplicateRejectReason = ref('')
const d7DuplicateUpdateCount = ref(0)
const d7LateMounted = ref(true)
const d7LateSession = ref(false)
const d7LateUpdates = ref(0)
const d7LateDrops = ref(0)
const d7OwnerFrame = ref<HTMLIFrameElement>()
const d7OwnerState = ref('ready')
const d7OwnerLiveCount = ref(0)
let d7OwnerApp: ReturnType<typeof createApp> | undefined

const d7RollbackSourceUpdate = () => undefined
const d7RollbackTargetUpdate = (next: Array<{ id: string; title: string; note?: string }>) => {
  d7RollbackTarget.value = next.map((item) => item.id === 'rollback-target' ? { ...item, note: 'concurrent' } : item)
  if (next.some((item) => item.id === 'rollback-target')) d7RollbackField.value = '并发字段：已保留'
}
const d7RollbackEvent = (event: { transactionId: string; itemKey: string; reason?: string }) => {
  if (event.reason) {
    d7RollbackRejectReason.value = event.reason
    d7RollbackRejectCount.value += 1
    d7RollbackResult.value = event.reason === 'parent-rejected' ? '结果：父层拒绝，列表已回滚' : `结果：移动被拒绝（${event.reason}）`
  }
  d7RollbackPayload.value = JSON.stringify(event)
}
const d7RollbackChange = (_items: unknown[], context?: { phase?: 'candidate' | 'rollback' }) => {
  if (context?.phase) {
    d7RollbackEvents.value = [...d7RollbackEvents.value, context.phase]
    d7RollbackProcess.value = context.phase === 'candidate' ? '事务过程：候选' : '事务过程：候选 → 回滚'
  }
}
const d7OwnerMountFrame = () => {
  const frame = d7OwnerFrame.value
  const ownerDocument = frame?.contentDocument
  if (!frame || !ownerDocument || d7OwnerApp) return
  ownerDocument.open()
  ownerDocument.write('<!doctype html><html><head><style>*{box-sizing:border-box}html,body{margin:0;padding:0;font:13px sans-serif}button{font:inherit}[data-testid="d7-iframe-scroll"] ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}[data-testid="d7-iframe-scroll"] li{list-style:none}.d7-iframe-row{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:8px;min-height:36px;padding:3px 4px;border:1px solid #d9e1ea;border-radius:4px;background:#fff}.d7-iframe-handle{min-width:56px;min-height:36px;padding:4px 8px;border:1px solid #b9c4d0;border-radius:4px;background:#f7f9fb;cursor:grab}.d7-iframe-handle:focus-visible{outline:2px solid #1677ff;outline-offset:2px}@media (pointer:coarse),(max-width:640px){.d7-iframe-row{min-height:40px}.d7-iframe-handle{min-height:40px}}<\\/style></head><body></body></html>')
  ownerDocument.close()
  const root = ownerDocument.createElement('div')
  root.setAttribute('data-testid', 'd7-owner-root')
  ownerDocument.body.append(root)
  const frameItems = ref(Array.from({ length: 10 }, (_, index) => ({ id: `iframe-${index + 1}`, title: `iframe 条目 ${index + 1}` })))
  d7OwnerApp = createApp({
    setup() {
      return () => h('div', { style: 'padding:8px;' }, [
        h('div', { 'data-testid': 'd7-iframe-scroll', style: 'height:100px;width:250px;overflow:auto;border:1px solid #b9c4d0;padding:4px;' }, [
          h(D7SortableList, {
            items: frameItems.value,
            itemKey: 'id',
            group: 'd7-iframe',
            label: 'iframe 列表',
            'onUpdate:items': (items: typeof frameItems.value) => { frameItems.value = items }
          }, {
            item: ({ item, handleProps }: { item: { id: string; title: string }; handleProps: Record<string, unknown> }) => h('div', { class: 'd7-iframe-row' }, [
              h('button', { ...handleProps, class: 'd7-iframe-handle', 'data-testid': 'd7-iframe-handle', type: 'button', 'aria-label': `拖动 ${item.title}` }, '抓取'),
              h('span', item.title)
            ])
          })
        ])
      ])
    }
  })
  d7OwnerApp.mount(root)
  d7OwnerLiveCount.value = 1
  d7OwnerState.value = 'mounted'
}
const d7OwnerUnmount = () => {
  const frame = d7OwnerFrame.value
  frame?.remove()
  d7OwnerApp?.unmount()
  d7OwnerApp = undefined
  d7OwnerLiveCount.value = 0
  d7OwnerState.value = 'detached'
}
const d7LateFinish = () => {
  if (!d7LateSession.value || d7LateMounted.value) return
  d7LateSession.value = false
}
onBeforeUnmount(() => {
  d7OwnerApp?.unmount()
  d7OwnerApp = undefined
})
onMounted(() => {
  void nextTick(() => {
    if (d7OwnerFrame.value?.contentDocument?.readyState === 'complete') d7OwnerMountFrame()
  })
})
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

.d7-primary-grid,
.d7-generic-grid,
.d7-sortable-grid {
  display: grid;
  gap: 8px;
}

.d7-primary-grid,
.d7-generic-grid,
.d7-sortable-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.d7-card {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 8px;
  border: 1px solid #e5eaf0;
  border-radius: 6px;
}

.d7-sortable-grid .aheart-dnd-sortable-list {
  min-height: 42px;
}

.d7-generic-grid .aheart-dnd-draggable,
.d7-generic-grid .aheart-dnd-drop-zone {
  min-height: 42px;
  padding: 8px;
  border: 1px solid #d9e1ea;
  border-radius: 4px;
}

.d7-generic-grid .aheart-dnd-draggable {
  background: #f7f9fb;
}

.d7-generic-grid .aheart-dnd-drop-zone {
  background: #fff;
}

.d7-generic-grid .aheart-dnd-keyboard-compatible {
  outline: 2px solid #52c41a;
  outline-offset: 1px;
}

.d7-generic-grid .aheart-dnd-draggable.aheart-dnd-keyboard-grabbed {
  border-color: #1677ff;
  background: #e6f4ff;
}

.d7-generic-grid .aheart-dnd-drop-zone.aheart-dnd-keyboard-compatible {
  border-color: #52c41a;
  background: #f6ffed;
}

.d7-generic-grid .aheart-dnd-drop-zone.aheart-dnd-keyboard-incompatible {
  border-color: #d9d9d9;
  background: #fafafa;
}

.d7-generic-grid .aheart-dnd-drop-zone[aria-disabled='true'] {
  border-color: #d9d9d9;
  background: #f5f5f5;
  color: #8c8c8c;
}

.d7-help,
.d7-status-line {
  color: #536273;
  font-size: 13px;
  line-height: 1.5;
}

.d7-status-line {
  display: grid;
  gap: 3px;
  padding: 8px;
  border: 1px solid #e5eaf0;
  border-radius: 4px;
  background: #fbfcfe;
}

.d7-visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.d7-audit-details {
  color: #667085;
  font-size: 12px;
}

.d7-audit-details pre {
  max-width: 100%;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.d7-inline-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.d7-inline-items > * {
  min-width: 0;
}

.d7-owner-frame {
  width: 100%;
  height: 150px;
  border: 1px solid #d9e1ea;
}

@media (max-width: 640px) {
  .d7-primary-grid,
  .d7-generic-grid,
  .d7-sortable-grid {
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
    <span>受控拖拽台 · 移动端使用拖动柄 · Alt + 方向键支持键盘排序</span>
    <span data-testid="dnd-status" aria-live="polite" style="color: #0958d9;">{{ status }}</span>
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

## D7 闭环夹具

<div data-testid="d7-fixture" class="aheart-demo-panel" style="display:grid;gap:10px;">
  <div class="d7-card">
    <strong>通用键盘取放</strong>
    <span class="d7-help">键盘说明：Tab 聚焦目标，Space/Enter 抓取或放置，Escape 取消并恢复来源焦点。</span>
    <div class="d7-generic-grid d7-primary-grid">
      <D7Draggable data-testid="d7-generic-source" :data="{ type: 'task', id: 'd7-task', label: '任务源' }" label="任务源" :scope-key="d7Route" @keyboard-cancel="event => d7GenericCancelReason = event.reason">任务源</D7Draggable>
      <D7DropZone data-testid="d7-generic-accepted" :data="{ type: 'inbox' }" accept="task" label="任务收件箱" :scope-key="d7Route" @drop="d7GenericDrops++" @keyboard-drop="d7GenericKeyboardDrops++">任务收件箱</D7DropZone>
      <D7DropZone data-testid="d7-generic-mismatch" :data="{ type: 'note' }" accept="note" label="笔记区" :scope-key="d7Route">笔记区（类型不匹配）</D7DropZone>
      <D7DropZone data-testid="d7-generic-disabled" :data="{ type: 'inbox' }" accept="task" :label="d7GenericDisabled ? '备用收件箱（已禁用）' : '备用收件箱'" :scope-key="d7Route" :disabled="d7GenericDisabled">{{ d7GenericDisabled ? '备用收件箱（已禁用）' : '备用收件箱' }}</D7DropZone>
    </div>
    <div class="d7-status-line">
      <span data-testid="d7-generic-drop-count">成功放置：{{ d7GenericDrops }} 次</span>
      <span data-testid="d7-generic-keyboard-drop-count">键盘放置：{{ d7GenericKeyboardDrops }} 次</span>
      <span data-testid="d7-generic-cancel-reason">取消状态：{{ d7GenericCancelReason === 'cancelled' ? '已取消' : d7GenericCancelReason === 'scope-changed' ? '已因页面切换取消' : d7GenericCancelReason || '未取消' }}</span>
      <span data-testid="d7-generic-cancel-reason-code" class="d7-visually-hidden">{{ d7GenericCancelReason }}</span>
    </div>
    <button data-testid="d7-generic-disable-toggle" type="button" @click="d7GenericDisabled = true">将备用收件箱设为禁用</button>
  </div>

  <div class="d7-card">
    <strong>稳定版本与受控事务</strong>
    <div class="d7-sortable-grid">
      <div data-testid="d7-stale-source" class="d7-card">
        <D7SortableList v-model:items="d7StaleSource" item-key="id" group="d7-stale" :revision="d7StaleRevision" label="过期源" @update:items="d7StaleUpdateCount++" @move-reject="event => d7StaleRejectReason = event.reason">
          <template #item="{ item, handleProps }"><div :data-item-id="item.id"><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
        </D7SortableList>
      </div>
      <div data-testid="d7-stale-target" class="d7-card">
        <D7SortableList v-model:items="d7StaleTarget" item-key="id" group="d7-stale" :revision="d7StaleRevision" label="过期目标">
          <template #item="{ item, handleProps }"><div :data-item-id="item.id"><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
        </D7SortableList>
      </div>
      <button data-testid="d7-stale-refresh" type="button" @click="d7StaleRevision++; d7StaleSource = d7StaleSource.map(item => ({ ...item }))">刷新 revision</button>
      <span data-testid="d7-stale-reject-reason">过期拒绝原因：{{ d7StaleRejectReason || '等待验证' }}</span>
      <span data-testid="d7-stale-update-count">过期更新次数：{{ d7StaleUpdateCount }}</span>
    </div>
    <div class="d7-sortable-grid">
      <div data-testid="d7-rollback-source" class="d7-card">
        <D7SortableList :items="d7RollbackSource" item-key="id" group="d7-rollback" label="回滚源" :scope-key="d7Route" @update:items="d7RollbackSourceUpdate" @change="d7RollbackChange" @move-reject="d7RollbackEvent">
          <template #item="{ item, handleProps }"><div :data-item-id="item.id"><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
        </D7SortableList>
      </div>
      <div data-testid="d7-rollback-target" class="d7-card">
        <D7SortableList :items="d7RollbackTarget" item-key="id" group="d7-rollback" label="回滚目标" :scope-key="d7Route" @update:items="d7RollbackTargetUpdate" @change="d7RollbackChange" @move-reject="d7RollbackEvent">
          <template #item="{ item, handleProps }"><div :data-item-id="item.id"><button v-bind="handleProps" type="button">{{ item.title }} <span v-if="item.note" data-testid="d7-rollback-target-concurrent" class="d7-visually-hidden">{{ item.note }}</span></button></div></template>
        </D7SortableList>
      </div>
    </div>
    <div class="d7-status-line">
      <span data-testid="d7-rollback-result">{{ d7RollbackResult }}</span>
      <span data-testid="d7-rollback-field">{{ d7RollbackField }}</span>
      <span data-testid="d7-rollback-process">{{ d7RollbackProcess }}</span>
    </div>
    <details class="d7-audit-details">
      <summary>展开事务审计数据</summary>
      <span data-testid="d7-rollback-reject-reason">{{ d7RollbackRejectReason }}</span>
      <span data-testid="d7-rollback-reject-count">{{ d7RollbackRejectCount }}</span>
      <span data-testid="d7-rollback-events">{{ d7RollbackEvents.join(',') }}</span>
      <pre data-testid="d7-rollback-payload">{{ d7RollbackPayload }}</pre>
    </details>
    <div data-testid="d7-duplicate-list" class="d7-card">
      <D7SortableList :items="d7DuplicateItems" item-key="id" group="d7-duplicate" label="重复键列表" @update:items="d7DuplicateUpdateCount++" @move-reject="event => d7DuplicateRejectReason = event.reason">
        <template #item="{ item, handleProps }"><div :data-item-id="item.id"><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
      </D7SortableList>
    </div>
    <span data-testid="d7-duplicate-reject-reason">重复键结果：{{ d7DuplicateRejectReason === 'duplicate-key' ? '已安全拒绝（键重复）' : d7DuplicateRejectReason || '等待验证' }}</span>
    <span data-testid="d7-duplicate-reject-reason-code" class="d7-visually-hidden">{{ d7DuplicateRejectReason }}</span>
    <span data-testid="d7-duplicate-update-count">重复键更新次数：{{ d7DuplicateUpdateCount }}</span>
  </div>

  <div class="d7-card">
    <strong>路由 scopeKey 与迟到回调</strong>
    <D7Draggable data-testid="d7-scope-source" :data="{ type: 'route-task' }" label="路由任务" :scope-key="d7Route" @keyboard-cancel="event => d7ScopeCancelReason = event.reason">路由任务</D7Draggable>
    <D7SortableList :items="d7StaleSource" item-key="id" group="d7-scope" :scope-key="d7Route" @update:items="d7StaleUpdateCount++">
      <template #item="{ item, handleProps }"><div><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
    </D7SortableList>
    <button data-testid="d7-scope-navigate" type="button" @click="d7Route = 'd7-route-b'">导航到下一页</button>
    <span data-testid="d7-scope-cancel-reason">路由取消状态：{{ d7ScopeCancelReason === 'scope-changed' ? '已因页面切换取消' : d7ScopeCancelReason || '未取消' }}</span>
    <span data-testid="d7-scope-cancel-reason-code" class="d7-visually-hidden">{{ d7ScopeCancelReason }}</span>
    <span data-testid="d7-scope-update-count">路由更新次数：{{ d7StaleUpdateCount }}</span>
    <div v-if="d7LateMounted" data-testid="d7-late-list">
      <D7SortableList :items="d7StaleTarget" item-key="id" group="d7-late" @update:items="d7LateUpdates++" @change="d7LateDrops++">
        <template #item="{ item, handleProps }"><div><button v-bind="handleProps" type="button">{{ item.title }}</button></div></template>
      </D7SortableList>
    </div>
    <button data-testid="d7-late-drop-start" type="button" @click="d7LateSession = true">开始迟到 drop</button>
    <button data-testid="d7-late-drop-unmount" type="button" @click="d7LateMounted = false">卸载列表</button>
    <button data-testid="d7-late-drop-finish" type="button" @click="d7LateFinish">完成迟到 drop</button>
    <span data-testid="d7-late-drop-result">迟到 drop 结果：更新 {{ d7LateUpdates }} 次；drop {{ d7LateDrops }} 次</span>
  </div>

  <div class="d7-card">
    <strong>iframe owner realm 嵌套自动滚动</strong>
    <iframe ref="d7OwnerFrame" data-testid="d7-owner-iframe" class="d7-owner-frame" title="D7 owner realm" src="about:blank" @load="d7OwnerMountFrame"></iframe>
    <button data-testid="d7-owner-unmount" type="button" @click="d7OwnerUnmount">卸载 iframe</button>
    <span data-testid="d7-owner-state">iframe 状态：{{ d7OwnerState === 'detached' ? '已分离' : d7OwnerState === 'mounted' ? '已挂载' : '准备中' }}</span>
    <span data-testid="d7-owner-state-code" class="d7-visually-hidden">{{ d7OwnerState }}</span>
    <span data-testid="d7-owner-live-count">owner live region：{{ d7OwnerLiveCount ? '已创建' : '已释放' }}</span>
  </div>
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

条目获得焦点后，可使用 `Alt + ArrowUp` 或 `Alt + ArrowDown` 完成同列表移动；使用 `Alt + ArrowLeft` 或 `Alt + ArrowRight` 会在注册顺序中移入上一个或下一个同 `group`、未禁用的列表。组件会通过 live region 宣布结果，并将焦点恢复到目标条目或拖动柄。

## 跨容器移动

<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
  <ASortableList v-model:items="todo" item-key="id" group="tasks"><template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span>{{ item.title }}</span></div></template></ASortableList>
  <ASortableList v-model:items="done" item-key="id" group="tasks"><template #item="{ item, handleProps }"><div class="qg2-dnd-item"><button v-bind="handleProps" type="button" :aria-label="`拖动 ${item.title}`" class="qg2-dnd-handle"><AIcon name="grip-vertical" :size="16" /></button><span>{{ item.title }}</span></div></template></ASortableList>
</div>

跨容器移动必须为两个列表显式设置相同且非空的 `group`；未设置 `group` 的列表仅支持自身排序，不会彼此接收条目。不同 `group` 会拒绝放置。

## API

| 组件 | 说明 |
| --- | --- |
| `Draggable` | 将插槽内容注册为可拖动元素，`data` 必须包含业务拖拽数据；`disabled` 可禁用拖动。`keyboard` 默认开启，Space/Enter 抓取、Escape 取消；`label` 用于播报，`scopeKey` 用于路由生命周期隔离。 |
| `DropZone` | 放置区域，`accept` 可限制允许的 `data.type`；`disabled` 可禁用放置。`keyboard` 默认开启，类型不匹配或禁用目标会保留焦点但拒绝放置并播报原因；`label` 与 `scopeKey` 必须与来源一致才可键盘取放。 |
| `SortableList` | 受控排序列表，使用 `v-model:items`、必填 `item-key` 与可选 `group`；`revision` 用于服务端刷新后的过期拖放拒绝，`label`/`item-label` 用于播报，`scope-key` 用于复用路由取消旧会话。跨容器时必须为双方设置相同的非空 `group`，`disabled` 可禁用排序与接收。 |
| `SortableItem` | `SortableList` 内部条目；也可用于定制条目结构。 |
| `DragOverlay` | 在拖动期间展示可自定义的浮层内容。 |

| `SortableList` 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `#item` | `{ item, index, handleProps }` | `handleProps` 绑定到单个拖动柄；仅该元素接管移动触摸，正文继续原生滚动。键盘用户聚焦条目后使用 `Alt + ArrowUp/ArrowDown` 排序，或以 `Alt + ArrowLeft/ArrowRight` 移入相邻兼容列表。 |

| 组合式 API | 说明 |
| --- | --- |
| `useDraggable` | 注册一个可拖动元素。 |
| `useDroppable` | 注册一个可放置元素。 |
| `useSortable` | 同时注册拖动源和放置目标；源数据为 `data`，目标数据使用 `dropData`。 |

`SortableList` 的 `moveStart`、`moveCommit` 与 `moveReject` 事件都携带稳定 `transactionId`、`sessionId`、`input`、`itemKey`、源/目标位置和 revision；`moveReject` 额外携带 `reason`。受控父层必须在 `update:items` 处理器中同步接受或拒绝候选数组，单侧拒绝时组件会等待回滚并保留并发字段更新。`change(items, context?)` 的第一个参数保持原有兼容性，第二个参数可用于审计 `candidate` 与 `rollback` 阶段。

`Draggable` 可监听 `keyboardGrab`、`keyboardCancel`，`DropZone` 可监听 `keyboardDrop`；这些事件的首参数是稳定的 session、来源、目标和 scope payload。每个 owner document 只创建一个 polite live region；同源 iframe 使用自身 owner document 的键盘、公告和自动滚动资源，iframe 卸载或路由 `scopeKey` 变化会取消迟到会话。
