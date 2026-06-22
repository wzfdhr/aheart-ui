<template>
  <div class="aheart-space" :class="spaceClass" :style="spaceStyle">
    <template v-for="(child, index) in normalizedChildren" :key="index">
      <div class="aheart-space__item" :class="semanticClassNames.item" :style="semanticStyles.item">
        <component :is="child" />
      </div>
      <span
        v-if="separatorNode !== undefined && separatorNode !== null && index < normalizedChildren.length - 1"
        class="aheart-space__separator"
        :class="semanticClassNames.separator"
        :style="semanticStyles.separator"
      >
        <ARenderNode :node="separatorNode" />
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Comment, Fragment, computed, defineComponent, useSlots, type PropType, type VNode, type VNodeChild } from 'vue'
import { useAheartConfig } from '../config'
import { spaceProps, type SpaceSize } from './types'
import './style.css'

defineOptions({
  name: 'ASpace'
})

const props = defineProps(spaceProps)
const slots = useSlots()
const config = useAheartConfig()

const ARenderNode = defineComponent({
  name: 'ASpaceRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

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
const separatorNode = computed(() => props.separator ?? props.split)
const semanticInfo = computed(() => ({
  props: {
    size: props.size,
    direction: props.direction,
    orientation: props.orientation,
    vertical: props.vertical,
    align: props.align,
    wrap: props.wrap,
    separator: props.separator,
    split: props.split
  }
}))

const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)

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
  props.className,
  props.rootClassName,
  semanticClassNames.value.root,
  `aheart-space--${resolvedDirection.value}`,
  {
    [`aheart-space--align-${props.align}`]: props.align,
    'is-wrap': props.wrap
  }
])

const spaceStyle = computed(() => {
  const [horizontal, vertical] = sizeToGap(props.size)

  return [
    {
      '--aheart-space-gap-horizontal': horizontal,
      '--aheart-space-gap-vertical': vertical
    },
    props.style,
    semanticStyles.value.root
  ]
})
</script>
