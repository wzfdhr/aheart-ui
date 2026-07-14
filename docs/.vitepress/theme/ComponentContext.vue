<template>
  <nav v-if="context" class="aheart-component-context" :class="`is-${context.domain.key}`" aria-label="组件定位">
    <span class="aheart-component-context__domain">{{ context.domain.name }}</span>
    <span class="aheart-component-context__task">任务组 · {{ context.domain.taskGroup }}</span>
    <span class="aheart-component-context__package">{{ context.packageName }}</span>
    <span v-if="context.related.length" class="aheart-component-context__related">
      <span>相关组件</span>
      <a v-for="component in context.related" :key="component.key" :href="component.link">{{ component.name }}</a>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { getComponentDocumentContext } from '../data/components'

const { page } = useData()
const context = computed(() => getComponentDocumentContext(page.value.relativePath, 'zh'))
</script>
