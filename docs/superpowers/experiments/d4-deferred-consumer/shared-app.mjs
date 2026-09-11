import { h } from 'vue'
import { Cascader, Tree, TreeSelect } from 'aheart-ui'

export const COMPONENTS = ['Tree', 'TreeSelect', 'Cascader']
export const ROW_MODES = ['fixed', 'coarse', 'dynamic']

export function treeData(count, rowMode) {
  if (count === 10000) return Array.from({ length: 100 }, (_, root) => ({
    key: `consumer-root-${root}`,
    title: `Consumer root ${root}`,
    children: Array.from({ length: 99 }, (_, child) => ({ key: `consumer-root-${root}-child-${child}`, title: rowMode === 'dynamic' && child % 10 === 0 ? `Wrapped child ${root}.${child} with deterministic long content` : `Child ${root}.${child}` }))
  }))
  return Array.from({ length: count }, (_, index) => ({ key: `consumer-${count}-${index}`, title: `Consumer ${rowMode} Tree row ${index}` }))
}

export function cascaderData(count, rowMode) {
  return Array.from({ length: count }, (_, index) => ({
    value: `consumer-${count}-${index}`,
    label: rowMode === 'dynamic' && index % 10 === 0 ? `Wrapped Cascader option ${index} with deterministic long content` : `Cascader option ${index}`,
    isLeaf: index !== 0,
    ...(index === 0 ? { isLeaf: false } : {})
  }))
}

export function cascaderFixture(count, rowMode) {
  const siblings = cascaderData(count, rowMode)
  const columns = Array.from({ length: 5 }, (_, depth) => Array.from({ length: 2000 }, (_, index) => ({ value: `deep-${depth}-${index}`, label: `${rowMode} deep ${depth}.${index}`, isLeaf: depth === 4 })))
  const searchLeaves = Array.from({ length: 10000 }, (_, index) => ({ path: [`search-${Math.floor(index / 100)}`, `leaf-${index}`], label: `Search leaf ${index}` }))
  return { siblings, columns, searchLeaves, lazy: { path: ['lazy-root'], delayed: true, abortable: true } }
}

export function componentProps(component, count, rowMode, virtual) {
  const virtualValue = virtual ? { height: component === 'Tree' ? 320 : 256, estimateSize: component === 'Cascader' ? 32 : 28, overscan: 4 } : false
  if (component === 'Tree') return { treeData: treeData(count, rowMode), defaultExpandAll: false, virtual: virtualValue, 'onUpdate:expandedKeys': value => { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'expand', timestamp: performance.now(), value }) } }
  if (component === 'TreeSelect') return { treeData: treeData(count, rowMode), defaultOpen: false, showSearch: true, treeCheckable: true, virtual: virtualValue, modelValue: [], 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) } } }
  return { options: cascaderData(count, rowMode), defaultOpen: false, showSearch: true, virtual: virtualValue, modelValue: undefined, 'onUpdate:modelValue': value => { if (typeof window !== 'undefined') { window.__d4ControlledAttempt = value; window.__d4EventLog?.push({ name: 'selection', timestamp: performance.now(), value }); window.__d4EventLog?.push({ name: 'controlled-reject', timestamp: performance.now(), value }) } }, loadData: async (option, context) => { const deepLazy = (level, prefix) => level >= 5 ? undefined : Array.from({ length: 2000 }, (_, index) => ({ value: `${prefix}-${level}-${index}`, label: `Loaded deep ${level}.${index}`, isLeaf: level === 4, ...(index === 0 && level < 4 ? { children: deepLazy(level + 1, `${prefix}-${index}`) } : {}) })); const key = String(option.value); const attempt = (typeof window !== 'undefined' ? ((window.__d4LazyAttempts ??= {})[key] = ((window.__d4LazyAttempts?.[key] ?? 0) + 1)) : 1); context?.signal?.addEventListener('abort', () => { if (typeof window !== 'undefined') { window.__d4EventLog?.push({ name: 'lazy-cancel', timestamp: performance.now(), key }); window.__d4EventLog?.push({ name: 'lazy-stale-ignored', timestamp: performance.now(), key }) } }, { once: true }); if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-pending', timestamp: performance.now(), key }); await new Promise(resolve => setTimeout(resolve, 100)); if (attempt === 1) { if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-error', timestamp: performance.now(), key }); throw new Error('bounded smoke lazy error') } if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-retry', timestamp: performance.now(), key }); const children = deepLazy(1, key) ?? [{ value: `${key}-lazy`, label: `Loaded ${option.label}`, isLeaf: true }]; if (typeof window !== 'undefined') window.__d4EventLog?.push({ name: 'lazy-resolve', timestamp: performance.now(), key }); return children } }
}

export function createConsumerApp(settings) {
  const Component = settings.component === 'Tree' ? Tree : settings.component === 'TreeSelect' ? TreeSelect : Cascader
  return { render: () => h(Component, { id: `d4-${settings.component.toLowerCase()}`, ...componentProps(settings.component, settings.count, settings.rowMode, settings.virtual) }) }
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
