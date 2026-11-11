<template>
  <div class="aheart-combobox">
    <input
      v-bind="$attrs"
      :id="inputId"
      ref="inputRef"
      class="aheart-combobox__input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-expanded="open"
      :aria-controls="open ? listboxId : undefined"
      :aria-activedescendant="open ? activeOption?.id : undefined"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="inputText"
      @click="showOptions"
      @blur="close"
      @input="handleInput"
      @compositionstart="composing = true"
      @compositionend="handleCompositionEnd"
      @keydown="handleKeydown"
    />
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="motion.isMounted.value"
        ref="panelRef"
        class="aheart-combobox__popup"
        :class="[`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`]"
        :style="floatingPosition.popupStyle.value"
        :aria-hidden="open ? undefined : true"
        @mousedown.prevent
      >
        <div
          :id="listboxId"
          role="listbox"
          :aria-label="($attrs['aria-label'] as string | undefined) || 'Suggestions'"
          :aria-labelledby="$attrs['aria-labelledby'] as string | undefined"
        >
          <div
            v-for="entry in filteredOptions"
            :id="entry.id"
            :key="entry.key"
            class="aheart-combobox__option"
            :class="{ 'is-active': entry.key === activeKey }"
            role="option"
            :aria-selected="Object.is(entry.option.value, selection.state.value)"
            :aria-disabled="entry.option.disabled || undefined"
            @click="select(entry.option)"
          >{{ entry.option.label }}</div>
        </div>
        <div v-if="!filteredOptions.length" class="aheart-combobox__empty" role="status">
          <slot name="empty">No matching options</slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useControllableState } from '../utils/use-controllable-state'
import { useFloatingLayer } from '../utils/use-floating-layer'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { getNextEnabledKey } from '../utils/use-roving-focus'
import { useStableId } from '../utils/use-stable-id'
import type { ComboboxOption, ComboboxProps, ComboboxValue } from './types'

defineOptions({ name: 'ACombobox', inheritAttrs: false })
const props = defineProps<ComboboxProps>()
const emit = defineEmits<{
  'update:modelValue': [value: ComboboxValue | undefined]
  change: [value: ComboboxValue, option: ComboboxOption]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const inputId = useStableId(() => props.id, 'aheart-combobox')
const listboxId = computed(() => `${inputId.value}-listbox`)
const selection = useControllableState<ComboboxValue>({
  controlled: () => props.modelValue,
  isControlled: usePropPresence('modelValue', 'model-value'),
  defaultValue: () => props.defaultValue,
  onChange: (value) => emit('update:modelValue', value)
})
const selectedLabel = computed(() => props.options.find(({ value }) => Object.is(value, selection.state.value))?.label ?? '')
const open = ref(false)
const query = ref<string>()
const activeKey = ref<string>()
const composing = ref(false)
const inputText = computed(() => query.value ?? selectedLabel.value)

const filteredOptions = computed(() => {
  const filter = query.value?.trim().toLowerCase()
  return props.options.map((option, index) => ({
    option,
    key: `${typeof option.value}:${String(option.value)}`,
    id: `${listboxId.value}-option-${index}`
  })).filter(({ option }) => !filter || option.label.toLowerCase().includes(filter))
})
const enabledOptions = computed(() => filteredOptions.value.filter(({ option }) => !option.disabled))
const activeOption = computed(() => enabledOptions.value.find(({ key }) => key === activeKey.value))
const motion = useMotionPresence(open, { destroyOnHidden: true, duration: 120 })

const close = () => {
  open.value = false
  query.value = undefined
  activeKey.value = undefined
  composing.value = false
}
const showOptions = () => {
  if (!props.disabled) open.value = true
}
const select = (option: ComboboxOption) => {
  if (!open.value || props.disabled || option.disabled) return
  if (selection.setState(option.value)) emit('change', option.value, option)
  close()
  inputRef.value?.focus({ preventScroll: true })
}

const { shouldTeleport, teleportTo, floatingPosition } = useFloatingLayer({
  reference: inputRef,
  floating: panelRef,
  getPopupContainer: () => props.getPopupContainer,
  position: { open: () => motion.isMounted.value, strategy: 'fixed', offset: 4 },
  dismiss: { open, ignoreEscape: composing, onDismiss: close }
})

const handleInput = (event: Event) => {
  if (composing.value) return
  query.value = (event.target as HTMLInputElement).value
  activeKey.value = undefined
  showOptions()
}

const handleCompositionEnd = (event: CompositionEvent) => {
  composing.value = false
  if (event.target === inputRef.value?.ownerDocument.activeElement) handleInput(event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || composing.value || event.isComposing || event.keyCode === 229) return
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    showOptions()
    activeKey.value = getNextEnabledKey(enabledOptions.value, activeOption.value?.key, event.key)
  } else if (event.key === 'Enter' && open.value && activeOption.value) {
    event.preventDefault()
    select(activeOption.value.option)
  }
}

watch(activeOption, (entry) => {
  if (!entry) return
  const panel = panelRef.value
  const option = panel?.ownerDocument.getElementById(entry.id)
  if (!panel || !option) return
  const bounds = panel.getBoundingClientRect()
  const row = option.getBoundingClientRect()
  if (row.top < bounds.top) panel.scrollTop += row.top - bounds.top
  else if (row.bottom > bounds.bottom) panel.scrollTop += row.bottom - bounds.bottom
}, { flush: 'post' })
watch(() => props.disabled, (disabled) => { if (disabled) close() })
</script>
