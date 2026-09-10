<template>
  <section class="aheart-ai-chat-panel" aria-label="AI 对话">
    <AIConversations
      v-if="conversations.length"
      :model-value="activeConversation"
      :conversations="conversations"
      @update:model-value="emit('update:activeConversation', $event)"
    />

    <div class="aheart-ai-chat-panel__surface">
      <div
        v-if="currentMessages.length"
        class="aheart-ai-chat-panel__messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AIBubble
          v-for="message in currentMessages"
          :key="message.id"
          :data-message-id="message.id"
          :message="message"
        >
          <template #actions>
            <div class="aheart-ai-chat-panel__message-actions" aria-label="消息操作">
              <button
                v-if="message.content"
                type="button"
                data-action="copy"
                :aria-label="`复制${message.role === 'user' ? '问题' : '回答'}`"
                @click="copyMessage(message)"
              >
                复制
              </button>
              <button
                v-if="message.role === 'user'"
                type="button"
                data-action="edit"
                :disabled="disabled || sending"
                @click="beginEdit(message)"
              >
                编辑
              </button>
              <button
                v-if="message.role === 'assistant' && (message.status === 'error' || message.status === 'stopped') && message.retryable !== false"
                type="button"
                data-action="retry"
                :disabled="disabled || sending"
                @click="retryMessage(message)"
              >
                重试
              </button>
              <button
                v-if="message.role === 'assistant' && message.status === 'complete'"
                type="button"
                data-action="regenerate"
                :disabled="disabled || sending"
                @click="regenerateMessage(message)"
              >
                重新生成
              </button>
            </div>
          </template>
        </AIBubble>
      </div>

      <div v-else class="aheart-ai-chat-panel__empty">
        <AIWelcome :title="welcomeTitle" :description="welcomeDescription" />
        <AIPrompts :prompts="prompts" :disabled="disabled || sending" @select="submit($event.label)" />
      </div>

      <div class="aheart-ai-chat-panel__composer">
        <p v-if="streamStatus === 'reconnecting'" class="aheart-ai-chat-panel__stream-reconnecting" role="status" aria-live="polite">正在恢复连接</p>
        <div v-if="editingMessage" class="aheart-ai-chat-panel__editing" role="status">
          <span>正在编辑已发送的问题</span>
          <button type="button" @click="cancelEdit">取消编辑</button>
        </div>
        <AIAttachments :items="attachments" removable @remove="removeAttachment" />
        <AISender v-model="draft" :disabled="disabled" :loading="sending" @submit="submit" @stop="stop" />
      </div>
    </div>

    <p class="aheart-ai-visually-hidden" role="status" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onBeforeUpdate, ref, watch } from 'vue'
import AIAttachments from './attachments.vue'
import AIBubble from './bubble.vue'
import AIConversations from './conversations.vue'
import AIPrompts from './prompts.vue'
import AISender from './sender.vue'
import AIWelcome from './welcome.vue'
import type {
  AIAttachment,
  AIChatAction,
  AIConversation,
  AIMessage,
  AIMessageStatus,
  AIProcessItem,
  AIProcessStatus,
  AIPrompt,
  AIStreamEvent,
  AITransport,
  AITransportV2,
  AIChatRequestV2,
  AIStreamEventV2
} from './types'
import { createAIStreamReducer } from './stream-reducer'

defineOptions({ name: 'AAIChatPanel' })

const props = withDefaults(
  defineProps<{
    messages?: AIMessage[]
    defaultMessages?: AIMessage[]
    transport: AITransport | AITransportV2
    conversationId?: string
    conversations?: AIConversation[]
    activeConversation?: string
    prompts?: AIPrompt[]
    attachments?: AIAttachment[]
    welcomeTitle?: string
    welcomeDescription?: string
    disabled?: boolean
    maxReconnectAttempts?: number
  }>(),
  {
    messages: () => [],
    defaultMessages: () => [],
    conversationId: undefined,
    conversations: () => [],
    activeConversation: undefined,
    prompts: () => [],
    attachments: () => [],
    welcomeTitle: '你好，我能为你做些什么？',
    welcomeDescription: '描述目标、补充上下文，或从建议任务开始。',
    disabled: false
    ,maxReconnectAttempts: 1
  }
)
const emit = defineEmits<{
  'update:messages': [messages: AIMessage[]]
  'update:activeConversation': [key: string]
  'update:attachments': [attachments: AIAttachment[]]
  send: [content: string]
  stop: []
  retry: [message: AIMessage]
  regenerate: [message: AIMessage]
  edit: [message: AIMessage, content: string]
  copy: [message: AIMessage]
  error: [error: string]
  'stream-status': [status: string]
  'stream-reject': [reason: string]
}>()

