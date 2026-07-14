<template>
  <span ref="rootRef" class="aheart-select" :class="selectClass" :style="rootStyle">
    <span
      ref="selectorRef"
      class="aheart-select__selector"
      :class="classNames.selector"
      :style="styles.selector"
      :id="isSearchable ? undefined : id"
      :role="isSearchable ? undefined : 'combobox'"
      :tabindex="isSearchable || isDisabled ? undefined : 0"
      :aria-controls="listboxId"
      :aria-labelledby="resolvedAriaLabelledby"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-haspopup="isSearchable ? undefined : 'listbox'"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :aria-busy="loading ? 'true' : undefined"
      :aria-activedescendant="activeOptionId"
      @click="handleSelectorClick"
      @keydown="handleKeydown"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
    >
      <span v-if="hasPrefix" class="aheart-select__prefix" :class="classNames.prefix" :style="styles.prefix">
        <slot name="prefix"><ARenderNode :node="prefix" /></slot>
      </span>

      <span class="aheart-select__selection" :class="classNames.selection" :style="styles.selection">
        <template v-if="isMultiple">
          <span
            v-for="option in visibleSelectedOptions"
            :key="getOptionKey(option.value)"
            class="aheart-select__tag"
            :class="classNames.tag"
            :style="styles.tag"
          >
            <span class="aheart-select__tag-label"><ARenderNode :node="renderTag(option)" /></span>
            <button
              v-if="!isDisabled"
              class="aheart-select__tag-remove"
              :class="classNames.tagRemove"
              :style="styles.tagRemove"
              type="button"
              :aria-label="`Remove ${option.label}`"
              @click.stop="removeValue(option.value)"
            >
              ×
            </button>
          </span>
          <span v-if="hiddenTagCount > 0" class="aheart-select__tag aheart-select__tag--rest">
            +{{ hiddenTagCount }}
          </span>
        </template>

        <input
          v-if="isSearchable"
          ref="searchRef"
          class="aheart-select__search"
          :class="classNames.search"
          :style="styles.search"
          :id="id"
          type="text"
          role="combobox"
          autocomplete="off"
          :value="currentSearchValue"
          :disabled="isDisabled"
          :placeholder="searchPlaceholder"
          :aria-controls="listboxId"
          :aria-labelledby="resolvedAriaLabelledby"
          :aria-expanded="mergedOpen ? 'true' : 'false'"
          aria-haspopup="listbox"
          :aria-activedescendant="activeOptionId"
          :aria-busy="loading ? 'true' : undefined"
          @input="handleSearch"
          @click.stop="openPopup"
          @keydown="handleKeydown"
        />
        <span v-else-if="!isMultiple" class="aheart-select__value" :class="{ 'is-placeholder': !selectedOption }">
          {{ selectedOption?.label ?? placeholder ?? '' }}
        </span>
        <span v-else-if="selectedOptions.length === 0 && !isSearchable" class="aheart-select__value is-placeholder">
          {{ placeholder }}
        </span>
      </span>

      <input v-if="name" type="hidden" :name="name" :value="formValue" />

      <button
        v-if="allowClear && !isDisabled && !loading && hasValue"
        class="aheart-select__clear"
        :class="classNames.clear"
        :style="styles.clear"
        type="button"
        aria-label="Clear"
        @click.stop="handleClear"
      >
        <slot name="clearIcon"><ARenderNode :node="clearIconContent" /></slot>
      </button>

      <span v-if="loading" class="aheart-select__loading" :class="classNames.loading" :style="styles.loading" aria-hidden="true">
        <slot name="loadingIcon">
          <ARenderNode v-if="loadingIcon !== undefined" :node="loadingIcon" />
          <AIcon v-else name="loading" :size="16" spin />
        </slot>
      </span>
      <span v-else class="aheart-select__suffix" :class="classNames.suffix" :style="styles.suffix" aria-hidden="true">
        <slot name="suffixIcon">
          <ARenderNode v-if="suffixIcon !== undefined" :node="suffixIcon" />
          <AIcon v-else name="chevron-down" :size="16" />
        </slot>
      </span>
    </span>

    <span v-if="loading" class="aheart-select__status" role="status" aria-live="polite">Loading</span>

    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="motion.isMounted.value"
        v-show="motion.phase.value !== 'hidden'"
        :id="listboxId"
        ref="popupRef"
        class="aheart-select__popup"
        :class="popupClass"
        :style="popupStyle"
        role="listbox"
        :aria-multiselectable="isMultiple ? 'true' : undefined"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
      >
        <div class="aheart-select__list" :class="classNames.list" :style="styles.list">
          <div
            v-for="(option, index) in filteredOptions"
            :id="getOptionId(index)"
            :key="getOptionKey(option.value)"
            class="aheart-select__option"
            :class="[
              classNames.option,
              {
                'is-active': index === activeIndex,
                'is-selected': isValueSelected(option.value),
                'is-disabled': isOptionDisabled(option)
              }
            ]"
            :style="styles.option"
            role="option"
            :aria-selected="isValueSelected(option.value) ? 'true' : 'false'"
            :aria-disabled="isOptionDisabled(option) ? 'true' : undefined"
            @mouseenter="setActiveIndex(index)"
            @mousedown.prevent
            @click="selectOption(option)"
          >
            <span class="aheart-select__option-content">
              <ARenderNode :node="renderOption(option, index)" />
            </span>
            <AIcon v-if="isValueSelected(option.value)" name="check" :size="16" aria-hidden="true" />
          </div>
          <div
            v-if="hasNoOptions"
            class="aheart-select__empty"
            :class="classNames.notFound"
            :style="styles.notFound"
          >
            {{ loading ? 'Loading' : notFoundContent }}
          </div>
        </div>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, nextTick, ref, useAttrs, useId, useSlots, watch, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AIcon from '../icon/icon.vue'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
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

