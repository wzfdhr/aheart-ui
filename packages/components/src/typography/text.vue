<template>
  <component :is="tagName" class="aheart-typography-text" :class="textClass">
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
  if (props.italic) return 'em'
  if (props.strong) return 'strong'
  return 'span'
})

const textClass = computed(() => ({
  [`aheart-typography-text--${props.type}`]: props.type,
  'is-strong': props.strong,
  'is-italic': props.italic,
  'is-disabled': props.disabled
}))
</script>
