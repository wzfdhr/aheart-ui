import { h } from 'vue'
import { Cascader, Tree, TreeSelect } from 'aheart-ui'

const eventTime = () => ({ timestamp: Date.now(), clockDomain: 'epoch-ms' })

export const COMPONENTS = ['Tree', 'TreeSelect', 'Cascader']
export const ROW_MODES = ['fixed', 'coarse', 'dynamic']

export function treeData(count, rowMode, scenario = 'flat10000') {
  const rootCount = scenario === 'expanded100' ? Math.min(100, count) : count
  return Array.from({ length: rootCount }, (_, root) => ({
    key: `consumer-root-${root}`,
    title: rowMode === 'dynamic' && root % 10 === 0 ? `Consumer root ${root} with deterministic wrapped content `.repeat(8) : `Consumer root ${root}`,
    ...(scenario === 'expanded100' && root < 100 ? { children: Array.from({ length: 99 }, (_, child) => ({ key: `consumer-root-${root}-child-${child}`, title: rowMode === 'dynamic' && child % 10 === 0 ? `Wrapped child ${root}.${child} with deterministic long content `.repeat(8) : `Child ${root}.${child}` })) } : {})
  }))
}

export function treeSelectData(count, rowMode) {
  const nodes = treeData(count + 100, rowMode)
  return nodes.map((node, index) => index < count ? { ...node, title: `match ${node.title}` } : { ...node, title: `Other excluded ${index - count}` })
}

export function cascaderData(count, rowMode) {
  return Array.from({ length: count }, (_, index) => ({
    value: `consumer-${count}-${index}`,
    label: rowMode === 'dynamic' && index % 10 === 0 ? `Wrapped Cascader option ${index} with deterministic long content `.repeat(8) : `Cascader option ${index}`,
    isLeaf: index !== 0,
    ...(index === 0 ? { isLeaf: false } : {})
  }))
}

export function cascaderSearchData(count, rowMode) {
  const options = []
  for (let group = 0; group < 101; group += 1) {
    const leaves = Array.from({ length: group === 100 ? 50 : 100 }, (_, leaf) => {
      const index = group * 100 + leaf
      return { value: `leaf-${index}`, label: index < 10000 ? `match leaf ${index}` : `other leaf ${index}`, isLeaf: true }
    })
    options.push({ value: `search-${group}`, label: `Search group ${group}`, children: leaves })
  }
  return options
}

export function cascaderDeepData() {
  const make = level => Array.from({ length: 2000 }, (_, index) => ({ value: `deep-${level}-${index}`, label: `Deep ${level}.${index}`, isLeaf: level === 4, ...(index === 0 && level < 4 ? { children: make(level + 1) } : {}) }))
  return make(0)
}

export function cascaderLazyData() {
  return [{ value: 'lazy-root', label: 'Lazy root', isLeaf: false }, { value: 'lazy-sibling', label: 'Lazy sibling', isLeaf: true }]
}

export function cascaderFixture(count, rowMode) {
  const siblings = cascaderData(count, rowMode)
  const columns = Array.from({ length: 5 }, (_, depth) => Array.from({ length: 2000 }, (_, index) => ({ value: `deep-${depth}-${index}`, label: `${rowMode} deep ${depth}.${index}`, isLeaf: depth === 4 })))
  const searchLeaves = Array.from({ length: 10050 }, (_, index) => ({ path: [`search-${Math.floor(index / 100)}`, `leaf-${index}`], label: index < 10000 ? `Search leaf ${index}` : `Other leaf ${index}` }))
  return { siblings, columns, searchLeaves, lazy: { path: ['lazy-root'], delayed: true, abortable: true } }
}

