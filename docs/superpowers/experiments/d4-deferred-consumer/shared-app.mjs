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
    isLeaf: index !== 0
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
  if (component === 'Tree') return { treeData: treeData(count, rowMode), defaultExpandAll: count === 10000, virtual: virtualValue }
  if (component === 'TreeSelect') return { treeData: treeData(count, rowMode), defaultOpen: false, showSearch: true, treeCheckable: true, virtual: virtualValue }
  return { options: cascaderData(count, rowMode), defaultOpen: false, showSearch: true, virtual: virtualValue, loadData: async option => [{ value: `${option.value}-lazy`, label: `Loaded ${option.label}`, isLeaf: true }] }
}

export function createConsumerApp(settings) {
  const Component = settings.component === 'Tree' ? Tree : settings.component === 'TreeSelect' ? TreeSelect : Cascader
  return { render: () => h(Component, componentProps(settings.component, settings.count, settings.rowMode, settings.virtual)) }
}

export function createCombinedConsumerApp(virtual) {
  return { render: () => h('main', COMPONENTS.map(component => h(
    component === 'Tree' ? Tree : component === 'TreeSelect' ? TreeSelect : Cascader,
    componentProps(component, 1000, 'fixed', Boolean(virtual[component]))
  ))) }
}
