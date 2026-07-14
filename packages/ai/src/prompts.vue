<template>
  <div class="aheart-ai-prompts" role="list">
    <button v-for="prompt in prompts" :key="prompt.key" type="button" role="listitem" :disabled="disabled" @click="emit('select', prompt)">
      <strong>{{ prompt.label }}</strong>
      <span v-if="prompt.description">{{ prompt.description }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AIPrompt } from './types'

withDefaults(defineProps<{ prompts?: AIPrompt[]; disabled?: boolean }>(), { prompts: () => [], disabled: false })
const emit = defineEmits<{ select: [prompt: AIPrompt] }>()
defineOptions({ name: 'AAIPrompts' })
</script>
