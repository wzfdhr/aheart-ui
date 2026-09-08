"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const normalizeTotal = (total) => Number.isFinite(total) && Number.isInteger(total) && total >= 0 ? total : 0;
const normalizePageSize = (size) => Number.isFinite(size) && size > 0 ? Math.max(1, Math.trunc(size)) : 1;
const getPageCount = (total, size) => Math.max(1, Math.ceil(normalizeTotal(total) / normalizePageSize(size)));
const normalizeCurrent = (current, total, size) => {
  const pageCount = getPageCount(total, size);
  const normalized = Number.isFinite(current) && current > 0 ? Math.trunc(current) : 1;
  return Math.min(Math.max(normalized, 1), pageCount);
};
exports.getPageCount = getPageCount;
exports.normalizeCurrent = normalizeCurrent;
exports.normalizePageSize = normalizePageSize;
exports.normalizeTotal = normalizeTotal;
