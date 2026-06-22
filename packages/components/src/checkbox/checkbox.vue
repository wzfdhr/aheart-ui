<template>
  <label ref="rootRef" class="aheart-checkbox" :class="checkboxClass" :style="rootStyle" :title="title">
    <span class="aheart-checkbox__box">
      <input
        ref="inputRef"
        class="aheart-checkbox__input"
        type="checkbox"
        :name="name"
        :value="value"
        :checked="mergedChecked"
        :disabled="isDisabled"
        :aria-checked="indeterminate ? 'mixed' : mergedChecked ? 'true' : 'false'"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
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
import { checkboxEmits, checkboxProps } from './types'
import './style.css'

defineOptions({
  name: 'ACheckbox'
})

const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmits)
const config = useAheartConfig()
const rootRef = ref<HTMLLabelElement>()
const inputRef = ref<HTMLInputElement>()
const internalChecked = ref(props.defaultChecked ?? false)

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isControlled = computed(() => props.checked !== undefined || props.modelValue !== undefined)
const mergedChecked = computed(() => props.checked ?? props.modelValue ?? internalChecked.value)

const checkboxClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-checked': mergedChecked.value,
    'is-indeterminate': props.indeterminate,
    'is-disabled': isDisabled.value
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const iconClass = computed(() => ['aheart-checkbox__inner', props.classNames?.icon])
const iconStyle = computed(() => props.styles?.icon)
const labelClass = computed(() => ['aheart-checkbox__label', props.classNames?.label])
const labelStyle = computed(() => props.styles?.label)

const handleChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  if (!isControlled.value) {
    internalChecked.value = checked
  }

  emit('update:modelValue', checked)
  emit('update:checked', checked)
  emit('change', checked, event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur,
  nativeElement: rootRef
})
</script>
