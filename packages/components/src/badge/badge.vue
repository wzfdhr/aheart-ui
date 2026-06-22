<template>
  <span class="aheart-badge" :class="badgeClass" :style="rootStyle">
    <slot />
    <sup v-if="showDotIndicator" :class="dotClass" :style="indicatorStyle" :title="title" />
    <sup v-else-if="showCountIndicator" :class="countClass" :style="indicatorStyle" :title="title">
      <slot name="count">{{ displayCount }}</slot>
    </sup>
    <template v-if="status">
      <span :class="statusDotClass" :style="indicatorStyle" />
      <span v-if="text" class="aheart-badge__status-text">{{ text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { badgeProps } from './types'
import './style.css'

defineOptions({
  name: 'ABadge'
})

const props = defineProps(badgeProps)
const slots = useSlots()

const hasDefaultSlot = computed(() => Boolean(slots.default))
const isStandalone = computed(() => !hasDefaultSlot.value)
const isZeroCount = computed(() => props.count === 0)
const showIndicatorWithCount = computed(() => !isZeroCount.value || props.showZero)
const showDotIndicator = computed(() => props.dot && showIndicatorWithCount.value)
const showCountIndicator = computed(() => !props.dot && props.count !== undefined && showIndicatorWithCount.value)
const normalizedSize = computed(() => (props.size === 'small' ? 'small' : 'medium'))

const displayCount = computed(() => {
  if (typeof props.count === 'number' && props.count > props.overflowCount) {
    return `${props.overflowCount}+`
  }

  return props.count
})

const rootStyle = computed(() => props.styles?.root)

const internalIndicatorStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.color) {
    style.backgroundColor = props.color
  }

  if (props.offset && !isStandalone.value) {
    const [x, y] = props.offset
    style.transform = `translate(50%, -50%) translate(${x}px, ${y}px)`
  }

  return style
})

const indicatorStyle = computed(() => [internalIndicatorStyle.value, props.styles?.indicator])

const badgeClass = computed(() => [
  {
    'aheart-badge--status': props.status,
    'aheart-badge--standalone': isStandalone.value
  },
  props.classNames?.root
])

const indicatorClass = computed(() => ({
  'is-standalone': isStandalone.value
}))

const countClass = computed(() => [
  'aheart-badge__count',
  `aheart-badge__count--${normalizedSize.value}`,
  indicatorClass.value,
  props.classNames?.indicator
])

const dotClass = computed(() => ['aheart-badge__dot', indicatorClass.value, props.classNames?.indicator])

const statusDotClass = computed(() => [
  'aheart-badge__status-dot',
  `aheart-badge__status-dot--${props.status}`,
  props.classNames?.indicator
])
</script>
