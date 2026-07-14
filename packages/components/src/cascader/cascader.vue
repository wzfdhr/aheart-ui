<template>
  <div ref="rootRef" class="aheart-cascader" :class="{ 'is-open': mergedOpen, 'is-disabled': disabled }">
    <div
      ref="triggerRef"
      class="aheart-cascader__trigger"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : undefined"
      aria-haspopup="dialog"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="multiple && selectedTags.length" class="aheart-cascader__value aheart-cascader__tags">
        <span v-for="tag in visibleSelectedTags" :key="pathKey(tag.path)" class="aheart-cascader__tag">
          <span class="aheart-cascader__tag-label">{{ tag.label }}</span>
          <button v-if="!disabled" class="aheart-cascader__tag-remove" type="button" :aria-label="`移除 ${tag.label}`" @click.stop="removePath(tag.path)"><AIcon name="close" :size="12" /></button>
        </span>
        <span v-if="hiddenTagCount" class="aheart-cascader__tag aheart-cascader__tag--rest">+{{ hiddenTagCount }}</span>
      </span>
      <span v-else class="aheart-cascader__value" :class="{ 'is-placeholder': !displayLabel }">{{ displayLabel || placeholder }}</span>
      <button
        v-if="allowClear && selectedPaths.length && !disabled"
        class="aheart-cascader__clear"
        type="button"
        aria-label="清除级联选择"
        @click.stop="clearValue"
      ><AIcon name="close" :size="12" /></button>
      <AIcon class="aheart-cascader__arrow" name="chevron-down" :size="16" aria-hidden="true" />
    </div>
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
    <div
      v-if="motion.isMounted.value"
      v-show="motion.phase.value !== 'hidden'"
      ref="panelRef"
      class="aheart-cascader__panel"
      :class="panelClass"
      :style="panelStyle"
      role="dialog"
      aria-label="级联选择"
    >
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
        <div v-if="searchResults.length === 0" class="aheart-cascader__empty" role="status">暂无匹配选项</div>
      </div>
      <div v-else ref="columnsRef" class="aheart-cascader__columns">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="aheart-cascader__column">
          <button
            v-for="option in column"
            :key="option.value"
            class="aheart-cascader__option"
            :class="{ 'is-active': activePath[columnIndex] === option.value, 'is-selected': isSelected(columnIndex, option), 'is-loading': isLoading(columnIndex, option) }"
            type="button"
            :data-cascader-value="option.value"
            :disabled="disabled || option.disabled || isLoading(columnIndex, option)"
            :aria-busy="isLoading(columnIndex, option) ? 'true' : undefined"
            @click="handleOption(option, columnIndex)"
            @keydown="handleOptionKeydown"
          >
            <span>{{ option.label }}</span>
            <AIcon v-if="isLoading(columnIndex, option)" name="loading" :size="16" spin aria-hidden="true" />
            <AIcon v-else-if="isBranch(option)" name="chevron-right" :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AIcon from '../icon/icon.vue'
import type { FloatingPlacement } from '../utils/floating'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
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
  open?: boolean
  defaultOpen?: boolean
  allowClear?: boolean
  maxTagCount?: number
  placement?: FloatingPlacement
  autoAdjustOverflow?: boolean
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  loadData?: (option: CascaderOption) => Promise<CascaderOption[]>
}>(), {
  options: () => [],
  placeholder: '请选择',
  placement: 'bottomLeft',
  autoAdjustOverflow: true
})
const emit = defineEmits<{
  'update:modelValue': [value: CascaderValue]
  change: [value: CascaderValue]
  openChange: [open: boolean]
  clear: []
}>()

