<template>
  <div ref="rootRef" class="aheart-cascader" :class="{ 'is-open': mergedOpen, 'is-disabled': disabled }">
    <div
      ref="triggerRef"
      class="aheart-cascader__trigger"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-controls="panelId"
      :aria-activedescendant="activeDescendantId"
      :aria-labelledby="resolvedAriaLabelledby"
      :aria-describedby="resolvedAriaDescribedby"
      aria-haspopup="dialog"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="multiple && selectedTags.length" class="aheart-cascader__value aheart-cascader__tags">
        <span v-for="tag in visibleSelectedTags" :key="pathToken(tag.path)" class="aheart-cascader__tag">
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
      :id="panelId"
      :aria-labelledby="resolvedAriaLabelledby || undefined"
      :aria-describedby="resolvedAriaDescribedby || undefined"
      :aria-label="resolvedAriaLabelledby ? undefined : '级联选择'"
    >
      <input
        v-if="showSearch"
        ref="searchRef"
        v-model="searchText"
        class="aheart-cascader__search"
        type="search"
        placeholder="搜索"
        aria-label="搜索级联选项"
        @keydown="handleSearchInputKeydown"
        @focus="handleSearchInputFocus"
        @blur="handleSearchInputBlur"
      />
      <template v-if="searchText.trim() && virtualEnabled">
      <CascaderVirtualList
        v-if="searchResults.length > 0"
        :ref="element => setVirtualListRef('search', element)"
        class-name="aheart-cascader__search-results"
        :items="searchResults"
        :config="effectiveVirtualConfig"
        :active-index="searchRovingIndex"
        :pinned-indexes="searchPinnedIndexes"
        :enabled="virtualEnabled && mergedOpen && !disabled"
        :row-key="(_index, result) => pathToken(result.path)"
        :disabled-index="(_index, result) => disabled || result.disabled"
      >
        <template #row="{ index, option: result, tabindex }">
          <button
            class="aheart-cascader__option"
            type="button"
            :tabindex="tabindex"
            :data-cascader-path="pathKey(result.path)"
            :data-cascader-path-token="pathToken(result.path)"
            :disabled="disabled || result.disabled"
            @click="selectPath(result.path)"
            @focus="handleSearchFocus(result.path, index)"
            @keydown="handleSearchKeydown($event, result.path, index)"
          >
            {{ result.labels.join(' / ') }}
          </button>
        </template>
      </CascaderVirtualList>
      <div v-if="searchResults.length === 0" class="aheart-cascader__empty" role="status">暂无匹配选项</div>
      </template>
      <div v-else-if="searchText.trim()" class="aheart-cascader__search-results">
        <button
          v-for="result in searchResults"
          :key="pathToken(result.path)"
          class="aheart-cascader__option"
          type="button"
          :data-cascader-path="pathKey(result.path)"
          :data-cascader-path-token="pathToken(result.path)"
          :disabled="disabled || result.disabled"
          @click="selectPath(result.path)"
        >
          {{ result.labels.join(' / ') }}
        </button>
        <div v-if="searchResults.length === 0" class="aheart-cascader__empty" role="status">暂无匹配选项</div>
      </div>
      <div v-else ref="columnsRef" class="aheart-cascader__columns">
        <template v-if="virtualEnabled">
        <CascaderVirtualList
          v-for="(column, columnIndex) in columns"
          :key="columnPrefixToken(columnIndex)"
          :ref="element => setVirtualListRef(columnPrefixToken(columnIndex), element)"
          class-name="aheart-cascader__column"
          :items="column"
          :config="effectiveVirtualConfig"
          :active-index="rovingIndex(columnIndex)"
          :pinned-indexes="pinnedIndexes(columnIndex)"
          :enabled="virtualEnabled && mergedOpen && !disabled"
          :row-key="(optionIndex, option) => rowToken(columnIndex, optionIndex, option)"
          :disabled-index="(optionIndex, option) => disabled || option.disabled || isLoading(columnIndex, option)"
        >
          <template #row="{ index: optionIndex, option, tabindex }">
            <button
              class="aheart-cascader__option"
              :class="{ 'is-active': activePath[columnIndex] === option.value, 'is-selected': isSelected(columnIndex, option), 'is-loading': isLoading(columnIndex, option), 'is-error': isLoadError(columnIndex, option) }"
              type="button"
              :tabindex="tabindex"
              :data-cascader-value="option.value"
              :data-cascader-token="cascaderKeyToken(option.value)"
              :id="optionId(columnIndex, optionIndex, option)"
              :data-cascader-column="columnIndex"
              :disabled="disabled || option.disabled || isLoading(columnIndex, option)"
              :aria-busy="isLoading(columnIndex, option) ? 'true' : undefined"
              :aria-label="isLoadError(columnIndex, option) ? `${option.label}，加载失败，按回车或点击重试` : undefined"
              @click="handleOption(option, columnIndex)"
              @focus="handleOptionFocus(option, columnIndex)"
              @blur="handleOptionBlur"
              @focusout="handleOptionBlur"
              @keydown="handleOptionKeydown($event, option, columnIndex, optionIndex)"
            >
              <span>{{ option.label }}</span>
              <AIcon v-if="isLoading(columnIndex, option)" name="loading" :size="16" spin aria-hidden="true" />
              <span v-else-if="isLoadError(columnIndex, option)" class="aheart-cascader__load-error" aria-hidden="true">重试</span>
              <AIcon v-else-if="isBranch(option)" name="chevron-right" :size="16" aria-hidden="true" />
            </button>
          </template>
        </CascaderVirtualList>
        </template>
        <template v-else>
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="aheart-cascader__column">
          <button
            v-for="(option, optionIndex) in column"
            :key="cascaderKeyToken(option.value)"
            class="aheart-cascader__option"
            :class="{ 'is-active': activePath[columnIndex] === option.value, 'is-selected': isSelected(columnIndex, option), 'is-loading': isLoading(columnIndex, option), 'is-error': isLoadError(columnIndex, option) }"
            type="button"
            :data-cascader-value="option.value"
            :data-cascader-token="cascaderKeyToken(option.value)"
            :id="optionId(columnIndex, optionIndex, option)"
            :data-cascader-column="columnIndex"
            :disabled="disabled || option.disabled || isLoading(columnIndex, option)"
            :aria-busy="isLoading(columnIndex, option) ? 'true' : undefined"
            :aria-label="isLoadError(columnIndex, option) ? `${option.label}，加载失败，按回车或点击重试` : undefined"
            @click="handleOption(option, columnIndex)"
            @focus="handleOptionFocus(option, columnIndex)"
            @blur="handleOptionBlur"
            @focusout="handleOptionBlur"
            @keydown="handleOptionKeydown($event, option, columnIndex, optionIndex)"
          >
            <span>{{ option.label }}</span>
            <AIcon v-if="isLoading(columnIndex, option)" name="loading" :size="16" spin aria-hidden="true" />
            <span v-else-if="isLoadError(columnIndex, option)" class="aheart-cascader__load-error" aria-hidden="true">重试</span>
            <AIcon v-else-if="isBranch(option)" name="chevron-right" :size="16" aria-hidden="true" />
          </button>
        </div>
        </template>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch, type CSSProperties, type ComponentPublicInstance } from 'vue'
