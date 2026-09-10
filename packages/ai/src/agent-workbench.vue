<template>
  <section class="aheart-ai-workbench" aria-label="AI 工作台">
    <header class="aheart-ai-workbench__header">
      <div>
        <span class="aheart-ai-workbench__eyebrow">智能工作区</span>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="aheart-ai-workbench__header-status">
        <span data-workbench-status :class="`is-${workbenchStatus.key}`">{{ workbenchStatus.label }}</span>
        <small class="aheart-ai-workbench__progress">{{ completedTaskCount }} / {{ tasks.length }} 已完成</small>
        <button
          v-if="pendingApprovalCount > 0"
          type="button"
          data-pending-approval-summary
          class="aheart-ai-workbench__pending-summary"
          :aria-label="pendingApprovalSummary"
          @click="openPendingApproval"
        >
          {{ pendingApprovalSummary }}
        </button>
      </div>
    </header>
    <div class="aheart-ai-workbench__desktop">
      <ASplitter :sizes="panelSizes" :default-sizes="[150, 'auto', 200]" @update:sizes="emit('update:panelSizes', $event)">
        <ASplitterPanel :min="140" collapsible>
          <aside class="aheart-ai-workbench__sidebar">
            <h2>会话</h2>
            <AIConversations :model-value="activeConversation" :conversations="conversations" @update:model-value="emit('update:activeConversation', $event)" />
            <section v-if="contextItems.length" class="aheart-ai-workbench__context" aria-label="上下文">
              <h3>上下文</h3>
            <ASortableList :items="sortableContext" item-key="id" :group="`agent-context-${scopeId}`" :disabled="disabled" @update:items="updateContext">
                <template #item="{ item, index }">
                  <div class="aheart-ai-workbench__context-item" :data-context-id="asContext(item).id">
                    <span>{{ asContext(item).label }}</span>
                    <small v-if="asContext(item).description">{{ asContext(item).description }}</small>
                    <div class="aheart-ai-workbench__move-actions">
                      <AButton type="text" :disabled="isContextMoveDisabled(index, -1)" @click="moveContext(index, -1)">上移</AButton>
                      <AButton type="text" :disabled="isContextMoveDisabled(index, 1)" @click="moveContext(index, 1)">下移</AButton>
                    </div>
                  </div>
                </template>
              </ASortableList>
            </section>
          </aside>
        </ASplitterPanel>
        <ASplitterPanel :min="230">
          <main class="aheart-ai-workbench__chat">
            <Teleport v-if="transport" :to="layoutReady ? mobileChatTarget : `#${chatTargetId}`" :disabled="!layoutReady || !isMobile || mobileView !== 'chat' || (!mobileChatTarget && layoutReady)">
            <AIChatPanel
              key="chat-owner"
              v-if="transport"
              v-bind="chatMessageProps"
              :transport="transport"
              :conversation-id="activeConversation"
              :prompts="prompts"
              :disabled="disabled"
              @update:messages="emit('update:messages', $event)"
              @error="emit('error', $event)"
              @stop="emit('stop')"
              @retry="emit('chat-retry', $event)"
              @regenerate="emit('chat-regenerate', $event)"
              @edit="forwardChatEdit"
              @copy="emit('chat-copy', $event)"
            />
            </Teleport>
          <p v-if="!transport" class="aheart-ai-workbench__empty">业务层尚未提供对话传输适配器。</p>
            <slot name="sources" :sources="sources"><AISources :sources="sources" /></slot>
            <slot name="attachments" :attachments="attachments"><AIAttachments :items="attachments" /></slot>
          </main>
        </ASplitterPanel>
        <ASplitterPanel :min="180" collapsible>
          <aside class="aheart-ai-workbench__execution" aria-label="执行与产物">
            <Teleport :to="layoutReady ? mobileExecutionTarget : `#${executionTargetId}`" :disabled="!layoutReady || !isMobile || mobileView !== 'execution' || !mobileExecutionTarget">
            <AgentExecution
              key="execution-owner"
              :tasks="tasks"
              :artifacts="artifacts"
              :active-artifact="activeArtifact"
              :disabled="disabled"
              :reorderable="reorderable"
              :tasks-revision="tasksRevision"
              :scope-key="scopeId"
              :action-disabled="isActionDisabled"
              :operation-messages="operationMessages"
              :validate-candidate="validateTaskCandidate"
              @update:tasks="handleTaskCandidate"
              @approve="handleAction('approve', $event)"
              @reject="handleAction('reject', $event)"
              @cancel="handleAction('cancel', $event)"
              @retry="handleAction('retry', $event)"
              @move-task="forwardMoveTask"
              @move-task-reject="emit('task-move-reject', $event)"
              @select-artifact="emit('update:activeArtifact', $event.id)"
            >
              <template v-if="$slots.task" #task="{ task, index }"><slot name="task" :task="task" :index="index" /></template>
              <template v-if="$slots.artifact" #artifact="{ artifact }"><slot name="artifact" :artifact="artifact" /></template>
              <template v-if="$slots['artifact-preview']" #artifact-preview="{ artifact }"><slot name="artifact-preview" :artifact="artifact" /></template>
            </AgentExecution>
            </Teleport>
            <p v-if="taskOrderError" class="aheart-ai-workbench__task-order-error" role="alert">无法排序：{{ taskOrderError }}</p>
          </aside>
        </ASplitterPanel>
      </ASplitter>
    </div>

    <div class="aheart-ai-workbench__mobile">
      <ATabs :items="mobileTabs" :active-key="tabKey(mobileView)" @update:active-key="mobileView = String($event).split('--')[0]" />
      <section v-show="mobileView === 'conversations'" class="aheart-ai-workbench__mobile-panel">
        <AIConversations :model-value="activeConversation" :conversations="conversations" @update:model-value="emit('update:activeConversation', $event)" />
        <section v-if="contextItems.length" class="aheart-ai-workbench__context" aria-label="上下文">
          <h3>上下文</h3>
            <div class="aheart-ai-workbench__context-list-mobile">
            <template v-for="(item, index) in sortableContext" :key="asContext(item).id">
              <div class="aheart-ai-workbench__context-item" :data-context-id="asContext(item).id">
                <span>{{ asContext(item).label }}</span>
                <small v-if="asContext(item).description">{{ asContext(item).description }}</small>
                <div class="aheart-ai-workbench__move-actions">
                  <AButton type="text" :disabled="isContextMoveDisabled(index, -1)" @click="moveContext(index, -1)">上移</AButton>
                  <AButton type="text" :disabled="isContextMoveDisabled(index, 1)" @click="moveContext(index, 1)">下移</AButton>
                </div>
              </div>
            </template>
            </div>
        </section>
      </section>
      <section v-show="mobileView === 'chat'" class="aheart-ai-workbench__mobile-panel">
        <div class="aheart-ai-workbench__mobile-panel--chat"><div :id="`${scopeId}-chat-target`" ref="mobileChatTarget" class="aheart-ai-workbench__mobile-owner-target"></div></div>
        <p v-if="!transport" class="aheart-ai-workbench__empty">业务层尚未提供对话传输适配器。</p>
        <slot name="sources" :sources="sources"><AISources :sources="sources" /></slot>
        <slot name="attachments" :attachments="attachments"><AIAttachments :items="attachments" /></slot>
      </section>
      <section v-show="mobileView === 'execution'" class="aheart-ai-workbench__mobile-panel">
        <AButton data-action="open-execution-drawer" type="primary" @click="executionDrawerOpen = true">查看执行与产物</AButton>
      </section>
      <ADrawer v-model:open="executionDrawerOpen" title="执行与产物" :get-container="false" :force-render="clientMounted" :destroy-on-close="false" placement="right">
        <div :id="executionTargetId" ref="mobileExecutionTarget" class="aheart-ai-workbench__mobile-owner-target"></div>
      </ADrawer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, h, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, ref, useId, watch } from 'vue'
