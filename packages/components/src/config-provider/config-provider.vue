<template>
  <div class="aheart-config-provider" :style="cssVariables">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { provideAheartConfig } from '../config'
import { configProviderProps } from './types'
import './style.css'

defineOptions({
  name: 'AConfigProvider'
})

const props = defineProps(configProviderProps)

provideAheartConfig(
  computed(() => ({
    size: props.size,
    disabled: props.disabled,
    locale: props.locale,
    theme: props.theme
  }))
)

const cssVariables = computed(() => {
  const theme = props.theme || {}

  return {
    '--aheart-color-primary': theme.primaryColor,
    '--aheart-color-primary-hover': theme.primaryHoverColor,
    '--aheart-color-success': theme.successColor,
    '--aheart-color-warning': theme.warningColor,
    '--aheart-color-danger': theme.dangerColor,
    '--aheart-color-info': theme.infoColor,
    '--aheart-color-text': theme.textColor,
    '--aheart-color-text-secondary': theme.textSecondaryColor,
    '--aheart-color-border': theme.borderColor,
    '--aheart-color-fill': theme.fillColor,
    '--aheart-color-bg': theme.backgroundColor,
    '--aheart-radius': theme.borderRadius,
    '--aheart-font-size': theme.fontSize
  }
})
</script>
