import { defineComponent as he, getCurrentInstance as ke, ref as k, onBeforeUpdate as Ce, computed as X, watch as Y, onBeforeUnmount as _e, openBlock as g, createElementBlock as C, createBlock as oe, createCommentVNode as E, createElementVNode as U, Fragment as xe, renderList as $e, withCtx as we, createVNode as z, toDisplayString as Ie } from "vue";
import Ae from "./attachments.vue.js";
import Se from "./bubble.vue.js";
import Re from "./conversations.vue.js";
import Ve from "./prompts.vue.js";
import Ee from "./sender.vue.js";
import Be from "./welcome.vue.js";
import { createAIStreamReducer as De } from "./stream-reducer.js";
const Me = {
  class: "aheart-ai-chat-panel",
  "aria-label": "AI 对话"
}, Ue = { class: "aheart-ai-chat-panel__surface" }, Pe = {
  key: 0,
  class: "aheart-ai-chat-panel__messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, Ne = {
  class: "aheart-ai-chat-panel__message-actions",
  "aria-label": "消息操作"
}, Te = ["aria-label", "onClick"], je = ["disabled", "onClick"], Fe = ["disabled", "onClick"], Oe = ["disabled", "onClick"], Ke = {
  key: 1,
  class: "aheart-ai-chat-panel__empty"
}, Le = { class: "aheart-ai-chat-panel__composer" }, ze = {
  key: 0,
  class: "aheart-ai-chat-panel__stream-reconnecting",
  role: "status",
  "aria-live": "polite"
}, Ge = {
  key: 1,
  class: "aheart-ai-chat-panel__editing",
  role: "status"
}, He = {
  class: "aheart-ai-visually-hidden",
  role: "status",
  "aria-live": "polite"
}, tt = /* @__PURE__ */ he({
  name: "AAIChatPanel",
  __name: "chat-panel",
  props: {
    messages: { default: () => [] },
    defaultMessages: { default: () => [] },
    transport: {},
    conversationId: { default: void 0 },
    conversations: { default: () => [] },
    activeConversation: { default: void 0 },
    prompts: { default: () => [] },
    attachments: { default: () => [] },
    welcomeTitle: { default: "你好，我能为你做些什么？" },
    welcomeDescription: { default: "描述目标、补充上下文，或从建议任务开始。" },
    disabled: { type: Boolean, default: !1 },
    maxReconnectAttempts: { default: 1 }
  },
  emits: ["update:messages", "update:activeConversation", "update:attachments", "send", "stop", "retry", "regenerate", "edit", "copy", "error", "stream-status", "stream-reject"],
  setup(m, { emit: re }) {
    const i = m, n = re, _ = ke(), Z = (e) => Object.prototype.hasOwnProperty.call((_ == null ? void 0 : _.vnode.props) ?? {}, e), q = k(Z("messages"));
    Ce(() => {
      q.value = Z("messages");
    });
    const f = () => q.value, G = k([...i.defaultMessages]), l = k(f() ? [...i.messages] : [...G.value]), S = k(""), u = k(!1), y = k(), R = k(), B = k(), P = k(""), x = k("idle");
    let p = 0, ne = 0;
    const w = X(() => f() ? i.messages : G.value), H = X(() => i.conversationId ?? i.activeConversation), le = X(() => {
      if (x.value === "reconnecting") return "";
      if (!f() && u.value && P.value) return `AI 回复：${P.value}`;
      const e = [...w.value].reverse().find((a) => a.role === "assistant");
      return e ? e.status === "streaming" ? "正在生成" : e.status === "stopped" ? "已停止生成" : e.status === "error" ? "生成失败" : e.status === "complete" ? "已完成生成" : "" : "";
    }), $ = (e) => {
      e === "idle" && u.value && (x.value === "streaming" || x.value === "reconnecting") || x.value !== e && (x.value = e, n("stream-status", e));
    };
    Y(
      () => i.messages,
      (e) => {
        f() && !u.value && (l.value = [...e]);
      },
      { deep: !0 }
    );
    const T = (e) => `${e}-${Date.now()}-${ne++}`, D = (e) => {
      l.value = e, f() || (G.value = e), n("update:messages", e);
    }, j = (e, a) => {
      D(l.value.map((t) => t.id === e ? { ...t, ...a } : t));
    }, ie = (e, a, t) => e == null ? void 0 : e.map((s) => s.status === "pending" || s.status === "running" ? { ...s, status: a, ...t && !s.detail ? { detail: t } : {} } : s), M = (e, a, t) => {
      const s = l.value.find((d) => d.id === e);
      if (!s) return;
      const o = a === "complete" ? "complete" : a === "stopped" ? "stopped" : "error";
      j(e, {
        status: a,
        ...t ? { error: t } : {},
        process: ie(s.process, o, t)
      }), a === "complete" ? $("completed") : a === "stopped" ? $("cancelled") : a === "error" && $("error");
    }, ce = (e, a) => {
      const t = l.value.find((s) => s.id === e);
      if (!t) return !1;
      if (a.type === "text-delta")
        f() || (P.value = a.delta), j(e, { content: `${t.content}${a.delta}` });
      else if (a.type === "process") {
        const s = [...(t.process ?? []).filter((o) => o.id !== a.item.id), a.item];
        j(e, { process: s });
      } else if (a.type === "sources")
        j(e, { sources: a.sources });
      else {
        if (a.type === "done")
          return M(e, "complete"), !0;
        if (a.type === "cancelled")
          return M(e, "stopped"), !0;
        if (a.type === "error")
          return M(e, "error", a.error), n("error", a.error), !0;
      }
      return !1;
    }, J = async (e, a = {}) => {
      var te, ae, se;
      const t = {
        id: T("assistant"),
        role: "assistant",
        content: "",
        status: "streaming"
      }, s = ((ae = (te = _ == null ? void 0 : _.proxy) == null ? void 0 : te.$el) == null ? void 0 : ae.ownerDocument) ?? (typeof document < "u" ? document : void 0), o = new (((se = s == null ? void 0 : s.defaultView) == null ? void 0 : se.AbortController) ?? AbortController)(), d = ++p, r = i.transport, N = r && "version" in r && r.version === "2", F = T("request");
      u.value = !0, $("streaming"), y.value = o, R.value = t.id, P.value = "", N && f() ? l.value = [...e, t] : D([...e, t]), N && f() && n("update:messages", [...e, t]);
      try {
        if (N) {
          const b = {
            version: "2",
            requestId: F,
            messageId: t.id,
            idempotencyKey: T("idempotency"),
            conversationId: H.value,
            messages: e,
            ...a.action && { action: a.action },
            ...a.messageId && { targetMessageId: a.messageId }
          }, c = De({ requestId: F, messageId: t.id, maxReconnectAttempts: i.maxReconnectAttempts });
          let V = r.send(b, o.signal), O = 0, K = !1, L = !1;
          for (; !K; )
            try {
              for await (const h of V) {
                if (d !== p || o.signal.aborted) break;
                const v = c.dispatch(h);
                if (v.diagnostic.kind === "protocol-error") {
                  const Q = c.failRecovery(`协议错误：${v.diagnostic.reason ?? "invalid envelope"}`, !1);
                  n("stream-reject", v.diagnostic.reason ?? "协议错误"), $(Q.status), n("error", Q.message.error ?? "协议错误");
                  const ye = { ...t, ...Q.message };
                  l.value = [...e, ye], f() ? n("update:messages", l.value) : D(l.value), L = !0, K = !0;
                  break;
                }
                $(v.status), (v.status === "completed" || v.status === "cancelled" || v.status === "error") && (K = !0);
                const be = { ...t, ...v.message };
                if (l.value = [...e, be], f() ? n("update:messages", l.value) : D(l.value), !f() && h.type === "text-delta" && v.diagnostic.kind === "accepted" && (P.value = h.delta), v.status === "completed" || v.status === "cancelled" || v.status === "error") {
                  K = !0;
                  break;
                }
                if (v.recoveryRequired) break;
              }
              if (d !== p || o.signal.aborted) break;
              const I = c.getState();
              if (I.status === "completed" || I.status === "cancelled" || I.status === "error") break;
              if (L || !("resume" in r) || !r.resume || O >= Math.max(0, Number.isSafeInteger(i.maxReconnectAttempts) ? i.maxReconnectAttempts : 1)) {
                let h = r.resume ? c.recover({ reason: L ? "protocol" : "eof" }) : c.failRecovery("连接中断，请重试");
                h.status === "reconnecting" && L && (h = c.failRecovery("协议错误", !1)), $(h.status);
                const v = { ...t, ...h.message };
                l.value = [...e, v], f() ? n("update:messages", l.value) : D(l.value);
                break;
              }
              O += 1;
              const A = c.recover({ reason: "eof" });
              $(A.status), V = r.resume({ ...b, resume: c.getState().cursor }, o.signal);
            } catch {
              if (d !== p || o.signal.aborted) break;
              let A = r.resume ? c.recover({ reason: "transport" }) : c.failRecovery("连接中断，请重试", !0);
              if ($(A.status), A.status === "error") {
                const h = { ...t, ...A.message };
                l.value = [...e, h], f() ? n("update:messages", l.value) : D(l.value);
              }
              if (!("resume" in r) || !r.resume || A.status === "error" || O >= (i.maxReconnectAttempts ?? 1)) break;
              O += 1, V = r.resume({ ...b, resume: c.getState().cursor }, o.signal);
            }
          if (d === p && !o.signal.aborted) {
            const I = c.getState(), A = { ...t, ...I.message };
            l.value = [...e, A], I.status === "error" && n("error", I.message.error ?? "生成失败");
          }
        } else {
          const b = r;
          for await (const V of b.send({ conversationId: H.value, messages: e, ...a.action && { action: a.action }, ...a.messageId && { messageId: a.messageId } }, o.signal))
            if (d !== p || o.signal.aborted || ce(t.id, V)) break;
          const c = l.value.find((V) => V.id === t.id);
          (c == null ? void 0 : c.status) === "streaming" && d === p && M(t.id, "complete");
        }
      } catch (b) {
        const c = String(b instanceof Error ? b.message : b);
        if (o.signal.aborted || d !== p)
          return;
        M(t.id, "error", c), n("error", c);
      } finally {
        y.value === o && (u.value = !1, x.value = w.value.some((b) => b.status === "streaming") ? "streaming" : "idle", y.value = void 0, R.value = void 0, l.value = [...w.value]);
      }
    }, W = async (e) => {
      const a = (e ?? S.value).trim();
      if (!a || u.value || i.disabled) return;
      if (B.value) {
        const o = B.value, d = [...w.value], r = d.findIndex((F) => F.id === o.id);
        if (r < 0) return;
        const N = { ...o, content: a, status: "complete" };
        S.value = "", B.value = void 0, n("edit", o, a), await J([...d.slice(0, r), N], { action: "edit", messageId: o.id });
        return;
      }
      const t = {
        id: T("user"),
        role: "user",
        content: a,
        status: "complete",
        ...i.attachments.length && { attachments: [...i.attachments] }
      }, s = [...w.value, t];
      S.value = "", n("send", a), i.attachments.length && n("update:attachments", []), await J(s);
    }, ee = async (e, a) => {
      if (u.value || i.disabled) return;
      const t = [...w.value], s = t.findIndex((r) => r.id === e.id);
      if (s < 1) return;
      const o = t.slice(0, s);
      [...o].reverse().find((r) => r.role === "user") && (n(a === "retry" ? "retry" : "regenerate", e), await J(o, { action: a, messageId: e.id }));
    }, ue = (e) => ee(e, "retry"), de = (e) => ee(e, "regenerate"), ve = (e) => {
      u.value || i.disabled || (B.value = e, S.value = e.content);
    }, me = () => {
      B.value = void 0, S.value = "";
    }, fe = (e) => {
      var t, s, o, d, r;
      const a = (o = (s = (t = _ == null ? void 0 : _.proxy) == null ? void 0 : t.$el) == null ? void 0 : s.ownerDocument) == null ? void 0 : o.defaultView;
      (r = (d = a == null ? void 0 : a.navigator) == null ? void 0 : d.clipboard) == null || r.writeText(e.content), n("copy", e);
    }, pe = (e) => {
      n("update:attachments", i.attachments.filter((a) => a.id !== e.id));
    }, ge = () => {
      p += 1;
      const e = y.value;
      R.value && M(R.value, "stopped"), e == null || e.abort(), y.value = void 0, R.value = void 0, u.value = !1, n("stop");
    };
    return Y(H, (e, a) => {
      var t;
      e !== a && (p += 1, (t = y.value) == null || t.abort(), y.value = void 0, R.value = void 0, u.value = !1, x.value = "idle");
    }), Y(() => i.transport, (e, a) => {
      var t;
      e !== a && (p += 1, (t = y.value) == null || t.abort(), y.value = void 0, R.value = void 0, u.value = !1, x.value = "idle");
    }), _e(() => {
      var e;
      p += 1, (e = y.value) == null || e.abort();
    }), (e, a) => (g(), C("section", Me, [
      m.conversations.length ? (g(), oe(Re, {
        key: 0,
        "model-value": m.activeConversation,
        conversations: m.conversations,
        "onUpdate:modelValue": a[0] || (a[0] = (t) => n("update:activeConversation", t))
      }, null, 8, ["model-value", "conversations"])) : E("", !0),
      U("div", Ue, [
        w.value.length ? (g(), C("div", Pe, [
          (g(!0), C(xe, null, $e(w.value, (t) => (g(), oe(Se, {
            key: t.id,
            "data-message-id": t.id,
            message: t
          }, {
            actions: we(() => [
              U("div", Ne, [
                t.content ? (g(), C("button", {
                  key: 0,
                  type: "button",
                  "data-action": "copy",
                  "aria-label": `复制${t.role === "user" ? "问题" : "回答"}`,
                  onClick: (s) => fe(t)
                }, " 复制 ", 8, Te)) : E("", !0),
                t.role === "user" ? (g(), C("button", {
                  key: 1,
                  type: "button",
                  "data-action": "edit",
                  disabled: m.disabled || u.value,
                  onClick: (s) => ve(t)
                }, " 编辑 ", 8, je)) : E("", !0),
                t.role === "assistant" && (t.status === "error" || t.status === "stopped") && t.retryable !== !1 ? (g(), C("button", {
                  key: 2,
                  type: "button",
                  "data-action": "retry",
                  disabled: m.disabled || u.value,
                  onClick: (s) => ue(t)
                }, " 重试 ", 8, Fe)) : E("", !0),
                t.role === "assistant" && t.status === "complete" ? (g(), C("button", {
                  key: 3,
                  type: "button",
                  "data-action": "regenerate",
                  disabled: m.disabled || u.value,
                  onClick: (s) => de(t)
                }, " 重新生成 ", 8, Oe)) : E("", !0)
              ])
            ]),
            _: 2
          }, 1032, ["data-message-id", "message"]))), 128))
        ])) : (g(), C("div", Ke, [
          z(Be, {
            title: m.welcomeTitle,
            description: m.welcomeDescription
          }, null, 8, ["title", "description"]),
          z(Ve, {
            prompts: m.prompts,
            disabled: m.disabled || u.value,
            onSelect: a[1] || (a[1] = (t) => W(t.label))
          }, null, 8, ["prompts", "disabled"])
        ])),
        U("div", Le, [
          x.value === "reconnecting" ? (g(), C("p", ze, "正在恢复连接")) : E("", !0),
          B.value ? (g(), C("div", Ge, [
            a[3] || (a[3] = U("span", null, "正在编辑已发送的问题", -1)),
            U("button", {
              type: "button",
              onClick: me
            }, "取消编辑")
          ])) : E("", !0),
          z(Ae, {
            items: m.attachments,
            removable: "",
            onRemove: pe
          }, null, 8, ["items"]),
          z(Ee, {
            modelValue: S.value,
            "onUpdate:modelValue": a[2] || (a[2] = (t) => S.value = t),
            disabled: m.disabled,
            loading: u.value,
            onSubmit: W,
            onStop: ge
          }, null, 8, ["modelValue", "disabled", "loading"])
        ])
      ]),
      U("p", He, Ie(le.value), 1)
    ]));
  }
});
export {
  tt as default
};
