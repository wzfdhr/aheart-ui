import { nextTick } from 'vue'
import type {
  SortableChangeContext,
  SortableDropPosition,
  SortableInput,
  SortableMoveEvent,
  SortableMoveRejectEvent,
  SortableRevision
} from './types'
import type { SortableItemData } from './sortable-context'

export interface SortableListController {
  group: () => string | undefined
  items: () => unknown[]
  update: (items: unknown[], context?: SortableChangeContext) => void
  keyOf?: (item: unknown) => string
  revision?: () => SortableRevision
  scopeKey?: () => string | number | undefined
  ownerDocument?: () => Document | undefined
  disabled?: () => boolean
  label?: () => string
  itemLabel?: (item: unknown, index: number) => string
  onMoveStart?: (event: SortableMoveEvent) => void
  onMoveCommit?: (event: SortableMoveEvent) => void
  onMoveReject?: (event: SortableMoveRejectEvent) => void
  onAnnounce?: (message: string) => void
  onAnnounceNow?: (message: string) => void
}

type Snapshot = { listId: string; revision: SortableRevision; keys: string[]; items: unknown[]; scopeKey?: string | number; group?: string; ownerDocument?: Document }
type Session = { id: string; source: SortableItemData; snapshots: Map<string, Snapshot>; ownerDocument?: Document; ended: boolean; dropConsumed: boolean; transactions: Set<Transaction> }
type Transaction = {
  session: Session; source: SortableListController; target: SortableListController
  sourceSnapshot: Snapshot; targetSnapshot: Snapshot; candidateSource: unknown[]; candidateTarget: unknown[]
  event: SortableMoveEvent; sameList: boolean; input: SortableInput; sourceId: string; targetId: string; settled: boolean; cancelling: boolean; rollbackPending: boolean; sourceRequested: boolean; targetRequested: boolean
}

const controllers = new Map<string, SortableListController>()
const sessions = new Map<string, Session>()
let idCounter = 0
const makeId = (prefix: string) => `aheart-sortable-${prefix}-${Date.now().toString(36)}-${(++idCounter).toString(36)}`
const keysOf = (controller: SortableListController, items: unknown[]) => controller.keyOf ? items.map(controller.keyOf) : items.map((_item, index) => String(index))
const duplicate = (keys: string[]) => new Set(keys).size !== keys.length
const invalidKey = (keys: string[]) => keys.some((key) => !key)
const sameKeys = (left: string[], right: string[]) => left.length === right.length && left.every((key, index) => key === right[index])
const revisionOf = (controller: SortableListController, items: unknown[]) => controller.revision?.() ?? keysOf(controller, items).join('\u001f')

export function findAdjacentSortableList(sourceListId: string, direction: -1 | 1): { listId: string; length: number } | undefined {
  const source = controllers.get(sourceListId)
  if (!source) return undefined
  const entries = Array.from(controllers.entries())
  const index = entries.findIndex(([listId]) => listId === sourceListId)
  for (let cursor = index + direction; cursor >= 0 && cursor < entries.length; cursor += direction) {
    const [listId, controller] = entries[cursor]
    if (controller.ownerDocument?.() !== source.ownerDocument?.() || controller.scopeKey?.() !== source.scopeKey?.()) continue
    if (controller.disabled?.() || !source.group() || controller.group() !== source.group()) continue
    return { listId, length: controller.items().length }
  }
  return undefined
}

function snapshot(listId: string, controller: SortableListController): Snapshot {
  const items = [...controller.items()]
  return { listId, items, keys: keysOf(controller, items), revision: revisionOf(controller, items), scopeKey: controller.scopeKey?.(), group: controller.group(), ownerDocument: controller.ownerDocument?.() }
}

function inputFor(source: SortableItemData): SortableInput { return source.input ?? (source.keyboard ? 'keyboard' : 'pointer') }

export function registerSortableList(listId: string, controller: SortableListController) {
  controllers.set(listId, controller)
  return () => {
    if (controllers.get(listId) !== controller) return false
    controllers.delete(listId)
    for (const session of Array.from(sessions.values())) {
      if (session.source.listId === listId && session.transactions.size === 0) finishSession(session)
      for (const transaction of Array.from(session.transactions)) {
        if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, 'unmounted')
      }
    }
    return true
  }
}

