<template>
  <label class="aheart-radio" :class="radioClass" :style="rootStyle" :title="title">
    <span class="aheart-radio__box">
      <input
        ref="inputRef"
        class="aheart-radio__input"
        type="radio"
        :name="name"
        :value="value"
        :checked="mergedChecked"
        :disabled="isDisabled"
        @change="handleChange"
      />
      <span :class="iconClass" :style="iconStyle" aria-hidden="true" />
    </span>
    <span :class="labelClass" :style="labelStyle">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { radioEmits, radioProps } from './types'
import './style.css'

defineOptions({
  name: 'ARadio'
})

const props = defineProps(radioProps)
const emit = defineEmits(radioEmits)
const config = useAheartConfig()
const inputRef = ref<HTMLInputElement>()
const internalChecked = ref(props.defaultChecked ?? false)

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isControlled = computed(() => props.checked !== undefined || props.modelValue !== undefined)
const mergedChecked = computed(() => props.checked ?? props.modelValue ?? internalChecked.value)

const radioClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-checked': mergedChecked.value,
    'is-disabled': isDisabled.value
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const iconClass = computed(() => ['aheart-radio__inner', props.classNames?.icon])
const iconStyle = computed(() => props.styles?.icon)
const labelClass = computed(() => ['aheart-radio__label', props.classNames?.label])
const labelStyle = computed(() => props.styles?.label)

const handleChange = (event: Event) => {
  if (isDisabled.value) {
    return
  }

  if (!isControlled.value) {
    internalChecked.value = true
  }

  emit('update:modelValue', true)
  emit('update:checked', true)
  emit('change', true, event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>