import AIcon from '../icon/icon.vue'
import type { FloatingPlacement } from '../utils/floating-core'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { useControllableState } from '../utils/use-controllable-state'
import { useStableId } from '../utils/use-stable-id'
import { useTeleportReady } from '../utils/use-teleport-ready'
import { usePopupViewportBudget } from '../utils/use-popup-viewport-budget'
import type { CascaderKey, CascaderLoadContext, CascaderOption, CascaderPath, CascaderValue } from './types'
import CascaderVirtualList, { type CascaderVirtualListExpose } from './cascader-virtual-list.vue'
import { normalizeCascaderVirtual } from './virtual-options'
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
  virtual?: import('./types').CascaderVirtual
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  loadData?: (option: CascaderOption, context: CascaderLoadContext) => Promise<CascaderOption[]>
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
const instanceId = useStableId(undefined, 'aheart-cascader').value
const panelId = `aheart-cascader-panel-${instanceId}`
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const columnsRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const searchText = ref('')
const activePath = ref<CascaderPath>([])
const focusedPath = ref<CascaderPath>([])
const loadingPaths = ref<CascaderPath[]>([])
const errorPaths = ref<CascaderPath[]>([])
const innerOptions = ref<CascaderOption[]>(cloneOptions(props.options))
const virtualConfig = computed(() => normalizeCascaderVirtual(props.virtual, (message) => {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(message)
}))
const virtualEnabled = computed(() => virtualConfig.value !== null)
const focusedSearchPath = ref<CascaderPath>([])
const virtualListRefs = new Map<string, CascaderVirtualListExpose>()
let revealGeneration = 0
const rovingKeys = ref<Record<string, CascaderKey | undefined>>({})
const setVirtualListRef = (key: string, element: Element | ComponentPublicInstance | null) => {
  if (element && '$el' in element) virtualListRefs.set(key, element as unknown as CascaderVirtualListExpose)
  else if (!element) virtualListRefs.delete(key)
}
const cancelVirtualFocus = () => virtualListRefs.forEach(list => list.cancelFocus())
const suspendVirtualLists = () => virtualListRefs.forEach(list => list.suspend())
let keyboardRequest = 0
let modeFocusGeneration = 0
type FocusOwner = {
  request: number
  loadGeneration: number
  modeFocusGeneration: number
  navigationVersion: number
  path: CascaderPath
  source: HTMLElement
  ownerDocument: Document
  sawRenderBlur: boolean
  renderBlurArmed: boolean
  renderRaf?: number
  renderTimer?: ReturnType<Window['setTimeout']>
  onFocusIn: (event: FocusEvent) => void
  onPointerDown: () => void
  onTouchStart: () => void
  onWheel: () => void
  onKeyDown: (event: KeyboardEvent) => void
  onWindowBlur: () => void
  dispose: () => void
}
let focusOwner: FocusOwner | undefined
const retire = (owner?: FocusOwner) => {
  if (!owner) return
  owner.dispose()
  if (focusOwner === owner) focusOwner = undefined
}
const invalidateModeFocus = () => { modeFocusGeneration += 1; keyboardRequest += 1; retire(focusOwner); cancelVirtualFocus() }
let loadGeneration = 0
let loadSequence = 0
let navigationVersion = 0
const activeLoadIds = new Map<string, number>()
const activeLoadControllers = new Map<string, AbortController>()
const isControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const openState = useControllableState({
  controlled: () => props.open,
  isControlled: isOpenControlled,
  defaultValue: () => props.defaultOpen,
  onChange: (open) => {
    const nextOpen = Boolean(open)
    emit('openChange', nextOpen)
  }
})
const valueState = useControllableState<CascaderValue>({
  controlled: () => props.modelValue,
  isControlled,
  defaultValue: () => props.defaultValue,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})
