<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { TreeKey, TreeNodeData } from '../../../packages/components/src/tree/types'
import Tree from '../../../packages/components/src/tree/tree.vue'

const count = ref<1000 | 10000>(1000)
const virtual = ref(true)
const height = ref(320)
const width = ref(520)
const fontSize = ref(14)
const wrapTitles = ref(false)
const disabledAncestor = ref(false)
const treeDisabled = ref(false)
const lazyMode = ref<'fail' | 'success'>('fail')
const lazyData: TreeNodeData[] = [{ key: 'lazy-root', title: 'Lazy loading root', isLeaf: false }]
let lazyHold = true
let releaseLazy: (() => void) | undefined
const revision = ref(0)
const data = ref<TreeNodeData[]>([])
const expandedKeys = ref<TreeKey[]>(['tree-ancestor'])
const focusKey = ref<TreeKey | undefined>()

const makeData = (size: number, disabled = disabledAncestor.value): TreeNodeData[] => {
  const children = Array.from({ length: 9 }, (_, index) => ({
    key: `tree-ancestor-child-${String(index).padStart(2, '0')}`,
    title: `Ancestor child ${String(index).padStart(2, '0')}`
  }))
  const roots: TreeNodeData[] = [{
    key: 'tree-ancestor',
    title: 'Ancestor group (collapse me)',
    disabled,
    children
  }]
  for (let index = 10; index < size; index++) {
    const ordinal = String(index).padStart(5, '0')
    roots.push({
      key: `tree-${ordinal}`,
      title: index % 10 === 0
        ? `Tree row ${ordinal} — a deliberately long title that wraps when the fixture is narrow`
        : `Tree row ${ordinal}`
    })
  }
  return roots
}

const setCount = (next: 1000 | 10000) => {
  count.value = next
  data.value = makeData(next)
  expandedKeys.value = ['tree-ancestor']
  focusKey.value = undefined
  revision.value++
}
const toggleVirtual = () => { virtual.value = !virtual.value }
const cycleHeight = () => { height.value = height.value === 320 ? 220 : height.value === 220 ? 420 : 320 }
const cycleWidth = () => { width.value = width.value === 520 ? 260 : width.value === 260 ? 720 : 520 }
const cycleFont = () => { fontSize.value = fontSize.value === 14 ? 20 : 14 }
const toggleWrap = () => { wrapTitles.value = !wrapTitles.value }
const toggleAncestorDisabled = () => {
  disabledAncestor.value = !disabledAncestor.value
  data.value = makeData(count.value)
  revision.value++
}
const toggleTreeDisabled = () => { treeDisabled.value = !treeDisabled.value }
const setLazyMode = (mode: 'fail' | 'success') => {
  lazyMode.value = mode
  if (mode === 'fail' && releaseLazy) {
    lazyHold = false
    releaseLazy()
    releaseLazy = undefined
  }
}
const loadLazyChildren = async (_node: TreeNodeData, { signal }: { signal: AbortSignal }) => {
  if (lazyHold) {
    await new Promise<void>((resolve, reject) => {
      releaseLazy = resolve
      const abort = () => { releaseLazy = undefined; reject(new Error('fixture lazy request aborted')) }
      signal.addEventListener('abort', abort, { once: true })
    })
  } else await new Promise<void>(resolve => window.setTimeout(resolve, 160))
  if (lazyMode.value === 'fail') throw new Error('fixture requested lazy failure')
  return Array.from({ length: 120 }, (_, index) => ({ key: `lazy-child-${String(index).padStart(3, '0')}`, title: `Lazy child ${String(index).padStart(3, '0')}` }))
}
const collapseAncestor = () => { expandedKeys.value = [] }
const expandAncestor = () => { expandedKeys.value = ['tree-ancestor'] }
const reorder = () => {
  const ancestor = data.value.find(node => node.key === 'tree-ancestor')
  const rest = data.value.filter(node => node.key !== 'tree-ancestor')
  data.value = ancestor ? [ancestor, ...rest.slice(1), rest[0]] : [...rest].reverse()
  revision.value++
}
const deleteFocus = () => {
  const target = focusKey.value
  if (target === undefined || target === 'tree-ancestor') return
  const remove = (nodes: TreeNodeData[]): TreeNodeData[] => nodes
    .filter(node => node.key !== target)
    .map(node => node.children ? { ...node, children: remove(node.children) } : node)
  data.value = remove(data.value)
  revision.value++
}

const onFocusIn = (event: FocusEvent) => {
  const target = event.target as HTMLElement | null
  const row = target?.closest<HTMLElement>('[role="treeitem"][data-tree-key]')
  if (row?.dataset.treeKey) focusKey.value = row.dataset.treeKey
}
const treeStyle = computed(() => ({
  width: `${width.value}px`,
  fontSize: `${fontSize.value}px`
}))
const titleStyle = computed(() => ({ whiteSpace: wrapTitles.value ? 'normal' : 'nowrap' }))
const focusText = computed(() => focusKey.value === undefined ? 'none' : String(focusKey.value))

