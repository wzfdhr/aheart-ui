"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const treeIndex = require("./tree-index.js");
function applyChildren(nodes, patches) {
  if (!patches.size)
    return nodes;
  const result = [];
  const pending = nodes.map((node) => ({ node, output: result })).reverse();
  const seen = /* @__PURE__ */ new Set();
  while (pending.length) {
    const { node, output } = pending.pop();
    if (seen.has(node.key))
      throw new Error(`Tree keys must be unique: ${String(node.key)}`);
    seen.add(node.key);
    const children = patches.get(node.key) ?? node.children;
    const copy = { ...node, ...children ? { children: [] } : {} };
    if (patches.has(node.key) && (children == null ? void 0 : children.length) === 0)
      copy.isLeaf = true;
    output.push(copy);
    if (children)
      for (let i = children.length - 1; i >= 0; i--)
        pending.push({ node: children[i], output: copy.children });
  }
  return result;
}
function useTreeLoader(source, getLoader, disabled) {
  const patches = vue.shallowRef(/* @__PURE__ */ new Map());
  const loadingKeys = vue.shallowRef(/* @__PURE__ */ new Set());
  const errorKeys = vue.shallowRef(/* @__PURE__ */ new Set());
  const loadedKeys = /* @__PURE__ */ new Set();
  const version = vue.shallowRef(0);
  const tasks = /* @__PURE__ */ new Map();
  const data = vue.computed(() => applyChildren(source(), patches.value));
  const setLoading = () => {
    loadingKeys.value = new Set(tasks.keys());
  };
  const cancel = (key) => {
    const task = tasks.get(key);
    tasks.delete(key);
    task == null ? void 0 : task.controller.abort();
    setLoading();
  };
  const cancelAll = () => {
    for (const key of tasks.keys())
      cancel(key);
  };
  vue.watch(source, () => {
    cancelAll();
    patches.value = /* @__PURE__ */ new Map();
    loadedKeys.clear();
    errorKeys.value = /* @__PURE__ */ new Set();
  }, { deep: true, flush: "sync" });
  vue.watch(getLoader, () => {
    cancelAll();
    patches.value = /* @__PURE__ */ new Map();
    loadedKeys.clear();
    errorKeys.value = /* @__PURE__ */ new Set();
    version.value++;
  }, { flush: "sync" });
  vue.watch(disabled, (value) => {
    if (value)
      cancelAll();
  }, { flush: "sync" });
  vue.onScopeDispose(cancelAll);
  const load = (key, retry = false) => {
    const existing = tasks.get(key);
    if (existing)
      return existing.promise;
    const loader = getLoader();
    const entry = treeIndex.createTreeIndex(data.value, disabled()).nodes.get(key);
    if (!loader || !entry || entry.disabled || entry.node.isLeaf !== false || entry.children.length || loadedKeys.has(key))
      return Promise.resolve(true);
    if (errorKeys.value.has(key) && !retry)
      return Promise.resolve(false);
    const controller = new AbortController();
    const task = { controller, promise: Promise.resolve(false) };
    tasks.set(key, task);
    setLoading();
    errorKeys.value = new Set([...errorKeys.value].filter((current) => current !== key));
    task.promise = Promise.resolve().then(() => {
      if (controller.signal.aborted)
        return;
      return loader(entry.node, { signal: controller.signal });
    }).then((children) => {
      if (controller.signal.aborted || tasks.get(key) !== task)
        return false;
      if (children !== void 0) {
        const next = new Map(patches.value).set(key, children);
        treeIndex.createTreeIndex(applyChildren(source(), next));
        patches.value = next;
      }
      loadedKeys.add(key);
      return true;
    }).catch(() => {
      if (!controller.signal.aborted && tasks.get(key) === task)
        errorKeys.value = /* @__PURE__ */ new Set([...errorKeys.value, key]);
      return false;
    }).finally(() => {
      if (tasks.get(key) === task) {
        tasks.delete(key);
        setLoading();
      }
    });
    return task.promise;
  };
  return { data, loadingKeys, errorKeys, version, load, cancel, cancelAll };
}
const treeModelKey = Symbol("aheart-tree-model");
exports.treeModelKey = treeModelKey;
exports.useTreeLoader = useTreeLoader;
