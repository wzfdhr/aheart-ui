<template>
  <button
    class="aheart-button"
    :class="buttonClass"
    :type="nativeType"
    :disabled="isDisabled || loading"
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
import { resolveConfigValue, useAheartConfig } from '../config'
import { buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)
const config = useAheartConfig()

const resolvedSize = computed(() => {
  const providerSize = config.value.size === 'middle' ? 'normal' : config.value.size
  return resolveConfigValue(props.size, providerSize, 'normal')
})

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${resolvedSize.value}`,
  {
    'is-block': props.block,
    'is-round': props.round,
    'is-loading': props.loading
  }
])
</script>
