const S = (s) => typeof s == "number" && Number.isSafeInteger(s), l = (s) => Array.isArray(s) ? s.map(l) : s && typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([o, c]) => [o, l(c)])) : s, f = (s) => s === void 0 ? "undefined" : s === null || typeof s != "object" ? JSON.stringify(s) : Array.isArray(s) ? `[${s.map(f).join(",")}]` : `{${Object.keys(s).sort().map((o) => `${JSON.stringify(o)}:${f(s[o])}`).join(",")}}`, M = (s) => {
  if (!s || typeof s != "object") return;
  const o = s;
  if (typeof o.id != "string" || typeof o.name != "string" || typeof o.summary != "string") return;
  const c = { id: o.id, name: o.name, summary: o.summary };
  for (const r of ["inputStatus", "inputSummary", "resultStatus", "resultSummary", "error"])
    typeof o[r] == "string" && (c[r] = o[r]);
  return c;
}, R = (s, o) => {
  if (!s || typeof s != "object") return;
  const c = s;
  if (c.id !== o || c.role !== "assistant" || typeof c.content != "string") return;
  const r = { id: o, role: "assistant", content: c.content };
  if ((c.status === "streaming" || c.status === "complete") && (r.status = c.status), typeof c.error == "string" && (r.error = c.error), Array.isArray(c.process) && (r.process = l(c.process)), Array.isArray(c.sources) && (r.sources = l(c.sources)), c.toolCall !== void 0) {
    const a = M(c.toolCall);
    a && (r.toolCall = a);
  }
  return r;
}, E = (s) => {
  const o = S(s.maxReconnectAttempts) ? Math.max(0, s.maxReconnectAttempts) : 1, c = s.initialMessage ?? { id: s.messageId, role: "assistant", content: "", status: "streaming" };
  let r = {
    requestId: s.requestId,
    messageId: s.messageId,
    cursor: { afterSequence: 0, revision: 0 },
    message: l(c),
    status: "idle",
    recoveryRequired: !1,
    diagnostic: { kind: "accepted" }
  };
  const a = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  let b = 0;
  const g = /* @__PURE__ */ new Map(), t = (e, i, n) => (r = { ...r, diagnostic: { kind: e, ...i === void 0 ? {} : { sequence: i }, ...n ? { reason: n } : {} } }, l(r)), m = (e, i) => {
    for (p.delete(e), p.set(e, i); p.size > 64; ) p.delete(p.keys().next().value);
  }, j = (e) => !(!e || typeof e != "object" || e.version !== "2" || typeof e.requestId != "string" || !e.requestId || typeof e.messageId != "string" || !e.messageId || e.requestId !== s.requestId || e.messageId !== s.messageId || !S(e.sequence) || e.sequence < 1 || !S(e.revision) || e.revision < 0 || !["text-delta", "process-upsert", "sources-replace", "snapshot", "final", "cancelled", "error"].includes(e.type) || e.type === "text-delta" && typeof e.delta != "string" || e.type === "process-upsert" && (!e.item || typeof e.item.id != "string") || e.type === "sources-replace" && !Array.isArray(e.sources) || (e.type === "snapshot" || e.type === "final") && !R(e.message, s.messageId) || e.type === "cancelled" && e.reason !== void 0 && typeof e.reason != "string" || e.type === "error" && typeof e.error != "string"), y = (e) => {
    if (e.revision > r.cursor.revision) {
      r = { ...r, recoveryRequired: !0 };
      return;
    }
    r = { ...r, cursor: { afterSequence: e.sequence, revision: r.cursor.revision }, status: "streaming", recoveryRequired: !1 }, !(e.revision < r.cursor.revision) && (e.type === "text-delta" ? r.message = { ...r.message, content: r.message.content + e.delta, status: "streaming" } : e.type === "process-upsert" ? r.message = { ...r.message, process: [...(r.message.process ?? []).filter((i) => i.id !== e.item.id), l(e.item)] } : e.type === "sources-replace" ? r.message = { ...r.message, sources: l(e.sources) } : e.type === "cancelled" ? (r.status = "cancelled", g.set(e.sequence, f(e)), r.message = { ...r.message, status: "stopped", error: e.reason }) : e.type === "error" && (r.status = "error", g.set(e.sequence, f(e)), r.message = { ...r.message, status: "error", error: e.error, retryable: e.retryable }));
  }, x = (e, i) => {
    const n = R(e.message, s.messageId);
    if (!n) return t("protocol-error", e.sequence, "invalid checkpoint");
    if (e.revision < r.cursor.revision || e.sequence < r.cursor.afterSequence) return t("stale", e.sequence);
    const q = r.message.attachments ? { attachments: r.message.attachments } : {}, { id: u, role: h, content: k, ...w } = n;
    for (r = { ...r, message: { id: r.message.id, role: "assistant", content: k, ...q, ...w, status: e.type === "final" ? "complete" : "streaming" }, cursor: { afterSequence: e.sequence, revision: e.revision }, recoveryRequired: !1, status: e.type === "final" ? "completed" : "streaming" }, a.forEach((d, A) => {
      A <= e.sequence && a.delete(A);
    }), e.type === "final" && g.set(e.sequence, i); a.has(r.cursor.afterSequence + 1); ) {
      const d = a.get(r.cursor.afterSequence + 1);
      if (r.status === "completed" || r.status === "cancelled" || r.status === "error" || d.revision > r.cursor.revision) break;
      a.delete(d.sequence), m(d.sequence, f(d)), y(d);
    }
    return t("accepted", e.sequence);
  }, I = (e) => {
    const i = f(e);
    if (!j(e)) return t("protocol-error", e == null ? void 0 : e.sequence, "invalid envelope");
    const n = g.get(e.sequence);
    if (n) return n === i ? t("duplicate", e.sequence) : t("protocol-error", e.sequence, "conflicting terminal");
    if (r.status === "completed" || r.status === "cancelled" || r.status === "error") return t("terminal-no-op", e.sequence);
    const q = p.get(e.sequence);
    if (q) return q === i ? t("duplicate", e.sequence) : t("protocol-error", e.sequence, "conflicting sequence");
    if (e.type === "snapshot" || e.type === "final")
      return e.revision < r.cursor.revision || e.sequence < r.cursor.afterSequence ? (m(e.sequence, i), t("stale", e.sequence)) : (m(e.sequence, i), x(e, i));
    if (e.sequence <= r.cursor.afterSequence)
      return p.has(e.sequence), t("stale", e.sequence);
    if (e.sequence > r.cursor.afterSequence + 1) {
      const u = a.get(e.sequence);
      return u ? f(u) === i ? t("duplicate", e.sequence) : t("protocol-error", e.sequence, "conflicting buffered sequence") : e.sequence - r.cursor.afterSequence > 32 || a.size >= 32 ? (r = { ...r, recoveryRequired: !0 }, t("gap", e.sequence)) : (a.set(e.sequence, e), t("buffered", e.sequence));
    }
    if (e.revision > r.cursor.revision)
      return r = { ...r, recoveryRequired: !0 }, t("protocol-error", e.sequence, "revision checkpoint required");
    for (m(e.sequence, i), y(e); a.has(r.cursor.afterSequence + 1); ) {
      const u = a.get(r.cursor.afterSequence + 1);
      if (r.status === "completed" || r.status === "cancelled" || r.status === "error" || u.revision > r.cursor.revision) break;
      a.delete(u.sequence);
      const h = f(u);
      if (m(u.sequence, h), y(u), r.status === "error" || r.status === "cancelled") break;
    }
    return t("accepted", e.sequence);
  };
  return { dispatch: I, reduce: I, recover: ({ reason: e = "transport" } = {}) => r.status === "completed" || r.status === "cancelled" || r.status === "error" ? t("terminal-no-op", r.cursor.afterSequence) : b < o ? (b += 1, r = { ...r, status: "reconnecting", recoveryRequired: !0 }, t("gap", r.cursor.afterSequence, e)) : (r = { ...r, status: "error", message: { ...r.message, status: "error", error: "连接中断，请重试", retryable: !0 }, recoveryRequired: !1 }, t("gap", r.cursor.afterSequence, e)), failRecovery: (e = "transport", i = !0) => r.status === "completed" || r.status === "cancelled" || r.status === "error" ? t("terminal-no-op", r.cursor.afterSequence) : (r = { ...r, status: "error", message: { ...r.message, status: "error", error: e, retryable: i }, recoveryRequired: !1 }, t("gap", r.cursor.afterSequence, e)), getState: () => r };
}, $ = (s, o) => s.dispatch(o);
export {
  E as createAIStreamReducer,
  $ as reduceAIStreamEvent
};