const instance = getCurrentInstance()
const hasProp = (name: string) => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, name)
const hasMessagesProp = ref(hasProp('messages'))
onBeforeUpdate(() => {
  hasMessagesProp.value = hasProp('messages')
})
const isMessagesControlled = () => hasMessagesProp.value
const localMessages = ref<AIMessage[]>([...props.defaultMessages])
const workingMessages = ref<AIMessage[]>(isMessagesControlled() ? [...props.messages] : [...localMessages.value])
const draft = ref('')
const sending = ref(false)
const controller = ref<AbortController>()
const activeAssistantId = ref<string>()
const editingMessage = ref<AIMessage>()
const latestDelta = ref('')
const streamStatus = ref('idle')
let epoch = 0
let sequence = 0

const currentMessages = computed(() => (isMessagesControlled() ? props.messages : localMessages.value))
const resolvedConversationId = computed(() => props.conversationId ?? props.activeConversation)
const announcement = computed(() => {
  if (streamStatus.value === 'reconnecting') return ''
  if (!isMessagesControlled() && sending.value && latestDelta.value) return `AI 回复：${latestDelta.value}`
  const message = [...currentMessages.value].reverse().find((item) => item.role === 'assistant')
  if (!message) return ''
  if (message.status === 'streaming') return '正在生成'
  if (message.status === 'stopped') return '已停止生成'
  if (message.status === 'error') return '生成失败'
  return message.status === 'complete' ? '已完成生成' : ''
})
const announceStreamStatus = (status: string) => {
  if (status === 'idle' && sending.value && (streamStatus.value === 'streaming' || streamStatus.value === 'reconnecting')) return
  if (streamStatus.value === status) return
  streamStatus.value = status
  emit('stream-status', status)
}

watch(
  () => props.messages,
  (messages) => {
    if (isMessagesControlled() && !sending.value) workingMessages.value = [...messages]
  },
  { deep: true }
)

const createId = (prefix: string) => `${prefix}-${Date.now()}-${sequence++}`
const publish = (messages: AIMessage[]) => {
  workingMessages.value = messages
  if (!isMessagesControlled()) localMessages.value = messages
  emit('update:messages', messages)
}
const updateAssistant = (assistantId: string, update: Partial<AIMessage>) => {
  publish(workingMessages.value.map((message) => (message.id === assistantId ? { ...message, ...update } : message)))
}

const settleProcess = (items: AIProcessItem[] | undefined, status: AIProcessStatus, detail?: string) =>
  items?.map((item) => (item.status === 'pending' || item.status === 'running'
    ? { ...item, status, ...(detail && !item.detail ? { detail } : {}) }
    : item))

const finishAssistant = (assistantId: string, status: AIMessageStatus, error?: string) => {
  const assistant = workingMessages.value.find((message) => message.id === assistantId)
  if (!assistant) return
  const processStatus: AIProcessStatus = status === 'complete' ? 'complete' : status === 'stopped' ? 'stopped' : 'error'
  updateAssistant(assistantId, {
    status,
    ...(error ? { error } : {}),
    process: settleProcess(assistant.process, processStatus, error)
  })
  if (status === 'complete') announceStreamStatus('completed')
  else if (status === 'stopped') announceStreamStatus('cancelled')
  else if (status === 'error') announceStreamStatus('error')
}

const applyEvent = (assistantId: string, event: AIStreamEvent) => {
  const assistant = workingMessages.value.find((message) => message.id === assistantId)
  if (!assistant) return false

  if (event.type === 'text-delta') {
    if (!isMessagesControlled()) latestDelta.value = event.delta
    updateAssistant(assistantId, { content: `${assistant.content}${event.delta}` })
  } else if (event.type === 'process') {
    const process = [...(assistant.process ?? []).filter((item) => item.id !== event.item.id), event.item]
    updateAssistant(assistantId, { process })
  } else if (event.type === 'sources') {
    updateAssistant(assistantId, { sources: event.sources })
  } else if (event.type === 'done') {
    finishAssistant(assistantId, 'complete')
    return true
  } else if (event.type === 'cancelled') {
    finishAssistant(assistantId, 'stopped')
    return true
  } else if (event.type === 'error') {
    finishAssistant(assistantId, 'error', event.error)
    emit('error', event.error)
    return true
  }

  return false
}

