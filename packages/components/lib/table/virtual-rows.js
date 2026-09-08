"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function getVirtualRange(count, scrollTop, height, estimate, overscan, measured) {
  if (!count)
    return { start: 0, end: 0, top: 0, bottom: 0 };
  const offset = (index) => {
    let total2 = 0;
    for (let i = 0; i < index; i++)
      total2 += measured.get(i) ?? estimate;
    return total2;
  };
  const total = offset(count);
  let start = 0;
  while (start < count - 1 && offset(start + 1) <= Math.max(0, scrollTop))
    start++;
  let end = start;
  while (end < count && offset(end) < scrollTop + height)
    end++;
  start = Math.max(0, start - overscan);
  end = Math.min(count, end + overscan);
  return { start, end, top: offset(start), bottom: Math.max(0, total - offset(end)) };
}
exports.getVirtualRange = getVirtualRange;
