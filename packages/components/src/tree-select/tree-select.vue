<template>
  <div ref="rootRef" class="aheart-tree-select" :class="{ 'is-open': mergedOpen, 'is-disabled': disabled }">
    <div
      ref="triggerRef"
      class="aheart-tree-select__trigger"
      :id="resolvedId"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-labelledby="mergedAriaLabelledby"
      :aria-controls="panelId"
      :aria-activedescendant="virtualEnabled ? undefined : activeNodeId"
      :aria-describedby="mergedAriaDescribedby"
      :aria-invalid="resolvedAriaInvalid"
      aria-haspopup="tree"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
      @focusout="handleTriggerFocusout"
    >
      <span v-if="isMultiple && selectedTags.length" class="aheart-tree-select__value aheart-tree-select__tags">
        <span v-for="tag in visibleSelectedTags" :key="treeKeyToken(tag.key)" class="aheart-tree-select__tag">
          <span class="aheart-tree-select__tag-label">{{ tag.title }}</span>
          <button v-if="!disabled" class="aheart-tree-select__tag-remove" type="button" :aria-label="`移除 ${tag.title}`" @click.stop="removeKey(tag.key)"><AIcon name="close" :size="12" /></button>
        </span>
        <span v-if="hiddenTagCount" class="aheart-tree-select__tag aheart-tree-select__tag--rest">+{{ hiddenTagCount }}</span>
      </span>
      <span v-else class="aheart-tree-select__value" :class="{ 'is-placeholder': !displayLabel }">{{ displayLabel || placeholder }}</span>
      <button
        v-if="allowClear && selectedKeys.length && !disabled"
        class="aheart-tree-select__clear"
        type="button"
        aria-label="清除树选择"
        @click.stop="clearValue"
      ><AIcon name="close" :size="12" /></button>
      <AIcon class="aheart-tree-select__arrow" name="chevron-down" :size="16" aria-hidden="true" />
    </div>
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
    <div
      v-if="motion.isMounted.value"
      v-show="motion.phase.value !== 'hidden'"
      ref="panelRef"
      class="aheart-tree-select__panel"
      :class="panelClass"
      :style="panelStyle"
      :id="panelId"
      role="dialog"
      :aria-labelledby="resolvedAriaLabelledby || undefined"
      :aria-describedby="resolvedAriaDescribedby || undefined"
      :aria-label="resolvedAriaLabelledby ? undefined : '树选择'"
      @focusin="handleTreeFocusin"
      @focusout="handleTriggerFocusout"
    >
      <input
        v-if="showSearch"
        ref="searchRef"
        v-model="searchText"
        class="aheart-tree-select__search"
        type="search"
        placeholder="搜索"
        aria-label="搜索树节点"
        @keydown="handleSearchKeydown"
      />
      <ATree
        :id="treeId"
        :tree-data="filteredTreeData"
        :selected-keys="treeCheckable ? [] : selectedKeys"
        :checked-keys="treeCheckable ? selectedKeys : undefined"
        :checkable="treeCheckable"
        :check-strictly="treeCheckStrictly"
        :selectable="!treeCheckable"
        :expanded-keys="searchText ? searchExpandedKeys : undefined"
        :multiple="isMultiple"
        :disabled="disabled"
        :virtual="treeVirtualForTree || undefined"
        @update:selected-keys="handleSelect"
        @update:checked-keys="handleCheck"
      />
      <div v-if="searchText.trim() && filteredTreeData.length === 0" class="aheart-tree-select__empty" role="status">暂无匹配节点</div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, ref, useAttrs, watch, type CSSProperties } from 'vue'