defineOptions({ name: 'ASelect' })

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const slots = useSlots()
const attrs = useAttrs()
const config = useAheartConfig()
const rootRef = ref<HTMLElement | null>(null)
const selectorRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const internalSearchValue = ref('')
const internalValue = ref<SelectValue | undefined>(props.defaultValue)
const internalOpen = ref(props.defaultOpen)
const activeIndex = ref(-1)
const focused = ref(false)
const instanceId = useId().replace(/:/g, '')
const listboxId = `aheart-select-${instanceId}-listbox`

const ARenderNode = defineComponent({
  name: 'ASelectRenderNode',
  props: { node: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const defaultFieldNames: Required<SelectFieldNames> = { label: 'label', value: 'value', disabled: 'disabled' }
const resolvedFieldNames = computed(() => ({ ...defaultFieldNames, ...props.fieldNames }))
const getRawField = (option: SelectRawOption, field: string) => (option as Record<string, unknown>)[field]
const normalizeOption = (option: SelectRawOption): SelectOption => {
  const fields = resolvedFieldNames.value
  const value = getRawField(option, fields.value)

  return {
    label: String(getRawField(option, fields.label) ?? ''),
    value: (typeof value === 'number' || typeof value === 'string' ? value : String(value ?? '')) as SelectPrimitiveValue,
    disabled: Boolean(getRawField(option, fields.disabled))
  }
}

const rawOptions = computed(() => props.options ?? [])
const normalizedOptions = computed(() => rawOptions.value.map(normalizeOption))
const isMultiple = computed(() => props.mode === 'multiple' || props.mode === 'tags')
const isSearchable = computed(() => props.showSearch || props.mode === 'tags')
const isControlled = usePropPresence('modelValue', 'model-value')
const mergedValue = computed(() => (isControlled.value ? props.modelValue : internalValue.value))
const isOpenControlled = usePropPresence('open')
const isSearchControlled = usePropPresence('searchValue', 'search-value')
const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value))
const currentSearchValue = computed(() => isSearchControlled.value ? props.searchValue ?? '' : internalSearchValue.value)
const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs['aria-labelledby'] as string | undefined)
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined'))
const hasPrefix = computed(() => Boolean(props.prefix !== undefined || slots.prefix))
const allowClearConfig = computed(() => (typeof props.allowClear === 'object' ? props.allowClear : undefined))
const clearIconContent = computed(() => allowClearConfig.value?.clearIcon ?? '×')
const getOptionKey = (value: SelectPrimitiveValue) => `${typeof value}:${String(value)}`
const valueEquals = (left: SelectPrimitiveValue, right: SelectPrimitiveValue) => left === right
const selectedValues = computed<SelectPrimitiveValue[]>(() =>
  Array.isArray(mergedValue.value)
    ? mergedValue.value
    : mergedValue.value === undefined || mergedValue.value === ''
      ? []
      : [mergedValue.value]
)
const selectedOptions = computed(() => selectedValues.value.map((value) =>
  normalizedOptions.value.find((option) => valueEquals(option.value, value)) ?? { label: String(value), value }
))
const selectedOption = computed(() => selectedOptions.value[0])
const visibleSelectedOptions = computed(() =>
  props.maxTagCount === undefined ? selectedOptions.value : selectedOptions.value.slice(0, Math.max(0, props.maxTagCount))
)
const hiddenTagCount = computed(() => selectedOptions.value.length - visibleSelectedOptions.value.length)
const hasValue = computed(() => selectedValues.value.length > 0)
const formValue = computed(() => isMultiple.value ? JSON.stringify(selectedValues.value) : String(selectedValues.value[0] ?? ''))
const searchPlaceholder = computed(() => selectedOptions.value.length === 0 ? props.placeholder : undefined)

