<script setup lang="ts">
import { computed, ref } from 'vue'
import Cascader from '../../../packages/components/src/cascader/cascader.vue'
import type { CascaderOption, CascaderPath, CascaderValue } from '../../../packages/components/src/cascader/types'

type Size = 1000 | 10000
type FixtureMode = 'siblings' | 'five-columns' | 'search-leaves'

const count = ref<Size>(1000)
const mode = ref<FixtureMode>('siblings')
const virtual = ref(true)
const longLabels = ref(false)
const fontSize = ref(14)
const viewportHint = ref<'normal' | 'short'>('normal')
const acceptSelection = ref(true)
const value = ref<CascaderValue>()
const controlledValue = ref<CascaderValue>()
const selectionEvents = ref(0)
const lastSelection = ref('[]')
const lazyState = ref<'idle' | 'loading' | 'error' | 'success' | 'aborted'>('idle')
const lazyAttempts = ref(0)
const lazyAborts = ref(0)
const lazyRevision = ref(0)
const lazyOpen = ref(false)
let releaseLazy: (() => void) | undefined
let lazyRequestToken = 0

const virtualConfig = computed(() => virtual.value ? {
  height: viewportHint.value === 'short' ? 180 : 256,
  estimateSize: 30,
  overscan: 4
} : false)

const labelFor = (prefix: string, index: number) => {
  const ordinal = String(index).padStart(4, '0')
  return longLabels.value && index % 7 === 0
    ? `${prefix} ${ordinal} — a deliberately long label that must remain reachable in a narrow viewport`
    : `${prefix} ${ordinal}`
}

const leaf = (prefix: string, index: number, disabled = false): CascaderOption => ({
  value: `${prefix}-leaf-${index}`,
  label: labelFor(`${prefix} leaf`, index),
  disabled
})

const siblingOptions = computed<CascaderOption[]>(() => Array.from({ length: count.value }, (_, index) => ({
  value: `sibling-${index}`,
  label: labelFor('Sibling', index),
  disabled: index === count.value - 1,
  children: [leaf('sibling', index)]
})))

const fiveColumnOptions = computed<CascaderOption[]>(() => {
  const size = 2000
  return Array.from({ length: size }, (_, index) => ({
    value: `level-0-${index}`,
    label: labelFor('Level 0', index),
    disabled: index === size - 1,
    children: [{
      value: `level-1-${index}`,
      label: labelFor('Level 1', index),
      children: [{
        value: `level-2-${index}`,
        label: labelFor('Level 2', index),
        children: [{
          value: `level-3-${index}`,
          label: labelFor('Level 3', index),
          children: [{ value: `level-4-${index}`, label: labelFor('Level 4', index) }]
        }]
      }]
    }]
  }))
})

const searchOptions = computed<CascaderOption[]>(() => Array.from({ length: 10000 }, (_, index) => ({
  value: `search-${index}`,
  label: `Search group ${String(index).padStart(5, '0')}`,
  children: [{
    value: `search-leaf-${index}`,
    label: `Search leaf ${String(index).padStart(5, '0')}`,
    disabled: index === 9999
  }]
})))

const options = computed(() => mode.value === 'five-columns'
  ? fiveColumnOptions.value
  : mode.value === 'search-leaves' ? searchOptions.value : siblingOptions.value)

const duplicateOptions: CascaderOption[] = [
  { value: 'duplicate-a', label: 'Duplicate path A', children: [{ value: 'same-leaf', label: 'Same leaf' }] },
  { value: 'duplicate-b', label: 'Duplicate path B', children: [{ value: 'same-leaf', label: 'Same leaf' }] },
  { value: 1, label: 'Numeric branch', children: [{ value: 'typed-leaf', label: 'Typed leaf' }] },
  { value: '1', label: 'String branch', children: [{ value: 'typed-leaf', label: 'Typed leaf' }] }
]

