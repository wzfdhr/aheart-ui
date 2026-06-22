<template>
  <span class="aheart-select" :class="selectClass" :style="rootStyle">
    <span v-if="hasPrefix" class="aheart-select__prefix" :class="classNames.prefix" :style="styles.prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      v-if="showSearch"
      ref="searchRef"
      class="aheart-select__search"
      :class="classNames.search"
      :style="styles.search"
      type="search"
      :value="currentSearchValue"
      :disabled="isDisabled"
      :placeholder="placeholder"
      aria-label="Search options"
      @input="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <select
      ref="selectRef"
      class="aheart-select__control"
      :class="classNames.selector"
      :style="styles.selector"
      :id="id"
      :name="name"
      :value="selectValue"
      :multiple="isMultiple"
      :disabled="isDisabled"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <option v-if="placeholder && !isMultiple && !showSearch && !hasNoOptions" value="" disabled>{{ placeholder }}</option>
      <option v-if="hasNoOptions" value="" disabled :class="classNames.notFound" :style="styles.notFound">{{ notFoundContent }}</option>
      <option
        v-for="option in filteredOptions"
        :key="getOptionKey(option.value)"
        :value="stringifyValue(option.value)"
        :disabled="isOptionDisabled(option)"
        :class="classNames.option"
        :style="styles.option"
      >
        {{ option.label }}
      </option>
    </select>
    <button
      v-if="allowClear && !isDisabled && hasValue"
      class="aheart-select__clear"
      :class="classNames.clear"
      :style="styles.clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      <slot name="clearIcon">
        <ARenderNode :node="clearIconContent" />
      </slot>
    </button>
    <span v-if="loading" class="aheart-select__loading" :class="classNames.loading" :style="styles.loading" aria-hidden="true">
      <slot name="loadingIcon">
        <ARenderNode :node="loadingIconContent" />
      </slot>
    </span>
    <span v-if="hasSuffix" class="aheart-select__suffix" :class="classNames.suffix" :style="styles.suffix">
      <slot name="suffixIcon">{{ suffixIcon }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, useSlots, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import {
  selectEmits,
  selectProps,
  type SelectFieldNames,
  type SelectOption,
  type SelectPrimitiveValue,
  type SelectRawOption,
  type SelectValue
} from './types'
import './style.css'

defineOptions({
  name: 'ASelect'
})

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const slots = useSlots()
const config = useAheartConfig()
const searchRef = ref<HTMLInputElement>()
const selectRef = ref<HTMLSelectElement>()
const internalSearchValue = ref('')
const internalValue = ref<SelectValue | undefined>(props.defaultValue)

const ARenderNode = defineComponent({
  name: 'ASelectRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const defaultFieldNames: Required<SelectFieldNames> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled'
}

const resolvedFieldNames = computed(() => ({
  ...defaultFieldNames,
  ...props.fieldNames
}))
const getRawField = (option: SelectRawOption, field: string) => (option as Record<string, unknown>)[field]
const normalizeOption = (option: SelectRawOption): SelectOption => {
  const fieldNames = resolvedFieldNames.value
  const label = getRawField(option, fieldNames.label)
  const value = getRawField(option, fieldNames.value)
  const disabled = getRawField(option, fieldNames.disabled)

  return {
    label: String(label ?? ''),
    value: (typeof value === 'number' || typeof value === 'string' ? value : String(value ?? '')) as SelectPrimitiveValue,
    disabled: Boolean(disabled)
  }
}

const rawOptions = computed(() => props.options ?? [])
const normalizedOptions = computed(() => rawOptions.value.map(normalizeOption))
const isMultiple = computed(() => props.mode === 'multiple' || props.mode === 'tags')
const isControlled = computed(() => props.modelValue !== undefined)
const mergedValue = computed(() => (isControlled.value ? props.modelValue : internalValue.value))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const currentSearchValue = computed(() => props.searchValue ?? internalSearchValue.value)
const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix))
const hasSuffix = computed(() => Boolean(props.suffixIcon || slots.suffixIcon))
const hasSuffixAffordance = computed(() => hasSuffix.value || props.loading)
const allowClearConfig = computed(() => {
  if (!props.allowClear) {
    return undefined
  }

  return typeof props.allowClear === 'object' ? props.allowClear : {}
})
const clearIconContent = computed(() => allowClearConfig.value?.clearIcon ?? '×')
const loadingIconContent = computed(() => props.loadingIcon ?? '…')

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
  const fieldNames = resolvedFieldNames.value
  const filterField =
    props.optionFilterProp === fieldNames.label || props.optionFilterProp === 'label'
      ? fieldNames.label
      : props.optionFilterProp === fieldNames.value || props.optionFilterProp === 'value'
        ? fieldNames.value
        : props.optionFilterProp

  const filtered =
    typeof filterOption === 'function'
      ? normalizedOptions.value.filter((option) => filterOption(searchText, option))
      : normalizedOptions.value.filter((option, index) => {
          const rawValue = getRawField(rawOptions.value[index], filterField)
          return String(rawValue ?? '').toLowerCase().includes(searchText)
        })

  return props.filterSort ? filtered.slice().sort((a, b) => props.filterSort?.(a, b, { searchValue: searchText }) ?? 0) : filtered
})

const hasNoOptions = computed(() => filteredOptions.value.length === 0)

const selectValue = computed(() => {
  if (isMultiple.value) {
    return Array.isArray(mergedValue.value) ? mergedValue.value.map(stringifyValue) : []
  }

  return typeof mergedValue.value === 'string' || typeof mergedValue.value === 'number' ? stringifyValue(mergedValue.value) : ''
})

const hasValue = computed(() => {
  if (Array.isArray(mergedValue.value)) {
    return mergedValue.value.length > 0
  }

  return mergedValue.value !== undefined && mergedValue.value !== null && mergedValue.value !== ''
})

const selectClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  `aheart-select--${resolvedSize.value}`,
  `aheart-select--${resolvedVariant.value}`,
  {
    [`aheart-select--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-loading': props.loading,
    'is-multiple': isMultiple.value,
    'is-searchable': props.showSearch,
    'has-prefix': hasPrefix.value,
    'has-suffix': hasSuffixAffordance.value
  }
])
const rootStyle = computed(() => [props.style, props.styles.root])

const emitValue = (value: SelectValue) => {
  if (!isControlled.value) {
    internalValue.value = value
  }

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
  if (!isControlled.value) {
    internalValue.value = value
  }

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

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const focus = () => {
  const target = props.showSearch ? searchRef.value : selectRef.value
  target?.focus()
}

const blur = () => {
  searchRef.value?.blur()
  selectRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>
