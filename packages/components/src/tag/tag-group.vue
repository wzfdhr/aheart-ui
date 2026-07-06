<template>
  <span class="aheart-tag-group" :class="tagGroupClass" :style="tagGroupStyle">
    <CheckableTag
      v-for="option in normalizedOptions"
      :key="getOptionKey(option.value)"
      :checked="isChecked(option.value)"
      :disabled="disabled || option.disabled"
      :icon="option.icon"
      :title="option.title"
      :class-name="option.className"
      :style="getOptionStyle(option)"
      :class-names="{ root: getOptionSemanticClass(option.value) }"
      @change="(checked) => handleOptionChange(option.value, checked)"
    >
      <ATagGroupRenderNode :node="option.label" />
    </CheckableTag>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, type PropType, type VNodeChild } from 'vue'
import CheckableTag from './checkable-tag.vue'
import { tagGroupEmits, tagGroupProps, type TagGroupValue, type TagOption, type TagValue } from './types'
import './style.css'

defineOptions({
  name: 'ATagGroup'
})

const props = defineProps(tagGroupProps)
const emit = defineEmits(tagGroupEmits)
const internalValue = ref<TagGroupValue>(props.defaultValue ?? (props.multiple ? [] : null))

const ATagGroupRenderNode = defineComponent({
  name: 'ATagGroupRenderNode',
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

const isControlled = computed(() => props.value !== undefined || props.modelValue !== undefined)
const mergedValue = computed(() => props.value ?? props.modelValue ?? internalValue.value)
const normalizedOptions = computed<TagOption[]>(() =>
  props.options.map((option) =>
    typeof option === 'object' && option !== null
      ? option
      : {
          label: String(option),
          value: option
        }
  )
)

const tagGroupClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  {
    'is-disabled': props.disabled,
    'is-multiple': props.multiple
  }
])
const tagGroupStyle = computed(() => [props.style, props.styles.root])

const getOptionKey = (value: TagValue) => `${typeof value}:${String(value)}`
const normalizeMultipleValue = (value: TagGroupValue): TagValue[] => {
  if (Array.isArray(value)) {
    return value
  }

  return value === null ? [] : [value]
}
const normalizeSingleValue = (value: TagGroupValue): TagValue | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}
const isChecked = (value: TagValue) =>
  props.multiple ? normalizeMultipleValue(mergedValue.value).includes(value) : normalizeSingleValue(mergedValue.value) === value
const getOptionSemanticClass = (value: TagValue) =>
  [props.classNames.item, isChecked(value) ? props.classNames.activeItem : undefined].filter(Boolean).join(' ')
const getOptionStyle = (option: TagOption) => [
  props.styles.item,
  option.style,
  isChecked(option.value) ? props.styles.activeItem : undefined
]

const handleOptionChange = (value: TagValue, checked: boolean) => {
  if (props.disabled) {
    return
  }

  const nextValue = props.multiple
    ? checked
      ? Array.from(new Set([...normalizeMultipleValue(mergedValue.value), value]))
      : normalizeMultipleValue(mergedValue.value).filter((currentValue) => currentValue !== value)
    : checked
      ? value
      : null

  if (!isControlled.value) {
    internalValue.value = nextValue
  }

  emit('update:modelValue', nextValue)
  emit('update:value', nextValue)
  emit('change', nextValue)
}
</script>