onMounted(() => {
  data.value = makeData(count.value)
})
</script>

<template>
  <section
    data-testid="tree-virtual-fixture"
    class="tree-virtual-fixture"
    aria-label="Tree virtual browser fixture"
    @focusin="onFocusIn"
  >
    <div class="tree-virtual-fixture__toolbar" aria-label="Tree virtual controls">
      <button type="button" data-testid="tree-virtual-toggle" @click="toggleVirtual">virtual: {{ virtual ? 'on' : 'off' }}</button>
      <button type="button" data-testid="tree-virtual-count-1000" @click="setCount(1000)">1000 items</button>
      <button type="button" data-testid="tree-virtual-count-10000" @click="setCount(10000)">10000 items</button>
      <button type="button" data-testid="tree-virtual-height" @click="cycleHeight">height: {{ height }}</button>
      <button type="button" data-testid="tree-virtual-width" @click="cycleWidth">width: {{ width }}</button>
      <button type="button" data-testid="tree-virtual-font" @click="cycleFont">font: {{ fontSize }}</button>
      <button type="button" data-testid="tree-virtual-wrap" @click="toggleWrap">wrap: {{ wrapTitles ? 'on' : 'off' }}</button>
      <button type="button" data-testid="tree-virtual-disable-ancestor" @click="toggleAncestorDisabled">ancestor disabled: {{ disabledAncestor ? 'on' : 'off' }}</button>
      <button type="button" data-testid="tree-virtual-disable-tree" @click="toggleTreeDisabled">tree disabled: {{ treeDisabled ? 'on' : 'off' }}</button>
      <button type="button" data-testid="tree-virtual-lazy-fail" @click="setLazyMode('fail')">lazy result: fail</button>
      <button type="button" data-testid="tree-virtual-lazy-success" @click="setLazyMode('success')">lazy result: success</button>
      <button type="button" data-testid="tree-virtual-collapse" @click="collapseAncestor">collapse ancestor</button>
      <button type="button" data-testid="tree-virtual-expand" @click="expandAncestor">expand ancestor</button>
      <button type="button" data-testid="tree-virtual-reorder" @click="reorder">reorder</button>
      <button type="button" data-testid="tree-virtual-delete-focus" @click="deleteFocus">delete focused node</button>
    </div>
    <p class="tree-virtual-fixture__readout" aria-live="polite">
      <span data-testid="tree-virtual-count">count={{ data.length + 9 }}</span>
      <span data-testid="tree-virtual-focus">focus={{ focusText }}</span>
      <span data-testid="tree-virtual-revision">revision={{ revision }}</span>
    </p>
    <button type="button" data-testid="tree-virtual-before">outside tree before</button>
    <div class="tree-virtual-fixture__frame">
      <Tree
        :tree-data="data"
        :expanded-keys="expandedKeys"
        :disabled="treeDisabled"
        checkable
        :virtual="virtual ? { height, estimateSize: 28, overscan: 4 } : false"
        :style="[treeStyle, titleStyle]"
        aria-label="Tree virtual fixture tree"
        @update:expanded-keys="expandedKeys = $event"
      />
    </div>
    <div class="tree-virtual-lazy" data-testid="tree-virtual-lazy-fixture">
      <Tree
        :tree-data="lazyData"
        :default-expanded-keys="['lazy-root']"
        :virtual="{ height: 220, estimateSize: 28, overscan: 4 }"
        :load-data="loadLazyChildren"
        aria-label="Tree virtual lazy fixture tree"
      />
    </div>
    <button type="button" data-testid="tree-virtual-after">outside tree after</button>
  </section>
</template>

<style scoped>
.tree-virtual-fixture { display: grid; gap: 10px; width: min(100%, 760px); padding: 12px; border: 1px solid #d9e1ea; border-radius: 8px; background: #fff; color: #1f2937; }
.tree-virtual-fixture__toolbar { display: flex; flex-wrap: wrap; gap: 6px; }
.tree-virtual-fixture button { padding: 5px 8px; border: 1px solid #b8c4d0; border-radius: 5px; background: #fff; color: inherit; cursor: pointer; }
.tree-virtual-fixture button:focus-visible { outline: 2px solid #1677ff; outline-offset: 2px; }
.tree-virtual-fixture__readout { display: flex; flex-wrap: wrap; gap: 16px; margin: 0; color: #536273; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
.tree-virtual-fixture__frame { max-width: 100%; overflow-x: auto; }
.tree-virtual-lazy { max-width: 100%; overflow-x: auto; }
.tree-virtual-lazy :deep(.aheart-tree) { border: 1px solid #e5eaf0; }
.tree-virtual-fixture :deep(.aheart-tree) { border: 1px solid #e5eaf0; }
.tree-virtual-fixture :deep(.aheart-tree__title) { white-space: inherit; }
</style>
