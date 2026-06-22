<template>
  <span class="aheart-tag" :class="tagClass" :style="tagStyle">
    <span class="aheart-tag__content">
      <slot />
    </span>
    <button v-if="closable" class="aheart-tag__close" type="button" aria-label="Close" @click="handleClose">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tagEmits, tagProps } from './types'
import './style.css'

defineOptions({
  name: 'ATag'
})

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const presetColors = ['default', 'primary', 'success', 'warning', 'danger']
const isPresetColor = computed(() => presetColors.includes(props.color))

const tagClass = computed(() => ({
  [`aheart-tag--${props.color}`]: isPresetColor.value,
  'is-custom-color': !isPresetColor.value
}))

const tagStyle = computed(() => ({
  '--aheart-tag-color': isPresetColor.value ? undefined : props.color
}))

const handleClose = (event: MouseEvent) => {
  emit('close', event)
}
</script>
