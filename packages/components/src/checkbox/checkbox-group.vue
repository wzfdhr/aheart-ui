<template>
  <span class="aheart-checkbox-group" :class="checkboxGroupClass">
    <Checkbox
      v-for="option in options"
      :key="getOptionKey(option.value)"
      :model-value="isChecked(option.value)"
      :value="option.value"
      :name="name"
      :label="option.label"
      :disabled="isDisabled || option.disabled"
      @change="(checked) => handleOptionChange(option.value, checked)"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import Checkbox from './checkbox.vue'
import { checkboxGroupEmits, checkboxGroupProps, type CheckboxValue } from './types'
import './style.css'

defineOptions({
  name: 'ACheckboxGroup'
})

const props = defineProps(checkboxGroupProps)
const emit = defineEmits(checkboxGroupEmits)
const config = useAheartConfig()

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const checkboxGroupClass = computed(() => [
  `aheart-checkbox-group--${props.direction}`,
  {
    'is-disabled': isDisabled.value
  }
])

const getOptionKey = (value: CheckboxValue) => `${typeof value}:${String(value)}`

const isChecked = (value: CheckboxValue) => props.modelValue.includes(value)

const handleOptionChange = (value: CheckboxValue, checked: boolean) => {
  const nextValue = checked
    ? Array.from(new Set([...props.modelValue, value]))
    : props.modelValue.filter((currentValue) => currentValue !== value)

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>
