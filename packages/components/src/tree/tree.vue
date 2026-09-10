<template>
  <div ref="rootRef" class="aheart-tree" :class="{ 'is-disabled': isDisabled, 'is-virtual': virtualConfig && !virtualFallback }" :style="virtualConfig && !virtualFallback ? { maxBlockSize: `${internalViewportHeight ?? virtualConfig.height}px`, overflowY: 'auto' } : undefined" role="tree" :aria-multiselectable="multiple || undefined" :tabindex="virtualConfig && !virtualFallback ? -1 : undefined" @focusin="trackFocusIn" @focusout="trackFocusOut">
    <ul class="aheart-tree__list" :style="virtualConfig && !virtualFallback ? { blockSize: `${virtualAdapter.totalSize.value}px`, position: 'relative' } : undefined">
      <ATreeNode
        v-for="entry in renderedNodes"
        :key="entry.key"
        :node="entry.node"
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
        @retry="retryNode"
        @keydown="handleKeydown"
        @focus="handleNodeFocus"
        :virtual="Boolean(virtualConfig && !virtualFallback)"
        :virtual-style="rowStyle(entry)"
        :measure-ref="measureRef(entry)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch, type VNodeRef } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { useStableId } from '../utils/use-stable-id'
import { closestVisibleTreeKey, createTreeIndex, getVisibleTreeNodes, treeKeyToken } from './tree-index'
import { treeModelKey, useTreeLoader } from './use-tree-loader'
import { deriveTreeCheckState, toggleTreeCheck } from './tree-check'
import ATreeNode from './tree-node.vue'
import { treeProps, type TreeCheckInfo, type TreeKey, type TreeNodeData } from './types'
import { normalizeTreeVirtual } from './virtual-options'
import { useTreeVirtual } from './use-tree-virtual'
import { treeFocusBridgeKey, treeVirtualViewportHeightKey } from './tree-focus-bridge'
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
const focusBridge = inject(treeFocusBridgeKey, undefined)
const privateViewportHeight = inject(treeVirtualViewportHeightKey, undefined)
const loader = sharedModel?.loader ?? useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value)
const renderData = computed(() => sharedModel ? props.treeData : loader.data.value)
const treeIndex = computed(() => createTreeIndex(renderData.value, isDisabled.value))
const checkIndex = computed(() => sharedModel?.index.value ?? treeIndex.value)

const innerExpandedKeys = ref<TreeKey[]>(props.defaultExpandAll ? [...treeIndex.value.order] : [...props.defaultExpandedKeys])
const innerSelectedKeys = ref<TreeKey[]>([...props.defaultSelectedKeys])
const innerCheckedKeys = ref<TreeKey[]>([...props.defaultCheckedKeys])
const focusedKey = ref<TreeKey | undefined>(props.treeData[0]?.key)
const rootRef = ref<HTMLDivElement>()
const lastFocusKey = ref<TreeKey | undefined>()
const focusMovedOutside = ref(false)
let treeAlive = true
let retryIntentSerial = 0
type RetryIntent = { id: number; key: TreeKey; generation: number; node: TreeNodeData }
let retryIntent: RetryIntent | undefined
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
const virtualConfig = computed(() => normalizeTreeVirtual(props.virtual, (message) => {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(message)
}))
const virtualAdapter = useTreeVirtual(rootRef, virtualConfig, visibleNodes, focusedKey, isDisabled)
const virtualFallback = computed(() => virtualAdapter.fallback.value)
const retireRetryIntent = (intent: Pick<RetryIntent, 'id' | 'key' | 'generation'>, cancelGeneration = true) => {
  if (retryIntent?.id !== intent.id) return
  if (cancelGeneration && intent.generation !== 0 && virtualAdapter.isPending(intent.key, intent.generation)) virtualAdapter.cancelPending()
  retryIntent = undefined
}
const internalViewportHeight = computed(() => privateViewportHeight?.value)
const renderedNodes = computed(() => virtualConfig.value && !virtualFallback.value
  ? virtualAdapter.rows.value.map(row => ({ key: row.entry.key, node: row.entry.node, item: row.item, level: row.entry.level }))
  : renderData.value.map(node => ({ key: node.key, node, item: undefined })))