const mergedOpen = computed(() => Boolean(openState.state.value))
const ownedRenderBlur = (event: FocusEvent) => {
  const owner = focusOwner
  if (!owner || owner.request !== keyboardRequest || owner.loadGeneration !== loadGeneration || owner.modeFocusGeneration !== modeFocusGeneration || owner.navigationVersion !== navigationVersion) return false
  if (event.target !== owner.source || event.currentTarget !== owner.source && event.currentTarget !== panelRef.value) return false
  if (event.relatedTarget !== null || !owner.renderBlurArmed || !owner.source.isConnected) return false
  const source = owner.source as HTMLButtonElement
  if (!source.disabled && !source.hasAttribute('disabled')) return false
  if (!loadingPaths.value.some(path => samePath(path, owner.path))) return false
  if (!samePath(activePath.value.slice(0, owner.path.length), owner.path)) return false
  const columnIndex = Number(source.dataset.cascaderColumn)
  if (!Number.isInteger(columnIndex) || columnIndex !== owner.path.length - 1 || source.dataset.cascaderToken !== cascaderKeyToken(owner.path.at(-1)!)) return false
  owner.sawRenderBlur = true
  return true
}
watch([panelRef, virtualEnabled, mergedOpen, () => props.disabled], ([panel, isVirtual, isOpen, isDisabled], _previous, cleanup) => {
  if (!panel || !isVirtual || !isOpen || isDisabled) return
  const ownerDocument = panel.ownerDocument
  const cancelOutside = (event: FocusEvent) => {
    const target = event.target as Node | null
    if (target && !rootRef.value?.contains(target) && !panel.contains(target)) invalidateModeFocus()
  }
  const cancelNavigation = () => invalidateModeFocus()
  const cancelFocusOut = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null
    if (ownedRenderBlur(event)) return
    const related = event.relatedTarget as Node | null
    if (related && !rootRef.value?.contains(related) && !panel.contains(related)) { invalidateModeFocus(); return }
    if (!related && target?.isConnected) invalidateModeFocus()
  }
  ownerDocument.addEventListener('focusin', cancelOutside)
  panel.addEventListener('focusout', cancelFocusOut, true)
  panel.addEventListener('wheel', cancelNavigation, { passive: true })
  panel.addEventListener('pointerdown', cancelNavigation, { passive: true })
  panel.addEventListener('touchstart', cancelNavigation, { passive: true })
  cleanup(() => {
    ownerDocument.removeEventListener('focusin', cancelOutside)
    panel.removeEventListener('focusout', cancelFocusOut, true)
    panel.removeEventListener('wheel', cancelNavigation)
    panel.removeEventListener('pointerdown', cancelNavigation)
    panel.removeEventListener('touchstart', cancelNavigation)
    invalidateModeFocus()
  })
}, { flush: 'post', immediate: true })
const mergedValue = valueState.state
const selectedPaths = computed<CascaderPath[]>(() => {
  if (props.multiple) {
    return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray)
      ? mergedValue.value as CascaderPath[]
      : []
  }
  return Array.isArray(mergedValue.value) ? [mergedValue.value as CascaderPath] : []
})

const pathKey = (path: CascaderPath) => path.join('/')
const cascaderKeyToken = (key: CascaderKey) =>
  `${typeof key === 'number' ? 'n' : 's'}-${Array.from(String(key), (character) => character.codePointAt(0)!.toString(16)).join('-')}`
