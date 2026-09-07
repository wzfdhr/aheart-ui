const createTreeIndex = (treeData, disabled = false) => {
  const nodes = /* @__PURE__ */ new Map();
  const order = [];
  const roots = treeData.map((node) => node.key);
  const pending = treeData.map((node, index) => ({ node, level: 1, position: index + 1, setSize: treeData.length, disabled })).reverse();
  while (pending.length) {
    const entry = pending.pop();
    const { node } = entry;
    if (nodes.has(node.key))
      throw new Error(`Tree keys must be unique: ${String(node.key)}`);
    const children = node.children ?? [];
    const record = {
      key: node.key,
      node,
      parentKey: entry.parentKey,
      children: children.map((child) => child.key),
      level: entry.level,
      position: entry.position,
      setSize: entry.setSize,
      disabled: entry.disabled || Boolean(node.disabled)
    };
    nodes.set(record.key, record);
    order.push(record.key);
    for (let index = children.length - 1; index >= 0; index -= 1) {
      pending.push({ node: children[index], parentKey: node.key, level: entry.level + 1, position: index + 1, setSize: children.length, disabled: record.disabled });
    }
  }
  return { nodes, roots, order };
};
const getVisibleTreeNodes = (index, expandedKeys) => {
  const expanded = new Set(expandedKeys);
  const pending = [...index.roots].reverse();
  const visible = [];
  while (pending.length) {
    const key = pending.pop();
    const record = index.nodes.get(key);
    if (!record)
      continue;
    visible.push(record);
    if (expanded.has(key)) {
      for (let child = record.children.length - 1; child >= 0; child -= 1)
        pending.push(record.children[child]);
    }
  }
  return visible;
};
const filterTreeIndex = (index, matches) => {
  const filtered = /* @__PURE__ */ new Map();
  for (let position = index.order.length - 1; position >= 0; position -= 1) {
    const key = index.order[position];
    const record = index.nodes.get(key);
    const children = record.children.flatMap((childKey) => {
      const child = filtered.get(childKey);
      return child ? [child] : [];
    });
    if (matches(record.node) || children.length)
      filtered.set(key, { ...record.node, children });
  }
  return index.roots.flatMap((key) => {
    const node = filtered.get(key);
    return node ? [node] : [];
  });
};
const closestVisibleTreeKey = (key, index, visible) => {
  var _a;
  let current = key;
  while (current !== void 0) {
    if (visible.has(current))
      return current;
    current = (_a = index.nodes.get(current)) == null ? void 0 : _a.parentKey;
  }
};
const treeKeyToken = (key) => `${typeof key === "number" ? "n" : "s"}-${Array.from(String(key), (character) => character.codePointAt(0).toString(16)).join("-")}`;
export {
  closestVisibleTreeKey,
  createTreeIndex,
  filterTreeIndex,
  getVisibleTreeNodes,
  treeKeyToken
};
