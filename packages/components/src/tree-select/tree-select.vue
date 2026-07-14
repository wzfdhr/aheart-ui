<template>
  <div class="aheart-tree-select" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <button class="aheart-tree-select__trigger" type="button" :disabled="disabled" @click="toggleOpen">
      <span>{{ displayLabel || placeholder }}</span>
      <span aria-hidden="true">{{ open ? '⌃' : '⌄' }}</span>
    </button>
    <div v-if="open" class="aheart-tree-select__panel">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue'
import ATree from '../tree'
import type { TreeKey, TreeNodeData } from '../tree'
import './style.css'

defineOptions({ name: 'ATreeSelect' })

type TreeSelectValue = TreeKey | TreeKey[] | undefined

const props = withDefaults(defineProps<{
  treeData?: TreeNodeData[]
  modelValue?: TreeSelectValue
  defaultValue?: TreeSelectValue
  multiple?: boolean
  showSearch?: boolean
  placeholder?: string
  disabled?: boolean
}>(), {
  treeData: () => [],
  placeholder: '请选择'
})
const emit = defineEmits<{
  'update:modelValue': [value: TreeSelectValue]
  change: [value: TreeSelectValue]
}>()

const open = ref(false)
const searchText = ref('')
const innerValue = ref<TreeSelectValue>(props.defaultValue)
const instance = getCurrentInstance()
const isControlled = computed(() => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'modelValue'))
const mergedValue = computed(() => isControlled.value ? props.modelValue : innerValue.value)
const selectedKeys = computed<TreeKey[]>(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === undefined ? [] : [mergedValue.value])
const flattenNodes = (nodes: TreeNodeData[]): TreeNodeData[] => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])])
const displayLabel = computed(() => selectedKeys.value
  .map((key) => flattenNodes(props.treeData).find((node) => node.key === key)?.title)
  .filter((title): title is string => Boolean(title))
  .join(', '))
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
  if (!props.disabled) open.value = !open.value
}
const handleSelect = (keys: TreeKey[]) => {
  const value: TreeSelectValue = props.multiple ? keys : keys[0]
  if (!isControlled.value) innerValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  if (!props.multiple) open.value = false
}
</script>