import AIcon from '../icon/icon.vue'
import { mergeAriaIds, useFormControl } from '../form/control-context'
import ATree from '../tree'
import type { TreeKey, TreeLoadData, TreeNodeData } from '../tree'
import type { TreeVirtual } from '../tree'
import { createTreeFocusBridge, treeFocusBridgeKey, treeVirtualViewportHeightKey } from '../tree/tree-focus-bridge'
import { treeModelKey, useTreeLoader } from '../tree/use-tree-loader'
import { deriveTreeCheckState, toggleTreeCheck } from '../tree/tree-check'
import { createTreeIndex, filterTreeIndex, getVisibleTreeNodes, treeKeyToken } from '../tree/tree-index'
import type { FloatingPlacement } from '../utils/floating-core'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { useControllableState } from '../utils/use-controllable-state'
import { useStableId } from '../utils/use-stable-id'
import { useTeleportReady } from '../utils/use-teleport-ready'
import { usePopupViewportBudget } from '../utils/use-popup-viewport-budget'
import { normalizeTreeSelectVirtual } from './virtual-options'
import './style.css'

defineOptions({ name: 'ATreeSelect' })

type TreeSelectValue = TreeKey | TreeKey[] | undefined

const props = withDefaults(defineProps<{
  treeData?: TreeNodeData[]
  id?: string
  labelledBy?: string
  ariaLabelledby?: string
  modelValue?: TreeSelectValue
  defaultValue?: TreeSelectValue
  multiple?: boolean
  treeCheckable?: boolean
  treeCheckStrictly?: boolean
  loadData?: TreeLoadData
  showSearch?: boolean
  placeholder?: string
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  allowClear?: boolean
  maxTagCount?: number
  placement?: FloatingPlacement
  autoAdjustOverflow?: boolean
  virtual?: TreeVirtual
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
}>(), {
  treeData: () => [],
  treeCheckStrictly: true,
  placeholder: '请选择',
  placement: 'bottomLeft',
  autoAdjustOverflow: true
})
const attrs = useAttrs()
const formControl = useFormControl()
const instanceId = useStableId(undefined, 'aheart-tree-select').value
const panelId = `aheart-tree-select-panel-${instanceId}`
const treeId = `aheart-tree-select-tree-${instanceId}`
const emit = defineEmits<{
  'update:modelValue': [value: TreeSelectValue]
  change: [value: TreeSelectValue]
  openChange: [open: boolean]
  clear: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const searchText = ref('')
watch(searchText, () => { if (virtualEnabled.value) focusBridge.cancel() }, { flush: 'sync' })
const focusBridge = createTreeFocusBridge()
const privateViewportHeight = ref<number | undefined>()
provide(treeFocusBridgeKey, focusBridge)
provide(treeVirtualViewportHeightKey, privateViewportHeight)
const isControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const resolvedId = computed(() => props.id ?? attrs.id as string | undefined ?? formControl?.controlId.value)
const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs['aria-labelledby'] as string | undefined)
const mergedAriaLabelledby = computed(() => mergeAriaIds(resolvedAriaLabelledby.value, formControl?.labelledBy.value))
const resolvedAriaDescribedby = computed(() => attrs['aria-describedby'] as string | undefined)
const mergedAriaDescribedby = computed(() => mergeAriaIds(resolvedAriaDescribedby.value, formControl?.describedBy.value))
const resolvedAriaInvalid = computed(() => attrs['aria-invalid'] as boolean | undefined ?? (formControl?.invalid.value ? true : undefined))
const openState = useControllableState({
  controlled: () => props.open,
  isControlled: isOpenControlled,
  defaultValue: () => props.defaultOpen,
  onChange: (open) => {
    const nextOpen = Boolean(open)
    emit('openChange', nextOpen)
  }
})
const valueState = useControllableState<TreeSelectValue>({
  controlled: () => props.modelValue,
  isControlled,
  defaultValue: () => props.defaultValue,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})
