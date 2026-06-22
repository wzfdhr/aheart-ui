<template>
  <button
    class="aheart-switch"
    :class="switchClass"
    type="button"
    role="switch"
    :aria-checked="modelValue ? 'true' : 'false'"
    :aria-busy="loading ? 'true' : undefined"
    :disabled="isDisabled || loading"
    @click="handleClick"
  >
    <span class="aheart-switch__handle" aria-hidden="true" />
    <span class="aheart-switch__label">
      {{ modelValue ? checkedChildren : unCheckedChildren }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { switchEmits, switchProps } from './types'
import './style.css'

defineOptions({
  name: 'ASwitch'
})

const props = defineProps(switchProps)
const emit = defineEmits(switchEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const switchClass = computed(() => [
  `aheart-switch--${resolvedSize.value}`,
  {
    'is-checked': props.modelValue,
    'is-loading': props.loading
  }
])

const handleClick = () => {
  if (isDisabled.value || props.loading) {
    return
  }

  const checked = !props.modelValue
  emit('update:modelValue', checked)
  emit('change', checked)
}
</script>