export function fixtureEvidence(count, rowMode, scenario = 'flat10000') {
  const roots = treeData(count, rowMode, scenario)
  const treeRoots = roots.map(node => ({ key: node.key, label: node.title }))
  const expandedChildren = roots.slice(0, Math.min(100, roots.length)).flatMap(node => (node.children ?? []).map(child => ({ key: child.key, label: child.title, parent: node.key })))
  const cascader = cascaderFixture(Math.max(count, 10000), rowMode)
  return {
    count,
    rowMode,
    tree: { rawRoots: roots.map(node => ({ key: node.key, label: node.title, children: (node.children ?? []).map(child => ({ key: child.key, label: child.title })) })), rootKeys: treeRoots.map(item => item.key), rootLabels: treeRoots.map(item => item.label), expandedChildKeys: expandedChildren.map(item => item.key), expandedChildLabels: expandedChildren.map(item => item.label), expandedParents: expandedChildren.map(item => item.parent) },
    treeSelect: { sourceKeys: treeSelectData(count, rowMode).map(node => node.key), sourceLabels: treeSelectData(count, rowMode).map(node => node.title), matchedKeys: treeSelectData(count, rowMode).filter(node => node.title.includes('match')).map(node => node.key), unmatchedKeys: treeSelectData(count, rowMode).filter(node => !node.title.includes('match')).map(node => node.key), checkedKeys: [] },
    cascader: { siblingPaths: cascader.siblings.map(option => [option.value]), deepPaths: cascader.columns.map(column => column.map(option => option.value)), searchPaths: cascader.searchLeaves.map(option => option.path), lazy: { sequence: ['pending', 'error', 'cancel', 'stale-ignored', 'retry', 'resolve'] } },
  }
}

export function createCascaderLoadData() {
  return async (option, context) => {
    const deepLazy = level => level >= 5 ? undefined : Array.from({ length: 2000 }, (_, index) => ({ value: `deep-${level}-${index}`, label: `Loaded deep ${level}.${index}`, isLeaf: level === 4, ...(index === 0 && level < 4 ? { children: deepLazy(level + 1) } : {}) }))
    const key = String(option.value)
    const attempt = typeof window !== 'undefined' ? ((window.__d4LazyAttempts ??= {})[key] = ((window.__d4LazyAttempts?.[key] ?? 0) + 1)) : 1
    context?.signal?.addEventListener('abort', () => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-cancel', ...eventTime(), key }) }, { once: true })
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-pending', ...eventTime(), key })
    await new Promise(resolve => setTimeout(resolve, 100))
    if (context?.signal?.aborted) { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'late-resolve', ...eventTime(), key }); return [] }
    if (attempt === 1) { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-error', ...eventTime(), key }); throw new Error('bounded smoke lazy error') }
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-retry', ...eventTime(), key })
    const children = deepLazy(1) ?? [{ value: `${key}-lazy`, label: `Loaded ${option.label}`, isLeaf: true }]
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-resolve', ...eventTime(), key })
    return children
  }
}

