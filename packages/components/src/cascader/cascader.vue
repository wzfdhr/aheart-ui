<template>
  <div class="aheart-cascader" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aheart-cascader__trigger" type="button" :disabled="disabled" @click="toggleOpen">
      <span>{{ displayLabel || placeholder }}</span>
      <span aria-hidden="true">{{ open ? '⌃' : '⌄' }}</span>
    </button>
    <div v-if="open" class="aheart-cascader__panel">
      <input
        v-if="showSearch"
        v-model="searchText"
        class="aheart-cascader__search"
        type="search"
        placeholder="搜索"
        aria-label="搜索级联选项"
      />
      <div v-if="searchText.trim()" class="aheart-cascader__search-results">
        <button
          v-for="result in searchResults"
          :key="pathKey(result.path)"
          class="aheart-cascader__option"
          type="button"
          :data-cascader-path="pathKey(result.path)"
          :disabled="disabled || result.disabled"
          @click="selectPath(result.path)"
        >
          {{ result.labels.join(' / ') }}
        </button>
      </div>
      <div v-else class="aheart-cascader__columns">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="aheart-cascader__column">
          <button
            v-for="option in column"
            :key="option.value"
            class="aheart-cascader__option"
            :class="{ 'is-active': activePath[columnIndex] === option.value, 'is-selected': isSelected(columnIndex, option) }"
            type="button"
            :data-cascader-value="option.value"
            :disabled="disabled || option.disabled || isLoading(columnIndex, option)"
            @click="handleOption(option, columnIndex)"
          >
            <span>{{ option.label }}</span>
            <span v-if="isBranch(option)" aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue'
import type { CascaderKey, CascaderOption, CascaderPath, CascaderValue } from './types'
import './style.css'

defineOptions({ name: 'ACascader' })

const props = withDefaults(defineProps<{
  options?: CascaderOption[]
  modelValue?: CascaderValue
  defaultValue?: CascaderValue
  multiple?: boolean
  showSearch?: boolean
  placeholder?: string
  disabled?: boolean
  loadData?: (option: CascaderOption) => Promise<CascaderOption[]>
}>(), {
  options: () => [],
  placeholder: '请选择'
})
const emit = defineEmits<{
  'update:modelValue': [value: CascaderValue]
  change: [value: CascaderValue]
}>()

const cloneOptions = (options: CascaderOption[]): CascaderOption[] => options.map((option) => ({
  ...option,
  children: option.children ? cloneOptions(option.children) : undefined
}))
const open = ref(false)
const searchText = ref('')
const activePath = ref<CascaderPath>([])
const loadingPaths = ref<CascaderPath[]>([])
const innerOptions = ref<CascaderOption[]>(cloneOptions(props.options))
const innerValue = ref<CascaderValue>(props.defaultValue)
const instance = getCurrentInstance()
const isControlled = computed(() => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'modelValue'))
const mergedValue = computed(() => isControlled.value ? props.modelValue : innerValue.value)
const selectedPaths = computed<CascaderPath[]>(() => {
  if (props.multiple) {
    return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray)
      ? mergedValue.value as CascaderPath[]
      : []
  }
  return Array.isArray(mergedValue.value) ? [mergedValue.value as CascaderPath] : []
})

watch(() => props.options, (options) => {
  innerOptions.value = cloneOptions(options)
})

const pathKey = (path: CascaderPath) => path.join('/')
const samePath = (left: CascaderPath, right: CascaderPath) => left.length === right.length && left.every((key, index) => key === right[index])
const isBranch = (option: CascaderOption) => Boolean(option.children?.length) || option.isLeaf === false
const columns = computed(() => {
  const result: CascaderOption[][] = [innerOptions.value]
  let siblings = innerOptions.value
  for (const key of activePath.value) {
    const option = siblings.find((current) => current.value === key)
    if (!option?.children?.length) break
    siblings = option.children
    result.push(siblings)
  }
  return result
})
const findOption = (path: CascaderPath, options = innerOptions.value): CascaderOption | undefined => {
  let siblings = options
  let current: CascaderOption | undefined
  for (const key of path) {
    current = siblings.find((option) => option.value === key)
    if (!current) return undefined
    siblings = current.children ?? []
  }
  return current
}
const findLabels = (path: CascaderPath): string[] => {
  const labels: string[] = []
  let siblings = innerOptions.value
  for (const key of path) {
    const option = siblings.find((current) => current.value === key)
    if (!option) return []
    labels.push(option.label)
    siblings = option.children ?? []
  }
  return labels
}
const pathHasDisabledOption = (path: CascaderPath) => {
  let siblings = innerOptions.value
  for (const key of path) {
    const option = siblings.find((current) => current.value === key)
    if (!option || option.disabled) return true
    siblings = option.children ?? []
  }
  return false
}
const displayLabel = computed(() => selectedPaths.value.map((path) => findLabels(path).join(' / ')).filter(Boolean).join(', '))
const collectLeaves = (options: CascaderOption[], parentPath: CascaderPath = [], parentLabels: string[] = [], parentDisabled = false): Array<{ path: CascaderPath; labels: string[]; disabled: boolean }> =>
  options.flatMap((option) => {
    const path = [...parentPath, option.value]
    const labels = [...parentLabels, option.label]
    const disabled = parentDisabled || Boolean(option.disabled)
    if (option.children?.length) return collectLeaves(option.children, path, labels, disabled)
    return option.isLeaf === false ? [] : [{ path, labels, disabled }]
  })
const searchResults = computed(() => {
  const query = searchText.value.trim().toLowerCase()
  return collectLeaves(innerOptions.value).filter((result) => result.labels.join(' / ').toLowerCase().includes(query))
})
const isSelected = (columnIndex: number, option: CascaderOption) => selectedPaths.value.some((path) => path[columnIndex] === option.value && path.length === columnIndex + 1)
const isLoading = (columnIndex: number, option: CascaderOption) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]))
const toggleOpen = () => {
  if (!props.disabled) open.value = !open.value
}
const emitValue = (value: CascaderValue) => {
  if (!isControlled.value) innerValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const selectPath = (path: CascaderPath) => {
  const option = findOption(path)
  if (props.disabled || !option || pathHasDisabledOption(path) || isBranch(option)) return
  if (props.multiple) {
    const paths = selectedPaths.value.some((current) => samePath(current, path))
      ? selectedPaths.value.filter((current) => !samePath(current, path))
      : [...selectedPaths.value, path]
    emitValue(paths)
    return
  }
  emitValue(path)
  open.value = false
}
const replaceChildren = (options: CascaderOption[], path: CascaderPath, children: CascaderOption[]): CascaderOption[] => options.map((option) => {
  if (option.value !== path[0]) return option
  if (path.length === 1) return { ...option, children }
  return { ...option, children: replaceChildren(option.children ?? [], path.slice(1), children) }
})
const handleOption = async (option: CascaderOption, columnIndex: number) => {
  if (props.disabled || option.disabled) return
  const path = [...activePath.value.slice(0, columnIndex), option.value]
  if (!isBranch(option)) {
    selectPath(path)
    return
  }
  activePath.value = path
  if (!option.children?.length && props.loadData) {
    if (loadingPaths.value.some((current) => samePath(current, path))) return
    loadingPaths.value = [...loadingPaths.value, path]
    try {
      const children = await props.loadData(option)
      innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children))
    } catch {
      // Loading errors belong to the application callback.
    } finally {
      loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path))
    }
  }
}
</script>
