<template>
  <div ref="rootRef" class="aheart-tree" :class="{ 'is-disabled': isDisabled }" role="tree" :aria-multiselectable="multiple || undefined">
    <ul class="aheart-tree__list">
      <ATreeNode
        v-for="node in treeData"
        :key="node.key"
        :node="node"
        :expanded-keys="mergedExpandedKeys"
        :selected-keys="mergedSelectedKeys"
        :checked-keys="mergedCheckedKeys"
        :focused-key="focusedKey"
        :checkable="checkable"
        :parent-disabled="isDisabled"
        @toggle="toggleExpanded"
        @select="selectNode"
        @check="checkNode"
        @keydown="handleKeydown"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import ATreeNode from './tree-node.vue'
import { treeProps, type TreeKey, type TreeNodeData } from './types'
import './style.css'

defineOptions({ name: 'ATree' })

const props = defineProps(treeProps)
const emit = defineEmits<{
  'update:expandedKeys': [keys: TreeKey[]]
  'update:selectedKeys': [keys: TreeKey[]]
  'update:checkedKeys': [keys: TreeKey[]]
  expand: [keys: TreeKey[], node: TreeNodeData]
  select: [keys: TreeKey[], node: TreeNodeData]
  check: [keys: TreeKey[], node: TreeNodeData]
}>()
const config = useAheartConfig()

const collectKeys = (nodes: TreeNodeData[]): TreeKey[] => nodes.flatMap((node) => [node.key, ...collectKeys(node.children ?? [])])
const innerExpandedKeys = ref<TreeKey[]>(props.defaultExpandAll ? collectKeys(props.treeData) : [...props.defaultExpandedKeys])
const innerSelectedKeys = ref<TreeKey[]>([...props.defaultSelectedKeys])
const innerCheckedKeys = ref<TreeKey[]>([...props.defaultCheckedKeys])
const focusedKey = ref<TreeKey | undefined>(props.treeData[0]?.key)
const rootRef = ref<HTMLDivElement>()
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const mergedExpandedKeys = computed(() => props.expandedKeys ?? innerExpandedKeys.value)
const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value)
const mergedCheckedKeys = computed(() => props.checkedKeys ?? innerCheckedKeys.value)
const expandedControlled = computed(() => props.expandedKeys !== undefined)
const selectedControlled = computed(() => props.selectedKeys !== undefined)
const checkedControlled = computed(() => props.checkedKeys !== undefined)

watch(() => props.treeData, (nodes) => {
  if (!focusedKey.value) focusedKey.value = nodes[0]?.key
})

const hasKey = (keys: TreeKey[], key: TreeKey) => keys.includes(key)
const replaceKey = (keys: TreeKey[], key: TreeKey, enabled: boolean) => enabled ? hasKey(keys, key) ? keys : [...keys, key] : keys.filter((current) => current !== key)
const getVisibleNodes = (nodes: TreeNodeData[], output: TreeNodeData[] = []): TreeNodeData[] => {
  for (const node of nodes) {
    output.push(node)
    if (mergedExpandedKeys.value.includes(node.key)) getVisibleNodes(node.children ?? [], output)
  }
  return output
}
const findParent = (key: TreeKey, nodes = props.treeData, parent?: TreeNodeData): TreeNodeData | undefined => {
  for (const node of nodes) {
    if (node.key === key) return parent
    const result = findParent(key, node.children ?? [], node)
    if (result) return result
  }
}
watch(mergedExpandedKeys, () => {
  const visibleNodes = getVisibleNodes(props.treeData)
  if (!visibleNodes.some((node) => node.key === focusedKey.value)) {
    let nextKey = focusedKey.value
    while (nextKey !== undefined && !visibleNodes.some((node) => node.key === nextKey)) {
      nextKey = findParent(nextKey)?.key
    }
    focusedKey.value = nextKey ?? visibleNodes[0]?.key
  }
})
const focusNode = (key: TreeKey) => {
  focusedKey.value = key
  nextTick(() => {
    Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.aheart-tree__node') ?? [])
      .find((element) => element.dataset.treeKey === String(key))
      ?.focus()
  })
}
const updateExpandedKeys = (keys: TreeKey[], node: TreeNodeData) => {
  if (!expandedControlled.value) innerExpandedKeys.value = keys
  emit('update:expandedKeys', keys)
  emit('expand', keys, node)
}
const toggleExpanded = (node: TreeNodeData, force?: boolean) => {
  if (isDisabled.value || node.disabled || !node.children?.length) return
  const expanded = force ?? !mergedExpandedKeys.value.includes(node.key)
  updateExpandedKeys(replaceKey(mergedExpandedKeys.value, node.key, expanded), node)
}
const selectNode = (node: TreeNodeData) => {
  if (isDisabled.value || node.disabled || !props.selectable) return
  const selected = mergedSelectedKeys.value.includes(node.key)
  const nextKeys = props.multiple ? replaceKey(mergedSelectedKeys.value, node.key, !selected) : selected ? [] : [node.key]
  if (!selectedControlled.value) innerSelectedKeys.value = nextKeys
  focusedKey.value = node.key
  emit('update:selectedKeys', nextKeys)
  emit('select', nextKeys, node)
}
const checkNode = (node: TreeNodeData) => {
  if (isDisabled.value || node.disabled || !props.checkable) return
  const nextKeys = replaceKey(mergedCheckedKeys.value, node.key, !mergedCheckedKeys.value.includes(node.key))
  if (!checkedControlled.value) innerCheckedKeys.value = nextKeys
  focusedKey.value = node.key
  emit('update:checkedKeys', nextKeys)
  emit('check', nextKeys, node)
}
const handleKeydown = (event: KeyboardEvent, node: TreeNodeData) => {
  const visibleNodes = getVisibleNodes(props.treeData)
  const index = visibleNodes.findIndex((current) => current.key === node.key)
  if (event.key === 'ArrowDown' && visibleNodes[index + 1]) {
    event.preventDefault()
    focusNode(visibleNodes[index + 1].key)
  } else if (event.key === 'ArrowUp' && visibleNodes[index - 1]) {
    event.preventDefault()
    focusNode(visibleNodes[index - 1].key)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (node.children?.length && !mergedExpandedKeys.value.includes(node.key)) toggleExpanded(node, true)
    else if (node.children?.[0]) focusNode(node.children[0].key)
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
  }
}
</script>
