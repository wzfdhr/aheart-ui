<template>
  <AIProcess :items="items" />
</template>

<script setup lang="ts">
import AIProcess from './process.vue'
import type { AIProcessItem } from './types'

withDefaults(defineProps<{ items?: AIProcessItem[] }>(), { items: () => [] })
defineOptions({ name: 'AAIThoughtChain' })
</script>