export function beginSortableSession(source: SortableItemData): SortableItemData {
  const sourceController = controllers.get(source.listId)
  if (!sourceController) return source
  const id = source.sessionId ?? makeId('session')
  const scope = sourceController.scopeKey?.()
  const captured = new Map<string, Snapshot>()
  for (const [listId, controller] of controllers) if (controller.ownerDocument?.() === sourceController.ownerDocument?.() && controller.scopeKey?.() === scope) captured.set(listId, snapshot(listId, controller))
  const sourceKey = source.itemKey ?? keysOf(sourceController, sourceController.items())[source.index]
  const session: Session = { id, source: { ...source, sessionId: id, itemKey: sourceKey, revision: sourceController.revision?.() }, snapshots: captured, ownerDocument: sourceController.ownerDocument?.(), ended: false, dropConsumed: false, transactions: new Set() }
  sessions.set(id, session)
  return { ...source, sessionId: id, itemKey: sourceKey, revision: session.source.revision, scopeKey: scope, sessionSnapshot: Object.fromEntries(Array.from(captured, ([listId, value]) => [listId, { revision: value.revision, keys: value.keys }])) }
}

function finishSession(session: Session) {
  if (session.ended) return
  session.ended = true
  sessions.delete(session.id)
}

export function closeSortableSession(sessionId: string | undefined) {
  if (!sessionId) return
  const session = sessions.get(sessionId)
  if (!session) return
  if (session.transactions.size === 0) finishSession(session)
}

export function closeSortableSessionsForList(listId: string) {
  for (const session of Array.from(sessions.values())) {
    if (session.source.listId === listId && session.transactions.size === 0) finishSession(session)
    for (const transaction of Array.from(session.transactions)) if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, 'cancelled')
  }
}

export function invalidateSortableRevision(listId: string) {
  for (const session of Array.from(sessions.values())) {
    if (!session.snapshots.has(listId) || session.transactions.size > 0) continue
    const source = controllers.get(session.source.listId)
    const snapshotValue = session.snapshots.get(session.source.listId)
    if (!source || !snapshotValue) { finishSession(session); continue }
    const index = snapshotValue.keys.indexOf(session.source.itemKey ?? '')
    const event = makeEvent(makeId('transaction'), session, source, source, snapshotValue, snapshotValue, session.source.itemKey ?? '', index, index, { kind: 'item', itemKey: session.source.itemKey ?? '' }, inputFor(session.source))
    source.onMoveReject?.({ ...event, reason: 'stale-revision' })
    source.onAnnounceNow?.(`移动失败：${reasonText('stale-revision')}`)
    finishSession(session)
  }
}

export function invalidateSortableScope(listId: string) {
  for (const session of Array.from(sessions.values())) {
    if (session.source.listId === listId) finishSession(session)
    for (const transaction of Array.from(session.transactions)) if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, 'cancelled')
  }
}

const reasonText = (reason: SortableMoveRejectEvent['reason']) => ({
  'stale-revision': '数据已更新，请重试', 'source-missing': '源项目不存在', 'target-missing': '目标列表不存在',
  'duplicate-key': '项目标识重复', 'group-mismatch': '列表分组不兼容', 'disabled': '目标已禁用',
  'invalid-position': '目标位置无效', 'parent-rejected': '父层拒绝了移动', 'rollback-rejected': '回滚被父层拒绝',
  unmounted: '列表已卸载', cancelled: '操作已取消'
}[reason])

function rejectPreflight(session: Session, source: SortableListController, target: SortableListController, reason: SortableMoveRejectEvent['reason'], event: SortableMoveEvent, notifyTarget = true) {
  const rejection = { ...event, reason }
  source.onMoveReject?.(rejection)
  if (notifyTarget && target !== source) target.onMoveReject?.(rejection)
  source.onAnnounceNow?.(`移动失败：${reasonText(reason)}`)
  if (notifyTarget && target !== source) target.onAnnounceNow?.(`移动失败：${reasonText(reason)}`)
  finishSession(session)
}

