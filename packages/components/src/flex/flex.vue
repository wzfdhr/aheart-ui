<template>
  <div class="aheart-flex" :class="flexClass" :style="flexStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { flexProps, type FlexGap } from './types'
import './style.css'

defineOptions({
  name: 'AFlex'
})

const props = defineProps(flexProps)

const gapToValue = (gap: FlexGap | undefined) => {
  if (typeof gap === 'number') {
    return `${gap}px`
  }

  const tokenMap = {
    large: 'var(--aheart-spacing-lg)',
    middle: 'var(--aheart-spacing-md)',
    small: 'var(--aheart-spacing-sm)'
  }

  return gap ? tokenMap[gap] : undefined
}

const flexClass = computed(() => [
  {
    'is-vertical': props.vertical,
    'is-wrap': props.wrap === true,
    [`is-wrap-${props.wrap}`]: typeof props.wrap === 'string',
    [`aheart-flex--justify-${props.justify}`]: props.justify,
    [`aheart-flex--align-${props.align}`]: props.align
  }
])

const flexStyle = computed(() => ({
  '--aheart-flex-gap': gapToValue(props.gap)
}))
</script>
