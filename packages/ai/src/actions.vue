<template>
  <div v-if="actions.length" class="aheart-ai-actions" aria-label="消息操作">
    <button v-for="action in actions" :key="action.key" type="button" :disabled="action.disabled" @click="emit('select', action)">
      {{ action.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AIAction } from './types'

withDefaults(defineProps<{ actions?: AIAction[] }>(), { actions: () => [] })
const emit = defineEmits<{ select: [action: AIAction] }>()
defineOptions({ name: 'AAIActions' })
</script>