function makeEvent(transactionId: string, session: Session, source: SortableListController, target: SortableListController, sourceSnapshot: Snapshot, targetSnapshot: Snapshot, itemKey: string, index: number, targetIndex: number, position: SortableDropPosition, input: SortableInput): SortableMoveEvent {
  const sourceItem = index >= 0 ? sourceSnapshot.items[index] : undefined
  return {
    transactionId, sessionId: session.id, input, itemKey,
    itemLabel: sourceItem === undefined ? itemKey : (source.itemLabel?.(sourceItem, index) ?? itemKey),
    source: { listId: sourceSnapshot.listId, listLabel: source.label?.() ?? '列表', index, revision: sourceSnapshot.revision },
    target: { listId: targetSnapshot.listId, listLabel: target.label?.() ?? '列表', index: targetIndex, revision: targetSnapshot.revision }, position
  }
}

function emitUpdate(controller: SortableListController, items: unknown[], transactionId: string, input: SortableInput, phase: 'candidate' | 'rollback') { controller.update(items, { transactionId, phase, input }) }
function restoreItems(original: Snapshot, current: unknown[], movedKey: string, movedItem: unknown, removeMoved: boolean, controller: SortableListController) {
  const currentKeys = keysOf(controller, current)
  const currentByKey = new Map(currentKeys.map((key, index) => [key, current[index]]))
  return original.keys.filter((key) => !(removeMoved && key === movedKey)).map((key) => currentByKey.get(key) ?? original.items[original.keys.indexOf(key)])
    .concat(!removeMoved && !original.keys.includes(movedKey) ? [movedItem] : [])
}

async function cancelTransaction(transaction: Transaction, reason: 'unmounted' | 'cancelled') {
  if (transaction.settled || transaction.cancelling) return
  transaction.cancelling = true
  const { source, target, session, sourceSnapshot, targetSnapshot, candidateSource, candidateTarget, sameList, input, event } = transaction
  const sourceAccepted = sameKeys(keysOf(source, source.items()), keysOf(source, candidateSource))
  const targetAccepted = sameList ? sourceAccepted : sameKeys(keysOf(target, target.items()), keysOf(target, candidateTarget))
  const movedItem = source.items().find((item, index) => keysOf(source, source.items())[index] === event.itemKey)
    ?? target.items().find((item, index) => keysOf(target, target.items())[index] === event.itemKey)
    ?? sourceSnapshot.items[sourceSnapshot.keys.indexOf(event.itemKey)]
  const sourceDetached = !controllers.has(transaction.sourceId)
  const targetDetached = !controllers.has(transaction.targetId)
  const sourceRollbackRequested = sourceAccepted || (reason === 'unmounted' && sourceDetached && transaction.sourceRequested)
  const targetRollbackRequested = !sameList && (targetAccepted || (reason === 'unmounted' && targetDetached && transaction.targetRequested))
  if (sourceRollbackRequested) emitUpdate(source, restoreItems(sourceSnapshot, source.items(), event.itemKey, movedItem, false, source), event.transactionId, input, 'rollback')
  if (targetRollbackRequested) emitUpdate(target, restoreItems(targetSnapshot, target.items(), event.itemKey, movedItem, true, target), event.transactionId, input, 'rollback')
  await nextTick()
  const sourceRestored = !sourceRollbackRequested || sameKeys(keysOf(source, source.items()), sourceSnapshot.keys)
  const targetRestored = !targetRollbackRequested || sameKeys(keysOf(target, target.items()), targetSnapshot.keys)
  const finalReason = !transaction.rollbackPending && sourceRestored && targetRestored ? reason : 'rollback-rejected'
  const rejection = { ...event, reason } as SortableMoveRejectEvent
  rejection.reason = finalReason
  source.onMoveReject?.(rejection)
  if (!sameList) target.onMoveReject?.(rejection)
  session.transactions.delete(transaction)
  transaction.settled = true
  finishSession(session)
  source.onAnnounceNow?.(`移动失败：${reasonText(finalReason)}`)
  if (!sameList) target.onAnnounceNow?.(`移动失败：${reasonText(finalReason)}`)
}

