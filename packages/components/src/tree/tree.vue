<template>
  <div ref="rootRef" class="aheart-tree" :class="{ 'is-disabled': isDisabled }" role="tree" :aria-multiselectable="multiple || undefined">
    <ul class="aheart-tree__list">
      <ATreeNode
        v-for="node in renderData"
        :key="node.key"
        :node="node"
        :expanded-keys="mergedExpandedKeys"
        :selected-keys="mergedSelectedKeys"
        :checked-keys="checkState.checkedKeys"
        :half-checked-keys="checkState.halfCheckedKeys"
        :loading-keys="loader.loadingKeys.value"
        :error-keys="loader.errorKeys.value"
        :focused-key="focusedKey"
        :checkable="checkable"
        :parent-disabled="isDisabled"
        :node-index="treeIndex"
        :id-prefix="treeId"
        @toggle="toggleExpanded"
        @select="selectNode"
        @check="checkNode"
        @retry="(node) => loader.load(node.key, true)"
        @keydown="handleKeydown"
        @focus="(node) => focusedKey = node.key"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { useStableId } from '../utils/use-stable-id'
import { closestVisibleTreeKey, createTreeIndex, getVisibleTreeNodes, treeKeyToken } from './tree-index'
import { treeModelKey, useTreeLoader } from './use-tree-loader'
import { deriveTreeCheckState, toggleTreeCheck } from './tree-check'
import ATreeNode from './tree-node.vue'
import { treeProps, type TreeCheckInfo, type TreeKey, type TreeNodeData } from './types'
import './style.css'

defineOptions({ name: 'ATree' })

const props = defineProps(treeProps)
const emit = defineEmits<{
  'update:expandedKeys': [keys: TreeKey[]]
  'update:selectedKeys': [keys: TreeKey[]]
  'update:checkedKeys': [keys: TreeKey[]]
  expand: [keys: TreeKey[], node: TreeNodeData]
  select: [keys: TreeKey[], node: TreeNodeData]
  check: [keys: TreeKey[], node: TreeNodeData, info: TreeCheckInfo]
}>()
const config = useAheartConfig()
const attrs = useAttrs()
const treeId = useStableId(() => attrs.id as string | undefined, 'aheart-tree')
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const sharedModel = inject(treeModelKey, undefined)
const loader = sharedModel?.loader ?? useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value)
const renderData = computed(() => sharedModel ? props.treeData : loader.data.value)
const treeIndex = computed(() => createTreeIndex(renderData.value, isDisabled.value))
const checkIndex = computed(() => sharedModel?.index.value ?? treeIndex.value)

const innerExpandedKeys = ref<TreeKey[]>(props.defaultExpandAll ? [...treeIndex.value.order] : [...props.defaultExpandedKeys])
const innerSelectedKeys = ref<TreeKey[]>([...props.defaultSelectedKeys])
const innerCheckedKeys = ref<TreeKey[]>([...props.defaultCheckedKeys])
const focusedKey = ref<TreeKey | undefined>(props.treeData[0]?.key)
const rootRef = ref<HTMLDivElement>()
const mergedExpandedKeys = computed(() => props.expandedKeys ?? innerExpandedKeys.value)
const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value)
const mergedCheckedKeys = computed(() => props.checkedKeys ?? innerCheckedKeys.value)
const checkState = computed(() => deriveTreeCheckState(checkIndex.value, mergedCheckedKeys.value, props.checkStrictly))
const expandedControlled = computed(() => props.expandedKeys !== undefined)
const selectedControlled = computed(() => props.selectedKeys !== undefined)
const checkedControlled = computed(() => props.checkedKeys !== undefined)