const cloneOptions = (options: CascaderOption[]): CascaderOption[] => options.map((option) => ({
  ...option,
  children: option.children ? cloneOptions(option.children) : undefined
}))
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const columnsRef = ref<HTMLElement | null>(null)
const innerOpen = ref(props.defaultOpen)
const searchText = ref('')
const activePath = ref<CascaderPath>([])
const loadingPaths = ref<CascaderPath[]>([])
const innerOptions = ref<CascaderOption[]>(cloneOptions(props.options))
const innerValue = ref<CascaderValue>(props.defaultValue)
const isControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const mergedOpen = computed(() => isOpenControlled.value ? props.open : innerOpen.value)
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
const selectedTags = computed(() => selectedPaths.value.map((path) => ({ path, label: findLabels(path).join(' / ') })).filter((tag) => tag.label))
const visibleSelectedTags = computed(() => props.maxTagCount === undefined
  ? selectedTags.value
  : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)))
const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length)
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
const requestOpen = (open: boolean) => {
  if (props.disabled) return
  if (!isOpenControlled.value) innerOpen.value = open
  emit('openChange', open)
}
const toggleOpen = () => requestOpen(!mergedOpen.value)
const emitValue = (value: CascaderValue) => {
  if (!isControlled.value) innerValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const clearValue = () => {
  emitValue(props.multiple ? [] : undefined)
  activePath.value = []
  searchText.value = ''
  emit('clear')
}
const removePath = (path: CascaderPath) => {
  if (props.disabled) return
  emitValue(selectedPaths.value.filter((current) => !samePath(current, path)))
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
  requestOpen(false)
}
const replaceChildren = (options: CascaderOption[], path: CascaderPath, children: CascaderOption[]): CascaderOption[] => options.map((option) => {
  if (option.value !== path[0]) return option
  if (path.length === 1) return { ...option, children }
  return { ...option, children: replaceChildren(option.children ?? [], path.slice(1), children) }
})
const revealLastColumn = async () => {
  await nextTick()
  if (columnsRef.value) columnsRef.value.scrollLeft = columnsRef.value.scrollWidth
}
const handleOption = async (option: CascaderOption, columnIndex: number) => {
  if (props.disabled || option.disabled) return
  const path = [...activePath.value.slice(0, columnIndex), option.value]
  if (!isBranch(option)) {
    selectPath(path)
    return
  }
  activePath.value = path
  void revealLastColumn()
  if (!option.children?.length && props.loadData) {
    if (loadingPaths.value.some((current) => samePath(current, path))) return
    loadingPaths.value = [...loadingPaths.value, path]
    try {
      const children = await props.loadData(option)
      innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children))
      void revealLastColumn()
    } catch {
      // Loading errors belong to the application callback.
    } finally {
      loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path))
    }
  }
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    requestOpen(true)
    void nextTick(() => panelRef.value?.querySelector<HTMLElement>('.aheart-cascader__option:not(:disabled)')?.focus())
  } else if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  }
}
const handleOptionKeydown = (event: KeyboardEvent) => {
  const current = event.currentTarget as HTMLButtonElement
  const options = Array.from(current.parentElement?.querySelectorAll<HTMLButtonElement>('.aheart-cascader__option:not(:disabled)') ?? [])
  const index = options.indexOf(current)
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  }
}

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) return props.getPopupContainer(triggerRef.value)
  return typeof document === 'undefined' ? false : document.body
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => popupContainer.value === false ? 'body' : popupContainer.value)
const floatingPosition = useFloatingPosition({
  reference: triggerRef,
  floating: panelRef,
  open: () => motion.isMounted.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  strategy: 'fixed',
  offset: 4,
  autoAdjustOverflow: () => props.autoAdjustOverflow
})
const panelClass = computed(() => [
  `aheart-floating--${floatingPosition.placement.value}`,
  `is-${motion.phase.value}`
])
const panelStyle = computed(() => floatingPosition.popupStyle.value)

useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: panelRef,
  onDismiss: () => requestOpen(false)
})

watch(() => props.defaultOpen, (open) => {
  if (!isOpenControlled.value) innerOpen.value = open
})
</script>