const mergedOpen = computed(() => Boolean(openState.state.value))
const virtualConfig = computed(() => normalizeTreeSelectVirtual(props.virtual, (message) => {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(message)
}))
const virtualEnabled = computed(() => virtualConfig.value !== null)
const mergedValue = valueState.state
const isMultiple = computed(() => props.multiple || props.treeCheckable)
const rawSelectedKeys = computed<TreeKey[]>(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === undefined ? [] : [mergedValue.value])
const loader = useTreeLoader(() => props.treeData, () => props.loadData, () => Boolean(props.disabled))
const treeIndex = computed(() => createTreeIndex(loader.data.value, Boolean(props.disabled)))
const selectedKeys = computed(() => props.treeCheckable ? deriveTreeCheckState(treeIndex.value, rawSelectedKeys.value, props.treeCheckStrictly).checkedKeys : rawSelectedKeys.value)
provide(treeModelKey, { loader, index: treeIndex })
watch(mergedOpen, open => {
  if (!open) {
    loader.cancelAll()
    focusBridge.cancel()
  }
}, { flush: 'sync' })
const displayLabel = computed(() => selectedKeys.value
  .map((key) => treeIndex.value.nodes.get(key)?.node.title)
  .filter((title): title is string => Boolean(title))
  .join(', '))
const selectedTags = computed(() => selectedKeys.value.map((key) => ({
  key,
  title: treeIndex.value.nodes.get(key)?.node.title ?? String(key)
})))
const visibleSelectedTags = computed(() => props.maxTagCount === undefined
  ? selectedTags.value
  : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)))
const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length)
const filteredTreeData = computed(() => {
  const query = searchText.value.trim().toLowerCase()
  return query ? filterTreeIndex(treeIndex.value, (node) => node.title.toLowerCase().includes(query)) : loader.data.value
})
const filteredTreeIndex = computed(() => createTreeIndex(filteredTreeData.value, Boolean(props.disabled)))
const activeKey = ref<TreeKey | undefined>()
const nodeId = (key: TreeKey) => `${treeId}-node-${treeKeyToken(key)}`
const activeNodeId = computed(() => {
  if (!mergedOpen.value || activeKey.value === undefined) return undefined
  return filteredTreeIndex.value.nodes.has(activeKey.value) ? nodeId(activeKey.value) : undefined
})
const handleTreeFocusin = (event: FocusEvent) => {
  const token = (event.target as HTMLElement).closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken
  if (token === undefined) return
  activeKey.value = filteredTreeIndex.value.order.find((key) => treeKeyToken(key) === token)
}
const handleTriggerFocusout = (event?: FocusEvent) => {
  void nextTick(() => {
    const active = triggerRef.value?.ownerDocument.activeElement ?? null
    if (virtualEnabled.value && active && !rootRef.value?.contains(active) && !panelRef.value?.contains(active)) focusBridge.cancel()
    if (!triggerRef.value?.contains(active) && !panelRef.value?.contains(active)) formControl?.blur()
  })
}
const searchExpandedKeys = computed(() => filteredTreeIndex.value.order
  .filter((key) => Boolean(filteredTreeIndex.value.nodes.get(key)?.children.length)))
const focusableSearchKeys = computed(() => (searchText.value.trim() ? getVisibleTreeNodes(filteredTreeIndex.value, searchExpandedKeys.value) : getVisibleTreeNodes(filteredTreeIndex.value, []))
  .filter(entry => !entry.disabled).map(entry => entry.key))
