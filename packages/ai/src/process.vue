<template>
  <section v-if="items.length" class="aheart-ai-process" aria-label="执行进度">
    <h3>执行进度</h3>
    <ol>
      <li v-for="item in items" :key="item.id" :class="`is-${item.status}`">
        <span>{{ item.label }}</span>
        <small v-if="item.detail">{{ item.detail }}</small>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { AIProcessItem } from './types'

withDefaults(defineProps<{ items?: AIProcessItem[] }>(), { items: () => [] })
defineOptions({ name: 'AAIProcess' })
</script>