const rowStyle = (entry: { item?: { start: number }; level?: number }) => virtualConfig.value && !virtualFallback.value && entry.item
  ? {
      position: 'absolute',
      top: '0',
      insetInline: '0',
      width: '100%',
      boxSizing: 'border-box',
      paddingInlineStart: `${Math.max(0, (entry.level ?? 1) - 1) * 20}px`,
      transform: `translateY(${entry.item.start}px)`
    }
  : undefined
const measureRef = (entry: { key: TreeKey; item?: { index: number } }): VNodeRef | undefined => virtualConfig.value && !virtualFallback.value && entry.item
  ? (element) => virtualAdapter.measureRow(element && typeof element === 'object' && 'nodeType' in element ? element as Element : null, entry.item!.index, treeKeyToken(entry.key))
  : undefined
watch([treeIndex, mergedExpandedKeys], ([index], previous) => {
  const activeElement = rootRef.value?.ownerDocument.activeElement as HTMLElement | null
  const hadFocus = Boolean(activeElement && rootRef.value?.contains(activeElement))
  const oldIndex = previous?.[0] ?? index
  const activeToken = hadFocus ? activeElement?.closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken : undefined
  const activeKey = hadFocus
    ? activeToken === undefined ? focusedKey.value : oldIndex.order.find((key) => treeKeyToken(key) === activeToken)
    : virtualConfig.value ? virtualAdapter.focusRecoveryKey.value : focusMovedOutside.value ? undefined : lastFocusKey.value
  const visible = new Set(visibleNodes.value.map((entry) => entry.key))
  if (activeKey !== undefined && visible.has(activeKey)) return
  if (!hadFocus && activeKey === undefined && focusedKey.value !== undefined && visible.has(focusedKey.value)) return
  const recoveryKey = activeKey ?? focusedKey.value
  const next = closestVisibleTreeKey(recoveryKey, index, visible) ?? closestVisibleTreeKey(recoveryKey, oldIndex, visible) ?? visibleNodes.value[0]?.key
  if (next === undefined) return
  if (hadFocus || activeKey !== undefined) focusNode(next)
  else focusedKey.value = next
}, { flush: 'post' })
const trackFocusIn = (event: FocusEvent) => {
  const row = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-tree-token]')
  if (!row || !rootRef.value?.contains(row)) return
  const token = row.dataset.treeToken
  lastFocusKey.value = treeIndex.value.order.find(key => treeKeyToken(key) === token)
  focusMovedOutside.value = false
}
const trackFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget as Node | null
  if (next && !rootRef.value?.contains(next)) focusMovedOutside.value = true
}
const focusNode = (key: TreeKey, existingVersion?: number, allowExternalSource = false, ownedIntent?: RetryIntent) => {
  if (!virtualConfig.value || virtualFallback.value) {
    focusedKey.value = key
    void nextTick(() => {
      const target = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.aheart-tree__node') ?? [])
        .find((element) => element.dataset.treeToken === treeKeyToken(key))
      target?.focus()
      if (ownedIntent) retireRetryIntent(ownedIntent, false)
    })
    return
  }
  const version = existingVersion ?? virtualAdapter.ensureKey(key)
  const activeBefore = rootRef.value?.ownerDocument.activeElement
  const sourceOwnsTarget = (activeBefore as HTMLElement | null)?.closest<HTMLElement>('[data-tree-token]')?.dataset.treeToken === treeKeyToken(key)
  let attempts = 0
  const focusMounted = () => {
    const activeNow = rootRef.value?.ownerDocument.activeElement
    const body = rootRef.value?.ownerDocument.body
    if (!allowExternalSource && virtualConfig.value && activeBefore && rootRef.value && activeBefore !== rootRef.value && activeBefore !== body && !rootRef.value.contains(activeBefore) && !(sourceOwnsTarget && activeNow === body)) {
      if (ownedIntent) retireRetryIntent(ownedIntent)
      else virtualAdapter.cancelPending()
      return
    }
    if (!allowExternalSource && virtualConfig.value && activeNow && rootRef.value && activeNow !== rootRef.value && activeNow !== rootRef.value.ownerDocument.body && !rootRef.value.contains(activeNow)) {
      if (ownedIntent) retireRetryIntent(ownedIntent)
      else virtualAdapter.cancelPending()
      return
    }
    const target = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.aheart-tree__node') ?? [])
      .find((element) => element.dataset.treeToken === treeKeyToken(key))
    const generationValid = virtualAdapter.isPending(key, version)
    if (target && generationValid) {
      focusedKey.value = key
      virtualAdapter.commitFocus(key)
      target.focus()
      if (ownedIntent) retireRetryIntent(ownedIntent, false)
      return
    }
    if (target && !generationValid) {
      if (ownedIntent) retireRetryIntent(ownedIntent, false)
      return
    }
    if (virtualAdapter.isPending(key, version)) {
      if (attempts++ < 8) void nextTick(focusMounted)
      else if (ownedIntent && ownedIntent.generation === version) retireRetryIntent(ownedIntent)
    } else if (ownedIntent) retireRetryIntent(ownedIntent, false)
  }
  void nextTick(focusMounted)
}
const handleNodeFocus = (node: TreeNodeData) => {
  focusedKey.value = node.key
  virtualAdapter.commitFocus(node.key)
}
const cancelTreeFocus = () => {
  if (retryIntent) retireRetryIntent(retryIntent)
  virtualAdapter.cancelPending()
}
const unregisterFocusBridge = focusBridge?.register(
  (key, allowExternalSource) => focusNode(key, undefined, allowExternalSource),
  cancelTreeFocus,
  (last) => visibleNodes.value.filter(entry => !isNodeDisabled(entry.key)).at(last ? -1 : 0)?.key
)
onBeforeUnmount(() => {
  treeAlive = false
  if (retryIntent) retireRetryIntent(retryIntent)
  virtualAdapter.cancelPending()
  unregisterFocusBridge?.()
})
const createRetryIntent = (node: TreeNodeData) => {
  const generation = virtualConfig.value && !virtualFallback.value ? virtualAdapter.ensureKey(node.key) : 0
  if (generation !== 0) virtualAdapter.beginFocusHandoff(node.key)
  const intent = { id: ++retryIntentSerial, key: node.key, generation, node }
  retryIntent = intent
  return intent
}
const startRetry = (node: TreeNodeData, intent = createRetryIntent(node)) => {
  if (!treeAlive || retryIntent?.id !== intent.id || isNodeDisabled(node.key) || treeIndex.value.nodes.get(node.key)?.node !== intent.node) {
    retireRetryIntent(intent)
    return
  }
  void loader.load(node.key, true)
  void nextTick(() => {
    if (!treeAlive || retryIntent?.id !== intent.id || isNodeDisabled(node.key) || treeIndex.value.nodes.get(node.key)?.node !== intent.node) {
      retireRetryIntent(intent)
      return
    }
    if (intent.generation === 0 || virtualAdapter.isPending(node.key, intent.generation)) focusNode(node.key, intent.generation || undefined, false, intent)
    else retireRetryIntent(intent, false)
  })
}
const retryNode = (node: TreeNodeData) => {
  if (isNodeDisabled(node.key)) return
  const intent = createRetryIntent(node)
  if (!mergedExpandedKeys.value.includes(node.key)) {
    toggleExpanded(node, true)
    void nextTick(() => {
      if (retryIntent?.id === intent.id && mergedExpandedKeys.value.includes(node.key)) startRetry(node, intent)
      else retireRetryIntent(intent)
    })
    return
  }
  startRetry(node, intent)
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
    const enabledNodes = orderedNodes.filter(entry => !isNodeDisabled(entry.key))
    const target = event.key === 'Home' ? enabledNodes[0] : enabledNodes.at(-1)
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
