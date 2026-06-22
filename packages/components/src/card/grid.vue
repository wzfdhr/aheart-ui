<template>
  <div class="aheart-card-grid" :class="gridClass" :style="rootStyle">
    <div class="aheart-card-grid__content" :class="classNames?.content" :style="styles?.content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cardGridProps } from './types'
import './style.css'

defineOptions({
  name: 'ACardGrid'
})

const props = defineProps(cardGridProps)

const gridClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-hoverable': props.hoverable
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
</script>
