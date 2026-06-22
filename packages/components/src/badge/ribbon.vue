<template>
  <div class="aheart-ribbon-wrapper" :class="wrapperClass" :style="wrapperStyle">
    <slot />
    <div class="aheart-ribbon__indicator" :class="indicatorClass" :style="indicatorStyle">
      <span class="aheart-ribbon__content" :class="contentClass" :style="contentStyle">
        <ARenderNode :node="text" />
      </span>
      <span class="aheart-ribbon__corner" :style="cornerStyle" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import { badgeRibbonProps } from './types'
import './style.css'

defineOptions({
  name: 'ABadgeRibbon'
})

const props = defineProps(badgeRibbonProps)

const ARenderNode = defineComponent({
  name: 'ABadgeRibbonRenderNode',
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

const wrapperClass = computed(() => [
  `aheart-ribbon--${props.placement}`,
  props.className,
  props.rootClassName,
  props.classNames?.root
])
const wrapperStyle = computed(() => [props.style, props.styles?.root])
const colorStyle = computed(() => (props.color ? { backgroundColor: props.color } : undefined))
const indicatorClass = computed(() => [props.classNames?.indicator])
const indicatorStyle = computed(() => [colorStyle.value, props.styles?.indicator])
const contentClass = computed(() => props.classNames?.content)
const contentStyle = computed(() => props.styles?.content)
const cornerStyle = computed(() => (props.color ? { color: props.color } : undefined))
</script>