export function componentProps(component, count, rowMode, virtual, treeScenario = 'flat10000', treeSelectScenario = '', cascaderScenario = '') {
  const virtualValue = virtual ? { height: component === 'Tree' ? 320 : 256, estimateSize: component === 'Cascader' ? 32 : 28, overscan: 4 } : false
  if (component === 'Tree') { const data = treeData(count, rowMode, treeScenario); const defaultExpandedKeys = treeScenario === 'expanded100' ? data.map(node => node.key) : []; let expandedState = [...defaultExpandedKeys]; const recordExpand = value => { if (typeof window !== 'undefined') { const beforeExpandedKeys = [...expandedState]; const afterExpandedKeys = [...value]; expandedState = afterExpandedKeys; window.__d4EventLog?.push({ name: 'expand', ...eventTime(), beforeExpandedKeys, afterExpandedKeys, value: afterExpandedKeys }) } }; return { treeData: data, defaultExpandAll: false, defaultExpandedKeys, virtual: virtualValue, onExpand: recordExpand, onSelect: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'select', ...eventTime(), value }) }, 'onUpdate:expandedKeys': recordExpand } }
  if (component === 'TreeSelect') return { treeData: treeSelectData(count, rowMode), defaultOpen: treeSelectScenario === 'search-5000-controlled', showSearch: true, treeCheckable: true, virtual: virtualValue, modelValue: treeSelectScenario === 'search-5000-controlled' ? ['consumer-root-0'] : [], onOpenChange: open => { if (typeof window !== 'undefined') { window.__d4EventLog?.push({ name: 'openChange', ...eventTime(), open }); if (!open) window.__d4EventLog?.push({ name: 'controlled-reject', ...eventTime(), reason: 'controlled-open-state' }) } }, onSearch: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'search', ...eventTime(), value }) }, onChange: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'controlled-reject', ...eventTime(), value }) }, onCheck: value => { if (typeof window !== 'undefined') { window.__d4EventLog?.push({ name: 'check', ...eventTime(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', ...eventTime(), value }) } }, 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'update:modelValue', intent: 'check', ...eventTime(), value, valueSnapshot: { requestedValue: value } }); window.__d4EventLog?.push({ name: 'controlled-reject', ...eventTime(), value }) } } }
  const cascaderOptions = cascaderScenario === 'deep' ? cascaderDeepData() : cascaderScenario === 'search' ? cascaderSearchData(count, rowMode) : cascaderScenario === 'lazy' ? cascaderLazyData() : cascaderData(count, rowMode)
  const cascaderProps = { options: cascaderOptions, defaultOpen: false, showSearch: true, virtual: virtualValue, modelValue: undefined, 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'selection', ...eventTime(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', ...eventTime(), value }) } } }
  cascaderProps.loadData = createCascaderLoadData()
  return cascaderProps
}

export function createConsumerApp(settings) {
  const Component = settings.component === 'Tree' ? Tree : settings.component === 'TreeSelect' ? TreeSelect : Cascader
  const props = componentProps(settings.component, settings.count, settings.rowMode, settings.virtual, settings.treeScenario, settings.treeSelectScenario, settings.cascaderScenario)
  if (settings.component === 'TreeSelect' && typeof window !== 'undefined') window.__d4AcceptedValue = ['consumer-root-0']
  if (settings.component === 'Cascader' && typeof window !== 'undefined') {
    const options = props.options ?? []
    const leaves = options.flatMap(option => option.children?.map(child => ({ path: [option.value, child.value], label: child.label })) ?? [{ path: [option.value], label: option.label }])
    const columns = []
    let current = options
    for (let index = 0; index < 5; index += 1) { columns.push({ index, keys: current.map(option => option.value), optionsHash: current.map(option => option.value).join('\n') }); current = current[0]?.children ?? [] }
    window.__d4ActualComponentInput = settings.cascaderScenario === 'deep' ? { kind: 'deep', actualOptionsColumns: columns } : settings.cascaderScenario === 'search' ? { kind: 'search', actualComponentInput: { rawLeaves: leaves } } : { kind: 'lazy', actualComponentInput: { kind: 'lazy', inputKeys: options.map(option => option.value), loaderId: 'createCascaderLoadData:v1', events: [] } }
  }
  return { render: () => h(Component, { id: `d4-${settings.component.toLowerCase()}`, ...props }) }
}

export function createCombinedConsumerApp(virtual, { ssrOpen = false } = {}) {
  return { render: () => h('main', COMPONENTS.map(component => {
    const props = { id: `d4-${component.toLowerCase()}`, ...componentProps(component, 1000, 'fixed', Boolean(virtual[component])) }
    if (ssrOpen && component !== 'Tree') props.defaultOpen = true
    if (component === 'Tree') { props.onExpand = keys => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'expand', timestamp: performance.now(), keys }) }; props.onSelect = keys => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'select', timestamp: performance.now(), keys }) } }
    else { props.onChange = value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'change', timestamp: performance.now(), value }) }; props.onOpenChange = open => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'openChange', timestamp: performance.now(), open }) } }
    return h(component === 'Tree' ? Tree : component === 'TreeSelect' ? TreeSelect : Cascader, props)
  })) }
}
