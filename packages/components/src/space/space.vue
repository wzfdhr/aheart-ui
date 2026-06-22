<template>
  <div class="aheart-space" :class="spaceClass" :style="spaceStyle">
    <template v-for="(child, index) in normalizedChildren" :key="index">
      <div class="aheart-space__item">
        <component :is="child" />
      </div>
      <span v-if="separatorText && index < normalizedChildren.length - 1" class="aheart-space__separator">
        {{ separatorText }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Comment, Fragment, computed, useSlots, type VNode } from 'vue'
import { useAheartConfig } from '../config'
import { spaceProps, type SpaceSize } from './types'
import './style.css'

defineOptions({
  name: 'ASpace'
})

const props = defineProps(spaceProps)
const slots = useSlots()
const config = useAheartConfig()

const flattenChildren = (children: VNode[]): VNode[] => {
  return children.flatMap((child) => {
    if (child.type === Comment) {
      return []
    }

    if (child.type === Fragment && Array.isArray(child.children)) {
      return flattenChildren(child.children as VNode[])
    }

    return [child]
  })
}

const normalizedChildren = computed(() => flattenChildren(slots.default?.() || []))
const resolvedDirection = computed(() => props.orientation || (props.vertical ? 'vertical' : props.direction))
const separatorText = computed(() => props.separator ?? props.split)

const sizeToGap = (size: SpaceSize | undefined) => {
  if (Array.isArray(size)) {
    return [`${size[0]}px`, `${size[1]}px`]
  }

  if (typeof size === 'number') {
    return [`${size}px`, `${size}px`]
  }

  const resolved = size || config.value.size || 'middle'
  const tokenMap = {
    large: 'var(--aheart-spacing-lg)',
    middle: 'var(--aheart-spacing-md)',
    small: 'var(--aheart-spacing-sm)'
  }

  return [tokenMap[resolved], tokenMap[resolved]]
}

const spaceClass = computed(() => [
  `aheart-space--${resolvedDirection.value}`,
  {
    [`aheart-space--align-${props.align}`]: props.align,
    'is-wrap': props.wrap
  }
])

const spaceStyle = computed(() => {
  const [horizontal, vertical] = sizeToGap(props.size)

  return {
    '--aheart-space-gap-horizontal': horizontal,
    '--aheart-space-gap-vertical': vertical
  }
})
</script>
