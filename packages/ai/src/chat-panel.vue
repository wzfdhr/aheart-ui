<template>
  <section class="aheart-ai-chat-panel" aria-label="AI 对话">
    <div class="aheart-ai-chat-panel__messages" role="log" aria-live="polite" aria-relevant="additions text">
      <AIBubble v-for="message in currentMessages" :key="message.id" :message="message" />
    </div>
    <AISender v-model="draft" :disabled="disabled" :loading="sending" @submit="submit" @stop="stop" />
    <p class="aheart-ai-visually-hidden" role="status" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AIBubble from './bubble.vue'
import AISender from './sender.vue'
import type { AIMessage, AIStreamEvent, AITransport } from './types'

defineOptions({ name: 'AAIChatPanel' })

const props = withDefaults(
  defineProps<{
    messages?: AIMessage[]
    transport: AITransport
    conversationId?: string
    disabled?: boolean
  }>(),
  { messages: () => [], conversationId: undefined, disabled: false }
)
const emit = defineEmits<{
  'update:messages': [messages: AIMessage[]]
  'send': [content: string]
  'stop': []
  'error': [error: string]
}>()

const workingMessages = ref<AIMessage[]>([...props.messages])
const draft = ref('')
const sending = ref(false)
const controller = ref<AbortController>()
const activeAssistantId = ref<string>()
const latestDelta = ref('')
let sequence = 0

const currentMessages = computed(() => props.messages)
const announcement = computed(() => {
  if (sending.value && latestDelta.value) return `AI 回复：${latestDelta.value}`
  const message = [...currentMessages.value].reverse().find((item) => item.role === 'assistant')
  if (!message) return ''
  if (message.status === 'streaming') return '正在生成'
  if (message.status === 'stopped') return '已停止生成'
  if (message.status === 'error') return '生成失败'
  return message.status === 'complete' ? '已完成生成' : ''
})

watch(
  () => props.messages,
  (messages) => {
    if (!sending.value) workingMessages.value = [...messages]
  }
)

const createId = (prefix: string) => `${prefix}-${Date.now()}-${sequence++}`
const publish = (messages: AIMessage[]) => {
  workingMessages.value = messages
  emit('update:messages', messages)
}
const updateAssistant = (assistantId: string, update: Partial<AIMessage>) => {
  publish(workingMessages.value.map((message) => (message.id === assistantId ? { ...message, ...update } : message)))
}

const applyEvent = (assistantId: string, event: AIStreamEvent) => {
  const assistant = workingMessages.value.find((message) => message.id === assistantId)
  if (!assistant) return false

  if (event.type === 'text-delta') {
    latestDelta.value = event.delta
    updateAssistant(assistantId, { content: `${assistant.content}${event.delta}` })
  } else if (event.type === 'process') {
    const process = [...(assistant.process ?? []).filter((item) => item.id !== event.item.id), event.item]
    updateAssistant(assistantId, { process })
  } else if (event.type === 'sources') {
    updateAssistant(assistantId, { sources: event.sources })
  } else if (event.type === 'done') {
    updateAssistant(assistantId, { status: 'complete' })
    return true
  } else if (event.type === 'cancelled') {
    updateAssistant(assistantId, { status: 'stopped' })
    return true
  } else if (event.type === 'error') {
    updateAssistant(assistantId, { status: 'error', error: event.error })
    emit('error', event.error)
    return true
  }

  return false
}

const submit = async (submittedContent?: string) => {
  const content = (submittedContent ?? draft.value).trim()
  if (!content || sending.value || props.disabled) return

  const user: AIMessage = { id: createId('user'), role: 'user', content, status: 'complete' }
  const assistant: AIMessage = { id: createId('assistant'), role: 'assistant', content: '', status: 'streaming' }
  const requestMessages = [...workingMessages.value, user]

  draft.value = ''
  sending.value = true
  controller.value = new AbortController()
  activeAssistantId.value = assistant.id
  latestDelta.value = ''
  publish([...requestMessages, assistant])
  emit('send', content)

  try {
    for await (const event of props.transport.send({ conversationId: props.conversationId, messages: requestMessages }, controller.value.signal)) {
      if (controller.value.signal.aborted) break
      if (applyEvent(assistant.id, event)) break
    }

    const message = workingMessages.value.find((item) => item.id === assistant.id)
    if (message?.status === 'streaming') updateAssistant(assistant.id, { status: 'complete' })
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error)
    if (controller.value?.signal.aborted) {
      updateAssistant(assistant.id, { status: 'stopped' })
    } else {
      updateAssistant(assistant.id, { status: 'error', error: message })
      emit('error', message)
    }
  } finally {
    sending.value = false
    controller.value = undefined
    activeAssistantId.value = undefined
    workingMessages.value = [...props.messages]
  }
}

const stop = () => {
  if (activeAssistantId.value) updateAssistant(activeAssistantId.value, { status: 'stopped' })
  controller.value?.abort()
  emit('stop')
}
</script>