const filteredOptions = computed(() => {
  const inputValue = currentSearchValue.value
  const normalizedSearchText = inputValue.trim().toLowerCase()
  if (!isSearchable.value || !normalizedSearchText || props.filterOption === false) return normalizedOptions.value

  const fields = resolvedFieldNames.value
  const filterField = props.optionFilterProp === 'label'
    ? fields.label
    : props.optionFilterProp === 'value'
      ? fields.value
      : props.optionFilterProp
  const filtered = typeof props.filterOption === 'function'
    ? normalizedOptions.value.filter((option) => props.filterOption && typeof props.filterOption === 'function' && props.filterOption(inputValue, option))
    : normalizedOptions.value.filter((_option, index) => String(getRawField(rawOptions.value[index], filterField) ?? '').toLowerCase().includes(normalizedSearchText))

  return props.filterSort
    ? filtered.slice().sort((a, b) => props.filterSort?.(a, b, { searchValue: inputValue }) ?? 0)
    : filtered
})
const hasNoOptions = computed(() => filteredOptions.value.length === 0)
const isOptionDisabled = (option: SelectOption) => Boolean(option.disabled)
const isValueSelected = (value: SelectPrimitiveValue) => selectedValues.value.some((selected) => valueEquals(selected, value))
const getOptionId = (index: number) => `${listboxId}-option-${index}`
const activeOptionId = computed(() => activeIndex.value >= 0 && mergedOpen.value ? getOptionId(activeIndex.value) : undefined)

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => {
  if (props.getPopupContainer && selectorRef.value) return props.getPopupContainer(selectorRef.value)
  return typeof document === 'undefined' ? false : document.body
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => popupContainer.value === false ? 'body' : popupContainer.value)
const floatingPosition = useFloatingPosition({
  reference: selectorRef,
  floating: popupRef,
  open: () => motion.isMounted.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  strategy: 'fixed',
  offset: 4,
  autoAdjustOverflow: () => props.autoAdjustOverflow
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
    'is-searchable': isSearchable.value,
    'is-open': mergedOpen.value,
    'is-focused': focused.value,
    'has-prefix': hasPrefix.value
  }
])
const rootStyle = computed(() => [props.style, props.styles.root])
const popupClass = computed(() => [
  `aheart-floating--${floatingPosition.placement.value}`,
  `is-${motion.phase.value}`,
  props.classNames.popup
])
const popupWidthStyle = computed(() => {
  if (props.popupMatchSelectWidth === false) return { minWidth: '160px' }
  const width = typeof props.popupMatchSelectWidth === 'number'
    ? props.popupMatchSelectWidth
    : selectorRef.value?.getBoundingClientRect().width
  return width ? { width: `${width}px` } : {}
})
const popupStyle = computed(() => [floatingPosition.popupStyle.value, popupWidthStyle.value, props.styles.popup])

const setInitialActive = () => {
  const selectedIndex = filteredOptions.value.findIndex((option) => isValueSelected(option.value) && !isOptionDisabled(option))
  activeIndex.value = selectedIndex >= 0 ? selectedIndex : filteredOptions.value.findIndex((option) => !isOptionDisabled(option))
}
const requestOpen = (open: boolean) => {
  if (isDisabled.value) return
  if (!isOpenControlled.value) internalOpen.value = open
  emit('openChange', open)
  if (open) setInitialActive()
}
const openPopup = () => {
  if (!mergedOpen.value) requestOpen(true)
}
const closePopup = () => requestOpen(false)
const handleSelectorClick = () => {
  if (isDisabled.value) return
  requestOpen(!mergedOpen.value)
  if (isSearchable.value) void nextTick(() => searchRef.value?.focus())
}