const hasKey = (keys: TreeKey[], key: TreeKey) => keys.includes(key)
const replaceKey = (keys: TreeKey[], key: TreeKey, enabled: boolean) => enabled ? hasKey(keys, key) ? keys : [...keys, key] : keys.filter((current) => current !== key)
const isNodeDisabled = (key: TreeKey) => Boolean(treeIndex.value.nodes.get(key)?.disabled)
const visibleNodes = computed(() => getVisibleTreeNodes(treeIndex.value, mergedExpandedKeys.value))
const visiblePositions = computed(() => new Map(visibleNodes.value.map((entry, position) => [entry.key, position])))
const findParent = (key: TreeKey) => {
  const parentKey = treeIndex.value.nodes.get(key)?.parentKey
  return parentKey === undefined ? undefined : treeIndex.value.nodes.get(parentKey)?.node
}
watch([treeIndex, mergedExpandedKeys], ([index], previous) => {
  const activeElement = rootRef.value?.ownerDocument.activeElement as HTMLElement | null
  const hadFocus = Boolean(activeElement && rootRef.value?.contains(activeElement))
  const oldIndex = previous?.[0] ?? index
  const activeToken = hadFocus ? activeElement?.closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken : undefined
  const activeKey = activeToken === undefined ? focusedKey.value : oldIndex.order.find((key) => treeKeyToken(key) === activeToken)
  const visible = new Set(visibleNodes.value.map((entry) => entry.key))
  if (activeKey !== undefined && visible.has(activeKey)) return
  const next = closestVisibleTreeKey(activeKey, index, visible) ?? closestVisibleTreeKey(activeKey, oldIndex, visible) ?? visibleNodes.value[0]?.key
  focusedKey.value = next
  if (hadFocus && next !== undefined) focusNode(next)
})
const focusNode = (key: TreeKey) => {
  focusedKey.value = key
  nextTick(() => {
    Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.aheart-tree__node') ?? [])
      .find((element) => element.dataset.treeToken === treeKeyToken(key))
      ?.focus()
  })
}
const syncCheckboxes = () => {
  for (const input of Array.from(rootRef.value?.querySelectorAll<HTMLInputElement>('.aheart-tree__checkbox') ?? [])) {
    const token = input.closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken
    if (token !== undefined) {
      input.checked = checkState.value.checkedKeys.some((key) => treeKeyToken(key) === token)
      input.indeterminate = checkState.value.halfCheckedKeys.some((key) => treeKeyToken(key) === token)
    }
  }
}
const updateExpandedKeys = (keys: TreeKey[], node: TreeNodeData) => {
  if (!expandedControlled.value) innerExpandedKeys.value = keys
  emit('update:expandedKeys', keys)
  emit('expand', keys, node)
}
const toggleExpanded = (node: TreeNodeData, force?: boolean) => {
  if (isNodeDisabled(node.key) || (!node.children?.length && node.isLeaf !== false)) return
  const expanded = force ?? !mergedExpandedKeys.value.includes(node.key)
  updateExpandedKeys(replaceKey(mergedExpandedKeys.value, node.key, expanded), node)
}
const selectNode = (node: TreeNodeData) => {
  if (isNodeDisabled(node.key) || !props.selectable) return
  const selected = mergedSelectedKeys.value.includes(node.key)
  const nextKeys = props.multiple ? replaceKey(mergedSelectedKeys.value, node.key, !selected) : selected ? [] : [node.key]
  if (!selectedControlled.value) innerSelectedKeys.value = nextKeys
  focusedKey.value = node.key
  emit('update:selectedKeys', nextKeys)
  emit('select', nextKeys, node)
}
const checkNode = (node: TreeNodeData) => {
  if (isNodeDisabled(node.key) || !props.checkable) return
  const next = toggleTreeCheck(checkIndex.value, mergedCheckedKeys.value, node.key, props.checkStrictly)
  const nextKeys = next.checkedKeys
  if (!checkedControlled.value) innerCheckedKeys.value = nextKeys
  focusedKey.value = node.key
  emit('update:checkedKeys', nextKeys)
  emit('check', nextKeys, node, { halfCheckedKeys: next.halfCheckedKeys })
  nextTick(syncCheckboxes)
}
const handleKeydown = (event: KeyboardEvent, node: TreeNodeData) => {
  const orderedNodes = visibleNodes.value
  const index = visiblePositions.value.get(node.key) ?? -1
  if (event.key === 'ArrowDown' && orderedNodes[index + 1]) {
    event.preventDefault()
    focusNode(orderedNodes[index + 1].key)
  } else if (event.key === 'ArrowUp' && orderedNodes[index - 1]) {
    event.preventDefault()
    focusNode(orderedNodes[index - 1].key)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if ((node.children?.length || node.isLeaf === false) && !mergedExpandedKeys.value.includes(node.key)) {
      toggleExpanded(node, true)
      nextTick(() => {
        if (mergedExpandedKeys.value.includes(node.key) && node.children?.[0]) focusNode(node.children[0].key)
      })
    } else if (node.children?.[0]) focusNode(node.children[0].key)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (mergedExpandedKeys.value.includes(node.key)) toggleExpanded(node, false)
    else {
      const parent = findParent(node.key)
      if (parent) focusNode(parent.key)
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    selectNode(node)
  } else if (event.key === ' ') {
    event.preventDefault()
    if (props.checkable) checkNode(node)
    else selectNode(node)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    const target = event.key === 'Home' ? orderedNodes[0] : orderedNodes.at(-1)
    if (target) focusNode(target.key)
  }
}
let mounted = false
const syncLoads = () => {
  if (!mounted) return
  const visible = new Set(visibleNodes.value.map(node => node.key))
  for (const key of loader.loadingKeys.value) {
    if (!visible.has(key) || !mergedExpandedKeys.value.includes(key)) loader.cancel(key)
  }
  for (const key of mergedExpandedKeys.value) {
    if (visible.has(key)) void loader.load(key)
  }
}
watch([treeIndex, mergedExpandedKeys, loader.version], syncLoads, { flush: 'post' })
onMounted(() => { mounted = true; syncLoads() })
</script>