async function settle(transaction: Transaction) {
  const { source, target, session, sourceSnapshot, targetSnapshot, candidateSource, candidateTarget, sameList, input, event } = transaction
  await nextTick()
  if (session.ended || transaction.settled || transaction.cancelling) return
  const sourceAccepted = sameKeys(keysOf(source, source.items()), keysOf(source, candidateSource))
  const targetAccepted = sameList ? sourceAccepted : sameKeys(keysOf(target, target.items()), keysOf(target, candidateTarget))
  if (sourceAccepted && targetAccepted) {
    transaction.settled = true
    session.transactions.delete(transaction)
    finishSession(session)
    source.onMoveCommit?.(event); if (!sameList) target.onMoveCommit?.(event)
    const message = sameList ? `已移动到第 ${event.target.index + 1} 项` : `已跨列表移动到第 ${event.target.index + 1} 项`
    source.onAnnounce?.(message); if (!sameList) target.onAnnounce?.(message)
    return
  }
  if (!sameList && sourceAccepted !== targetAccepted) {
    const acceptedController = sourceAccepted ? source : target
    const acceptedSnapshot = sourceAccepted ? sourceSnapshot : targetSnapshot
    const movedItem = sourceAccepted ? target.items().find((item, index) => keysOf(target, target.items())[index] === event.itemKey) : source.items().find((item, index) => keysOf(source, source.items())[index] === event.itemKey)
      ?? sourceSnapshot.items[sourceSnapshot.keys.indexOf(event.itemKey)]
    const rollback = restoreItems(acceptedSnapshot, acceptedController.items(), event.itemKey, movedItem, !sourceAccepted, acceptedController)
    transaction.rollbackPending = true
    emitUpdate(acceptedController, rollback, event.transactionId, input, 'rollback')
    await nextTick()
    if (transaction.cancelling || transaction.settled) return
    const rollbackAccepted = sameKeys(keysOf(acceptedController, acceptedController.items()), acceptedSnapshot.keys)
    const reason = rollbackAccepted ? 'parent-rejected' : 'rollback-rejected'
    const rejection = { ...event, reason } as SortableMoveRejectEvent
    source.onMoveReject?.(rejection); if (!sameList) target.onMoveReject?.(rejection)
    source.onAnnounceNow?.(`移动失败：${reasonText(reason)}`)
    if (!sameList) target.onAnnounceNow?.(`移动失败：${reasonText(reason)}`)
    transaction.settled = true
    session.transactions.delete(transaction)
    finishSession(session); return
  }
  const rejection = { ...event, reason: 'parent-rejected' } as SortableMoveRejectEvent
  source.onMoveReject?.(rejection); if (!sameList) target.onMoveReject?.(rejection)
  source.onAnnounceNow?.(`移动失败：${reasonText('parent-rejected')}`)
  if (!sameList) target.onAnnounceNow?.(`移动失败：${reasonText('parent-rejected')}`)
  transaction.settled = true
  session.transactions.delete(transaction)
  finishSession(session)
}