const pathToken = (path: CascaderPath) => path.map(cascaderKeyToken).join('--')
const samePath = (left: CascaderPath, right: CascaderPath) => left.length === right.length && left.every((key, index) => key === right[index])
const closestExistingPath = (path: CascaderPath, options: CascaderOption[]) => {
  const existing: CascaderPath = []
  let siblings = options
  for (const key of path) {
    const option = siblings.find((candidate) => candidate.value === key)
    if (!option) break
    existing.push(key)
    siblings = option.children ?? []
  }
  return existing
}
const invalidateLoads = () => {
  retire(focusOwner)
  loadGeneration += 1
  activeLoadControllers.forEach((controller) => controller.abort())
  activeLoadControllers.clear()
  activeLoadIds.clear()
  loadingPaths.value = []
}
const cancelOtherLoads = (requestKey: string) => {
  activeLoadControllers.forEach((controller, key) => {
    if (key === requestKey) return
    controller.abort()
    activeLoadControllers.delete(key)
    activeLoadIds.delete(key)
  })
  loadingPaths.value = loadingPaths.value.filter((path) => pathToken(path) === requestKey)
}
watch(() => props.options, (options) => {
  const nextOptions = cloneOptions(options)
  revealGeneration += 1
  invalidateLoads()
  innerOptions.value = nextOptions
  errorPaths.value = []
  activePath.value = closestExistingPath(activePath.value, nextOptions)
  focusedPath.value = closestExistingPath(focusedPath.value, nextOptions)
})
watch(() => props.disabled, (disabled) => {
  if (disabled) {
    invalidateModeFocus()
    suspendVirtualLists()
    invalidateLoads()
  }
})
watch(() => props.loadData, invalidateLoads, { flush: 'sync' })
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
const columnPrefixToken = (columnIndex: number) => `column-${columnIndex === 0 ? 'root' : pathToken(activePath.value.slice(0, columnIndex))}`
const rowToken = (columnIndex: number, _optionIndex: number, option: CascaderOption) => `${columnPrefixToken(columnIndex)}-${cascaderKeyToken(option.value)}`
const columnOptionLoading = (columnIndex: number, option: CascaderOption) => loadingPaths.value.some(path => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]))
const firstEnabledIndex = (items: CascaderOption[]) => items.findIndex(option => !option.disabled)
const lastEnabledIndex = (items: CascaderOption[]) => {
  for (let index = items.length - 1; index >= 0; index--) if (!items[index].disabled) return index
  return -1
}
const rovingIndex = (columnIndex: number) => {
  const column = columns.value[columnIndex] ?? []
  const focused = rovingKeys.value[columnPrefixToken(columnIndex)] ?? focusedPath.value[columnIndex]
  const focusedIndex = focused === undefined ? -1 : column.findIndex(option => option.value === focused && !option.disabled && !columnOptionLoading(columnIndex, option))
  const enabled = column.filter(option => !option.disabled && !columnOptionLoading(columnIndex, option))
  const fallback = firstEnabledIndex(enabled)
  return focusedIndex >= 0 ? focusedIndex : (fallback < 0 ? -1 : column.indexOf(enabled[fallback]))
}
const pinnedIndexes = (columnIndex: number) => {
  const index = rovingIndex(columnIndex)
  return index >= 0 ? [index] : []
}
const searchRovingIndex = computed(() => {
  const focused = focusedSearchPath.value
  const index = searchResults.value.findIndex(result => samePath(result.path, focused) && !result.disabled)
  return index >= 0 ? index : firstEnabledIndex(searchResults.value.map(result => ({ value: result.path.join('/'), label: result.labels.join(' / '), disabled: result.disabled })))
})
const searchPinnedIndexes = computed(() => searchRovingIndex.value >= 0 ? [searchRovingIndex.value] : [])
const attrs = useAttrs()
const resolvedAriaLabelledby = computed(() => attrs['aria-labelledby'] as string | undefined)
const resolvedAriaDescribedby = computed(() => attrs['aria-describedby'] as string | undefined)
const optionId = (columnIndex: number, _optionIndex: number, option?: CascaderOption) => {
  const fullPath = option ? [...activePath.value.slice(0, columnIndex), option.value] : []
  return `${instanceId}-option-column-${columnIndex}-${pathToken(fullPath) || 'root'}`
}
const activeDescendantId = computed(() => {
  if (virtualEnabled.value || !mergedOpen.value || searchText.value.trim()) return undefined
  const path = focusedPath.value
  if (!path.length) return undefined
  const option = findOption(path.slice(0, -1))?.children?.find((item) => item.value === path.at(-1)) ?? (path.length === 1 ? innerOptions.value.find((item) => item.value === path[0]) : undefined)
  if (!option || !columns.value[path.length - 1]?.includes(option)) return undefined
  return optionId(path.length - 1, columns.value[path.length - 1].indexOf(option), option)
})
const isSelected = (columnIndex: number, option: CascaderOption) => {
  const candidate = [...activePath.value.slice(0, columnIndex), option.value]
  return selectedPaths.value.some(path => samePath(path, candidate))
}
const isLoading = (columnIndex: number, option: CascaderOption) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]))
const isLoadError = (columnIndex: number, option: CascaderOption) => errorPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]))
let selectionFocus: { restore: () => void; clear: () => void } | undefined
const clearSelectionFocus = () => { selectionFocus?.clear(); selectionFocus = undefined }
onBeforeUnmount(clearSelectionFocus)
watch([() => props.disabled, () => props.options], clearSelectionFocus)
const requestOpen = (open: boolean) => {
  if (props.disabled) return
  if (open) clearSelectionFocus()
  if (!open) { revealGeneration += 1; invalidateModeFocus() }
  openState.setState(open, { force: true })
}
watch(mergedOpen, (open, previousOpen) => {
  if (previousOpen && !open) {
    selectionFocus?.restore()
    revealGeneration += 1
    invalidateModeFocus()
    suspendVirtualLists()
    invalidateLoads()
  }
})
const toggleOpen = () => requestOpen(!mergedOpen.value)
const emitValue = (value: CascaderValue) => {
  valueState.setState(value, { force: true })
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
  clearSelectionFocus()
  const document = panelRef.value?.ownerDocument
  const focused = document?.activeElement
  if (document && focused && panelRef.value?.contains(focused)) {
    const cancel = () => { if (selectionFocus === pending) clearSelectionFocus() }
    const focus = (event: FocusEvent) => { if (event.target !== focused) cancel() }
    const clear = () => {
      document.removeEventListener('focusin', focus, true)
      document.removeEventListener('pointerdown', cancel, true)
      document.removeEventListener('keydown', cancel, true)
    }
    const pending = { clear, restore: () => { void nextTick(() => {
      if (selectionFocus !== pending) return
      const trigger = triggerRef.value
      clearSelectionFocus()
      if (!props.disabled && !mergedOpen.value && trigger?.isConnected && (document.activeElement === focused || document.activeElement === document.body)) trigger.focus()
    }) } }
    selectionFocus = pending
    document.addEventListener('focusin', focus, true)
    document.addEventListener('pointerdown', cancel, true)
    document.addEventListener('keydown', cancel, true)
  }
  emitValue(path)
  requestOpen(false)
}
const replaceChildren = (options: CascaderOption[], path: CascaderPath, children: CascaderOption[]): CascaderOption[] => options.map((option) => {
  if (option.value !== path[0]) return option
  if (path.length === 1) return { ...option, children }
  return { ...option, children: replaceChildren(option.children ?? [], path.slice(1), children) }
})
const revealColumnInViewport = (columnIndex: number) => {
  const columns = columnsRef.value
  const column = columns?.children[columnIndex] as HTMLElement | undefined
  if (!columns || !column) return
  const viewport = columns.getBoundingClientRect()
  const target = column.getBoundingClientRect()
  let nextScrollLeft = columns.scrollLeft
  if (target.left < viewport.left) nextScrollLeft += target.left - viewport.left
  else if (target.right > viewport.right) nextScrollLeft += target.right - viewport.right
  const maximum = Math.max(0, columns.scrollWidth - columns.clientWidth)
  nextScrollLeft = Math.min(maximum, Math.max(0, nextScrollLeft))
  if (Math.abs(nextScrollLeft - columns.scrollLeft) < 0.5) return
  const previousBehavior = columns.style.scrollBehavior
  columns.style.scrollBehavior = 'auto'
  columns.scrollLeft = nextScrollLeft
  columns.style.scrollBehavior = previousBehavior
}
const revealLastColumn = async () => {
  const generation = ++revealGeneration
  await nextTick()
  if (generation !== revealGeneration || !mergedOpen.value || props.disabled || searchText.value.trim()) return
  await floatingPosition.update()
  await nextTick()
  if (generation !== revealGeneration || !mergedOpen.value || props.disabled || searchText.value.trim()) return
  revealColumnInViewport(Math.max(0, columns.value.length - 1))
}
const handleOption = async (option: CascaderOption, columnIndex: number, owner?: FocusOwner) => {
  if (props.disabled || option.disabled) return
  navigationVersion++
  const path = [...activePath.value.slice(0, columnIndex), option.value]
  if (focusOwner && focusOwner !== owner) retire(focusOwner)
  cancelOtherLoads(pathToken(path))
  if (!isBranch(option)) {
    selectPath(path)
    return
  }
  activePath.value = path
  void revealLastColumn()
  if (!option.children?.length && props.loadData) {
    const requestKey = pathToken(path)
    if (activeLoadIds.has(requestKey)) return
    const requestId = ++loadSequence
    const generation = loadGeneration
    const controller = new AbortController()
    activeLoadIds.set(requestKey, requestId)
    activeLoadControllers.set(requestKey, controller)
    errorPaths.value = errorPaths.value.filter((current) => !samePath(current, path))
    loadingPaths.value = [...loadingPaths.value, path]
    try {
      const children = await props.loadData(option, { signal: controller.signal })
      if (generation !== loadGeneration || activeLoadIds.get(requestKey) !== requestId) return
      if (!path.every((key, index) => activePath.value[index] === key)) return
      innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children))
      void revealLastColumn()
    } catch {
      if (generation === loadGeneration && activeLoadIds.get(requestKey) === requestId && path.every((key, index) => activePath.value[index] === key)) {
        errorPaths.value = [...errorPaths.value.filter((current) => !samePath(current, path)), path]
      }
    } finally {
      if (activeLoadIds.get(requestKey) === requestId) {
        activeLoadIds.delete(requestKey)
        activeLoadControllers.delete(requestKey)
        loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path))
      }
    }
  }
}
const handleOptionFocus = (option: CascaderOption, columnIndex: number) => {
  focusedPath.value = [...activePath.value.slice(0, columnIndex), option.value]
  rovingKeys.value = { ...rovingKeys.value, [columnPrefixToken(columnIndex)]: option.value }
}
const handleOptionBlur = (event: FocusEvent) => {
  const related = event.relatedTarget as Node | null
  if (ownedRenderBlur(event)) return
  if (related && !rootRef.value?.contains(related) && !panelRef.value?.contains(related)) invalidateModeFocus()
  if (!event.relatedTarget) {
    const current = event.currentTarget as HTMLElement | null
    current?.blur()
    invalidateModeFocus()
  }
}
const handleSearchFocus = (path: CascaderPath, _index: number) => {
  focusedSearchPath.value = [...path]
  focusedPath.value = [...path]
}
const handleSearchInputFocus = () => invalidateModeFocus()
const handleSearchInputBlur = (event: FocusEvent) => {
  if (!event.relatedTarget) invalidateModeFocus()
}
const focusColumnIndex = (columnIndex: number, index: number, cancelPendingReveal = false) => {
  if (cancelPendingReveal) revealGeneration += 1
  revealColumnInViewport(columnIndex)
  const key = columnPrefixToken(columnIndex)
  const list = virtualListRefs.get(key)
  if (list) list.focusIndex(index)
  else {
    const target = panelRef.value?.querySelector<HTMLElement>(`[data-cascader-column="${columnIndex}"][data-cascader-token="${cascaderKeyToken(columns.value[columnIndex]?.[index]?.value)}"]`)
    target?.focus()
  }
}
watch(searchText, (query, previousQuery) => {
  if (!virtualEnabled.value || query === previousQuery) return
  revealGeneration += 1
  const active = searchRef.value?.ownerDocument.activeElement as HTMLElement | null
  const resultWasFocused = Boolean(active?.classList.contains('aheart-cascader__option') && active.dataset.cascaderPath)
  const path = [...focusedSearchPath.value]
  const generation = ++modeFocusGeneration
  cancelVirtualFocus()
  if (!query.trim() && resultWasFocused && path.length) {
    activePath.value = path.slice(0, -1)
    focusedPath.value = [...path]
    void nextTick(() => void nextTick(() => {
      if (generation !== modeFocusGeneration) return
      const siblings = columns.value[path.length - 1] ?? []
      const index = siblings.findIndex(option => option.value === path.at(-1) && !option.disabled)
      if (index >= 0) focusColumnIndex(path.length - 1, index)
    }))
    void revealLastColumn()
  } else if (query.trim() && resultWasFocused) {
    searchRef.value?.focus()
  } else if (!query.trim()) {
    void revealLastColumn()
  }
  if (query.trim()) {
    const retained = searchResults.value.some(result => samePath(result.path, path) && !result.disabled)
    if (!retained) focusedSearchPath.value = []
  }
}, { flush: 'sync' })
const enabledIndexes = (columnIndex: number) => (columns.value[columnIndex] ?? [])
  .map((option, index) => ({ option, index }))
  .filter(({ option }) => !option.disabled && !isLoading(columnIndex, option))
  .map(({ index }) => index)
