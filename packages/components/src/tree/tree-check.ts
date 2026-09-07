import type { TreeKey } from './types'
import type { TreeIndex } from './tree-index'

export interface TreeCheckState {
  checkedKeys: TreeKey[]
  halfCheckedKeys: TreeKey[]
}

const token = (key: TreeKey) => `${typeof key}:${String(key)}`

const uniqueKeys = (keys: readonly TreeKey[]) => {
  const seen = new Set<string>()
  const result: TreeKey[] = []
  for (const key of keys) {
    const id = token(key)
    if (!seen.has(id)) {
      seen.add(id)
      result.push(key)
    }
  }
  return result
}

/** Derives checked and half-checked state without mutating the caller's keys or tree data. */
export const deriveTreeCheckState = (index: TreeIndex, keys: readonly TreeKey[], checkStrictly: boolean): TreeCheckState => {
  const input = uniqueKeys(keys)
  if (checkStrictly) return { checkedKeys: input, halfCheckedKeys: [] }

  const explicit = new Set(input.map(token))
  const checked = new Set<string>()
  const half = new Set<string>()
  const covered = new Set<string>()

  // A checked enabled ancestor covers its enabled descendants. Disabled records are
  // boundaries, even when their key was explicitly checked.
  for (const key of index.order) {
    const record = index.nodes.get(key)!
    const id = token(key)
    if (record.disabled) {
      if (explicit.has(id)) checked.add(id)
      continue
    }
    const parentCovered = record.parentKey !== undefined && covered.has(token(record.parentKey))
    if (explicit.has(id) || parentCovered) {
      checked.add(id)
      covered.add(id)
    }
  }

  // Aggregate from leaves upward. Disabled children do not participate in the
  // parent's quorum, and therefore cannot make it checked or half-checked.
  for (let position = index.order.length - 1; position >= 0; position -= 1) {
    const key = index.order[position]
    const record = index.nodes.get(key)!
    if (record.disabled || checked.has(token(key))) continue
    const children = record.children.flatMap((child) => {
      const childRecord = index.nodes.get(child)
      return childRecord && !childRecord.disabled ? [childRecord] : []
    })
    if (!children.length) continue
    const checkedChildren = children.filter((child) => checked.has(token(child.key))).length
    const partialChildren = children.some((child) => half.has(token(child.key)))
    if (checkedChildren === children.length && !partialChildren) checked.add(token(key))
    else if (checkedChildren > 0 || partialChildren) half.add(token(key))
  }

  const knownChecked = new Set(checked)
  const knownHalf = new Set(half)
  const checkedKeys = index.order.filter((key) => knownChecked.has(token(key)))
  const halfCheckedKeys = index.order.filter((key) => knownHalf.has(token(key)))
  // Unknown keys are deliberately retained, in their input order, after indexed keys.
  for (const key of input) {
    if (!index.nodes.has(key)) checkedKeys.push(key)
  }
  return { checkedKeys, halfCheckedKeys }
}

/** Toggles one key against the derived state while retaining typed-key identity. */
export const toggleTreeCheck = (index: TreeIndex, keys: readonly TreeKey[], key: TreeKey, checkStrictly: boolean): TreeCheckState => {
  const target = index.nodes.get(key)
  if (target?.disabled) return deriveTreeCheckState(index, keys, checkStrictly)
  const current = deriveTreeCheckState(index, keys, checkStrictly)
  const isChecked = current.checkedKeys.some((currentKey) => token(currentKey) === token(key))
  // Work from the effective state: a checked ancestor may have supplied checked
  // siblings that are absent from the caller's raw list.
  const next = uniqueKeys(current.checkedKeys).filter((currentKey) => token(currentKey) !== token(key))

  if (checkStrictly) {
    if (!isChecked) next.push(key)
    return deriveTreeCheckState(index, next, true)
  }

  // Explicit ancestors can otherwise re-cover a subtree immediately after it is
  // cancelled. Remove them for both selecting and cancelling the target subtree.
  const targetKeys = new Set<string>()
  const pending = [key]
  while (pending.length) {
    const currentKey = pending.pop()!
    const currentNode = index.nodes.get(currentKey)
    if (!currentNode || targetKeys.has(token(currentKey))) continue
    if (currentNode.disabled) continue
    targetKeys.add(token(currentKey))
    for (const child of currentNode.children) {
      if (!index.nodes.get(child)?.disabled) pending.push(child)
    }
  }
  const ancestorKeys = new Set<string>()
  let ancestor = target?.parentKey
  while (ancestor !== undefined) {
    ancestorKeys.add(token(ancestor))
    ancestor = index.nodes.get(ancestor)?.parentKey
  }
  const filtered = next.filter((currentKey) => !targetKeys.has(token(currentKey)) && !ancestorKeys.has(token(currentKey)))
  if (!isChecked) filtered.push(key)
  return deriveTreeCheckState(index, filtered, false)
}
