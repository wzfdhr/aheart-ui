<template>
  <div
    class="aheart-divider"
    :class="dividerClass"
    :style="dividerStyle"
    role="separator"
    :aria-orientation="resolvedType"
  >
    <span class="aheart-divider__line" :class="classNames.line" :style="styles.line" aria-hidden="true" />
    <span
      v-if="hasText"
      class="aheart-divider__text"
      :class="classNames.text"
      :style="styles.text"
    >
      <slot />
    </span>
    <span v-if="hasText" class="aheart-divider__line" :class="classNames.line" :style="styles.line" aria-hidden="true" />
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
const hasText = computed(() => Boolean(slots.default && resolvedType.value === 'horizontal'))

const dividerClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  `aheart-divider--${resolvedType.value}`,
  `aheart-divider--${resolvedTitlePlacement.value}`,
  `aheart-divider--${props.size}`,
  {
    'has-text': hasText.value,
    [`is-${resolvedVariant.value}`]: resolvedVariant.value,
    'is-plain': props.plain
  }
])

const dividerStyle = computed(() => [
  props.orientationMargin
    ? {
        '--aheart-divider-orientation-margin': normalizeSize(props.orientationMargin)
      }
    : undefined,
  props.style,
  props.styles.root
])
</script>
