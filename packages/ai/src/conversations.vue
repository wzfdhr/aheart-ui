<template>
  <nav class="aheart-ai-conversations" aria-label="会话列表">
    <button
      v-for="conversation in conversations"
      :key="conversation.key"
      type="button"
      :class="{ 'is-active': conversation.key === modelValue }"
      :disabled="conversation.disabled"
      :aria-current="conversation.key === modelValue ? 'page' : undefined"
      @click="emit('update:modelValue', conversation.key)"
    >
      {{ conversation.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { AIConversation } from './types'

withDefaults(defineProps<{ modelValue?: string; conversations?: AIConversation[] }>(), { modelValue: undefined, conversations: () => [] })
const emit = defineEmits<{ 'update:modelValue': [key: string] }>()
defineOptions({ name: 'AAIConversations' })
</script>