import { Button as AButton, Drawer as ADrawer, Splitter as ASplitter, SplitterPanel as ASplitterPanel, Tabs as ATabs } from 'aheart-ui'
import { SortableList as ASortableList } from '@aheart-ui/dnd'
import AIAttachments from './attachments.vue'
import AIChatPanel from './chat-panel.vue'
import AIConversations from './conversations.vue'
import AISources from './sources.vue'
import AgentExecution from './agent-execution.vue'
import type { AIAgentActionHandler, AIAgentArtifact, AIAgentContextItem, AIAgentOperationAction, AIAgentOperationRequest, AIAgentTask, AIAttachment, AIConversation, AIMessage, AIPrompt, AISource, AITransport, AITransportV2 } from './types'

defineOptions({ name: 'AAIAgentWorkbench' })

type WorkbenchPanelSize = number | `${number}%` | 'auto'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  panelSizes?: WorkbenchPanelSize[]
  conversations?: AIConversation[]
  activeConversation?: string
  messages?: AIMessage[]
  prompts?: AIPrompt[]
  transport?: AITransport | AITransportV2
  tasks?: AIAgentTask[]
  contextItems?: AIAgentContextItem[]
  sources?: AISource[]
  attachments?: AIAttachment[]
  artifacts?: AIAgentArtifact[]
  activeArtifact?: string
  disabled?: boolean
  actionHandler?: AIAgentActionHandler
  reorderable?: boolean
  tasksRevision?: string | number
  scopeKey?: string | number
}>(), {
  title: 'AI 工作台',
  description: '编排对话、任务、审批与产物。',
  panelSizes: () => [150, 'auto', 200],
  conversations: () => [],
  activeConversation: undefined,
  messages: () => [],
  prompts: () => [],
  transport: undefined,
  tasks: () => [],
  contextItems: () => [],
  sources: () => [],
  attachments: () => [],
  artifacts: () => [],
  activeArtifact: undefined,
  disabled: false
  ,reorderable: true
  ,tasksRevision: undefined
  ,scopeKey: undefined
})

