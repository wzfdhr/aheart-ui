<template>
  <section class="aheart-ai-workbench" aria-label="Agent 工作台">
    <header class="aheart-ai-workbench__header">
      <div>
        <span class="aheart-ai-workbench__eyebrow">AGENT WORKSPACE</span>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="aheart-ai-workbench__header-status">
        <span data-workbench-status :class="`is-${workbenchStatus.key}`">{{ workbenchStatus.label }}</span>
        <small class="aheart-ai-workbench__progress">{{ completedTaskCount }} / {{ tasks.length }} 已完成</small>
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
              <ASortableList :items="sortableContext" item-key="id" group="agent-context" :disabled="disabled" @update:items="updateContext">
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
        <ASplitterPanel :min="240">
          <main class="aheart-ai-workbench__chat">
            <AIChatPanel
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
            <p v-else class="aheart-ai-workbench__empty">业务层尚未提供对话传输适配器。</p>
            <slot name="sources" :sources="sources"><AISources :sources="sources" /></slot>
            <slot name="attachments" :attachments="attachments"><AIAttachments :items="attachments" /></slot>
          </main>
        </ASplitterPanel>
        <ASplitterPanel :min="190" collapsible>
          <aside class="aheart-ai-workbench__execution" aria-label="执行与产物">
            <AgentExecution
              :tasks="tasks"
              :artifacts="artifacts"
              :active-artifact="activeArtifact"
              :disabled="disabled"
              @update:tasks="emit('update:tasks', $event)"
              @approve="emit('approve', $event)"
              @reject="emit('reject', $event)"
              @cancel="emit('cancel', $event)"
              @retry="emit('retry', $event)"
              @move-task="forwardMoveTask"
              @select-artifact="emit('update:activeArtifact', $event.id)"
            >
              <template v-if="$slots.task" #task="{ task, index }"><slot name="task" :task="task" :index="index" /></template>
              <template v-if="$slots.artifact" #artifact="{ artifact }"><slot name="artifact" :artifact="artifact" /></template>
              <template v-if="$slots['artifact-preview']" #artifact-preview="{ artifact }"><slot name="artifact-preview" :artifact="artifact" /></template>
            </AgentExecution>
          </aside>
        </ASplitterPanel>
      </ASplitter>
    </div>

    <div class="aheart-ai-workbench__mobile">
      <ATabs :items="mobileTabs" :active-key="mobileView" @update:active-key="mobileView = $event" />
      <section v-if="mobileView === 'conversations'" class="aheart-ai-workbench__mobile-panel">
        <AIConversations :model-value="activeConversation" :conversations="conversations" @update:model-value="emit('update:activeConversation', $event)" />
        <section v-if="contextItems.length" class="aheart-ai-workbench__context" aria-label="上下文">
          <h3>上下文</h3>
          <ASortableList :items="sortableContext" item-key="id" group="agent-context" :disabled="disabled" @update:items="updateContext">
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
      </section>
      <section v-else-if="mobileView === 'chat'" class="aheart-ai-workbench__mobile-panel">
        <AIChatPanel
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
        <p v-else class="aheart-ai-workbench__empty">业务层尚未提供对话传输适配器。</p>
        <slot name="sources" :sources="sources"><AISources :sources="sources" /></slot>
        <slot name="attachments" :attachments="attachments"><AIAttachments :items="attachments" /></slot>
      </section>
      <section v-else class="aheart-ai-workbench__mobile-panel">
        <AButton data-action="open-execution-drawer" type="primary" @click="executionDrawerOpen = true">查看执行与产物</AButton>
      </section>
      <ADrawer v-model:open="executionDrawerOpen" title="执行与产物" :get-container="false" placement="right">
        <AgentExecution
          :tasks="tasks"
          :artifacts="artifacts"
          :active-artifact="activeArtifact"
          :disabled="disabled"
          @update:tasks="emit('update:tasks', $event)"
          @approve="emit('approve', $event)"
          @reject="emit('reject', $event)"
          @cancel="emit('cancel', $event)"
          @retry="emit('retry', $event)"
          @move-task="forwardMoveTask"
          @select-artifact="emit('update:activeArtifact', $event.id)"
        >
          <template v-if="$slots.task" #task="{ task, index }"><slot name="task" :task="task" :index="index" /></template>
          <template v-if="$slots.artifact" #artifact="{ artifact }"><slot name="artifact" :artifact="artifact" /></template>
          <template v-if="$slots['artifact-preview']" #artifact-preview="{ artifact }"><slot name="artifact-preview" :artifact="artifact" /></template>
        </AgentExecution>
      </ADrawer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUpdate, ref } from 'vue'
import { Button as AButton, Drawer as ADrawer, Splitter as ASplitter, SplitterPanel as ASplitterPanel, Tabs as ATabs } from 'aheart-ui'
import { SortableList as ASortableList } from '@aheart-ui/dnd'
import AIAttachments from './attachments.vue'
import AIChatPanel from './chat-panel.vue'
import AIConversations from './conversations.vue'
import AISources from './sources.vue'
import AgentExecution from './agent-execution.vue'
import type { AIAgentArtifact, AIAgentContextItem, AIAgentTask, AIAttachment, AIConversation, AIMessage, AIPrompt, AISource, AITransport } from './types'

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
  transport?: AITransport
  tasks?: AIAgentTask[]
  contextItems?: AIAgentContextItem[]
  sources?: AISource[]
  attachments?: AIAttachment[]
  artifacts?: AIAgentArtifact[]
  activeArtifact?: string
  disabled?: boolean
}>(), {
  title: 'Agent 工作台',
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
}>()

const mobileView = ref('chat')
const executionDrawerOpen = ref(false)
const instance = getCurrentInstance()
const readMessagesPresence = () => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'messages')
const hasMessagesProp = ref(readMessagesPresence())
onBeforeUpdate(() => {
  hasMessagesProp.value = readMessagesPresence()
})
const chatMessageProps = computed(() => (hasMessagesProp.value
  ? { messages: props.messages }
  : { defaultMessages: props.messages }))
const mobileTabs = [
  { key: 'conversations', label: '会话' },
  { key: 'chat', label: '对话' },
  { key: 'execution', label: '执行' }
]
const sortableContext = computed(() => props.contextItems as unknown as Record<string, unknown>[])
const completedTaskCount = computed(() => props.tasks.filter((task) => task.status === 'complete').length)
const workbenchStatus = computed(() => {
  if (props.tasks.some((task) => task.status === 'error')) return { key: 'error', label: '需要处理' }
  if (props.tasks.some((task) => task.status === 'waiting-approval')) return { key: 'waiting', label: '等待人工审批' }
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
</script>
