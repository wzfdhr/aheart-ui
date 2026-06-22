<template>
  <span class="aheart-badge" :class="badgeClass">
    <slot />
    <sup v-if="dot" class="aheart-badge__dot" />
    <sup v-else-if="count !== undefined" class="aheart-badge__count">{{ displayCount }}</sup>
    <template v-if="status">
      <span class="aheart-badge__status-dot" :class="`aheart-badge__status-dot--${status}`" />
      <span v-if="text" class="aheart-badge__status-text">{{ text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { badgeProps } from './types'
import './style.css'

defineOptions({
  name: 'ABadge'
})

const props = defineProps(badgeProps)

const displayCount = computed(() => {
  if (typeof props.count === 'number' && props.count > props.overflowCount) {
    return `${props.overflowCount}+`
  }

  return props.count
})

const badgeClass = computed(() => ({
  'aheart-badge--status': props.status,
  'aheart-badge--standalone': props.count === undefined && !props.dot
}))
</script>