const setCount = (next: Size) => { count.value = next; value.value = undefined }
const setMode = (next: FixtureMode) => { mode.value = next; value.value = undefined }
const toggleVirtual = () => { virtual.value = !virtual.value }
const toggleLabels = () => { longLabels.value = !longLabels.value }
const toggleFont = () => { fontSize.value = fontSize.value === 14 ? 24 : 14 }
const toggleViewport = () => { viewportHint.value = viewportHint.value === 'normal' ? 'short' : 'normal' }
const togglePolicy = () => { acceptSelection.value = !acceptSelection.value }
const selectionText = (next: CascaderValue) => JSON.stringify(next ?? null)
const onMainValue = (next: CascaderValue) => {
  selectionEvents.value++
  lastSelection.value = selectionText(next)
  if (acceptSelection.value) value.value = next
}
const onControlledValue = (next: CascaderValue) => {
  selectionEvents.value++
  lastSelection.value = selectionText(next)
  if (acceptSelection.value) controlledValue.value = next
}

const lazyOptions = ref<CascaderOption[]>([{ value: 'lazy-root', label: 'Lazy root', isLeaf: false }])
const loadLazy = async (_option: CascaderOption, { signal }: { signal: AbortSignal }) => {
  const attempt = ++lazyAttempts.value
  const request = ++lazyRequestToken
  lazyState.value = 'loading'
  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, 180)
    const abort = () => { window.clearTimeout(timer); lazyAborts.value++; lazyState.value = 'aborted'; reject(new Error('fixture lazy request aborted')) }
    signal.addEventListener('abort', abort, { once: true })
  })
  if (request !== lazyRequestToken || signal.aborted) throw new Error('stale lazy request')
  if (attempt === 1) { lazyState.value = 'error'; throw new Error('fixture first attempt failed') }
  lazyState.value = 'success'
  return [{ value: 'lazy-child', label: 'Loaded lazy child' }]
}
const replaceLazy = () => { lazyRevision.value++; lazyOptions.value = [{ value: `lazy-root-${lazyRevision.value}`, label: 'Lazy root replaced', isLeaf: false }] }
const abortLazy = () => { lazyOpen.value = false; lazyRequestToken++ }
const closeLazy = () => { lazyOpen.value = false }
</script>

