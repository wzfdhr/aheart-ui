const token = (key) => `${typeof key}:${String(key)}`;
const uniqueKeys = (keys) => {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const key of keys) {
    const id = token(key);
    if (!seen.has(id)) {
      seen.add(id);
      result.push(key);
    }
  }
  return result;
};
const deriveTreeCheckState = (index, keys, checkStrictly) => {
  const input = uniqueKeys(keys);
  if (checkStrictly)
    return { checkedKeys: input, halfCheckedKeys: [] };
  const explicit = new Set(input.map(token));
  const checked = /* @__PURE__ */ new Set();
  const half = /* @__PURE__ */ new Set();
  const covered = /* @__PURE__ */ new Set();
  for (const key of index.order) {
    const record = index.nodes.get(key);
    const id = token(key);
    if (record.disabled) {
      if (explicit.has(id))
        checked.add(id);
      continue;
    }
    const parentCovered = record.parentKey !== void 0 && covered.has(token(record.parentKey));
    if (explicit.has(id) || parentCovered) {
      checked.add(id);
      covered.add(id);
    }
  }
  for (let position = index.order.length - 1; position >= 0; position -= 1) {
    const key = index.order[position];
    const record = index.nodes.get(key);
    if (record.disabled || checked.has(token(key)))
      continue;
    const children = record.children.flatMap((child) => {
      const childRecord = index.nodes.get(child);
      return childRecord && !childRecord.disabled ? [childRecord] : [];
    });
    if (!children.length)
      continue;
    const checkedChildren = children.filter((child) => checked.has(token(child.key))).length;
    const partialChildren = children.some((child) => half.has(token(child.key)));
    if (checkedChildren === children.length && !partialChildren)
      checked.add(token(key));
    else if (checkedChildren > 0 || partialChildren)
      half.add(token(key));
  }
  const knownChecked = new Set(checked);
  const knownHalf = new Set(half);
  const checkedKeys = index.order.filter((key) => knownChecked.has(token(key)));
  const halfCheckedKeys = index.order.filter((key) => knownHalf.has(token(key)));
  for (const key of input) {
    if (!index.nodes.has(key))
      checkedKeys.push(key);
  }
  return { checkedKeys, halfCheckedKeys };
};
const toggleTreeCheck = (index, keys, key, checkStrictly) => {
  var _a, _b;
  const target = index.nodes.get(key);
  if (target == null ? void 0 : target.disabled)
    return deriveTreeCheckState(index, keys, checkStrictly);
  const current = deriveTreeCheckState(index, keys, checkStrictly);
  const isChecked = current.checkedKeys.some((currentKey) => token(currentKey) === token(key));
  const next = uniqueKeys(current.checkedKeys).filter((currentKey) => token(currentKey) !== token(key));
  if (checkStrictly) {
    if (!isChecked)
      next.push(key);
    return deriveTreeCheckState(index, next, true);
  }
  const targetKeys = /* @__PURE__ */ new Set();
  const pending = [key];
  while (pending.length) {
    const currentKey = pending.pop();
    const currentNode = index.nodes.get(currentKey);
    if (!currentNode || targetKeys.has(token(currentKey)))
      continue;
    if (currentNode.disabled)
      continue;
    targetKeys.add(token(currentKey));
    for (const child of currentNode.children) {
      if (!((_a = index.nodes.get(child)) == null ? void 0 : _a.disabled))
        pending.push(child);
    }
  }
  const ancestorKeys = /* @__PURE__ */ new Set();
  let ancestor = target == null ? void 0 : target.parentKey;
  while (ancestor !== void 0) {
    ancestorKeys.add(token(ancestor));
    ancestor = (_b = index.nodes.get(ancestor)) == null ? void 0 : _b.parentKey;
  }
  const filtered = next.filter((currentKey) => !targetKeys.has(token(currentKey)) && !ancestorKeys.has(token(currentKey)));
  if (!isChecked)
    filtered.push(key);
  return deriveTreeCheckState(index, filtered, false);
};
export {
  deriveTreeCheckState,
  toggleTreeCheck
};
