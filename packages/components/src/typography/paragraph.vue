<template>
  <p class="aheart-typography-paragraph" :class="paragraphClass">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { paragraphProps } from './types'
import './style.css'

defineOptions({
  name: 'AParagraph'
})

const props = defineProps(paragraphProps)

const paragraphClass = computed(() => ({
  [`aheart-typography-paragraph--${props.type}`]: props.type,
  'is-strong': props.strong,
  'is-italic': props.italic,
  'is-ellipsis': props.ellipsis,
  'is-disabled': props.disabled
}))
</script>