const requestTreeFocus = (key: TreeKey | undefined) => {
  if (key === undefined) return
  if (virtualEnabled.value) {
    focusBridge.request(key, { allowExternalSource: true })
    return
  }
  void nextTick(() => {
    const target = panelRef.value?.querySelector<HTMLElement>(`[data-tree-token="${treeKeyToken(key)}"]`)
    target?.focus()
  })
}
const requestFirstOrLastSearchFocus = (last: boolean) => {
  if (!searchText.value.trim() && virtualEnabled.value) {
    focusBridge.requestEndpoint(last, { allowExternalSource: true })
    return
  }
  const keys = focusableSearchKeys.value
  requestTreeFocus(last ? keys.at(-1) : keys[0])
}
const handleSearchKeydown = (event: KeyboardEvent) => {
  if (!virtualEnabled.value) return
  if (event.key === 'ArrowDown' || event.key === 'Home') {
    event.preventDefault()
    requestFirstOrLastSearchFocus(false)
  } else if (event.key === 'ArrowUp' || event.key === 'End') {
    event.preventDefault()
    requestFirstOrLastSearchFocus(true)
  }
}
const toggleOpen = () => {
  requestOpen(!mergedOpen.value)
}
const requestOpen = (open: boolean) => {
  if (props.disabled) return
  if (!open) {
    focusBridge.cancel()
    if (!isOpenControlled.value) void nextTick(() => triggerRef.value?.focus())
  }
  openState.setState(open, { force: true })
}
const emitValue = (value: TreeSelectValue) => {
  valueState.setState(value, { force: true })
  formControl?.change()
}
const handleSelect = (keys: TreeKey[]) => {
  if (props.treeCheckable) return
  const value: TreeSelectValue = isMultiple.value ? keys : keys[0]
  emitValue(value)
  if (!isMultiple.value) requestOpen(false)
}
const handleCheck = (keys: TreeKey[]) => { if (props.treeCheckable) emitValue(keys) }
const clearValue = () => {
  emitValue(isMultiple.value ? [] : undefined)
  searchText.value = ''
  emit('clear')
}
const removeKey = (key: TreeKey) => {
  if (props.disabled) return
  emitValue(props.treeCheckable ? toggleTreeCheck(treeIndex.value, rawSelectedKeys.value, key, props.treeCheckStrictly).checkedKeys : selectedKeys.value.filter((current) => current !== key))
}
const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    requestOpen(true)
    void nextTick(() => {
      const key = focusableSearchKeys.value[0]
      if (virtualEnabled.value) requestTreeFocus(key)
      else {
        const node = panelRef.value?.querySelector<HTMLElement>('[data-tree-token][tabindex="0"]')
        const token = node?.dataset.treeToken
        if (token !== undefined) activeKey.value = filteredTreeIndex.value.order.find((key) => treeKeyToken(key) === token)
        node?.focus()
      }
    })
  } else if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => triggerRef.value?.focus())
  }
}

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
  open: () => motion.isMounted.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  strategy: 'fixed',
  offset: 4,
  autoAdjustOverflow: () => props.autoAdjustOverflow
})
const viewportBudget = usePopupViewportBudget({
  trigger: triggerRef,
  popup: panelRef,
  placement: floatingPosition.placement,
  open: computed(() => virtualEnabled.value && !props.disabled && mergedOpen.value && motion.isMounted.value && motion.phase.value !== 'hidden'),
  maximum: computed(() => virtualConfig.value?.height ?? 256),
  search: searchRef
})
watch(viewportBudget, value => { privateViewportHeight.value = virtualEnabled.value ? value.treeHeight : undefined }, { immediate: true })
const treeVirtualForTree = computed<TreeVirtual | false>(() => {
  const config = virtualConfig.value
  if (!config) return false
  return { ...config }
})
const panelClass = computed(() => [
  `aheart-floating--${floatingPosition.placement.value}`,
  `is-${motion.phase.value}`
])
const panelStyle = computed(() => [
  floatingPosition.popupStyle.value,
  triggerRef.value?.getBoundingClientRect().width ? { width: `${triggerRef.value.getBoundingClientRect().width}px` } : undefined,
  virtualEnabled.value ? { display: 'flex', flexDirection: 'column', minBlockSize: '0', overflow: 'hidden', maxBlockSize: `${viewportBudget.value.popupHeight}px` } as CSSProperties : undefined
])

useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: panelRef,
  onDismiss: () => requestOpen(false)
})

</script>
