<template>
  <div
    class="aheart-divider"
    :class="dividerClass"
    :style="dividerStyle"
    role="separator"
    :aria-orientation="resolvedType"
  >
    <span v-if="$slots.default && resolvedType === 'horizontal'" class="aheart-divider__text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { dividerProps } from './types'
import './style.css'

defineOptions({
  name: 'ADivider'
})

const props = defineProps(dividerProps)
const slots = useSlots()

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
const resolvedType = computed(() => (props.vertical ? 'vertical' : props.type))
const resolvedTitlePlacement = computed(() => props.titlePlacement || props.orientation)
const resolvedVariant = computed(() => (props.dashed ? 'dashed' : props.variant))

const dividerClass = computed(() => [
  `aheart-divider--${resolvedType.value}`,
  `aheart-divider--${resolvedTitlePlacement.value}`,
  `aheart-divider--${props.size}`,
  {
    'has-text': Boolean(slots.default && resolvedType.value === 'horizontal'),
    [`is-${resolvedVariant.value}`]: resolvedVariant.value,
    'is-plain': props.plain
  }
])

const dividerStyle = computed(() =>
  props.orientationMargin
    ? {
        '--aheart-divider-orientation-margin': normalizeSize(props.orientationMargin)
      }
    : undefined
)
</script>
