import { h } from 'vue'
import { Cascader, Tree, TreeSelect } from 'aheart-ui'

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
    const deepLazy = (level, prefix) => level >= 5 ? undefined : Array.from({ length: 2000 }, (_, index) => ({ value: `${prefix}-${level}-${index}`, label: `Loaded deep ${level}.${index}`, isLeaf: level === 4, ...(index === 0 && level < 4 ? { children: deepLazy(level + 1, `${prefix}-${index}`) } : {}) }))
    const key = String(option.value)
    const attempt = typeof window !== 'undefined' ? ((window.__d4LazyAttempts ??= {})[key] = ((window.__d4LazyAttempts?.[key] ?? 0) + 1)) : 1
    context?.signal?.addEventListener('abort', () => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-cancel', timestamp: performance.now(), key }) }, { once: true })
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-pending', timestamp: performance.now(), key })
    await new Promise(resolve => setTimeout(resolve, 100))
    if (context?.signal?.aborted) { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'late-resolve-stale-ignored', timestamp: performance.now(), key }); return [] }
    if (attempt === 1) { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-error', timestamp: performance.now(), key }); throw new Error('bounded smoke lazy error') }
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-retry', timestamp: performance.now(), key })
    const children = deepLazy(1, key) ?? [{ value: `${key}-lazy`, label: `Loaded ${option.label}`, isLeaf: true }]
    if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-resolve', timestamp: performance.now(), key })
    return children
  }
}

export function componentProps(component, count, rowMode, virtual, treeScenario = 'flat10000', treeSelectScenario = '') {
  const virtualValue = virtual ? { height: component === 'Tree' ? 320 : 256, estimateSize: component === 'Cascader' ? 32 : 28, overscan: 4 } : false
  if (component === 'Tree') { const data = treeData(count, rowMode, treeScenario); const defaultExpandedKeys = treeScenario === 'expanded100' ? data.map(node => node.key) : []; let expandedState = [...defaultExpandedKeys]; const recordExpand = value => { if (typeof window !== 'undefined') { const beforeExpandedKeys = [...expandedState]; const afterExpandedKeys = [...value]; expandedState = afterExpandedKeys; window.__d4EventLog?.push({ name: 'expand', timestamp: performance.now(), beforeExpandedKeys, afterExpandedKeys, value: afterExpandedKeys }) } }; return { treeData: data, defaultExpandAll: false, defaultExpandedKeys, virtual: virtualValue, onExpand: recordExpand, onSelect: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'select', timestamp: performance.now(), value }) }, 'onUpdate:expandedKeys': recordExpand } }
  if (component === 'TreeSelect') return { treeData: treeSelectData(count, rowMode), defaultOpen: treeSelectScenario === 'search-5000-controlled', showSearch: true, treeCheckable: true, virtual: virtualValue, modelValue: [], onOpenChange: open => { if (typeof window !== 'undefined') { window.__d4EventLog?.push({ name: 'openChange', timestamp: performance.now(), open }); if (!open) window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), reason: 'controlled-open-state' }) } }, onSearch: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'search', timestamp: performance.now(), value }) }, onChange: value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) }, onCheck: value => { if (typeof window !== 'undefined') { window.__d4EventLog?.push({ name: 'check', timestamp: performance.now(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) } }, 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'update:modelValue', intent: 'check', requestedValue: value, timestamp: performance.now(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) } } }
  const cascaderProps = { options: cascaderData(count, rowMode), defaultOpen: false, showSearch: true, virtual: virtualValue, modelValue: undefined, 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'selection', timestamp: performance.now(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) } } }
  cascaderProps.loadData = createCascaderLoadData()
  return cascaderProps
}

export function createConsumerApp(settings) {
  const Component = settings.component === 'Tree' ? Tree : settings.component === 'TreeSelect' ? TreeSelect : Cascader
  const props = componentProps(settings.component, settings.count, settings.rowMode, settings.virtual, settings.treeScenario, settings.treeSelectScenario)
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
