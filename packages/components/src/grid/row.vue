<template>
  <div class="aheart-row" :class="rowClass" :style="rowStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { rowProps, type GridBreakpoint, type GridGutter } from './types'
import './style.css'

defineOptions({
  name: 'ARow'
})

const props = defineProps(rowProps)
const breakpoints: GridBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

const normalizeGutter = (gutter: GridGutter | undefined) => {
  if (typeof gutter === 'number') {
    return {
      base: gutter,
      responsive: {}
    }
  }

  return {
    base: gutter?.xs ?? gutter?.sm ?? gutter?.md ?? gutter?.lg ?? gutter?.xl ?? gutter?.xxl ?? 0,
    responsive: gutter ?? {}
  }
}

const horizontalGutter = computed(() => {
  return Array.isArray(props.gutter) ? normalizeGutter(props.gutter[0]) : normalizeGutter(props.gutter as GridGutter)
})

const verticalGutter = computed(() => {
  return Array.isArray(props.gutter) ? normalizeGutter(props.gutter[1]) : normalizeGutter(0)
})

const rowClass = computed(() => [
  {
    [`aheart-row--justify-${props.justify}`]: props.justify,
    [`aheart-row--align-${props.align}`]: props.align,
    'is-nowrap': !props.wrap
  }
])

const rowStyle = computed(() => {
  const style: Record<string, string> = {
    '--aheart-row-gutter-horizontal': `${horizontalGutter.value.base}px`,
    '--aheart-row-gutter-vertical': `${verticalGutter.value.base}px`
  }

  breakpoints.forEach((breakpoint) => {
    const horizontal = horizontalGutter.value.responsive[breakpoint]
    const vertical = verticalGutter.value.responsive[breakpoint]

    if (horizontal !== undefined) {
      style[`--aheart-row-${breakpoint}-gutter-horizontal`] = `${horizontal}px`
    }

    if (vertical !== undefined) {
      style[`--aheart-row-${breakpoint}-gutter-vertical`] = `${vertical}px`
    }
  })

  return style
})
</script>