const emit = defineEmits<{
  'update:panelSizes': [sizes: number[]]
  'update:activeConversation': [key: string]
  'update:messages': [messages: AIMessage[]]
  'update:activeArtifact': [id: string]
  'update:tasks': [tasks: AIAgentTask[]]
  'update:contextItems': [items: AIAgentContextItem[]]
  approve: [task: AIAgentTask]
  reject: [task: AIAgentTask]
  cancel: [task: AIAgentTask]
  retry: [task: AIAgentTask]
  'move-task': [id: string, direction: 'up' | 'down']
  'move-context': [id: string, direction: 'up' | 'down']
  stop: []
  'chat-retry': [message: AIMessage]
  'chat-regenerate': [message: AIMessage]
  'chat-edit': [message: AIMessage, content: string]
  'chat-copy': [message: AIMessage]
  error: [message: string]
  'operation-start': [request: AIAgentOperationRequest]
  'operation-success': [request: AIAgentOperationRequest]
  'operation-error': [request: AIAgentOperationRequest, message: string]
  'task-move-reject': [reason: string]
}>()

const mobileView = ref('chat')
const executionDrawerOpen = ref(false)
const mobileChatTarget = ref<HTMLElement>()
const mobileExecutionTarget = ref<HTMLElement>()
const clientMounted = ref(false)
const layoutReady = ref(false)
const isMobile = ref(false)
let mediaQuery: MediaQueryList | undefined
let mediaListener: ((event: MediaQueryListEvent) => void) | undefined
const instance = getCurrentInstance()
const instanceScope = `scope-${useId().replace(/[^a-zA-Z0-9_-]/g, '-')}`
const ownerId = instanceScope.replace(/^scope-/, '')
const chatTargetId = `aheart-ai-${ownerId}-chat-target`
const executionTargetId = `aheart-ai-${ownerId}-execution-target`
const scopeId = computed(() => props.scopeKey === undefined ? instanceScope : `scope-${String(props.scopeKey).replace(/[^a-zA-Z0-9_-]/g, '-')}-${instanceScope.replace(/^scope-/, '')}`)
onMounted(async () => {
  clientMounted.value = true
  const ownerDocument = (instance?.proxy?.$el as HTMLElement | undefined)?.ownerDocument
  const ownerWindow = ownerDocument?.defaultView
  if (ownerWindow?.matchMedia) {
    mediaQuery = ownerWindow.matchMedia('(max-width: 760px)')
    isMobile.value = mediaQuery.matches
    mediaListener = (event) => { isMobile.value = event.matches }
    mediaQuery.addEventListener?.('change', mediaListener)
  } else isMobile.value = true
  layoutReady.value = true
  await nextTick()
})
onBeforeUnmount(() => { if (mediaQuery && mediaListener) mediaQuery.removeEventListener?.('change', mediaListener) })
watch(isMobile, (mobile) => { if (!mobile) executionDrawerOpen.value = false })
type OperationState = { status: 'pending' | 'success' | 'error'; operationId: string; idempotencyKey: string; action: AIAgentOperationAction; message?: string; outcome?: 'not-applied' | 'unknown'; taskRevision: string | number; taskStatus?: AIAgentTask['status']; approvalStatus?: string; approvalId?: string; artifactId?: string; artifactRevision?: string | number; conversationId?: string }
const operations = ref<Record<string, OperationState>>({})
const operationControllers = new Map<string, AbortController>()
const idempotency = new Map<string, string>()
let operationCounter = 0
const inFlightKeys = new Set<string>()
const readMessagesPresence = () => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'messages')
const hasMessagesProp = ref(readMessagesPresence())
onBeforeUpdate(() => {
  hasMessagesProp.value = readMessagesPresence()
})
const chatMessageProps = computed(() => (hasMessagesProp.value
  ? { messages: props.messages }
  : { defaultMessages: props.messages }))
