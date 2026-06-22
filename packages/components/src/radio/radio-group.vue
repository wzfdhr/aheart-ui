<template>
  <span class="aheart-radio-group" :class="radioGroupClass">
    <template v-if="optionType === 'button'">
      <label
        v-for="option in options"
        :key="getOptionKey(option.value)"
        class="aheart-radio-button"
        :class="getButtonClass(option)"
      >
        <input
          class="aheart-radio-button__input"
          type="radio"
          :name="name"
          :value="option.value"
          :checked="isSelected(option.value)"
          :disabled="isDisabled || option.disabled"
          @change="handleOptionChange(option)"
        />
        <span class="aheart-radio-button__label">{{ option.label }}</span>
      </label>
    </template>
    <template v-else>
      <Radio
        v-for="option in options"
        :key="getOptionKey(option.value)"
        :model-value="isSelected(option.value)"
        :value="option.value"
        :name="name"
        :label="option.label"
        :disabled="isDisabled || option.disabled"
        @change="() => handleOptionChange(option)"
      />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import Radio from './radio.vue'
import { radioGroupEmits, radioGroupProps, type RadioOption, type RadioValue } from './types'
import './style.css'

defineOptions({
  name: 'ARadioGroup'
})

const props = defineProps(radioGroupProps)
const emit = defineEmits(radioGroupEmits)
const config = useAheartConfig()

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))

const radioGroupClass = computed(() => [
  `aheart-radio-group--${props.direction}`,
  `aheart-radio-group--${resolvedSize.value}`,
  {
    'aheart-radio-group--button': props.optionType === 'button',
    'aheart-radio-group--solid': props.buttonStyle === 'solid',
    'aheart-radio-group--block': props.block,
    'is-disabled': isDisabled.value
  }
])

const getOptionKey = (value: RadioValue) => `${typeof value}:${String(value)}`

const isSelected = (value: RadioValue) => props.modelValue === value

const getButtonClass = (option: RadioOption) => ({
  'is-checked': isSelected(option.value),
  'is-disabled': isDisabled.value || option.disabled
})

const handleOptionChange = (option: RadioOption) => {
  if (isDisabled.value || option.disabled) {
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>