const streamResponse = async (
  requestMessages: AIMessage[],
  options: { action?: AIChatAction; messageId?: string } = {}
) => {
  const assistant: AIMessage = {
    id: createId('assistant'),
    role: 'assistant',
    content: '',
    status: 'streaming'
  }
  const rootDocument = (instance?.proxy?.$el as HTMLElement | undefined)?.ownerDocument ?? (typeof document !== 'undefined' ? document : undefined)
  const activeController = new (rootDocument?.defaultView?.AbortController ?? AbortController)()
  const requestEpoch = ++epoch
  const transport = props.transport
  const isV2 = transport && 'version' in transport && transport.version === '2'
  const requestId = createId('request')

  sending.value = true
  announceStreamStatus('streaming')
  controller.value = activeController
  activeAssistantId.value = assistant.id
  latestDelta.value = ''
  if (isV2 && isMessagesControlled()) workingMessages.value = [...requestMessages, assistant]
  else publish([...requestMessages, assistant])
  if (isV2 && isMessagesControlled()) emit('update:messages', [...requestMessages, assistant])

  try {
    if (isV2) {
      const request: AIChatRequestV2 = {
        version: '2', requestId, messageId: assistant.id, idempotencyKey: createId('idempotency'),
        conversationId: resolvedConversationId.value, messages: requestMessages,
        ...(options.action && { action: options.action }), ...(options.messageId && { targetMessageId: options.messageId })
      }
      const reducer = createAIStreamReducer({ requestId, messageId: assistant.id, maxReconnectAttempts: props.maxReconnectAttempts })
      let iterable: AsyncIterable<AIStreamEventV2> = transport.send(request, activeController.signal)
      let attempts = 0
      let completed = false
      let protocolFailure = false
      while (!completed) {
        try {
          for await (const event of iterable) {
            if (requestEpoch !== epoch || activeController.signal.aborted) break
            const next = reducer.dispatch(event)
            if (next.diagnostic.kind === 'protocol-error') {
              const failed = reducer.failRecovery(`协议错误：${next.diagnostic.reason ?? 'invalid envelope'}`, false)
              emit('stream-reject', next.diagnostic.reason ?? '协议错误')
              announceStreamStatus(failed.status)
              emit('error', failed.message.error ?? '协议错误')
              const protocolCandidate = { ...assistant, ...failed.message }
              workingMessages.value = [...requestMessages, protocolCandidate]
              if (isMessagesControlled()) emit('update:messages', workingMessages.value)
              else publish(workingMessages.value)
              protocolFailure = true
              completed = true
              break
            }
            announceStreamStatus(next.status)
            if (next.status === 'completed' || next.status === 'cancelled' || next.status === 'error') completed = true
            const candidate = { ...assistant, ...next.message }
            workingMessages.value = [...requestMessages, candidate]
            if (isMessagesControlled()) emit('update:messages', workingMessages.value)
            else publish(workingMessages.value)
            if (!isMessagesControlled() && event.type === 'text-delta' && next.diagnostic.kind === 'accepted') latestDelta.value = event.delta
            if (next.status === 'completed' || next.status === 'cancelled' || next.status === 'error') { completed = true; break }
            if (next.recoveryRequired) break
          }
          if (requestEpoch !== epoch || activeController.signal.aborted) break
          const current = reducer.getState()
          if (current.status === 'completed' || current.status === 'cancelled' || current.status === 'error') break
          if (protocolFailure || !('resume' in transport) || !transport.resume || attempts >= Math.max(0, Number.isSafeInteger(props.maxReconnectAttempts) ? props.maxReconnectAttempts! : 1)) {
            let recovered = !transport.resume ? reducer.failRecovery('连接中断，请重试') : reducer.recover({ reason: protocolFailure ? 'protocol' : 'eof' })
            if (recovered.status === 'reconnecting' && protocolFailure) recovered = reducer.failRecovery('协议错误', false)
            announceStreamStatus(recovered.status)
            const recoveryCandidate = { ...assistant, ...recovered.message }
            workingMessages.value = [...requestMessages, recoveryCandidate]
            if (isMessagesControlled()) emit('update:messages', workingMessages.value)
            else publish(workingMessages.value)
            break
          }
          attempts += 1
          const reconnecting = reducer.recover({ reason: 'eof' }); announceStreamStatus(reconnecting.status)
          iterable = transport.resume({ ...request, resume: reducer.getState().cursor }, activeController.signal)
        } catch (error) {
          if (requestEpoch !== epoch || activeController.signal.aborted) break
          let settled = !transport.resume ? reducer.failRecovery('连接中断，请重试', true) : reducer.recover({ reason: 'transport' })
          announceStreamStatus(settled.status)
          if (settled.status === 'error') {
            const recoveryCandidate = { ...assistant, ...settled.message }
            workingMessages.value = [...requestMessages, recoveryCandidate]
            if (isMessagesControlled()) emit('update:messages', workingMessages.value)
            else publish(workingMessages.value)
          }
          if (!('resume' in transport) || !transport.resume || settled.status === 'error' || attempts >= (props.maxReconnectAttempts ?? 1)) break
          attempts += 1
          iterable = transport.resume({ ...request, resume: reducer.getState().cursor }, activeController.signal)
        }
      }
      if (requestEpoch === epoch && !activeController.signal.aborted) {
        const result = reducer.getState()
        const candidate = { ...assistant, ...result.message }
        workingMessages.value = [...requestMessages, candidate]
        if (result.status === 'error') emit('error', result.message.error ?? '生成失败')
      }
    } else {
      const legacyTransport = transport as AITransport
      for await (const event of legacyTransport.send({ conversationId: resolvedConversationId.value, messages: requestMessages, ...(options.action && { action: options.action }), ...(options.messageId && { messageId: options.messageId }) }, activeController.signal)) {
        if (requestEpoch !== epoch || activeController.signal.aborted) break
        if (applyEvent(assistant.id, event as AIStreamEvent)) break
      }
      const message = workingMessages.value.find((item) => item.id === assistant.id)
      if (message?.status === 'streaming' && requestEpoch === epoch) finishAssistant(assistant.id, 'complete')
    }
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error)
    if (activeController.signal.aborted || requestEpoch !== epoch) {
      return
    } else {
      finishAssistant(assistant.id, 'error', message)
      emit('error', message)
    }
  } finally {
    if (controller.value === activeController) {
      sending.value = false
      streamStatus.value = currentMessages.value.some((item) => item.status === 'streaming') ? 'streaming' : 'idle'
      controller.value = undefined
      activeAssistantId.value = undefined
      workingMessages.value = [...currentMessages.value]
    }
  }
}

