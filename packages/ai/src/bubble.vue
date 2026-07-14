<template>
  <article class="aheart-ai-bubble" :class="`is-${message.role}`">
    <header class="aheart-ai-bubble__header">{{ roleLabel }}</header>
    <p class="aheart-ai-bubble__content"><AIBubbleRenderNode :node="contentNode" /></p>
    <p v-if="message.error" class="aheart-ai-bubble__error">{{ message.error }}</p>
    <AIProcess :items="message.process" />
    <AISources :sources="message.sources" />
    <AIAttachments :items="message.attachments" />
    <slot name="actions" :message="message" />
  </article>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import AIAttachments from './attachments.vue'
import AIProcess from './process.vue'
import AISources from './sources.vue'
import { renderSafeMarkdown } from './safe-markdown'
import type { AIContentRenderer, AIMessage } from './types'

const props = defineProps<{ message: AIMessage; contentRenderer?: AIContentRenderer }>()
const roleLabel = computed(() => ({ user: '你', assistant: 'AI 助手', system: '系统', tool: '工具' })[props.message.role])
const contentNode = computed(() => props.contentRenderer?.(props.message) ?? renderSafeMarkdown(props.message.content))
defineOptions({ name: 'AAIBubble' })

const AIBubbleRenderNode = defineComponent({
  name: 'AIBubbleRenderNode',
  props: {
    node: { type: null as unknown as PropType<VNodeChild>, default: undefined }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})
</script>
