"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const getSafeUrl = (value) => value && /^(https?:|mailto:)/i.test(value) ? value : void 0;
const inlinePattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
const renderInline = (value) => {
  const children = [];
  let cursor = 0;
  for (const match of value.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > cursor) children.push(value.slice(cursor, index));
    if (match[2]) {
      children.push(vue.h("strong", match[2]));
    } else if (match[3]) {
      children.push(vue.h("em", match[3]));
    } else {
      const url = getSafeUrl(match[5]);
      children.push(url ? vue.h("a", { href: url, target: "_blank", rel: "noreferrer" }, match[4]) : match[4]);
    }
    cursor = index + match[0].length;
  }
  if (cursor < value.length) children.push(value.slice(cursor));
  return children;
};
const renderSafeMarkdown = (value) => {
  const lines = value.split("\n");
  return lines.flatMap((line, index) => index === 0 ? renderInline(line) : [vue.h("br"), ...renderInline(line)]);
};
exports.getSafeUrl = getSafeUrl;
exports.renderSafeMarkdown = renderSafeMarkdown;
