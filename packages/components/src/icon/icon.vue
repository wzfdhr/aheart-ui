<template>
  <span class="aheart-icon" :class="iconClass" :style="iconStyle" aria-hidden="true">
    <slot v-if="slots.default" />
    <component
      :is="resolvedComponent"
      v-else-if="resolvedComponent"
      class="aheart-icon__svg"
      aria-hidden="true"
      focusable="false"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, markRaw, toRaw, useSlots, warn, watchEffect } from 'vue'
import { iconComponents, warnedUnknownIconNames } from './icons'
import { iconProps } from './types'
import './style.css'

defineOptions({
  name: 'AIcon'
})

const props = defineProps(iconProps)
const slots = useSlots()

const resolvedComponent = computed(() => {
  const component = props.component ?? (props.name ? iconComponents[props.name] : undefined)
  return component ? markRaw(toRaw(component)) : undefined
})

watchEffect(() => {
  if (
    slots.default ||
    props.component ||
    !props.name ||
    resolvedComponent.value ||
    warnedUnknownIconNames.has(props.name)
  ) {
    return
  }

  warnedUnknownIconNames.add(props.name)
  warn(`[Aheart UI] Unknown icon name: ${props.name}`)
})

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
