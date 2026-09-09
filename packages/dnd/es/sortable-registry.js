import { nextTick } from "vue";
const controllers = /* @__PURE__ */ new Map();
const sessions = /* @__PURE__ */ new Map();
let idCounter = 0;
const makeId = (prefix) => `aheart-sortable-${prefix}-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;
const keysOf = (controller, items) => controller.keyOf ? items.map(controller.keyOf) : items.map((_item, index) => String(index));
const duplicate = (keys) => new Set(keys).size !== keys.length;
const invalidKey = (keys) => keys.some((key) => !key);
const sameKeys = (left, right) => left.length === right.length && left.every((key, index) => key === right[index]);
const revisionOf = (controller, items) => {
  var _a;
  return ((_a = controller.revision) == null ? void 0 : _a.call(controller)) ?? keysOf(controller, items).join("");
};
function findAdjacentSortableList(sourceListId, direction) {
  var _a, _b, _c, _d, _e;
  const source = controllers.get(sourceListId);
  if (!source) return void 0;
  const entries = Array.from(controllers.entries());
  const index = entries.findIndex(([listId]) => listId === sourceListId);
  for (let cursor = index + direction; cursor >= 0 && cursor < entries.length; cursor += direction) {
    const [listId, controller] = entries[cursor];
    if (((_a = controller.ownerDocument) == null ? void 0 : _a.call(controller)) !== ((_b = source.ownerDocument) == null ? void 0 : _b.call(source)) || ((_c = controller.scopeKey) == null ? void 0 : _c.call(controller)) !== ((_d = source.scopeKey) == null ? void 0 : _d.call(source))) continue;
    if (((_e = controller.disabled) == null ? void 0 : _e.call(controller)) || !source.group() || controller.group() !== source.group()) continue;
    return { listId, length: controller.items().length };
  }
  return void 0;
}
function snapshot(listId, controller) {
  var _a, _b;
  const items = [...controller.items()];
  return { listId, items, keys: keysOf(controller, items), revision: revisionOf(controller, items), scopeKey: (_a = controller.scopeKey) == null ? void 0 : _a.call(controller), group: controller.group(), ownerDocument: (_b = controller.ownerDocument) == null ? void 0 : _b.call(controller) };
}
function inputFor(source) {
  return source.input ?? (source.keyboard ? "keyboard" : "pointer");
}
function registerSortableList(listId, controller) {
  controllers.set(listId, controller);
  return () => {
    if (controllers.get(listId) !== controller) return false;
    controllers.delete(listId);
    for (const session of Array.from(sessions.values())) {
      if (session.source.listId === listId && session.transactions.size === 0) finishSession(session);
      for (const transaction of Array.from(session.transactions)) {
        if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, "unmounted");
      }
    }
    return true;
  };
}
function beginSortableSession(source) {
  var _a, _b, _c, _d, _e, _f;
  const sourceController = controllers.get(source.listId);
  if (!sourceController) return source;
  const id = source.sessionId ?? makeId("session");
  const scope = (_a = sourceController.scopeKey) == null ? void 0 : _a.call(sourceController);
  const captured = /* @__PURE__ */ new Map();
  for (const [listId, controller] of controllers) if (((_b = controller.ownerDocument) == null ? void 0 : _b.call(controller)) === ((_c = sourceController.ownerDocument) == null ? void 0 : _c.call(sourceController)) && ((_d = controller.scopeKey) == null ? void 0 : _d.call(controller)) === scope) captured.set(listId, snapshot(listId, controller));
  const sourceKey = source.itemKey ?? keysOf(sourceController, sourceController.items())[source.index];
  const session = { id, source: { ...source, sessionId: id, itemKey: sourceKey, revision: (_e = sourceController.revision) == null ? void 0 : _e.call(sourceController) }, snapshots: captured, ownerDocument: (_f = sourceController.ownerDocument) == null ? void 0 : _f.call(sourceController), ended: false, dropConsumed: false, transactions: /* @__PURE__ */ new Set() };
  sessions.set(id, session);
  return { ...source, sessionId: id, itemKey: sourceKey, revision: session.source.revision, scopeKey: scope, sessionSnapshot: Object.fromEntries(Array.from(captured, ([listId, value]) => [listId, { revision: value.revision, keys: value.keys }])) };
}
function finishSession(session) {
  if (session.ended) return;
  session.ended = true;
  sessions.delete(session.id);
}
function closeSortableSession(sessionId) {
  if (!sessionId) return;
  const session = sessions.get(sessionId);
  if (!session) return;
  if (session.transactions.size === 0) finishSession(session);
}
function closeSortableSessionsForList(listId) {
  for (const session of Array.from(sessions.values())) {
    if (session.source.listId === listId && session.transactions.size === 0) finishSession(session);
    for (const transaction of Array.from(session.transactions)) if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, "cancelled");
  }
}
function invalidateSortableRevision(listId) {
  var _a, _b;
  for (const session of Array.from(sessions.values())) {
    if (!session.snapshots.has(listId) || session.transactions.size > 0) continue;
    const source = controllers.get(session.source.listId);
    const snapshotValue = session.snapshots.get(session.source.listId);
    if (!source || !snapshotValue) {
      finishSession(session);
      continue;
    }
    const index = snapshotValue.keys.indexOf(session.source.itemKey ?? "");
    const event = makeEvent(makeId("transaction"), session, source, source, snapshotValue, snapshotValue, session.source.itemKey ?? "", index, index, { kind: "item", itemKey: session.source.itemKey ?? "" }, inputFor(session.source));
    (_a = source.onMoveReject) == null ? void 0 : _a.call(source, { ...event, reason: "stale-revision" });
    (_b = source.onAnnounceNow) == null ? void 0 : _b.call(source, `移动失败：${reasonText("stale-revision")}`);
    finishSession(session);
  }
}
function invalidateSortableScope(listId) {
  for (const session of Array.from(sessions.values())) {
    if (session.source.listId === listId) finishSession(session);
    for (const transaction of Array.from(session.transactions)) if (transaction.sourceId === listId || transaction.targetId === listId) void cancelTransaction(transaction, "cancelled");
  }
}
const reasonText = (reason) => ({
  "stale-revision": "数据已更新，请重试",
  "source-missing": "源项目不存在",
  "target-missing": "目标列表不存在",
  "duplicate-key": "项目标识重复",
  "group-mismatch": "列表分组不兼容",
  "disabled": "目标已禁用",
  "invalid-position": "目标位置无效",
  "parent-rejected": "父层拒绝了移动",
  "rollback-rejected": "回滚被父层拒绝",
  unmounted: "列表已卸载",
  cancelled: "操作已取消"
})[reason];
function rejectPreflight(session, source, target, reason, event, notifyTarget = true) {
  var _a, _b, _c, _d;
  const rejection = { ...event, reason };
  (_a = source.onMoveReject) == null ? void 0 : _a.call(source, rejection);
  if (notifyTarget && target !== source) (_b = target.onMoveReject) == null ? void 0 : _b.call(target, rejection);
  (_c = source.onAnnounceNow) == null ? void 0 : _c.call(source, `移动失败：${reasonText(reason)}`);
  if (notifyTarget && target !== source) (_d = target.onAnnounceNow) == null ? void 0 : _d.call(target, `移动失败：${reasonText(reason)}`);
  finishSession(session);
}
function makeEvent(transactionId, session, source, target, sourceSnapshot, targetSnapshot, itemKey, index, targetIndex, position, input) {
  var _a, _b, _c;
  const sourceItem = index >= 0 ? sourceSnapshot.items[index] : void 0;
  return {
    transactionId,
    sessionId: session.id,
    input,
    itemKey,
    itemLabel: sourceItem === void 0 ? itemKey : ((_a = source.itemLabel) == null ? void 0 : _a.call(source, sourceItem, index)) ?? itemKey,
    source: { listId: sourceSnapshot.listId, listLabel: ((_b = source.label) == null ? void 0 : _b.call(source)) ?? "列表", index, revision: sourceSnapshot.revision },
    target: { listId: targetSnapshot.listId, listLabel: ((_c = target.label) == null ? void 0 : _c.call(target)) ?? "列表", index: targetIndex, revision: targetSnapshot.revision },
    position
  };
}
function emitUpdate(controller, items, transactionId, input, phase) {
  controller.update(items, { transactionId, phase, input });
}
function restoreItems(original, current, movedKey, movedItem, removeMoved, controller) {
  const currentKeys = keysOf(controller, current);
  const currentByKey = new Map(currentKeys.map((key, index) => [key, current[index]]));
  return original.keys.filter((key) => !(removeMoved && key === movedKey)).map((key) => currentByKey.get(key) ?? original.items[original.keys.indexOf(key)]).concat(!removeMoved && !original.keys.includes(movedKey) ? [movedItem] : []);
}
async function cancelTransaction(transaction, reason) {
  var _a, _b, _c, _d;
  if (transaction.settled || transaction.cancelling) return;
  transaction.cancelling = true;
  const { source, target, session, sourceSnapshot, targetSnapshot, candidateSource, candidateTarget, sameList, input, event } = transaction;
  const sourceAccepted = sameKeys(keysOf(source, source.items()), keysOf(source, candidateSource));
  const targetAccepted = sameList ? sourceAccepted : sameKeys(keysOf(target, target.items()), keysOf(target, candidateTarget));
  const movedItem = source.items().find((item, index) => keysOf(source, source.items())[index] === event.itemKey) ?? target.items().find((item, index) => keysOf(target, target.items())[index] === event.itemKey) ?? sourceSnapshot.items[sourceSnapshot.keys.indexOf(event.itemKey)];
  const sourceDetached = !controllers.has(transaction.sourceId);
  const targetDetached = !controllers.has(transaction.targetId);
  const sourceRollbackRequested = sourceAccepted || reason === "unmounted" && sourceDetached && transaction.sourceRequested;
  const targetRollbackRequested = !sameList && (targetAccepted || reason === "unmounted" && targetDetached && transaction.targetRequested);
  if (sourceRollbackRequested) emitUpdate(source, restoreItems(sourceSnapshot, source.items(), event.itemKey, movedItem, false, source), event.transactionId, input, "rollback");
  if (targetRollbackRequested) emitUpdate(target, restoreItems(targetSnapshot, target.items(), event.itemKey, movedItem, true, target), event.transactionId, input, "rollback");
  await nextTick();
  const sourceRestored = !sourceRollbackRequested || sameKeys(keysOf(source, source.items()), sourceSnapshot.keys);
  const targetRestored = !targetRollbackRequested || sameKeys(keysOf(target, target.items()), targetSnapshot.keys);
  const finalReason = !transaction.rollbackPending && sourceRestored && targetRestored ? reason : "rollback-rejected";
  const rejection = { ...event, reason };
  rejection.reason = finalReason;
  (_a = source.onMoveReject) == null ? void 0 : _a.call(source, rejection);
  if (!sameList) (_b = target.onMoveReject) == null ? void 0 : _b.call(target, rejection);
  session.transactions.delete(transaction);
  transaction.settled = true;
  finishSession(session);
  (_c = source.onAnnounceNow) == null ? void 0 : _c.call(source, `移动失败：${reasonText(finalReason)}`);
  if (!sameList) (_d = target.onAnnounceNow) == null ? void 0 : _d.call(target, `移动失败：${reasonText(finalReason)}`);
}
async function settle(transaction) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const { source, target, session, sourceSnapshot, targetSnapshot, candidateSource, candidateTarget, sameList, input, event } = transaction;
  await nextTick();
  if (session.ended || transaction.settled || transaction.cancelling) return;
  const sourceAccepted = sameKeys(keysOf(source, source.items()), keysOf(source, candidateSource));
  const targetAccepted = sameList ? sourceAccepted : sameKeys(keysOf(target, target.items()), keysOf(target, candidateTarget));
  if (sourceAccepted && targetAccepted) {
    transaction.settled = true;
    session.transactions.delete(transaction);
    finishSession(session);
    (_a = source.onMoveCommit) == null ? void 0 : _a.call(source, event);
    if (!sameList) (_b = target.onMoveCommit) == null ? void 0 : _b.call(target, event);
    const message = sameList ? `已移动到第 ${event.target.index + 1} 项` : `已跨列表移动到第 ${event.target.index + 1} 项`;
    (_c = source.onAnnounce) == null ? void 0 : _c.call(source, message);
    if (!sameList) (_d = target.onAnnounce) == null ? void 0 : _d.call(target, message);
    return;
  }
  if (!sameList && sourceAccepted !== targetAccepted) {
    const acceptedController = sourceAccepted ? source : target;
    const acceptedSnapshot = sourceAccepted ? sourceSnapshot : targetSnapshot;
    const movedItem = sourceAccepted ? target.items().find((item, index) => keysOf(target, target.items())[index] === event.itemKey) : source.items().find((item, index) => keysOf(source, source.items())[index] === event.itemKey) ?? sourceSnapshot.items[sourceSnapshot.keys.indexOf(event.itemKey)];
    const rollback = restoreItems(acceptedSnapshot, acceptedController.items(), event.itemKey, movedItem, !sourceAccepted, acceptedController);
    transaction.rollbackPending = true;
    emitUpdate(acceptedController, rollback, event.transactionId, input, "rollback");
    await nextTick();
    if (transaction.cancelling || transaction.settled) return;
    const rollbackAccepted = sameKeys(keysOf(acceptedController, acceptedController.items()), acceptedSnapshot.keys);
    const reason = rollbackAccepted ? "parent-rejected" : "rollback-rejected";
    const rejection2 = { ...event, reason };
    (_e = source.onMoveReject) == null ? void 0 : _e.call(source, rejection2);
    if (!sameList) (_f = target.onMoveReject) == null ? void 0 : _f.call(target, rejection2);
    (_g = source.onAnnounceNow) == null ? void 0 : _g.call(source, `移动失败：${reasonText(reason)}`);
    if (!sameList) (_h = target.onAnnounceNow) == null ? void 0 : _h.call(target, `移动失败：${reasonText(reason)}`);
    transaction.settled = true;
    session.transactions.delete(transaction);
    finishSession(session);
    return;
  }
  const rejection = { ...event, reason: "parent-rejected" };
  (_i = source.onMoveReject) == null ? void 0 : _i.call(source, rejection);
  if (!sameList) (_j = target.onMoveReject) == null ? void 0 : _j.call(target, rejection);
  (_k = source.onAnnounceNow) == null ? void 0 : _k.call(source, `移动失败：${reasonText("parent-rejected")}`);
  if (!sameList) (_l = target.onAnnounceNow) == null ? void 0 : _l.call(target, `移动失败：${reasonText("parent-rejected")}`);
  transaction.settled = true;
  session.transactions.delete(transaction);
  finishSession(session);
}
function moveSortableItem(source, targetListId, targetIndex) {
  var _a, _b, _c, _d, _e, _f;
  const sourceController = controllers.get(source.listId);
  const targetController = controllers.get(targetListId);
  if (!sourceController) return false;
  if (!targetController) {
    const session2 = source.sessionId ? sessions.get(source.sessionId) : void 0;
    const sourceSnapshot2 = session2 == null ? void 0 : session2.snapshots.get(source.listId);
    if (session2 && sourceSnapshot2 && !session2.ended && !session2.dropConsumed) {
      session2.dropConsumed = true;
      const event2 = makeEvent(makeId("transaction"), session2, sourceController, sourceController, sourceSnapshot2, { listId: targetListId, revision: sourceSnapshot2.revision, scopeKey: sourceSnapshot2.scopeKey }, source.itemKey ?? "", sourceSnapshot2.keys.indexOf(source.itemKey ?? ""), targetIndex, { kind: "end" }, inputFor(source));
      rejectPreflight(session2, sourceController, sourceController, "target-missing", event2);
    }
    return false;
  }
  if (!source.sessionId || !sourceController.keyOf || !targetController.keyOf) {
    const sourceItems2 = sourceController.items(), targetItems2 = targetController.items();
    if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) return false;
    if (source.index < 0 || source.index >= sourceItems2.length || targetIndex < 0 || targetIndex > targetItems2.length) return false;
    if (source.listId === targetListId) {
      if (source.index === Math.min(targetIndex, targetItems2.length - 1)) return false;
      const next = [...targetItems2], [item2] = next.splice(source.index, 1);
      next.splice(Math.min(targetIndex, next.length), 0, item2);
      targetController.update(next);
      return true;
    }
    const item = sourceItems2[source.index];
    sourceController.update(sourceItems2.filter((_item, index) => index !== source.index));
    targetController.update([...targetItems2.slice(0, targetIndex), item, ...targetItems2.slice(targetIndex)]);
    return true;
  }
  const session = sessions.get(source.sessionId);
  const sourceSnapshot = session == null ? void 0 : session.snapshots.get(source.listId), targetSnapshot = session == null ? void 0 : session.snapshots.get(targetListId);
  if (!session || session.ended || !sourceSnapshot || session.dropConsumed) return false;
  session.dropConsumed = true;
  const currentSource = snapshot(source.listId, sourceController), currentTarget = snapshot(targetListId, targetController);
  const itemKey = source.itemKey ?? String(source.index);
  const position = source.position ?? (targetIndex >= currentTarget.items.length ? { kind: "end" } : { kind: "item", itemKey: currentTarget.keys[targetIndex] });
  const resolvedTargetIndex = position.kind === "end" ? currentTarget.items.length : currentTarget.keys.indexOf(position.itemKey);
  const event = makeEvent(makeId("transaction"), session, sourceController, targetController, sourceSnapshot, targetSnapshot ?? currentTarget, itemKey, sourceSnapshot.keys.indexOf(itemKey), resolvedTargetIndex, position, inputFor(source));
  let reason;
  if (!targetSnapshot) reason = "target-missing";
  else if (((_a = sourceController.scopeKey) == null ? void 0 : _a.call(sourceController)) !== sourceSnapshot.scopeKey || ((_b = targetController.scopeKey) == null ? void 0 : _b.call(targetController)) !== targetSnapshot.scopeKey) reason = "stale-revision";
  else if (invalidKey(currentSource.keys) || invalidKey(currentTarget.keys) || duplicate(currentSource.keys) || duplicate(currentTarget.keys)) reason = "duplicate-key";
  else if (sourceController.revision && currentSource.revision !== sourceSnapshot.revision || targetController.revision && currentTarget.revision !== targetSnapshot.revision) reason = "stale-revision";
  else if (currentSource.keys.indexOf(itemKey) < 0) reason = "source-missing";
  else if (position.kind === "item" && !currentTarget.keys.includes(position.itemKey)) reason = "target-missing";
  else if (source.listId !== targetListId && (!sourceController.group() || sourceController.group() !== targetController.group())) reason = "group-mismatch";
  else if (((_c = sourceController.disabled) == null ? void 0 : _c.call(sourceController)) || ((_d = targetController.disabled) == null ? void 0 : _d.call(targetController))) reason = "disabled";
  else if (resolvedTargetIndex < 0 || resolvedTargetIndex > currentTarget.items.length) reason = "invalid-position";
  if (reason) {
    rejectPreflight(session, sourceController, targetController, reason, event, reason !== "target-missing");
    return false;
  }
  const sameList = source.listId === targetListId, sourceIndex = currentSource.keys.indexOf(itemKey), sourceItems = currentSource.items, targetItems = currentTarget.items;
  const candidateSource = sameList ? (() => {
    const next = [...sourceItems], [item] = next.splice(sourceIndex, 1);
    next.splice(Math.min(resolvedTargetIndex, next.length), 0, item);
    return next;
  })() : sourceItems.filter((_item, index) => index !== sourceIndex);
  const movedItem = sourceItems[sourceIndex];
  const candidateTarget = sameList ? candidateSource : [...targetItems.slice(0, resolvedTargetIndex), movedItem, ...targetItems.slice(resolvedTargetIndex)];
  if (sameList && sameKeys(keysOf(sourceController, candidateSource), currentSource.keys)) {
    finishSession(session);
    return false;
  }
  const transaction = { session, source: sourceController, target: targetController, sourceSnapshot, targetSnapshot, candidateSource, candidateTarget, event, sameList, input: inputFor(source), sourceId: source.listId, targetId: targetListId, settled: false, cancelling: false, rollbackPending: false, sourceRequested: false, targetRequested: false };
  session.transactions.add(transaction);
  (_e = sourceController.onMoveStart) == null ? void 0 : _e.call(sourceController, event);
  if (!sameList) (_f = targetController.onMoveStart) == null ? void 0 : _f.call(targetController, event);
  if (sameList) {
    transaction.sourceRequested = true;
    emitUpdate(sourceController, candidateSource, event.transactionId, transaction.input, "candidate");
  } else {
    transaction.sourceRequested = true;
    transaction.targetRequested = true;
    emitUpdate(sourceController, candidateSource, event.transactionId, transaction.input, "candidate");
    emitUpdate(targetController, candidateTarget, event.transactionId, transaction.input, "candidate");
  }
  void settle(transaction);
  return true;
}
export {
  beginSortableSession,
  closeSortableSession,
  closeSortableSessionsForList,
  findAdjacentSortableList,
  invalidateSortableRevision,
  invalidateSortableScope,
  moveSortableItem,
  registerSortableList
};
