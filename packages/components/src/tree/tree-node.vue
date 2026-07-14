<template>
  <li
    class="aheart-tree__treeitem"
    role="treeitem"
    :aria-selected="selected"
    :aria-expanded="hasChildren ? expanded : undefined"
    :aria-disabled="isDisabled || undefined"
  >
    <div
      class="aheart-tree__node"
      :class="{ 'is-expanded': expanded, 'is-selected': selected, 'is-checked': checked, 'is-disabled': isDisabled }"
      :data-tree-key="String(node.key)"
      :tabindex="focused ? 0 : -1"
      @click="$emit('select', node)"
      @keydown="$emit('keydown', $event, node)"
    >
      <button
        v-if="hasChildren"
        class="aheart-tree__switcher"
        type="button"
        :disabled="isDisabled"
        :aria-label="expanded ? 'Collapse node' : 'Expand node'"
        @click.stop="$emit('toggle', node)"
      >
        {{ expanded ? '−' : '+' }}
      </button>
      <span v-else class="aheart-tree__switcher aheart-tree__switcher--empty" aria-hidden="true" />
      <input
        v-if="checkable"
        class="aheart-tree__checkbox"
        type="checkbox"
        :checked="checked"
        :disabled="isDisabled"
        :aria-label="`Select ${node.title}`"
        @click.stop
        @change="$emit('check', node)"
      />
      <span class="aheart-tree__title">{{ node.title }}</span>
    </div>
    <ul v-if="hasChildren && expanded" class="aheart-tree__group" role="group">
      <ATreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :checked-keys="checkedKeys"
        :focused-key="focusedKey"
        :checkable="checkable"
        :parent-disabled="isDisabled"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @check="$emit('check', $event)"
        @keydown="(event, childNode) => $emit('keydown', event, childNode)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TreeKey, TreeNodeData } from './types'

defineOptions({ name: 'ATreeNode' })

const props = defineProps<{
  node: TreeNodeData
  expandedKeys: TreeKey[]
  selectedKeys: TreeKey[]
  checkedKeys: TreeKey[]
  focusedKey?: TreeKey
  checkable: boolean
  parentDisabled?: boolean
}>()

defineEmits<{
  toggle: [node: TreeNodeData]
  select: [node: TreeNodeData]
  check: [node: TreeNodeData]
  keydown: [event: KeyboardEvent, node: TreeNodeData]
}>()

const hasChildren = computed(() => Boolean(props.node.children?.length))
const isDisabled = computed(() => Boolean(props.parentDisabled || props.node.disabled))
const expanded = computed(() => props.expandedKeys.includes(props.node.key))
const selected = computed(() => props.selectedKeys.includes(props.node.key))
const checked = computed(() => props.checkedKeys.includes(props.node.key))
const focused = computed(() => props.focusedKey === props.node.key)
</script>
