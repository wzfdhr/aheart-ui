<template>
  <article class="aheart-ai-bubble" :class="`is-${message.role}`">
    <header class="aheart-ai-bubble__header">{{ roleLabel }}</header>
    <p class="aheart-ai-bubble__content"><AIBubbleRenderNode :node="contentNode" /></p>
    <section v-if="message.toolCall" class="aheart-ai-bubble__tool-call" aria-label="工具调用摘要">
      <header class="aheart-ai-bubble__tool-heading">
        <strong>{{ message.toolCall.name }}</strong>
        <span>{{ message.toolCall.summary }}</span>
      </header>
      <dl class="aheart-ai-bubble__tool-details">
        <template v-if="message.toolCall.inputSummary || message.toolCall.inputStatus">
          <dt>输入</dt><dd><span>{{ message.toolCall.inputSummary }}</span><small v-if="message.toolCall.inputStatus">{{ message.toolCall.inputStatus }}</small></dd>
        </template>
        <template v-if="message.toolCall.resultSummary || message.toolCall.resultStatus">
          <dt>结果</dt><dd><span>{{ message.toolCall.resultSummary }}</span><small v-if="message.toolCall.resultStatus">{{ message.toolCall.resultStatus }}</small></dd>
        </template>
        <template v-if="message.toolCall.error"><dt>错误</dt><dd>{{ message.toolCall.error }}</dd></template>
      </dl>
    </section>
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
const contentNode = computed(() => props.message.toolCall ? '' : (props.contentRenderer?.(props.message) ?? renderSafeMarkdown(props.message.content)))
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
