<template>
  <div class="aheart-col" :class="colClass" :style="colStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colProps, type ColSpanConfig, type GridBreakpoint } from './types'
import './style.css'

defineOptions({
  name: 'ACol'
})

const props = defineProps(colProps)
const breakpoints: GridBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

const normalizeSpanConfig = (value: number | ColSpanConfig | undefined): ColSpanConfig | undefined => {
  if (typeof value === 'number') {
    return { span: value }
  }

  return value
}

const flexToValue = (flex: string | number | undefined) => {
  if (typeof flex === 'number') {
    return `0 0 ${flex}px`
  }

  return flex
}

const responsiveConfigs = computed(() => {
  return Object.fromEntries(
    breakpoints.map((breakpoint) => [breakpoint, normalizeSpanConfig(props[breakpoint])])
  ) as Partial<Record<GridBreakpoint, ColSpanConfig | undefined>>
})

const colClass = computed(() => {
  const classes: Array<string | undefined> = [
    props.span !== undefined ? `aheart-col-${props.span}` : undefined,
    props.offset !== undefined ? `aheart-col-offset-${props.offset}` : undefined,
    props.order !== undefined ? `aheart-col-order-${props.order}` : undefined,
    props.push !== undefined ? `aheart-col-push-${props.push}` : undefined,
    props.pull !== undefined ? `aheart-col-pull-${props.pull}` : undefined
  ]

  breakpoints.forEach((breakpoint) => {
    if (responsiveConfigs.value[breakpoint]) {
      classes.push(`aheart-col-${breakpoint}`)
    }
  })

  return classes
})

const colStyle = computed(() => {
  const style: Record<string, string | number> = {}

  if (props.span !== undefined) {
    style['--aheart-col-span'] = props.span
  }

  if (props.offset !== undefined) {
    style['--aheart-col-offset'] = props.offset
  }

  if (props.order !== undefined) {
    style['--aheart-col-order'] = props.order
  }

  if (props.pull !== undefined) {
    style['--aheart-col-pull'] = props.pull
  }

  if (props.push !== undefined) {
    style['--aheart-col-push'] = props.push
  }

  const flex = flexToValue(props.flex)

  if (flex !== undefined) {
    style['--aheart-col-flex'] = flex
  }

  breakpoints.forEach((breakpoint) => {
    const config = responsiveConfigs.value[breakpoint]

    if (!config) {
      return
    }

    if (config.span !== undefined) {
      style[`--aheart-col-${breakpoint}-span`] = config.span
    }

    if (config.offset !== undefined) {
      style[`--aheart-col-${breakpoint}-offset`] = config.offset
    }

    if (config.order !== undefined) {
      style[`--aheart-col-${breakpoint}-order`] = config.order
    }

    if (config.pull !== undefined) {
      style[`--aheart-col-${breakpoint}-pull`] = config.pull
    }

    if (config.push !== undefined) {
      style[`--aheart-col-${breakpoint}-push`] = config.push
    }

    const responsiveFlex = flexToValue(config.flex)

    if (responsiveFlex !== undefined) {
      style[`--aheart-col-${breakpoint}-flex`] = responsiveFlex
    }
  })

  return style
})
</script>
