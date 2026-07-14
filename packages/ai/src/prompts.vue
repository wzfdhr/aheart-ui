<template>
  <ul class="aheart-ai-prompts" aria-label="建议任务">
    <li v-for="prompt in prompts" :key="prompt.key">
      <button type="button" :disabled="disabled" @click="emit('select', prompt)">
        <strong>{{ prompt.label }}</strong>
        <span v-if="prompt.description">{{ prompt.description }}</span>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { AIPrompt } from './types'

withDefaults(defineProps<{ prompts?: AIPrompt[]; disabled?: boolean }>(), { prompts: () => [], disabled: false })
const emit = defineEmits<{ select: [prompt: AIPrompt] }>()
defineOptions({ name: 'AAIPrompts' })
</script>
