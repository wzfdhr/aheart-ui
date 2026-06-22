<template>
  <component :is="tagName" class="aheart-typography-title" :class="titleClass" :style="titleStyle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { titleProps } from './types'
import './style.css'

defineOptions({
  name: 'ATitle'
})

const props = defineProps(titleProps)
const tagName = computed(() => `h${props.level}`)

const semanticInfo = computed(() => ({ props: props as unknown as Record<string, unknown> }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)

const titleClass = computed(() => [
  `aheart-typography-title--${props.level}`,
  props.type ? `aheart-typography-title--${props.type}` : undefined,
  {
    'is-disabled': props.disabled,
    'is-mark': props.mark
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const titleStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