const pendingApprovalTasks = computed(() => props.tasks.filter((task) =>
  task.approval && (!task.approval.status || task.approval.status === 'pending')
))
const pendingApprovalCount = computed(() => pendingApprovalTasks.value.length)
const pendingApprovalSummary = computed(() => {
  const task = pendingApprovalTasks.value[0]
  const artifact = props.artifacts.find((item) => item.id === task?.approval?.artifactId)
  if (!artifact) return `${pendingApprovalCount.value} 项待审批`
  const prefix = pendingApprovalCount.value > 1 ? `${pendingApprovalCount.value} 项待审批` : '待审批'
  return `${prefix}：${artifact.title}`
})
const openPendingApproval = () => {
  mobileView.value = 'execution'
  executionDrawerOpen.value = true
}
const mobileTabs = computed(() => [
  { key: tabKey('conversations'), label: '会话' },
  { key: tabKey('chat'), label: '对话' },
  {
    key: tabKey('execution'),
    label: h('span', { class: 'aheart-ai-workbench__mobile-tab-label' }, [
      h('span', '执行'),
      pendingApprovalCount.value > 0
        ? h('span', { class: 'aheart-ai-workbench__pending-badge', 'aria-label': `${pendingApprovalCount.value} 项待审批` }, String(pendingApprovalCount.value))
        : null
    ])
  }
])
const tabKey = (key: string) => `${key}--${ownerId}`
const operationMessages = computed(() => Object.fromEntries(Object.entries(operations.value).map(([key, value]) => [key, value.message ?? (value.status === 'pending' ? '处理中…' : value.status === 'success' ? '成功' : '')])))
const operationKey = (task: AIAgentTask) => `${task.id}:${String(task.revision ?? '')}:${task.approval?.id ?? ''}`
const isActionDisabled = (task: AIAgentTask, action: string) => {
  const key = operationKey(task)
  const current = operations.value[key]
  if (inFlightKeys.has(key) || [...inFlightKeys].some((entry) => entry.startsWith(`${task.id}:`)) || current?.status === 'pending' || current?.status === 'success') return true
  if (props.disabled) return true
  if (props.actionHandler && task.revision === undefined) return true
  if (!task.approval) {
    if (current?.status === 'error') return action !== 'retry'
    return !((task.status === 'running' && action === 'cancel') || (task.status === 'error' && action === 'retry'))
  }
  if (current?.status === 'error' && current.outcome !== 'not-applied' && action !== 'retry') return true
  if (props.actionHandler && (task.revision === undefined || (task.approval.artifactId && (!props.artifacts.find((item) => item.id === task.approval?.artifactId) || props.artifacts.some((item) => item.id === task.approval?.artifactId && item.revision === undefined))))) return true
  const disabled = task.status === 'running' && action !== 'cancel'
  return disabled
}
const handleAction = async (action: AIAgentOperationAction, task: AIAgentTask) => {
  if (isActionDisabled(task, action)) return
  if (!props.actionHandler) {
    if (action === 'approve') emit('approve', task)
    else if (action === 'reject') emit('reject', task)
    else if (action === 'cancel') emit('cancel', task)
    else emit('retry', task)
    return
  }
  const artifact = task.approval?.artifactId ? props.artifacts.find((item) => item.id === task.approval?.artifactId) : undefined
  const key = operationKey(task)
  const previous = operations.value[key]
  if (previous?.status === 'error' && previous.outcome === 'not-applied') idempotency.delete(key)
  const idemKey = idempotency.get(key) ?? `${key}:${Date.now()}:${++operationCounter}`
  idempotency.set(key, idemKey)
  const request: AIAgentOperationRequest = {
    operationId: `${idemKey}:attempt-${++operationCounter}`,
    idempotencyKey: idemKey,
    conversationId: props.activeConversation,
    taskId: task.id,
    taskRevision: task.revision!,
    action: previous?.status === 'error' && previous.outcome === 'unknown' && action === 'retry' ? previous.action : action,
    ...(task.approval?.id ? { approvalId: task.approval.id } : {}),
    artifactId: task.approval?.artifactId ?? artifact?.id,
    ...(artifact?.revision === undefined ? {} : { artifactRevision: artifact.revision })
  }
  const controller = new AbortController()
  inFlightKeys.add(key)
  operationControllers.set(key, controller)
  operations.value = { ...operations.value, [key]: { status: 'pending', operationId: request.operationId, idempotencyKey: idemKey, action: request.action, taskRevision: task.revision!, taskStatus: task.status, approvalStatus: task.approval?.status, approvalId: task.approval?.id, artifactId: artifact?.id ?? task.approval?.artifactId, artifactRevision: artifact?.revision, conversationId: props.activeConversation } }
  emit('operation-start', request)
  try {
    const result = await props.actionHandler(request, controller.signal)
    const current = operations.value[key]
    if (controller.signal.aborted || !current || current.operationId !== request.operationId) return
    if (result.operationId !== request.operationId) return
    if (result.status === 'success') {
      operations.value = { ...operations.value, [key]: { ...current, status: 'success', message: '成功' } }
      emit('operation-success', request)
    } else {
      operations.value = { ...operations.value, [key]: { ...current, status: 'error', message: result.error, outcome: result.outcome ?? 'unknown' } }
      emit('operation-error', request, result.error)
    }
  } catch (error) {
    if (controller.signal.aborted) return
    const current = operations.value[key]
    if (!current || current.operationId !== request.operationId) return
    const message = error instanceof Error ? error.message : '操作失败'
    operations.value = { ...operations.value, [key]: { ...current, status: 'error', message, outcome: 'unknown' } }
    emit('operation-error', request, message)
  } finally {
    inFlightKeys.delete(key)
    if (operationControllers.get(key) === controller) operationControllers.delete(key)
  }
}
const validateTaskOrder = (items: AIAgentTask[]) => {
  const ids = new Set(items.map((task) => task.id))
  const originalIds = new Set(props.tasks.map((task) => task.id))
  if (ids.size !== items.length || ids.size !== originalIds.size || [...ids].some((id) => !originalIds.has(id)) || items.some((task) => task.dependsOn?.some((dependency) => !ids.has(dependency)))) return '任务集合或依赖无效，无法排序'
  const indexes = new Map(items.map((task, index) => [task.id, index]))
  if (items.some((task) => task.dependsOn?.some((dependency) => (indexes.get(dependency) ?? Infinity) >= indexes.get(task.id)!))) return '依赖任务必须排在前面'
  const visiting = new Set<string>(); const visited = new Set<string>()
  const cycle = (id: string): boolean => { if (visiting.has(id)) return true; if (visited.has(id)) return false; visiting.add(id); const task = items.find((candidate) => candidate.id === id); if (task?.dependsOn?.some(cycle)) return true; visiting.delete(id); visited.add(id); return false }
  if (items.some((task) => cycle(task.id))) return '任务依赖存在循环'
  return undefined
}
const taskOrderError = computed(() => validateTaskOrder(props.tasks))
const validateTaskCandidate = (items: AIAgentTask[]) => {
  const reason = validateTaskOrder(items)
  if (reason) return reason
  const originalIndexes = new Map(props.tasks.map((task, index) => [task.id, index]))
  for (const [index, task] of items.entries()) {
    const original = props.tasks[originalIndexes.get(task.id) ?? -1]
    if (!original) return '任务集合发生变化，无法排序'
    if (JSON.stringify(task) !== JSON.stringify(original)) return '任务数据在排序期间发生变化'
    if ((original.lockedReason || original.reorderable === false || ['running', 'waiting-approval'].includes(original.status)) && originalIndexes.get(task.id) !== index) return original.lockedReason ?? '任务当前不可移动'
    if (operations.value[operationKey(original)]?.status === 'pending' && originalIndexes.get(task.id) !== index) return '任务操作进行中，无法移动'
  }
  return undefined
}
const handleTaskCandidate = (items: AIAgentTask[]) => {
  const next = items
  const reason = validateTaskCandidate(next)
  if (reason) { emit('task-move-reject', reason); return }
  emit('update:tasks', next)
}
const sortableContext = computed(() => props.contextItems as unknown as Record<string, unknown>[])
const completedTaskCount = computed(() => props.tasks.filter((task) => task.status === 'complete').length)
const workbenchStatus = computed(() => {
  if (props.tasks.some((task) => task.status === 'error')) return { key: 'error', label: '需要处理' }
  if (pendingApprovalCount.value > 0) return { key: 'waiting', label: '等待人工审批' }
  if (props.tasks.some((task) => task.status === 'running')) return { key: 'running', label: '执行中' }
  if (props.tasks.length && completedTaskCount.value === props.tasks.length) return { key: 'complete', label: '已完成' }
  return { key: 'idle', label: '待开始' }
})
const asContext = (item: unknown) => item as AIAgentContextItem

