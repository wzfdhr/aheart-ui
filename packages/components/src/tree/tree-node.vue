<template>
  <li
    class="aheart-tree__treeitem"
    role="presentation"
  >
    <div
      class="aheart-tree__node"
      :id="nodeId"
      role="treeitem"
      :aria-label="node.title"
      :aria-selected="selected"
      :aria-expanded="hasChildren ? expanded : undefined"
      :aria-disabled="isDisabled || undefined"
      :aria-checked="checkable ? halfChecked ? 'mixed' : checked : undefined"
      :aria-busy="loading || undefined"
      :aria-level="metadata?.level"
      :aria-posinset="metadata?.position"
      :aria-setsize="metadata?.setSize"
      :aria-owns="hasChildren && expanded ? `${nodeId}-group` : undefined"
      :class="{ 'is-expanded': expanded, 'is-selected': selected, 'is-checked': checked, 'is-disabled': isDisabled }"
      :data-tree-key="String(node.key)"
      :data-tree-token="treeKeyToken(node.key)"
      :tabindex="focused ? 0 : -1"
      @click="$emit('select', node)"
      @keydown="$emit('keydown', $event, node)"
      @focus="$emit('focus', node)"
    >
      <button
        v-if="hasChildren"
        class="aheart-tree__switcher"
        type="button"
        tabindex="-1"
        :disabled="isDisabled"
        :aria-label="expanded ? 'Collapse node' : 'Expand node'"
        @click.stop="$emit('toggle', node)"
      >
        <AIcon v-if="loading" name="loading" :size="14" spin aria-hidden="true" />
        <template v-else>{{ expanded ? '−' : '+' }}</template>
      </button>
      <span v-else class="aheart-tree__switcher aheart-tree__switcher--empty" aria-hidden="true" />
      <input
        v-if="checkable"
        class="aheart-tree__checkbox"
        type="checkbox"
        tabindex="-1"
        :checked="checked"
        :indeterminate="halfChecked"
        :disabled="isDisabled"
        :aria-label="`Select ${node.title}`"
        @click.stop
        @change="$emit('check', node)"
      />
      <span class="aheart-tree__title">{{ node.title }}</span>
      <button v-if="errorKeys.has(node.key)" type="button" class="aheart-tree__retry" :disabled="isDisabled" :aria-label="`重试加载 ${node.title}`" @click.stop="$emit('retry', node)" @keydown.stop>加载失败，重试</button>
    </div>
    <ul v-if="hasChildren && expanded" :id="`${nodeId}-group`" class="aheart-tree__group" role="group">
      <ATreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        :half-checked-keys="halfCheckedKeys"
        :loading-keys="loadingKeys"
        :error-keys="errorKeys"
        :focused-key="focusedKey"
        :checkable="checkable"
        :parent-disabled="isDisabled"
        :node-index="nodeIndex"
        :id-prefix="idPrefix"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @check="$emit('check', $event)"
        @retry="$emit('retry', $event)"
        @keydown="(event, childNode) => $emit('keydown', event, childNode)"
        @focus="$emit('focus', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AIcon from '../icon/icon.vue'
import type { TreeKey, TreeNodeData } from './types'
import { treeKeyToken, type TreeIndex } from './tree-index'

defineOptions({ name: 'ATreeNode' })

const props = defineProps<{
  node: TreeNodeData
  expandedKeys: TreeKey[]
  selectedKeys: TreeKey[]
  checkedKeys: TreeKey[]
  halfCheckedKeys: TreeKey[]
  loadingKeys: Set<TreeKey>
  errorKeys: Set<TreeKey>
  focusedKey?: TreeKey
  checkable: boolean
  parentDisabled?: boolean
  nodeIndex: TreeIndex
  idPrefix: string
}>()

defineEmits<{
  toggle: [node: TreeNodeData]
  select: [node: TreeNodeData]
  check: [node: TreeNodeData]
  retry: [node: TreeNodeData]
  keydown: [event: KeyboardEvent, node: TreeNodeData]
  focus: [node: TreeNodeData]
}>()

const hasChildren = computed(() => Boolean(props.node.children?.length) || props.node.isLeaf === false)
const loading = computed(() => props.loadingKeys.has(props.node.key))
const halfChecked = computed(() => props.halfCheckedKeys.includes(props.node.key))
const metadata = computed(() => props.nodeIndex.nodes.get(props.node.key))
const nodeId = computed(() => `${props.idPrefix}-node-${treeKeyToken(props.node.key)}`)
const isDisabled = computed(() => Boolean(props.parentDisabled || props.node.disabled))
const expanded = computed(() => props.expandedKeys.includes(props.node.key))
const selected = computed(() => props.selectedKeys.includes(props.node.key))
const checked = computed(() => props.checkedKeys.includes(props.node.key))
const focused = computed(() => props.focusedKey === props.node.key)
</script>
