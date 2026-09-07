import { computed, onScopeDispose, shallowRef, watch, type InjectionKey, type ComputedRef } from 'vue'
import { createTreeIndex, type TreeIndex } from './tree-index'
import type { TreeKey, TreeLoadData, TreeNodeData } from './types'

function applyChildren(nodes: TreeNodeData[], patches: Map<TreeKey, TreeNodeData[]>): TreeNodeData[] {
  if (!patches.size) return nodes
  const result: TreeNodeData[] = []
  const pending = nodes.map(node => ({ node, output: result })).reverse()
  const seen = new Set<TreeKey>()
  while (pending.length) {
    const { node, output } = pending.pop()!
    if (seen.has(node.key)) throw new Error(`Tree keys must be unique: ${String(node.key)}`)
    seen.add(node.key)
    const children = patches.get(node.key) ?? node.children
    const copy = { ...node, ...(children ? { children: [] as TreeNodeData[] } : {}) }
    if (patches.has(node.key) && children?.length === 0) copy.isLeaf = true
    output.push(copy)
    if (children) for (let i = children.length - 1; i >= 0; i--) pending.push({ node: children[i], output: copy.children! })
  }
  return result
}

export function useTreeLoader(source: () => TreeNodeData[], getLoader: () => TreeLoadData | undefined, disabled: () => boolean) {
  const patches = shallowRef(new Map<TreeKey, TreeNodeData[]>())
  const loadingKeys = shallowRef(new Set<TreeKey>())
  const errorKeys = shallowRef(new Set<TreeKey>())
  const loadedKeys = new Set<TreeKey>()
  const version = shallowRef(0)
  const tasks = new Map<TreeKey, { controller: AbortController; promise: Promise<boolean> }>()
  const data = computed(() => applyChildren(source(), patches.value))
  const setLoading = () => { loadingKeys.value = new Set(tasks.keys()) }
  const cancel = (key: TreeKey) => {
    const task = tasks.get(key)
    tasks.delete(key)
    task?.controller.abort()
    setLoading()
  }
  const cancelAll = () => { for (const key of tasks.keys()) cancel(key) }
  watch(source, () => {
    cancelAll()
    patches.value = new Map()
    loadedKeys.clear()
    errorKeys.value = new Set()
  }, { deep: true, flush: 'sync' })
  watch(getLoader, () => { cancelAll(); patches.value = new Map(); loadedKeys.clear(); errorKeys.value = new Set(); version.value++ }, { flush: 'sync' })
  watch(disabled, value => { if (value) cancelAll() }, { flush: 'sync' })
  onScopeDispose(cancelAll)

  const load = (key: TreeKey, retry = false): Promise<boolean> => {
    const existing = tasks.get(key)
    if (existing) return existing.promise
    const loader = getLoader()
    const entry = createTreeIndex(data.value, disabled()).nodes.get(key)
    if (!loader || !entry || entry.disabled || entry.node.isLeaf !== false || entry.children.length || loadedKeys.has(key)) return Promise.resolve(true)
    if (errorKeys.value.has(key) && !retry) return Promise.resolve(false)
    const controller = new AbortController()
    const task = { controller, promise: Promise.resolve(false) }
    tasks.set(key, task)
    setLoading()
    errorKeys.value = new Set([...errorKeys.value].filter(current => current !== key))
    task.promise = Promise.resolve().then(() => {
      if (controller.signal.aborted) return
      return loader(entry.node, { signal: controller.signal })
    }).then(children => {
      if (controller.signal.aborted || tasks.get(key) !== task) return false
      if (children !== undefined) {
        const next = new Map(patches.value).set(key, children)
        createTreeIndex(applyChildren(source(), next))
        patches.value = next
      }
      loadedKeys.add(key)
      return true
    }).catch(() => {
      if (!controller.signal.aborted && tasks.get(key) === task) errorKeys.value = new Set([...errorKeys.value, key])
      return false
    }).finally(() => {
      if (tasks.get(key) === task) { tasks.delete(key); setLoading() }
    })
    return task.promise
  }
  return { data, loadingKeys, errorKeys, version, load, cancel, cancelAll }
}

// Private sharing channel: filtering a TreeSelect must not replace its logical tree model.
export const treeModelKey: InjectionKey<{ loader: ReturnType<typeof useTreeLoader>; index: ComputedRef<TreeIndex> }> = Symbol('aheart-tree-model')
