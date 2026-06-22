<template>
  <span class="aheart-select" :class="selectClass">
    <span v-if="hasPrefix" class="aheart-select__prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      v-if="showSearch"
      class="aheart-select__search"
      type="search"
      :value="currentSearchValue"
      :disabled="isDisabled"
      :placeholder="placeholder"
      aria-label="Search options"
      @input="handleSearch"
    />
    <select
      class="aheart-select__control"
      :id="id"
      :name="name"
      :value="selectValue"
      :multiple="isMultiple"
      :disabled="isDisabled"
      @change="handleChange"
    >
      <option v-if="placeholder && !isMultiple && !showSearch && !hasNoOptions" value="" disabled>{{ placeholder }}</option>
      <option v-if="hasNoOptions" value="" disabled>{{ notFoundContent }}</option>
      <option
        v-for="option in filteredOptions"
        :key="getOptionKey(option.value)"
        :value="stringifyValue(option.value)"
        :disabled="isOptionDisabled(option)"
      >
        {{ option.label }}
      </option>
    </select>
    <button
      v-if="allowClear && !isDisabled && hasValue"
      class="aheart-select__clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      ×
    </button>
    <span v-if="hasSuffix" class="aheart-select__suffix">
      <slot name="suffixIcon">{{ suffixIcon }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { selectEmits, selectProps, type SelectOption, type SelectPrimitiveValue, type SelectValue } from './types'
import './style.css'

defineOptions({
  name: 'ASelect'
})

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const slots = useSlots()
const config = useAheartConfig()
const internalSearchValue = ref('')

const normalizedOptions = computed(() => props.options ?? [])
const isMultiple = computed(() => props.mode === 'multiple' || props.mode === 'tags')
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const currentSearchValue = computed(() => props.searchValue ?? internalSearchValue.value)
const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix))
const hasSuffix = computed(() => Boolean(props.suffixIcon || slots.suffixIcon))

const stringifyValue = (value: SelectPrimitiveValue) => String(value)

const getOptionKey = (value: SelectPrimitiveValue) => `${typeof value}:${String(value)}`

const mapNativeValue = (value: string): SelectPrimitiveValue => {
  const option = normalizedOptions.value.find((currentOption) => stringifyValue(currentOption.value) === value)
  return option?.value ?? value
}

const filteredOptions = computed(() => {
  if (!props.showSearch) {
    return normalizedOptions.value
  }

  const searchText = currentSearchValue.value.trim().toLowerCase()

  if (!searchText || props.filterOption === false) {
    return normalizedOptions.value
  }

  const filterOption = props.filterOption

  if (typeof filterOption === 'function') {
    return normalizedOptions.value.filter((option) => filterOption(searchText, option))
  }

  return normalizedOptions.value.filter((option) => option.label.toLowerCase().includes(searchText))
})

const hasNoOptions = computed(() => filteredOptions.value.length === 0)

const selectValue = computed(() => {
  if (isMultiple.value) {
    return Array.isArray(props.modelValue) ? props.modelValue.map(stringifyValue) : []
  }

  return typeof props.modelValue === 'string' || typeof props.modelValue === 'number' ? stringifyValue(props.modelValue) : ''
})

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }

  return Boolean(props.modelValue)
})

const selectClass = computed(() => [
  `aheart-select--${resolvedSize.value}`,
  `aheart-select--${resolvedVariant.value}`,
  {
    [`aheart-select--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-multiple': isMultiple.value,
    'is-searchable': props.showSearch,
    'has-prefix': hasPrefix.value,
    'has-suffix': hasSuffix.value
  }
])

const emitValue = (value: SelectValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement

  if (isMultiple.value) {
    const selectedValues = Array.from(target.selectedOptions).map((option) => mapNativeValue(option.value))
    emitValue(props.maxCount === undefined ? selectedValues : selectedValues.slice(0, props.maxCount))
    return
  }

  emitValue(mapNativeValue(target.value))
}

const handleClear = () => {
  const value = isMultiple.value ? [] : ''
  emit('update:modelValue', value)
  emit('change', value)
  emit('clear')
}

const isOptionDisabled = (option: SelectOption) => option.disabled

const handleSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  internalSearchValue.value = value
  emit('search', value)
}
</script>
