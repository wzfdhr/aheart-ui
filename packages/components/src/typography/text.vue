<template>
  <component :is="tagName" class="aheart-typography-text" :class="textClass" :style="textStyle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textProps } from './types'
import './style.css'

defineOptions({
  name: 'AText'
})

const props = defineProps(textProps)

const tagName = computed(() => {
  if (props.code) return 'code'
  if (props.keyboard) return 'kbd'
  if (props.delete) return 'del'
  if (props.underline) return 'u'
  if (props.mark) return 'mark'
  if (props.italic) return 'em'
  if (props.strong) return 'strong'
  return 'span'
})

const semanticInfo = computed(() => ({ props: props as unknown as Record<string, unknown> }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)

const textClass = computed(() => [
  {
    [`aheart-typography-text--${props.type}`]: props.type,
    'is-strong': props.strong,
    'is-italic': props.italic,
    'is-mark': props.mark,
    'is-disabled': props.disabled
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const textStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
