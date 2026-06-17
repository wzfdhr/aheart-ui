<template>
  <button
    class="aheart-button"
    :class="buttonClass"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="aheart-button__loading" aria-hidden="true" />
    <span class="aheart-button__content">
      <slot>按钮</slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${props.size}`,
  {
    'is-block': props.block,
    'is-round': props.round,
    'is-loading': props.loading
  }
])
</script>
