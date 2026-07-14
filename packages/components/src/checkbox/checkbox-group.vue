<template>
  <span class="aheart-checkbox-group" :class="checkboxGroupClass" :style="style">
    <Checkbox
      v-for="option in normalizedOptions"
      :key="getOptionKey(option.value)"
      :model-value="isChecked(option.value)"
      :value="option.value"
      :name="name"
      :disabled="isDisabled || option.disabled"
      :class-name="option.className"
      :style="option.style"
      :title="option.title"
      @change="(checked) => handleOptionChange(option.value, checked)"
    >
      <ACheckboxGroupRenderNode :node="option.label" />
    </Checkbox>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { usePropPresence } from '../utils/use-prop-presence'
import Checkbox from './checkbox.vue'
import { checkboxGroupEmits, checkboxGroupProps, type CheckboxOption, type CheckboxValue } from './types'
import './style.css'

defineOptions({
  name: 'ACheckboxGroup'
})

const props = defineProps(checkboxGroupProps)
const emit = defineEmits(checkboxGroupEmits)
const config = useAheartConfig()
const internalValue = ref<CheckboxValue[]>(props.defaultValue ? [...props.defaultValue] : [])

const ACheckboxGroupRenderNode = defineComponent({
  name: 'ACheckboxGroupRenderNode',
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

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const hasValue = usePropPresence('value')
const hasModelValue = usePropPresence('modelValue', 'model-value')
const isControlled = computed(() => hasValue.value || hasModelValue.value)
const mergedValue = computed(() => hasValue.value ? props.value ?? [] : hasModelValue.value ? props.modelValue ?? [] : internalValue.value)
const normalizedOptions = computed<CheckboxOption[]>(() =>
  props.options.map((option) =>
    typeof option === 'object' && option !== null
      ? option
      : {
          label: String(option),
          value: option
        }
  )
)

const checkboxGroupClass = computed(() => [
  `aheart-checkbox-group--${props.direction}`,
  props.className,
  props.rootClassName,
  {
    'is-disabled': isDisabled.value
  }
])

const getOptionKey = (value: CheckboxValue) => `${typeof value}:${String(value)}`

const isChecked = (value: CheckboxValue) => mergedValue.value.includes(value)

const handleOptionChange = (value: CheckboxValue, checked: boolean) => {
  const nextValue = checked
    ? Array.from(new Set([...mergedValue.value, value]))
    : mergedValue.value.filter((currentValue) => currentValue !== value)

  if (!isControlled.value) {
    internalValue.value = nextValue
  }

  emit('update:modelValue', nextValue)
  emit('update:value', nextValue)
  emit('change', nextValue)
}
</script>
