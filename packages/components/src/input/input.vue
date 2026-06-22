<template>
  <span v-if="hasAddon" class="aheart-input-group" :class="`aheart-input-group--${resolvedSize}`">
    <span v-if="addonBefore" class="aheart-input__addon aheart-input__addon--before">{{ addonBefore }}</span>
    <span class="aheart-input" :class="inputClass">
      <span v-if="hasPrefix" class="aheart-input__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <input
        class="aheart-input__control"
        :id="id"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :readonly="readOnly"
        :maxlength="maxlength"
        @input="handleInput"
        @change="handleChange"
        @keydown="handleKeydown"
      />
      <button
        v-if="allowClear && !isDisabled && modelValue"
        class="aheart-input__clear"
        type="button"
        aria-label="Clear"
        @click="handleClear"
      >
        ×
      </button>
      <span v-if="hasSuffix" class="aheart-input__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
      <span v-if="showCount" class="aheart-input__count">{{ countText }}</span>
    </span>
    <span v-if="addonAfter" class="aheart-input__addon aheart-input__addon--after">{{ addonAfter }}</span>
  </span>
  <span v-else class="aheart-input" :class="inputClass">
    <span v-if="hasPrefix" class="aheart-input__prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      class="aheart-input__control"
      :id="id"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readOnly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @keydown="handleKeydown"
    />
    <button
      v-if="allowClear && !isDisabled && modelValue"
      class="aheart-input__clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      ×
    </button>
    <span v-if="hasSuffix" class="aheart-input__suffix">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
    <span v-if="showCount" class="aheart-input__count">{{ countText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputEmits, inputProps } from './types'
import './style.css'

defineOptions({
  name: 'AInput'
})

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const slots = useSlots()
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => props.modelValue ?? '')
const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? 'borderless' : 'outlined'))
const hasAddon = computed(() => Boolean(props.addonBefore || props.addonAfter))
const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix))
const hasSuffix = computed(() => Boolean(props.suffix || slots.suffix))

const inputClass = computed(() => [
  `aheart-input--${resolvedSize.value}`,
  `aheart-input--${resolvedVariant.value}`,
  {
    [`aheart-input--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])

const countText = computed(() => {
  const length = currentValue.value.length
  return props.maxlength ? `${length} / ${props.maxlength}` : String(length)
})

const getEventValue = (event: Event) => (event.target as HTMLInputElement).value

const handleInput = (event: Event) => {
  const value = getEventValue(event)
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  emit('change', getEventValue(event))
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event)
  }
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
}
</script>