<template>
  <section
    data-testid="cascader-virtual-fixture"
    class="cascader-virtual-fixture"
    :data-font-size="fontSize"
    :data-long-labels="longLabels ? 'on' : 'off'"
    :data-viewport="viewportHint"
    :style="{ fontSize: `${fontSize}px` }"
    aria-label="Cascader virtual browser fixture"
  >
    <div class="cascader-virtual-fixture__toolbar" aria-label="Cascader virtual controls">
      <button type="button" data-testid="cascader-virtual-toggle" @click="toggleVirtual">virtual: {{ virtual ? 'on' : 'off' }}</button>
      <button type="button" data-testid="cascader-virtual-count-1000" @click="setCount(1000)">1000 siblings</button>
      <button type="button" data-testid="cascader-virtual-count-10000" @click="setCount(10000)">10000 siblings</button>
      <button type="button" data-testid="cascader-virtual-five-columns" @click="setMode('five-columns')">5 columns x 2000</button>
      <button type="button" data-testid="cascader-virtual-search-leaves" @click="setMode('search-leaves')">10000 search leaves</button>
      <button type="button" data-testid="cascader-virtual-labels" @click="toggleLabels">long labels: {{ longLabels ? 'on' : 'off' }}</button>
      <button type="button" data-testid="cascader-virtual-font" @click="toggleFont">font: {{ fontSize }}</button>
      <button type="button" data-testid="cascader-virtual-viewport" @click="toggleViewport">viewport: {{ viewportHint }}</button>
      <button type="button" data-testid="cascader-virtual-policy" @click="togglePolicy">{{ acceptSelection ? 'reject updates' : 'accept updates' }}</button>
      <button type="button" data-testid="cascader-virtual-duplicate" @click="setMode('siblings')">duplicate leaf paths</button>
    </div>
    <p class="cascader-virtual-fixture__readout" role="status">
      <span data-testid="cascader-virtual-count">count={{ options.length }}</span>
      <span data-testid="cascader-virtual-events">events={{ selectionEvents }}; last={{ lastSelection }}; policy={{ acceptSelection ? 'accept' : 'reject' }}</span>
    </p>

    <div class="cascader-virtual-fixture__fields">
      <div class="cascader-virtual-fixture__field">
        <span id="cascader-virtual-default-label" class="cascader-virtual-fixture__label">Default full DOM</span>
        <Cascader
          data-testid="cascader-virtual-default"
          :options="siblingOptions"
          placeholder="默认完整 DOM"
          aria-labelledby="cascader-virtual-default-label"
        />
      </div>
      <div class="cascader-virtual-fixture__field">
        <span id="cascader-virtual-main-label" class="cascader-virtual-fixture__label">Virtual Cascader</span>
        <Cascader
          data-testid="cascader-virtual-main"
          :options="options"
          :model-value="value"
          :virtual="virtualConfig"
          show-search
          allow-clear
          placeholder="选择级联路径"
          aria-labelledby="cascader-virtual-main-label"
          @update:model-value="onMainValue"
        />
      </div>
      <div class="cascader-virtual-fixture__field">
        <span id="cascader-virtual-controlled-label" class="cascader-virtual-fixture__label">Controlled acceptance</span>
        <Cascader
          data-testid="cascader-virtual-controlled"
          :options="duplicateOptions"
          :model-value="controlledValue"
          :virtual="virtualConfig"
          placeholder="受控级联"
          aria-labelledby="cascader-virtual-controlled-label"
          @update:model-value="onControlledValue"
        />
      </div>
      <div class="cascader-virtual-fixture__field">
        <span id="cascader-virtual-lazy-label" class="cascader-virtual-fixture__label">Lazy first-fail / retry</span>
        <Cascader
          data-testid="cascader-virtual-lazy"
          :options="lazyOptions"
          :model-value="undefined"
          :open="lazyOpen"
          :virtual="virtualConfig"
          placeholder="按需加载"
          aria-labelledby="cascader-virtual-lazy-label"
          :load-data="loadLazy"
          @open-change="lazyOpen = $event"
        />
        <output data-testid="cascader-virtual-lazy-state">state={{ lazyState }}; attempts={{ lazyAttempts }}; aborts={{ lazyAborts }}; revision={{ lazyRevision }}</output>
      </div>
    </div>

    <div class="cascader-virtual-fixture__lazy-controls" aria-label="Lazy request controls">
      <button type="button" data-testid="cascader-virtual-lazy-replace" @click="replaceLazy">replace options (stale)</button>
      <button type="button" data-testid="cascader-virtual-lazy-abort" @click="abortLazy">abort request</button>
      <button type="button" data-testid="cascader-virtual-lazy-close" @click="closeLazy">close and reopen</button>
    </div>
  </section>
</template>

<style scoped>
.cascader-virtual-fixture { display: grid; gap: 12px; width: min(100%, 940px); padding: 14px; border: 1px solid #d9e1ea; border-radius: 8px; background: #fff; color: #1f2937; }
.cascader-virtual-fixture__toolbar, .cascader-virtual-fixture__lazy-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.cascader-virtual-fixture button { padding: 5px 8px; border: 1px solid #b8c4d0; border-radius: 5px; background: #fff; color: inherit; cursor: pointer; }
.cascader-virtual-fixture button:focus-visible { outline: 2px solid #1677ff; outline-offset: 2px; }
.cascader-virtual-fixture__readout { display: flex; flex-wrap: wrap; gap: 16px; margin: 0; color: #536273; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.cascader-virtual-fixture__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.cascader-virtual-fixture__field { min-width: 0; }
.cascader-virtual-fixture__label { display: block; margin-bottom: 6px; color: #536273; font-size: 12px; }
.cascader-virtual-fixture :deep(.aheart-cascader) { width: 100%; }
.cascader-virtual-fixture :deep(.aheart-cascader__trigger) { width: 100%; }
.cascader-virtual-fixture__field:last-child { grid-column: 1 / -1; }
.cascader-virtual-fixture__field output { display: block; margin-top: 6px; color: #536273; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
@media (max-width: 680px) { .cascader-virtual-fixture__fields { grid-template-columns: 1fr; } .cascader-virtual-fixture__field:last-child { grid-column: auto; } }
</style>