const handleSearchInputKeydown = (event: KeyboardEvent) => {
  if (!virtualEnabled.value) return
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const indexes = searchResults.value.map((result, index) => ({ result, index })).filter(({ result }) => !result.disabled).map(({ index }) => index)
  if (!indexes.length) return
  event.preventDefault()
  const index = event.key === 'ArrowDown' ? indexes[0] : indexes.at(-1)!
  const list = virtualListRefs.get('search')
  if (list) list.focusIndex(index)
  else void nextTick(() => panelRef.value?.querySelectorAll<HTMLElement>('.aheart-cascader__search-results .aheart-cascader__option')[index]?.focus())
}
const handleSearchKeydown = (event: KeyboardEvent, path: CascaderPath, index: number) => {
  const indexes = searchResults.value.map((result, resultIndex) => ({ result, resultIndex })).filter(({ result }) => !result.disabled).map(({ resultIndex }) => resultIndex)
  const current = indexes.indexOf(index)
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const next = indexes[(current + (event.key === 'ArrowDown' ? 1 : -1) + indexes.length) % indexes.length]
    virtualListRefs.get('search')?.focusIndex(next)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    virtualListRefs.get('search')?.focusIndex(event.key === 'Home' ? indexes[0] : indexes.at(-1)!)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  } else if ((event.key === 'Enter' || event.key === ' ') && !searchResults.value[index].disabled) {
    event.preventDefault()
    selectPath(path)
  }
}
const ownKeyboardFocus = (source: HTMLElement, path: CascaderPath, request: number) => {
  retire(focusOwner)
  const ownerDocument = source.ownerDocument
  const ownerWindow = ownerDocument.defaultView
  const owner: FocusOwner = {
    request,
    loadGeneration,
    modeFocusGeneration,
    navigationVersion,
    path: [...path],
    source,
    ownerDocument,
    sawRenderBlur: false,
    renderBlurArmed: true,
    onFocusIn: undefined as unknown as (event: FocusEvent) => void,
    onPointerDown: undefined as unknown as () => void,
    onTouchStart: undefined as unknown as () => void,
    onWheel: undefined as unknown as () => void,
    onKeyDown: undefined as unknown as (event: KeyboardEvent) => void,
    onWindowBlur: undefined as unknown as () => void,
    dispose: undefined as unknown as () => void
  }
  owner.onFocusIn = (event: FocusEvent) => {
    const target = event.target as Node | null
    if (target && target !== source) retire(owner)
  }
  owner.onPointerDown = () => retire(owner)
  owner.onTouchStart = () => retire(owner)
  owner.onWheel = () => retire(owner)
  owner.onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Tab' || event.key === 'Escape') retire(owner) }
  owner.onWindowBlur = () => retire(owner)
  ownerDocument.addEventListener('focusin', owner.onFocusIn)
  ownerDocument.addEventListener('pointerdown', owner.onPointerDown, true)
  ownerDocument.addEventListener('touchstart', owner.onTouchStart, true)
  ownerDocument.addEventListener('wheel', owner.onWheel, true)
  ownerDocument.addEventListener('keydown', owner.onKeyDown, true)
  ownerWindow?.addEventListener('blur', owner.onWindowBlur)
  let disposed = false
  owner.dispose = () => {
    if (disposed) return
    disposed = true
    if (owner.renderRaf !== undefined) ownerWindow?.cancelAnimationFrame?.(owner.renderRaf)
    if (owner.renderTimer !== undefined) ownerWindow?.clearTimeout?.(owner.renderTimer)
    owner.renderRaf = undefined
    owner.renderTimer = undefined
    owner.renderBlurArmed = false
    ownerDocument.removeEventListener('focusin', owner.onFocusIn)
    ownerDocument.removeEventListener('pointerdown', owner.onPointerDown, true)
    ownerDocument.removeEventListener('touchstart', owner.onTouchStart, true)
    ownerDocument.removeEventListener('wheel', owner.onWheel, true)
    ownerDocument.removeEventListener('keydown', owner.onKeyDown, true)
    ownerWindow?.removeEventListener('blur', owner.onWindowBlur)
  }
  focusOwner = owner
  return owner
}
const enterChildColumn = async (option: CascaderOption, columnIndex: number, current: HTMLElement) => {
  const request = ++keyboardRequest
  const path = [...activePath.value.slice(0, columnIndex), option.value]
  const ownsActiveFocus = current.ownerDocument.activeElement === current
  const owner = ownsActiveFocus ? ownKeyboardFocus(current, path, request) : undefined
  try {
    const generation = loadGeneration
    const pending = handleOption(option, columnIndex, owner)
    const navigation = navigationVersion
    if (owner) owner.navigationVersion = navigation
    const ownerWindow = current.ownerDocument.defaultView
    if (owner && owner === focusOwner && current.isConnected && mergedOpen.value && !props.disabled && loadingPaths.value.some(loadingPath => samePath(loadingPath, path))) {
      const canUseRaf = Boolean(ownerWindow && typeof ownerWindow.requestAnimationFrame === 'function' && typeof ownerWindow.cancelAnimationFrame === 'function')
      const canUseTimer = Boolean(ownerWindow && typeof ownerWindow.setTimeout === 'function' && typeof ownerWindow.clearTimeout === 'function')
      if (canUseRaf) {
        const closeAfterRaf = () => {
          owner.renderRaf = undefined
          if (focusOwner !== owner) { owner.renderBlurArmed = false; return }
          if (canUseTimer) owner.renderTimer = ownerWindow!.setTimeout(() => { owner.renderTimer = undefined; owner.renderBlurArmed = false }, 0)
          else if (canUseRaf) owner.renderRaf = ownerWindow!.requestAnimationFrame(() => { owner.renderRaf = undefined; owner.renderBlurArmed = false })
          else owner.renderBlurArmed = false
        }
        owner.renderRaf = ownerWindow!.requestAnimationFrame(closeAfterRaf)
      }
      else if (canUseTimer) owner.renderTimer = ownerWindow!.setTimeout(() => { owner.renderTimer = undefined; owner.renderBlurArmed = false }, 0)
      else owner.renderBlurArmed = false
    }
    await pending
    await nextTick()
    const active = current.ownerDocument.activeElement
    if (request !== keyboardRequest || generation !== loadGeneration || !current.isConnected || props.disabled || !mergedOpen.value || !samePath(activePath.value.slice(0, path.length), path)) return
    if (owner) {
      if (owner.modeFocusGeneration !== modeFocusGeneration || owner.navigationVersion !== navigationVersion || owner !== focusOwner) return
      if (active !== current && !(active === owner.ownerDocument.body && owner.sawRenderBlur)) return
    }
    if (!pathHasDisabledOption(path)) {
      const nextColumn = columnIndex + 1
      const nextIndexes = enabledIndexes(nextColumn)
      if (nextIndexes.length) focusColumnIndex(nextColumn, nextIndexes[0])
      else if (current.ownerDocument.activeElement === current.ownerDocument.body && !(current as HTMLButtonElement).disabled) current.focus()
    }
  } finally {
    retire(owner)
  }
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    requestOpen(true)
    void nextTick(() => panelRef.value?.querySelector<HTMLElement>('.aheart-cascader__option:not(:disabled)')?.focus())
  } else if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  }
}
const handleOptionKeydown = (event: KeyboardEvent, option: CascaderOption, columnIndex: number, optionIndex = -1) => {
  const current = event.currentTarget as HTMLButtonElement
  if (virtualEnabled.value) {
    const indexes = enabledIndexes(columnIndex)
    const currentIndex = optionIndex >= 0 ? indexes.indexOf(optionIndex) : indexes.findIndex(index => columns.value[columnIndex]?.[index] === option)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (indexes.length) focusColumnIndex(columnIndex, indexes[(currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + indexes.length) % indexes.length])
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      if (indexes.length) focusColumnIndex(columnIndex, event.key === 'Home' ? indexes[0] : indexes.at(-1)!)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      requestOpen(false)
      void nextTick(() => triggerRef.value?.focus())
    } else if ((event.key === 'Enter' || event.key === ' ') && !option.disabled) {
      event.preventDefault()
      void enterChildColumn(option, columnIndex, current)
    } else if (event.key === 'ArrowRight' && isBranch(option)) {
      event.preventDefault()
      void enterChildColumn(option, columnIndex, current)
    } else if (event.key === 'ArrowLeft' && columnIndex > 0) {
      event.preventDefault()
      const parentValue = focusedPath.value[columnIndex - 1] ?? activePath.value[columnIndex - 1]
      const parentIndex = (columns.value[columnIndex - 1] ?? []).findIndex(candidate => candidate.value === parentValue)
      if (parentIndex >= 0) focusColumnIndex(columnIndex - 1, parentIndex, true)
    }
    return
  }
  const options = Array.from(current.parentElement?.querySelectorAll<HTMLButtonElement>('.aheart-cascader__option:not(:disabled)') ?? [])
  const index = options.indexOf(current)
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    options[event.key === 'Home' ? 0 : options.length - 1]?.focus()
  } else if ((event.key === 'Enter' || event.key === ' ') && !option.disabled) {
    event.preventDefault()
    void enterChildColumn(option, columnIndex, current)
  } else if (event.key === 'ArrowRight' && isBranch(option)) {
    event.preventDefault()
    void enterChildColumn(option, columnIndex, current)
  } else if (event.key === 'ArrowLeft' && columnIndex > 0) {
    event.preventDefault()
    const parentValue = focusedPath.value[columnIndex - 1] ?? activePath.value[columnIndex - 1]
    const parentIndex = (columns.value[columnIndex - 1] ?? []).findIndex(candidate => candidate.value === parentValue)
    if (parentIndex >= 0) focusColumnIndex(columnIndex - 1, parentIndex, true)
  }
}

