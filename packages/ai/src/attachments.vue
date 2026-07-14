<template>
  <ul v-if="items.length" class="aheart-ai-attachments" aria-label="附件">
    <li v-for="item in items" :key="item.id">
      <a v-if="getSafeUrl(item.url)" :href="getSafeUrl(item.url)" target="_blank" rel="noreferrer">{{ item.name }}</a>
      <span v-else>{{ item.name }}</span>
      <button v-if="removable" type="button" :aria-label="`移除 ${item.name}`" @click="emit('remove', item)">移除</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { AIAttachment } from './types'
import { getSafeUrl } from './safe-markdown'

withDefaults(defineProps<{ items?: AIAttachment[]; removable?: boolean }>(), { items: () => [], removable: false })
const emit = defineEmits<{ remove: [item: AIAttachment] }>()
defineOptions({ name: 'AAIAttachments' })
</script>