const submit = async (submittedContent?: string) => {
  const content = (submittedContent ?? draft.value).trim()
  if (!content || sending.value || props.disabled) return

  if (editingMessage.value) {
    const original = editingMessage.value
    const source = [...currentMessages.value]
    const index = source.findIndex((message) => message.id === original.id)
    if (index < 0) return
    const edited: AIMessage = { ...original, content, status: 'complete' }
    draft.value = ''
    editingMessage.value = undefined
    emit('edit', original, content)
    await streamResponse([...source.slice(0, index), edited], { action: 'edit', messageId: original.id })
    return
  }

  const user: AIMessage = {
    id: createId('user'),
    role: 'user',
    content,
    status: 'complete',
    ...(props.attachments.length && { attachments: [...props.attachments] })
  }
  const requestMessages = [...currentMessages.value, user]
  draft.value = ''
  emit('send', content)
  if (props.attachments.length) emit('update:attachments', [])
  await streamResponse(requestMessages)
}

const rerunAssistant = async (message: AIMessage, action: 'retry' | 'regenerate') => {
  if (sending.value || props.disabled) return
  const source = [...currentMessages.value]
  const index = source.findIndex((candidate) => candidate.id === message.id)
  if (index < 1) return
  const requestMessages = source.slice(0, index)
  const lastUser = [...requestMessages].reverse().find((candidate) => candidate.role === 'user')
  if (!lastUser) return
  if (action === 'retry') emit('retry', message)
  else emit('regenerate', message)
  await streamResponse(requestMessages, { action, messageId: message.id })
}

const retryMessage = (message: AIMessage) => rerunAssistant(message, 'retry')
const regenerateMessage = (message: AIMessage) => rerunAssistant(message, 'regenerate')
const beginEdit = (message: AIMessage) => {
  if (sending.value || props.disabled) return
  editingMessage.value = message
  draft.value = message.content
}
const cancelEdit = () => {
  editingMessage.value = undefined
  draft.value = ''
}
const copyMessage = (message: AIMessage) => {
  const ownerWindow = (instance?.proxy?.$el as HTMLElement | undefined)?.ownerDocument?.defaultView
  void ownerWindow?.navigator?.clipboard?.writeText(message.content)
  emit('copy', message)
}
const removeAttachment = (attachment: AIAttachment) => {
  emit('update:attachments', props.attachments.filter((item) => item.id !== attachment.id))
}
const stop = () => {
  epoch += 1
  const prior = controller.value
  if (activeAssistantId.value) finishAssistant(activeAssistantId.value, 'stopped')
  prior?.abort()
  controller.value = undefined
  activeAssistantId.value = undefined
  sending.value = false
  emit('stop')
}

watch(resolvedConversationId, (nextConversation, previousConversation) => {
  if (nextConversation !== previousConversation) {
    epoch += 1
    controller.value?.abort()
    controller.value = undefined
    activeAssistantId.value = undefined
    sending.value = false
    streamStatus.value = 'idle'
  }
})
watch(() => props.transport, (nextTransport, previousTransport) => {
  if (nextTransport !== previousTransport) {
    epoch += 1
    controller.value?.abort()
    controller.value = undefined
    activeAssistantId.value = undefined
    sending.value = false
    streamStatus.value = 'idle'
  }
})
onBeforeUnmount(() => {
  epoch += 1
  controller.value?.abort()
})
</script>
