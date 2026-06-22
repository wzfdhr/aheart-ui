<template>
  <component :is="component" class="aheart-flex" :class="flexClass" :style="flexStyle">
    <slot />
  </component>
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
    medium: 'var(--aheart-spacing-md)',
    small: 'var(--aheart-spacing-sm)'
  }

  return gap ? (tokenMap[gap as keyof typeof tokenMap] ?? gap) : undefined
}

const justifyToValue = (justify: string | undefined) => {
  const valueMap: Record<string, string> = {
    start: 'flex-start',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }

  return justify ? valueMap[justify] ?? justify : undefined
}

const alignToValue = (align: string | undefined) => {
  const valueMap: Record<string, string> = {
    start: 'flex-start',
    end: 'flex-end'
  }

  return align ? valueMap[align] ?? align : undefined
}

const wrapToValue = (wrap: boolean | string | undefined) => {
  if (wrap === true) {
    return 'wrap'
  }

  if (wrap === false || wrap === undefined) {
    return undefined
  }

  return wrap === 'reverse' ? 'wrap-reverse' : wrap
}

const resolvedOrientation = computed(() => props.orientation || (props.vertical ? 'vertical' : 'horizontal'))
const resolvedWrap = computed(() => wrapToValue(props.wrap))

const flexClass = computed(() => [
  props.className,
  props.rootClassName,
  `aheart-flex--${resolvedOrientation.value}`,
  {
    'is-vertical': resolvedOrientation.value === 'vertical',
    'is-wrap': props.wrap === true,
    [`is-wrap-${props.wrap}`]: typeof props.wrap === 'string',
    [`aheart-flex--justify-${props.justify}`]: props.justify,
    [`aheart-flex--align-${props.align}`]: props.align
  }
])

const flexStyle = computed(() => [
  {
    '--aheart-flex-gap': gapToValue(props.gap),
    flexDirection: resolvedOrientation.value === 'vertical' ? 'column' : undefined,
    flexWrap: resolvedWrap.value,
    justifyContent: justifyToValue(props.justify),
    alignItems: alignToValue(props.align),
    flex: props.flex
  },
  props.style
])
</script>
