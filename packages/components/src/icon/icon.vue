<template>
  <span class="aheart-icon" :class="iconClass" :style="iconStyle" aria-hidden="true">
    <slot>{{ name }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconProps } from './types'
import './style.css'

defineOptions({
  name: 'AIcon'
})

const props = defineProps(iconProps)

const normalizeSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return size
}

const iconClass = computed(() => ({
  'aheart-icon--spin': props.spin
}))

const iconStyle = computed(() => ({
  '--aheart-icon-size': normalizeSize(props.size),
  '--aheart-icon-color': props.color
}))
</script>