const reorder = <T>(items: T[], index: number, offset: number) => {
  const destination = index + offset
  if (destination < 0 || destination >= items.length) return items
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(destination, 0, item)
  return next
}
const isContextMoveDisabled = (index: number, offset: number) => {
  const destination = index + offset
  return Boolean(
    props.disabled ||
    destination < 0 ||
    destination >= props.contextItems.length ||
    props.contextItems[index]?.disabled ||
    props.contextItems[destination]?.disabled
  )
}
const moveContext = (index: number, offset: number) => {
  if (isContextMoveDisabled(index, offset)) return
  const item = props.contextItems[index]
  if (!item || index + offset < 0 || index + offset >= props.contextItems.length) return
  emit('update:contextItems', reorder(props.contextItems, index, offset))
  emit('move-context', item.id, offset < 0 ? 'up' : 'down')
}
const updateContext = (items: Record<string, unknown>[]) => {
  if (props.disabled) return
  const nextItems = items as unknown as AIAgentContextItem[]
  const movedLockedItem = props.contextItems.some((item, index) => item.disabled && nextItems[index]?.id !== item.id)
  if (!movedLockedItem) emit('update:contextItems', nextItems)
}
const forwardMoveTask = (id: string, direction: 'up' | 'down') => emit('move-task', id, direction)
const forwardChatEdit = (message: AIMessage, content: string) => emit('chat-edit', message, content)
watch(() => [props.tasks, props.artifacts, props.activeConversation, props.actionHandler], () => {
  for (const [key, controller] of operationControllers) {
    const task = props.tasks.find((candidate) => operationKey(candidate) === key)
    if (!task) { controller.abort(); operationControllers.delete(key); inFlightKeys.delete(key); idempotency.delete(key); continue }
    const operation = operations.value[key]
    const artifact = task.approval?.artifactId ? props.artifacts.find((item) => item.id === task.approval?.artifactId) : undefined
    if (operation && (operation.taskRevision !== task.revision || operation.approvalId !== task.approval?.id || operation.artifactId !== (artifact?.id ?? task.approval?.artifactId) || operation.artifactRevision !== artifact?.revision || operation.conversationId !== props.activeConversation)) { controller?.abort(); if (controller) operationControllers.delete(key); inFlightKeys.delete(key); idempotency.delete(key); delete operations.value[key] }
  }
  for (const key of Object.keys(operations.value)) if (!props.tasks.some((task) => operationKey(task) === key)) delete operations.value[key]
  for (const [key, operation] of Object.entries(operations.value)) {
    const task = props.tasks.find((candidate) => operationKey(candidate) === key)
    const artifact = task?.approval?.artifactId ? props.artifacts.find((item) => item.id === task.approval?.artifactId) : undefined
    if (!task || operation.conversationId !== props.activeConversation || operation.taskStatus !== task.status || operation.approvalStatus !== task.approval?.status || operation.artifactId !== (artifact?.id ?? task.approval?.artifactId) || operation.artifactRevision !== artifact?.revision) { idempotency.delete(key); delete operations.value[key] }
  }
}, { deep: true })
watch(() => props.actionHandler, (next, previous) => {
  if (next !== previous) {
    for (const controller of operationControllers.values()) controller.abort()
    operationControllers.clear()
    inFlightKeys.clear()
    operations.value = {}
    idempotency.clear()
  }
})
onBeforeUnmount(() => { for (const controller of operationControllers.values()) controller.abort() })
</script>
