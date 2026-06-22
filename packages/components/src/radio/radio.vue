<template>
  <label class="aheart-radio" :class="radioClass">
    <span class="aheart-radio__box">
      <input
        class="aheart-radio__input"
        type="radio"
        :name="name"
        :value="value"
        :checked="modelValue"
        :disabled="isDisabled"
        @change="handleChange"
      />
      <span class="aheart-radio__inner" aria-hidden="true" />
    </span>
    <span class="aheart-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { radioEmits, radioProps } from './types'
import './style.css'

defineOptions({
  name: 'ARadio'
})

const props = defineProps(radioProps)
const emit = defineEmits(radioEmits)
const config = useAheartConfig()

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const radioClass = computed(() => ({
  'is-checked': props.modelValue,
  'is-disabled': isDisabled.value
}))

const handleChange = () => {
  emit('update:modelValue', true)
  emit('change', true)
}
</script>
