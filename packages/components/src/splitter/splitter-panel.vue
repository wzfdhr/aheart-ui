<template>
  <div class="aheart-splitter__panel">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { SplitterPanelConstraint } from './types'

defineOptions({
  name: 'ASplitterPanel'
})

defineProps({
  min: [Number, String] as PropType<SplitterPanelConstraint['min']>,
  max: [Number, String] as PropType<SplitterPanelConstraint['max']>,
  collapsible: Boolean
})
</script>
