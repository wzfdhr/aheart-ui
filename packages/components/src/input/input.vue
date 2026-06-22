<template>
  <span v-if="hasAddon" class="aheart-input-group" :class="`aheart-input-group--${resolvedSize}`">
    <span v-if="addonBefore" class="aheart-input__addon aheart-input__addon--before">{{ addonBefore }}</span>
    <span class="aheart-input" :class="inputClass" :style="rootStyle">
      <span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <input
        class="aheart-input__control"
        :class="controlClass"
        :style="controlStyle"
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
        v-if="showClear"
        :class="clearClass"
        :style="clearStyle"
        type="button"
        aria-label="Clear"
        @click="handleClear"
      >
        <slot name="clearIcon">{{ clearIconContent }}</slot>
      </button>
      <span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
      <span v-if="showCountDisplay" :class="countClass" :style="countStyle">{{ countText }}</span>
    </span>
    <span v-if="addonAfter" class="aheart-input__addon aheart-input__addon--after">{{ addonAfter }}</span>
  </span>
  <span v-else class="aheart-input" :class="inputClass" :style="rootStyle">
    <span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      class="aheart-input__control"
      :class="controlClass"
      :style="controlStyle"
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
      v-if="showClear"
      :class="clearClass"
      :style="clearStyle"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      <slot name="clearIcon">{{ clearIconContent }}</slot>
    </button>
    <span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
    <span v-if="showCountDisplay" :class="countClass" :style="countStyle">{{ countText }}</span>
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
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const hasAddon = computed(() => Boolean(props.addonBefore || props.addonAfter))
const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix))
const hasSuffix = computed(() => Boolean(props.suffix || slots.suffix))
const allowClearConfig = computed(() =>
  typeof props.allowClear === 'object' && props.allowClear !== null ? props.allowClear : undefined
)
const showClear = computed(() => Boolean(props.allowClear) && !isDisabled.value && Boolean(currentValue.value))
const clearIconContent = computed(() => allowClearConfig.value?.clearIcon ?? '×')

const inputClass = computed(() => [
  `aheart-input--${resolvedSize.value}`,
  `aheart-input--${resolvedVariant.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    [`aheart-input--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const controlClass = computed(() => props.classNames?.input)
const controlStyle = computed(() => props.styles?.input)
const prefixClass = computed(() => ['aheart-input__prefix', props.classNames?.prefix])
const prefixStyle = computed(() => props.styles?.prefix)
const suffixClass = computed(() => ['aheart-input__suffix', props.classNames?.suffix])
const suffixStyle = computed(() => props.styles?.suffix)
const clearClass = computed(() => ['aheart-input__clear', props.classNames?.clear])
const clearStyle = computed(() => props.styles?.clear)
const countClass = computed(() => ['aheart-input__count', props.classNames?.count])
const countStyle = computed(() => props.styles?.count)

const countLength = computed(() => props.count?.strategy?.(currentValue.value) ?? currentValue.value.length)
const countMaxLength = computed(() => props.count?.max ?? props.maxlength)
const countInfo = computed(() => ({
  count: countLength.value,
  maxLength: countMaxLength.value,
  value: currentValue.value
}))
const showCountFormatter = computed(() =>
  typeof props.showCount === 'object' && props.showCount !== null ? props.showCount.formatter : undefined
)
const showCountDisplay = computed(() => {
  if (props.count?.show === false) {
    return false
  }

  return Boolean(props.showCount) || props.count?.show === true || typeof props.count?.show === 'function'
})
const countText = computed(() => {
  if (typeof props.count?.show === 'function') {
    return props.count.show(countInfo.value)
  }

  if (showCountFormatter.value) {
    return showCountFormatter.value(countInfo.value)
  }

  return countMaxLength.value ? `${countLength.value} / ${countMaxLength.value}` : String(countLength.value)
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
