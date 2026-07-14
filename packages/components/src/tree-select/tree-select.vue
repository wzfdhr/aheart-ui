<template>
  <div ref="rootRef" class="aheart-tree-select" :class="{ 'is-open': mergedOpen, 'is-disabled': disabled }">
    <div
      ref="triggerRef"
      class="aheart-tree-select__trigger"
      :id="id"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-labelledby="resolvedAriaLabelledby"
      aria-haspopup="tree"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
    >
      <span v-if="multiple && selectedTags.length" class="aheart-tree-select__value aheart-tree-select__tags">
        <span v-for="tag in visibleSelectedTags" :key="String(tag.key)" class="aheart-tree-select__tag">
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
    >
      <input
        v-if="showSearch"
        v-model="searchText"
        class="aheart-tree-select__search"
        type="search"
        placeholder="搜索"
        aria-label="搜索树节点"
      />
      <ATree
        :tree-data="filteredTreeData"
        :selected-keys="selectedKeys"
        :expanded-keys="searchText ? searchExpandedKeys : undefined"
        :multiple="multiple"
        :disabled="disabled"
        @update:selected-keys="handleSelect"
      />
      <div v-if="searchText.trim() && filteredTreeData.length === 0" class="aheart-tree-select__empty" role="status">暂无匹配节点</div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import AIcon from '../icon/icon.vue'
import ATree from '../tree'
import type { TreeKey, TreeNodeData } from '../tree'
import type { FloatingPlacement } from '../utils/floating'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
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
}>(), {
  treeData: () => [],
  placeholder: '请选择',
  placement: 'bottomLeft',
  autoAdjustOverflow: true
})
const attrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [value: TreeSelectValue]
  change: [value: TreeSelectValue]
  openChange: [open: boolean]
  clear: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const innerOpen = ref(props.defaultOpen)
const searchText = ref('')
const innerValue = ref<TreeSelectValue>(props.defaultValue)
const isControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const mergedOpen = computed(() => isOpenControlled.value ? props.open : innerOpen.value)
const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs['aria-labelledby'] as string | undefined)
const mergedValue = computed(() => isControlled.value ? props.modelValue : innerValue.value)
const selectedKeys = computed<TreeKey[]>(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === undefined ? [] : [mergedValue.value])
const flattenNodes = (nodes: TreeNodeData[]): TreeNodeData[] => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])])
const displayLabel = computed(() => selectedKeys.value
  .map((key) => flattenNodes(props.treeData).find((node) => node.key === key)?.title)
  .filter((title): title is string => Boolean(title))
  .join(', '))
const selectedTags = computed(() => selectedKeys.value.map((key) => ({
  key,
  title: flattenNodes(props.treeData).find((node) => node.key === key)?.title ?? String(key)
})))
const visibleSelectedTags = computed(() => props.maxTagCount === undefined
  ? selectedTags.value
  : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)))
const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length)
const filterNodes = (nodes: TreeNodeData[], query: string): TreeNodeData[] => nodes.flatMap((node) => {
  const children = filterNodes(node.children ?? [], query)
  if (node.title.toLowerCase().includes(query) || children.length) return [{ ...node, children }]
  return []
})
const filteredTreeData = computed(() => {
  const query = searchText.value.trim().toLowerCase()
  return query ? filterNodes(props.treeData, query) : props.treeData
})
const searchExpandedKeys = computed(() => flattenNodes(filteredTreeData.value)
  .filter((node) => node.children?.length)
  .map((node) => node.key))
const toggleOpen = () => {
  requestOpen(!mergedOpen.value)
}
const requestOpen = (open: boolean) => {
  if (props.disabled) return
  if (!isOpenControlled.value) innerOpen.value = open
  emit('openChange', open)
}
const emitValue = (value: TreeSelectValue) => {
  if (!isControlled.value) innerValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const handleSelect = (keys: TreeKey[]) => {
  const value: TreeSelectValue = props.multiple ? keys : keys[0]
  emitValue(value)
  if (!props.multiple) requestOpen(false)
}
const clearValue = () => {
  emitValue(props.multiple ? [] : undefined)
  searchText.value = ''
  emit('clear')
}
const removeKey = (key: TreeKey) => {
  if (props.disabled) return
  emitValue(selectedKeys.value.filter((current) => current !== key))
}
const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    requestOpen(true)
    void nextTick(() => panelRef.value?.querySelector<HTMLElement>('[data-tree-key][tabindex="0"]')?.focus())
  } else if (event.key === 'Escape' && mergedOpen.value) {
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
const panelStyle = computed(() => [
  floatingPosition.popupStyle.value,
  triggerRef.value?.getBoundingClientRect().width ? { width: `${triggerRef.value.getBoundingClientRect().width}px` } : undefined
])

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
