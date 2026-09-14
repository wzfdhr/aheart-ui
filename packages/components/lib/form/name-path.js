"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const blockedSegments = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
const normalizeNamePath = (name) => {
  if (typeof name === "string") {
    if (blockedSegments.has(name))
      throw new Error("Form field name paths contain an unsafe segment");
    return name;
  }
  if (name.length === 0)
    throw new Error("Form field name paths must not be empty");
  if (name.some((segment) => typeof segment !== "string" && typeof segment !== "number" || blockedSegments.has(String(segment)) || typeof segment === "number" && (!Number.isFinite(segment) || !Number.isInteger(segment) || segment < 0))) {
    throw new Error("Form field name paths contain an unsafe segment");
  }
  return [...name];
};
const namePathSegments = (name) => {
  const normalized = normalizeNamePath(name);
  return typeof normalized === "string" ? [normalized] : [...normalized];
};
const resolveNamePath = (prefix, name) => {
  const normalized = normalizeNamePath(name);
  return prefix === void 0 ? normalized : [...namePathSegments(prefix), ...namePathSegments(normalized)];
};
const matchListDescendant = (name, listName) => {
  const nameSegments = namePathSegments(name);
  const listSegments = namePathSegments(listName);
  if (nameSegments.length <= listSegments.length || !listSegments.every((segment, index2) => Object.is(nameSegments[index2], segment)))
    return void 0;
  const index = nameSegments[listSegments.length];
  if (typeof index !== "number")
    return void 0;
  return { index, tail: nameSegments.slice(listSegments.length + 1) };
};
const remapListDescendant = (name, listName, oldIndexToNewIndex) => {
  const match = matchListDescendant(name, listName);
  if (!match)
    return void 0;
  const nextIndex = oldIndexToNewIndex.get(match.index);
  return nextIndex === void 0 ? void 0 : [...namePathSegments(listName), nextIndex, ...match.tail];
};
const namePathKey = (name) => {
  const normalized = normalizeNamePath(name);
  return typeof normalized === "string" ? `s:${normalized}` : `p:${JSON.stringify(normalized.map((segment) => [typeof segment, segment]))}`;
};
const namePathLabel = (name) => typeof name === "string" ? name : name.join(".");
const getNamePathValue = (model, name) => {
  const normalized = normalizeNamePath(name);
  if (typeof normalized === "string")
    return Object.prototype.hasOwnProperty.call(model, normalized) ? model[normalized] : void 0;
  return normalized.reduce((value, segment) => {
    if (value === null || typeof value !== "object")
      return void 0;
    return Object.prototype.hasOwnProperty.call(value, segment) ? value[segment] : void 0;
  }, model);
};
const setNamePathValue = (model, name, value) => {
  const normalized = normalizeNamePath(name);
  if (typeof normalized === "string") {
    model[normalized] = value;
    return;
  }
  let target = model;
  normalized.slice(0, -1).forEach((segment, index) => {
    const next = normalized[index + 1];
    const current = Object.prototype.hasOwnProperty.call(target, segment) ? target[segment] : void 0;
    if (!current || typeof current !== "object")
      target[segment] = typeof next === "number" ? [] : {};
    target = target[segment];
  });
  target[normalized[normalized.length - 1]] = value;
};
const deleteNamePathValue = (model, name) => {
  const normalized = normalizeNamePath(name);
  if (typeof normalized === "string") {
    delete model[normalized];
    return;
  }
  let target = model;
  for (const segment of normalized.slice(0, -1)) {
    if (!Object.prototype.hasOwnProperty.call(target, segment))
      return;
    const next = target[segment];
    if (!next || typeof next !== "object")
      return;
    target = next;
  }
  delete target[normalized[normalized.length - 1]];
};
exports.deleteNamePathValue = deleteNamePathValue;
exports.getNamePathValue = getNamePathValue;
exports.matchListDescendant = matchListDescendant;
exports.namePathKey = namePathKey;
exports.namePathLabel = namePathLabel;
exports.namePathSegments = namePathSegments;
exports.normalizeNamePath = normalizeNamePath;
exports.remapListDescendant = remapListDescendant;
exports.resolveNamePath = resolveNamePath;
exports.setNamePathValue = setNamePathValue;
