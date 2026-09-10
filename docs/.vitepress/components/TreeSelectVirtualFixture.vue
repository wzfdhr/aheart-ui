<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeKey, TreeNodeData } from '../../../packages/components/src/tree/types'
import TreeSelect from '../../../packages/components/src/tree-select/tree-select.vue'

const count = ref<1000 | 10000>(1000)
const open = ref(false)
const selectedKeys = ref<TreeKey[]>(['node-00001', 'node-00002', 'node-00003'])
const controlledValue = ref<TreeKey>('node-00001')
const acceptSelection = ref(false)
const longLabels = ref(false)
const fontSize = ref(14)
const viewportHint = ref<'normal' | 'short'>('normal')
const selectionEvents = ref(0)
const lastSelection = ref('node-00001')

const data = computed<TreeNodeData[]>(() => Array.from({ length: count.value }, (_, index) => {
  const key = `node-${String(index).padStart(5, '0')}`
  const disabled = index === count.value - 1
  const title = longLabels.value && index % 10 === 0
    ? `Node ${String(index).padStart(5, '0')} — a deliberately long label that should remain reachable without clipping in a narrow short viewport`
    : disabled
      ? `Node ${String(index).padStart(5, '0')} disabled tail`
      : `Node ${String(index).padStart(5, '0')}`
  return { key, title, disabled }
}).map((node, index) => index === 0
  ? { key: 'tree-root', title: 'Tree root', children: [{ key: 'tree-child', title: 'Tree child' }], isLeaf: false }
  : node))

const virtual = computed(() => ({ height: viewportHint.value === 'short' ? 180 : 256, estimateSize: 28, overscan: 4 }))
const fixtureStyle = computed(() => ({ fontSize: `${fontSize.value}px` }))
const acceptText = computed(() => acceptSelection.value ? '接受选择更新' : '拒绝选择更新')

const setCount = (next: 1000 | 10000) => { count.value = next }
const toggleSelectionPolicy = () => { acceptSelection.value = !acceptSelection.value }
const toggleLabels = () => { longLabels.value = !longLabels.value }
const toggleFont = () => { fontSize.value = fontSize.value === 14 ? 24 : 14 }
const toggleViewportHint = () => { viewportHint.value = viewportHint.value === 'normal' ? 'short' : 'normal' }
const onMainValue = (value: TreeKey | TreeKey[] | undefined) => {
  selectionEvents.value++
  if (!acceptSelection.value) return
  selectedKeys.value = Array.isArray(value) ? value : value === undefined ? [] : [value]
}
const onControlledValue = (value: TreeKey | TreeKey[] | undefined) => {
  selectionEvents.value++
  lastSelection.value = String(value ?? '')
  if (acceptSelection.value && !Array.isArray(value) && value !== undefined) controlledValue.value = value
}
</script>

<template>
  <section
    data-testid="tree-select-virtual-fixture"
    class="tree-select-virtual-fixture"
    :class="{ 'is-short-hint': viewportHint === 'short' }"
    :data-font-size="fontSize"
    :data-long-labels="longLabels ? 'on' : 'off'"
    aria-label="TreeSelect virtual browser fixture"
    :style="fixtureStyle"
  >
    <div class="tree-select-virtual-fixture__toolbar" aria-label="TreeSelect virtual controls">
      <button type="button" data-testid="tree-select-virtual-count-1000" @click="setCount(1000)">1000 items</button>
      <button type="button" data-testid="tree-select-virtual-count-10000" @click="setCount(10000)">10000 items</button>
      <button type="button" data-testid="tree-select-virtual-labels" @click="toggleLabels">long labels: {{ longLabels ? 'on' : 'off' }}</button>
      <button type="button" data-testid="tree-select-virtual-font" @click="toggleFont">font: {{ fontSize }}</button>
      <button type="button" data-testid="tree-select-virtual-viewport" @click="toggleViewportHint">viewport hint: {{ viewportHint }}</button>
      <button type="button" data-testid="tree-select-virtual-policy" @click="toggleSelectionPolicy">{{ acceptText }}</button>
      <output data-testid="tree-select-virtual-events">events={{ selectionEvents }}; last={{ lastSelection }}</output>
    </div>

    <div class="tree-select-virtual-fixture__row">
      <div class="tree-select-virtual-fixture__field">
        <span id="tree-select-virtual-main-label" class="tree-select-virtual-fixture__label">Virtual checkable / searchable / tags</span>
        <TreeSelect
          data-testid="tree-select-virtual-main"
          :model-value="selectedKeys"
          :tree-data="data"
          :virtual="virtual"
          labelled-by="tree-select-virtual-main-label"
          :open="open"
          tree-checkable
          tree-check-strictly
          show-search
          multiple
          allow-clear
          :max-tag-count="2"
          placeholder="选择节点"
          @update:model-value="onMainValue"
          @open-change="open = $event"
        />
      </div>
      <div class="tree-select-virtual-fixture__field">
        <span id="tree-select-virtual-controlled-label" class="tree-select-virtual-fixture__label">Controlled rejection</span>
        <TreeSelect
          data-testid="tree-select-virtual-controlled"
          :model-value="controlledValue"
          :tree-data="data"
          :virtual="virtual"
          labelled-by="tree-select-virtual-controlled-label"
          placeholder="受控选择"
          @update:model-value="onControlledValue"
        />
      </div>
    </div>
    <p class="tree-select-virtual-fixture__readout" role="status">
      count={{ count }}; tags={{ selectedKeys.join(',') }}; policy={{ acceptSelection ? 'accept' : 'reject' }}
    </p>
  </section>
</template>

<style scoped>
.tree-select-virtual-fixture { display: grid; gap: 12px; width: min(100%, 860px); padding: 14px; border: 1px solid #d9e1ea; border-radius: 8px; background: #fff; color: #1f2937; }
.tree-select-virtual-fixture__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.tree-select-virtual-fixture button { padding: 5px 8px; border: 1px solid #b8c4d0; border-radius: 5px; background: #fff; color: inherit; cursor: pointer; }
.tree-select-virtual-fixture button:focus-visible { outline: 2px solid #1677ff; outline-offset: 2px; }
.tree-select-virtual-fixture__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.tree-select-virtual-fixture__field { min-width: 0; }
.tree-select-virtual-fixture__label { display: block; margin-bottom: 6px; color: #536273; font-size: 12px; }
.tree-select-virtual-fixture :deep(.aheart-tree-select) { width: 100%; }
.tree-select-virtual-fixture__readout { margin: 0; color: #536273; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
@media (max-width: 620px) { .tree-select-virtual-fixture__row { grid-template-columns: 1fr; } }
</style>

<style>
body:has([data-testid="tree-select-virtual-fixture"][data-font-size="24"]) .aheart-tree-select__panel { font-size: 24px; }
body:has([data-testid="tree-select-virtual-fixture"][data-font-size="24"]) .aheart-tree-select__panel,
body:has([data-testid="tree-select-virtual-fixture"][data-font-size="24"]) .aheart-tree-select__panel .aheart-tree { --aheart-font-size: 24px; }
body:has([data-testid="tree-select-virtual-fixture"][data-long-labels="on"]) .aheart-tree-select__panel .aheart-tree__title { white-space: normal; overflow-wrap: anywhere; word-break: break-word; }
</style>