const emitValue = (value: SelectValue) => {
  if (!isControlled.value) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const clearSearch = () => {
  if (!isSearchControlled.value) internalSearchValue.value = ''
  if (isSearchable.value || currentSearchValue.value) emit('search', '')
}
const selectOption = (option: SelectOption) => {
  if (isDisabled.value || isOptionDisabled(option)) return
  if (isMultiple.value) {
    const next = isValueSelected(option.value)
      ? selectedValues.value.filter((value) => !valueEquals(value, option.value))
      : [...selectedValues.value, option.value]
    if (!isValueSelected(option.value) && props.maxCount !== undefined && next.length > props.maxCount) return
    emitValue(next)
    clearSearch()
    if (isSearchable.value) void nextTick(() => searchRef.value?.focus())
    return
  }

  emitValue(option.value)
  clearSearch()
  closePopup()
}
const removeValue = (value: SelectPrimitiveValue) => {
  if (isDisabled.value) return
  emitValue(selectedValues.value.filter((selected) => !valueEquals(selected, value)))
}
const handleClear = () => {
  if (isDisabled.value) return
  emitValue(isMultiple.value ? [] : '')
  clearSearch()
  emit('clear')
}
const renderOption = (option: SelectOption, index: number) => props.optionRender?.(option, { index }) ?? option.label
const renderTag = (option: SelectOption) => props.tagRender?.({
  label: option.label,
  value: option.value,
  closable: !isDisabled.value,
  onClose: () => removeValue(option.value)
}) ?? option.label

const handleSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (!isSearchControlled.value) internalSearchValue.value = value
  else (event.target as HTMLInputElement).value = currentSearchValue.value
  emit('search', value)
  openPopup()
  void nextTick(setInitialActive)
}
const setActiveIndex = (index: number) => {
  if (!isOptionDisabled(filteredOptions.value[index])) activeIndex.value = index
}
const moveActive = (direction: 1 | -1) => {
  if (filteredOptions.value.length === 0) return
  let index = activeIndex.value
  for (let attempts = 0; attempts < filteredOptions.value.length; attempts += 1) {
    index = (index + direction + filteredOptions.value.length) % filteredOptions.value.length
    if (!isOptionDisabled(filteredOptions.value[index])) {
      activeIndex.value = index
      return
    }
  }
}
const handleKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!mergedOpen.value) {
      requestOpen(true)
      return
    }
    moveActive(event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (event.key === 'Enter' && mergedOpen.value) {
    event.preventDefault()
    const option = filteredOptions.value[activeIndex.value]
    if (option) selectOption(option)
    else if (props.mode === 'tags' && currentSearchValue.value.trim()) {
      selectOption({ label: currentSearchValue.value.trim(), value: currentSearchValue.value.trim() })
    }
    return
  }
  if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    closePopup()
    void nextTick(() => (isSearchable.value ? searchRef.value : selectorRef.value)?.focus())
  }
}

const handleFocusIn = (event: FocusEvent) => {
  if (focused.value) return
  focused.value = true
  emit('focus', event)
}
const handleFocusOut = (event: FocusEvent) => {
  void nextTick(() => {
    const active = document.activeElement
    if (rootRef.value?.contains(active) || popupRef.value?.contains(active)) return
    focused.value = false
    emit('blur', event)
    closePopup()
  })
}

useFloatingDismiss({
  open: mergedOpen,
  trigger: selectorRef,
  floating: popupRef,
  onDismiss: () => closePopup()
})

watch(filteredOptions, () => {
  if (mergedOpen.value) setInitialActive()
})
watch(() => props.defaultOpen, (open) => {
  if (!isOpenControlled.value) internalOpen.value = open
})

const focus = () => (isSearchable.value ? searchRef.value : selectorRef.value)?.focus()
const blur = () => {
  searchRef.value?.blur()
  selectorRef.value?.blur()
}

defineExpose({ focus, blur })
</script>
