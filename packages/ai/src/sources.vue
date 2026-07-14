<template>
  <section v-if="sources.length" class="aheart-ai-sources" aria-label="参考来源">
    <h3>参考来源</h3>
    <ul>
      <li v-for="source in sources" :key="source.id">
        <a v-if="getSafeUrl(source.url)" :href="getSafeUrl(source.url)" target="_blank" rel="noreferrer">{{ source.title }}</a>
        <span v-else>{{ source.title }}</span>
        <p v-if="source.description">{{ source.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { AISource } from './types'
import { getSafeUrl } from './safe-markdown'

withDefaults(defineProps<{ sources?: AISource[] }>(), { sources: () => [] })
defineOptions({ name: 'AAISources' })

</script>