onBeforeUnmount(invalidateLoads)

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const teleportReady = useTeleportReady()
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) return props.getPopupContainer(triggerRef.value)
  return triggerRef.value?.ownerDocument.body ?? false
})
const shouldTeleport = computed(() => teleportReady.value && popupContainer.value !== false)
const teleportTo = computed(() => popupContainer.value === false ? 'body' : popupContainer.value)
const floatingPosition = useFloatingPosition({
  reference: triggerRef,
  floating: panelRef,
  open: () => !props.disabled && motion.isMounted.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  strategy: 'fixed',
  offset: 4,
  autoAdjustOverflow: () => props.autoAdjustOverflow,
  autoUpdateOptions: { elementResize: false }
})
const viewportBudget = usePopupViewportBudget({
  trigger: triggerRef,
  popup: panelRef,
  placement: floatingPosition.placement,
  open: computed(() => virtualEnabled.value && !props.disabled && mergedOpen.value && motion.isMounted.value && motion.phase.value !== 'hidden'),
  maximum: computed(() => virtualConfig.value?.height ?? 256),
  search: searchRef
})
const effectiveVirtualConfig = computed(() => {
  const config = virtualConfig.value
  if (!config) return { height: 0, estimateSize: 32, overscan: 0 }
  return { ...config, height: Math.max(0, viewportBudget.value.treeHeight) }
})
const panelClass = computed(() => [
  `aheart-floating--${floatingPosition.placement.value}`,
  `is-${motion.phase.value}`,
  { 'is-virtual': virtualEnabled.value }
])
const panelStyle = computed(() => [
  floatingPosition.popupStyle.value,
  virtualEnabled.value ? {
    display: 'flex',
    flexDirection: 'column',
    minBlockSize: '0',
    overflowY: 'hidden',
    maxBlockSize: `${viewportBudget.value.popupHeight}px`
  } as CSSProperties : undefined
])

useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: panelRef,
  onDismiss: () => requestOpen(false)
})

</script>