export function moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number): boolean {
  const sourceController = controllers.get(source.listId)
  const targetController = controllers.get(targetListId)
  if (!sourceController) return false
  if (!targetController) {
    const session = source.sessionId ? sessions.get(source.sessionId) : undefined
    const sourceSnapshot = session?.snapshots.get(source.listId)
    if (session && sourceSnapshot && !session.ended && !session.dropConsumed) {
      session.dropConsumed = true
      const event = makeEvent(makeId('transaction'), session, sourceController, sourceController, sourceSnapshot, { listId: targetListId, revision: sourceSnapshot.revision, keys: [], items: [], scopeKey: sourceSnapshot.scopeKey }, source.itemKey ?? '', sourceSnapshot.keys.indexOf(source.itemKey ?? ''), targetIndex, { kind: 'end' }, inputFor(source))
      rejectPreflight(session, sourceController, sourceController, 'target-missing', event)
    }
    return false
  }
  if (!source.sessionId || !sourceController.keyOf || !targetController.keyOf) {
    const sourceItems = sourceController.items(), targetItems = targetController.items()
    if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) return false
    if (source.index < 0 || source.index >= sourceItems.length || targetIndex < 0 || targetIndex > targetItems.length) return false
    if (source.listId === targetListId) {
      if (source.index === Math.min(targetIndex, targetItems.length - 1)) return false
      const next = [...targetItems], [item] = next.splice(source.index, 1)
      next.splice(Math.min(targetIndex, next.length), 0, item); targetController.update(next); return true
    }
    const item = sourceItems[source.index]
    sourceController.update(sourceItems.filter((_item, index) => index !== source.index))
    targetController.update([...targetItems.slice(0, targetIndex), item, ...targetItems.slice(targetIndex)]); return true
  }
  const session = sessions.get(source.sessionId)
  const sourceSnapshot = session?.snapshots.get(source.listId), targetSnapshot = session?.snapshots.get(targetListId)
  if (!session || session.ended || !sourceSnapshot || session.dropConsumed) return false
  session.dropConsumed = true
  const currentSource = snapshot(source.listId, sourceController), currentTarget = snapshot(targetListId, targetController)
  const itemKey = source.itemKey ?? String(source.index)
  const position: SortableDropPosition = source.position ?? (targetIndex >= currentTarget.items.length
    ? { kind: 'end' }
    : { kind: 'item', itemKey: currentTarget.keys[targetIndex] })
  const resolvedTargetIndex = position.kind === 'end' ? currentTarget.items.length : currentTarget.keys.indexOf(position.itemKey)
  const event = makeEvent(makeId('transaction'), session, sourceController, targetController, sourceSnapshot, targetSnapshot ?? currentTarget, itemKey, sourceSnapshot.keys.indexOf(itemKey), resolvedTargetIndex, position, inputFor(source))
  let reason: SortableMoveRejectEvent['reason'] | undefined
  if (!targetSnapshot) reason = 'target-missing'
  else if (sourceController.scopeKey?.() !== sourceSnapshot.scopeKey || targetController.scopeKey?.() !== targetSnapshot.scopeKey) reason = 'stale-revision'
  else if (invalidKey(currentSource.keys) || invalidKey(currentTarget.keys) || duplicate(currentSource.keys) || duplicate(currentTarget.keys)) reason = 'duplicate-key'
  else if (sourceController.revision && currentSource.revision !== sourceSnapshot.revision || targetController.revision && currentTarget.revision !== targetSnapshot.revision) reason = 'stale-revision'
  else if (currentSource.keys.indexOf(itemKey) < 0) reason = 'source-missing'
  else if (position.kind === 'item' && !currentTarget.keys.includes(position.itemKey)) reason = 'target-missing'
  else if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) reason = 'group-mismatch'
  else if (sourceController.disabled?.() || targetController.disabled?.()) reason = 'disabled'
  else if (resolvedTargetIndex < 0 || resolvedTargetIndex > currentTarget.items.length) reason = 'invalid-position'
  if (reason) { rejectPreflight(session, sourceController, targetController, reason, event, reason !== 'target-missing'); return false }
  const sameList = source.listId === targetListId, sourceIndex = currentSource.keys.indexOf(itemKey), sourceItems = currentSource.items, targetItems = currentTarget.items
  const candidateSource = sameList ? (() => { const next = [...sourceItems], [item] = next.splice(sourceIndex, 1); next.splice(Math.min(resolvedTargetIndex, next.length), 0, item); return next })() : sourceItems.filter((_item, index) => index !== sourceIndex)
  const movedItem = sourceItems[sourceIndex]
  const candidateTarget = sameList ? candidateSource : [...targetItems.slice(0, resolvedTargetIndex), movedItem, ...targetItems.slice(resolvedTargetIndex)]
  if (sameList && sameKeys(keysOf(sourceController, candidateSource), currentSource.keys)) { finishSession(session); return false }
  const transaction: Transaction = { session, source: sourceController, target: targetController, sourceSnapshot, targetSnapshot: targetSnapshot!, candidateSource, candidateTarget, event, sameList, input: inputFor(source), sourceId: source.listId, targetId: targetListId, settled: false, cancelling: false, rollbackPending: false, sourceRequested: false, targetRequested: false }
  session.transactions.add(transaction)
  sourceController.onMoveStart?.(event); if (!sameList) targetController.onMoveStart?.(event)
  if (sameList) { transaction.sourceRequested = true; emitUpdate(sourceController, candidateSource, event.transactionId, transaction.input, 'candidate') }
  else { transaction.sourceRequested = true; transaction.targetRequested = true; emitUpdate(sourceController, candidateSource, event.transactionId, transaction.input, 'candidate'); emitUpdate(targetController, candidateTarget, event.transactionId, transaction.input, 'candidate') }
  void settle(transaction)
  return true
}
