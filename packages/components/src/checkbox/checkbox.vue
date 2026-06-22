<template>
  <label class="aheart-checkbox" :class="checkboxClass">
    <span class="aheart-checkbox__box">
      <input
        class="aheart-checkbox__input"
        type="checkbox"
        :name="name"
        :value="value"
        :checked="modelValue"
        :disabled="isDisabled"
        :aria-checked="indeterminate ? 'mixed' : modelValue ? 'true' : 'false'"
        @change="handleChange"
      />
      <span class="aheart-checkbox__inner" aria-hidden="true" />
    </span>
    <span class="aheart-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { checkboxEmits, checkboxProps } from './types'
import './style.css'

defineOptions({
  name: 'ACheckbox'
})

const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmits)
const config = useAheartConfig()

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const checkboxClass = computed(() => ({
  'is-checked': props.modelValue,
  'is-indeterminate': props.indeterminate,
  'is-disabled': isDisabled.value
}))

const handleChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked)
}
</script>
