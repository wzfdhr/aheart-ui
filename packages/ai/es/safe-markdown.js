import { h as s } from "vue";
const l = (e) => e && /^(https?:|mailto:)/i.test(e) ? e : void 0, h = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g, c = (e) => {
  const r = [];
  let n = 0;
  for (const t of e.matchAll(h)) {
    const o = t.index ?? 0;
    if (o > n && r.push(e.slice(n, o)), t[2])
      r.push(s("strong", t[2]));
    else if (t[3])
      r.push(s("em", t[3]));
    else {
      const i = l(t[5]);
      r.push(i ? s("a", { href: i, target: "_blank", rel: "noreferrer" }, t[4]) : t[4]);
    }
    n = o + t[0].length;
  }
  return n < e.length && r.push(e.slice(n)), r;
}, p = (e) => e.split(`
`).flatMap((n, t) => t === 0 ? c(n) : [s("br"), ...c(n)]);
export {
  l as getSafeUrl,
  p as renderSafeMarkdown
};
