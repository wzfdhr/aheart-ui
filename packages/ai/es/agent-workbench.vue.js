import { defineComponent as Be, ref as R, getCurrentInstance as Ve, useId as De, computed as I, onMounted as He, nextTick as Le, onBeforeUnmount as Ie, watch as ee, onBeforeUpdate as Pe, h as te, openBlock as h, createElementBlock as g, createElementVNode as u, toDisplayString as $, createCommentVNode as C, normalizeClass as Ne, createVNode as m, unref as y, withCtx as k, createTextVNode as P, createBlock as ae, Teleport as $e, mergeProps as Fe, renderSlot as _, createSlots as Je, withDirectives as oe, Fragment as Ze, renderList as qe, vShow as se } from "vue";
import { Splitter as We, SplitterPanel as ne, Button as N, Tabs as Ge, Drawer as Xe } from "aheart-ui";
import { SortableList as Ye } from "@aheart-ui/dnd";
import Ce from "./attachments.vue.js";
import Qe from "./chat-panel.vue.js";
import xe from "./conversations.vue.js";
import Se from "./sources.vue.js";
import et from "./agent-execution.vue.js";
const tt = {
  class: "aheart-ai-workbench",
  "aria-label": "AI 工作台"
}, at = { class: "aheart-ai-workbench__header" }, ot = { key: 0 }, st = { class: "aheart-ai-workbench__header-status" }, nt = { class: "aheart-ai-workbench__progress" }, rt = ["aria-label"], it = { class: "aheart-ai-workbench__desktop" }, lt = { class: "aheart-ai-workbench__sidebar" }, dt = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
}, ct = ["data-context-id"], ut = { key: 0 }, vt = { class: "aheart-ai-workbench__move-actions" }, pt = { class: "aheart-ai-workbench__chat" }, ft = {
  key: 1,
  class: "aheart-ai-workbench__empty"
}, mt = {
  class: "aheart-ai-workbench__execution",
  "aria-label": "执行与产物"
}, bt = {
  key: 0,
  class: "aheart-ai-workbench__task-order-error",
  role: "alert"
}, ht = { class: "aheart-ai-workbench__mobile" }, kt = { class: "aheart-ai-workbench__mobile-panel" }, gt = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
}, yt = { class: "aheart-ai-workbench__context-list-mobile" }, wt = ["data-context-id"], It = { key: 0 }, $t = { class: "aheart-ai-workbench__move-actions" }, Ct = { class: "aheart-ai-workbench__mobile-panel" }, xt = { class: "aheart-ai-workbench__mobile-panel--chat" }, St = ["id"], At = {
  key: 0,
  class: "aheart-ai-workbench__empty"
}, Tt = { class: "aheart-ai-workbench__mobile-panel" }, Ut = /* @__PURE__ */ Be({
  name: "AAIAgentWorkbench",
  __name: "agent-workbench",
  props: {
    title: { default: "AI 工作台" },
    description: { default: "编排对话、任务、审批与产物。" },
    panelSizes: { default: () => [150, "auto", 200] },
    conversations: { default: () => [] },
    activeConversation: { default: void 0 },
    messages: { default: () => [] },
    prompts: { default: () => [] },
    transport: { default: void 0 },
    tasks: { default: () => [] },
    contextItems: { default: () => [] },
    sources: { default: () => [] },
    attachments: { default: () => [] },
    artifacts: { default: () => [] },
    activeArtifact: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    actionHandler: {},
    reorderable: { type: Boolean, default: !0 },
    tasksRevision: { default: void 0 },
    scopeKey: { default: void 0 }
  },
  emits: ["update:panelSizes", "update:activeConversation", "update:messages", "update:activeArtifact", "update:tasks", "update:contextItems", "approve", "reject", "cancel", "retry", "move-task", "move-context", "stop", "chat-retry", "chat-regenerate", "chat-edit", "chat-copy", "error", "operation-start", "operation-success", "operation-error", "task-move-reject"],
  setup(l, { emit: Ae }) {
    const s = l, v = Ae, j = R("chat"), D = R(!1), W = R(), G = R(), re = R(!1), K = R(!1), U = R(!1);
    let S, F;
    const B = Ve(), X = `scope-${De().replace(/[^a-zA-Z0-9_-]/g, "-")}`, Y = X.replace(/^scope-/, ""), Te = `aheart-ai-${Y}-chat-target`, ie = `aheart-ai-${Y}-execution-target`, Q = I(() => s.scopeKey === void 0 ? X : `scope-${String(s.scopeKey).replace(/[^a-zA-Z0-9_-]/g, "-")}-${X.replace(/^scope-/, "")}`);
    He(async () => {
      var a, o, r;
      re.value = !0;
      const t = (o = (a = B == null ? void 0 : B.proxy) == null ? void 0 : a.$el) == null ? void 0 : o.ownerDocument, e = t == null ? void 0 : t.defaultView;
      e != null && e.matchMedia ? (S = e.matchMedia("(max-width: 760px)"), U.value = S.matches, F = (d) => {
        U.value = d.matches;
      }, (r = S.addEventListener) == null || r.call(S, "change", F)) : U.value = !0, K.value = !0, await Le();
    }), Ie(() => {
      var t;
      S && F && ((t = S.removeEventListener) == null || t.call(S, "change", F));
    }), ee(U, (t) => {
      t || (D.value = !1);
    });
    const f = R({}), A = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
    let le = 0;
    const E = /* @__PURE__ */ new Set(), de = () => Object.prototype.hasOwnProperty.call((B == null ? void 0 : B.vnode.props) ?? {}, "messages"), ce = R(de());
    Pe(() => {
      ce.value = de();
    });
    const Me = I(() => ce.value ? { messages: s.messages } : { defaultMessages: s.messages }), ue = I(() => s.tasks.filter(
      (t) => t.approval && (!t.approval.status || t.approval.status === "pending")
    )), z = I(() => ue.value.length), ve = I(() => {
      const t = ue.value[0], e = s.artifacts.find((o) => {
        var r;
        return o.id === ((r = t == null ? void 0 : t.approval) == null ? void 0 : r.artifactId);
      });
      return e ? `${z.value > 1 ? `${z.value} 项待审批` : "待审批"}：${e.title}` : `${z.value} 项待审批`;
    }), Re = () => {
      j.value = "execution", D.value = !0;
    }, je = I(() => [
      { key: J("conversations"), label: "会话" },
      { key: J("chat"), label: "对话" },
      {
        key: J("execution"),
        label: te("span", { class: "aheart-ai-workbench__mobile-tab-label" }, [
          te("span", "执行"),
          z.value > 0 ? te("span", { class: "aheart-ai-workbench__pending-badge", "aria-label": `${z.value} 项待审批` }, String(z.value)) : null
        ])
      }
    ]), J = (t) => `${t}--${Y}`, ze = I(() => Object.fromEntries(Object.entries(f.value).map(([t, e]) => [t, e.message ?? (e.status === "pending" ? "处理中…" : e.status === "success" ? "成功" : "")]))), V = (t) => {
      var e;
      return `${t.id}:${String(t.revision ?? "")}:${((e = t.approval) == null ? void 0 : e.id) ?? ""}`;
    }, pe = (t, e) => {
      const a = V(t), o = f.value[a];
      return E.has(a) || [...E].some((d) => d.startsWith(`${t.id}:`)) || (o == null ? void 0 : o.status) === "pending" || (o == null ? void 0 : o.status) === "success" || s.disabled || s.actionHandler && t.revision === void 0 ? !0 : t.approval ? (o == null ? void 0 : o.status) === "error" && o.outcome !== "not-applied" && e !== "retry" || s.actionHandler && (t.revision === void 0 || t.approval.artifactId && (!s.artifacts.find((d) => {
        var n;
        return d.id === ((n = t.approval) == null ? void 0 : n.artifactId);
      }) || s.artifacts.some((d) => {
        var n;
        return d.id === ((n = t.approval) == null ? void 0 : n.artifactId) && d.revision === void 0;
      }))) ? !0 : t.status === "running" && e !== "cancel" : (o == null ? void 0 : o.status) === "error" ? e !== "retry" : !(t.status === "running" && e === "cancel" || t.status === "error" && e === "retry");
    }, Z = async (t, e) => {
      var c, p, b, M, L, ye;
      if (pe(e, t)) return;
      if (!s.actionHandler) {
        v(t === "approve" ? "approve" : t === "reject" ? "reject" : t === "cancel" ? "cancel" : "retry", e);
        return;
      }
      const a = (c = e.approval) != null && c.artifactId ? s.artifacts.find((x) => {
        var w;
        return x.id === ((w = e.approval) == null ? void 0 : w.artifactId);
      }) : void 0, o = V(e), r = f.value[o];
      (r == null ? void 0 : r.status) === "error" && r.outcome === "not-applied" && O.delete(o);
      const d = O.get(o) ?? `${o}:${Date.now()}:${++le}`;
      O.set(o, d);
      const n = {
        operationId: `${d}:attempt-${++le}`,
        idempotencyKey: d,
        conversationId: s.activeConversation,
        taskId: e.id,
        taskRevision: e.revision,
        action: (r == null ? void 0 : r.status) === "error" && r.outcome === "unknown" && t === "retry" ? r.action : t,
        ...(p = e.approval) != null && p.id ? { approvalId: e.approval.id } : {},
        artifactId: ((b = e.approval) == null ? void 0 : b.artifactId) ?? (a == null ? void 0 : a.id),
        ...(a == null ? void 0 : a.revision) === void 0 ? {} : { artifactRevision: a.revision }
      }, i = new AbortController();
      E.add(o), A.set(o, i), f.value = { ...f.value, [o]: { status: "pending", operationId: n.operationId, idempotencyKey: d, action: n.action, taskRevision: e.revision, taskStatus: e.status, approvalStatus: (M = e.approval) == null ? void 0 : M.status, approvalId: (L = e.approval) == null ? void 0 : L.id, artifactId: (a == null ? void 0 : a.id) ?? ((ye = e.approval) == null ? void 0 : ye.artifactId), artifactRevision: a == null ? void 0 : a.revision, conversationId: s.activeConversation } }, v("operation-start", n);
      try {
        const x = await s.actionHandler(n, i.signal), w = f.value[o];
        if (i.signal.aborted || !w || w.operationId !== n.operationId || x.operationId !== n.operationId) return;
        x.status === "success" ? (f.value = { ...f.value, [o]: { ...w, status: "success", message: "成功" } }, v("operation-success", n)) : (f.value = { ...f.value, [o]: { ...w, status: "error", message: x.error, outcome: x.outcome ?? "unknown" } }, v("operation-error", n, x.error));
      } catch (x) {
        if (i.signal.aborted) return;
        const w = f.value[o];
        if (!w || w.operationId !== n.operationId) return;
        const we = x instanceof Error ? x.message : "操作失败";
        f.value = { ...f.value, [o]: { ...w, status: "error", message: we, outcome: "unknown" } }, v("operation-error", n, we);
      } finally {
        E.delete(o), A.get(o) === i && A.delete(o);
      }
    }, fe = (t) => {
      const e = new Set(t.map((i) => i.id)), a = new Set(s.tasks.map((i) => i.id));
      if (e.size !== t.length || e.size !== a.size || [...e].some((i) => !a.has(i)) || t.some((i) => {
        var c;
        return (c = i.dependsOn) == null ? void 0 : c.some((p) => !e.has(p));
      })) return "任务集合或依赖无效，无法排序";
      const o = new Map(t.map((i, c) => [i.id, c]));
      if (t.some((i) => {
        var c;
        return (c = i.dependsOn) == null ? void 0 : c.some((p) => (o.get(p) ?? 1 / 0) >= o.get(i.id));
      })) return "依赖任务必须排在前面";
      const r = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), n = (i) => {
        var p;
        if (r.has(i)) return !0;
        if (d.has(i)) return !1;
        r.add(i);
        const c = t.find((b) => b.id === i);
        return (p = c == null ? void 0 : c.dependsOn) != null && p.some(n) ? !0 : (r.delete(i), d.add(i), !1);
      };
      if (t.some((i) => n(i.id))) return "任务依赖存在循环";
    }, me = I(() => fe(s.tasks)), be = (t) => {
      var o;
      const e = fe(t);
      if (e) return e;
      const a = new Map(s.tasks.map((r, d) => [r.id, d]));
      for (const [r, d] of t.entries()) {
        const n = s.tasks[a.get(d.id) ?? -1];
        if (!n) return "任务集合发生变化，无法排序";
        if (JSON.stringify(d) !== JSON.stringify(n)) return "任务数据在排序期间发生变化";
        if ((n.lockedReason || n.reorderable === !1 || ["running", "waiting-approval"].includes(n.status)) && a.get(d.id) !== r) return n.lockedReason ?? "任务当前不可移动";
        if (((o = f.value[V(n)]) == null ? void 0 : o.status) === "pending" && a.get(d.id) !== r) return "任务操作进行中，无法移动";
      }
    }, Oe = (t) => {
      const e = t, a = be(e);
      if (a) {
        v("task-move-reject", a);
        return;
      }
      v("update:tasks", e);
    }, he = I(() => s.contextItems), ke = I(() => s.tasks.filter((t) => t.status === "complete").length), ge = I(() => s.tasks.some((t) => t.status === "error") ? { key: "error", label: "需要处理" } : z.value > 0 ? { key: "waiting", label: "等待人工审批" } : s.tasks.some((t) => t.status === "running") ? { key: "running", label: "执行中" } : s.tasks.length && ke.value === s.tasks.length ? { key: "complete", label: "已完成" } : { key: "idle", label: "待开始" }), T = (t) => t, Ee = (t, e, a) => {
      const o = e + a;
      if (o < 0 || o >= t.length) return t;
      const r = [...t], [d] = r.splice(e, 1);
      return r.splice(o, 0, d), r;
    }, H = (t, e) => {
      var o, r;
      const a = t + e;
      return !!(s.disabled || a < 0 || a >= s.contextItems.length || (o = s.contextItems[t]) != null && o.disabled || (r = s.contextItems[a]) != null && r.disabled);
    }, q = (t, e) => {
      if (H(t, e)) return;
      const a = s.contextItems[t];
      !a || t + e < 0 || t + e >= s.contextItems.length || (v("update:contextItems", Ee(s.contextItems, t, e)), v("move-context", a.id, e < 0 ? "up" : "down"));
    }, _e = (t) => {
      if (s.disabled) return;
      const e = t;
      s.contextItems.some((o, r) => {
        var d;
        return o.disabled && ((d = e[r]) == null ? void 0 : d.id) !== o.id;
      }) || v("update:contextItems", e);
    }, Ke = (t, e) => v("move-task", t, e), Ue = (t, e) => v("chat-edit", t, e);
    return ee(() => [s.tasks, s.artifacts, s.activeConversation, s.actionHandler], () => {
      var t, e, a, o, r, d;
      for (const [n, i] of A) {
        const c = s.tasks.find((M) => V(M) === n);
        if (!c) {
          i.abort(), A.delete(n), E.delete(n), O.delete(n);
          continue;
        }
        const p = f.value[n], b = (t = c.approval) != null && t.artifactId ? s.artifacts.find((M) => {
          var L;
          return M.id === ((L = c.approval) == null ? void 0 : L.artifactId);
        }) : void 0;
        p && (p.taskRevision !== c.revision || p.approvalId !== ((e = c.approval) == null ? void 0 : e.id) || p.artifactId !== ((b == null ? void 0 : b.id) ?? ((a = c.approval) == null ? void 0 : a.artifactId)) || p.artifactRevision !== (b == null ? void 0 : b.revision) || p.conversationId !== s.activeConversation) && (i == null || i.abort(), i && A.delete(n), E.delete(n), O.delete(n), delete f.value[n]);
      }
      for (const n of Object.keys(f.value)) s.tasks.some((i) => V(i) === n) || delete f.value[n];
      for (const [n, i] of Object.entries(f.value)) {
        const c = s.tasks.find((b) => V(b) === n), p = (o = c == null ? void 0 : c.approval) != null && o.artifactId ? s.artifacts.find((b) => {
          var M;
          return b.id === ((M = c.approval) == null ? void 0 : M.artifactId);
        }) : void 0;
        (!c || i.conversationId !== s.activeConversation || i.taskStatus !== c.status || i.approvalStatus !== ((r = c.approval) == null ? void 0 : r.status) || i.artifactId !== ((p == null ? void 0 : p.id) ?? ((d = c.approval) == null ? void 0 : d.artifactId)) || i.artifactRevision !== (p == null ? void 0 : p.revision)) && (O.delete(n), delete f.value[n]);
      }
    }, { deep: !0 }), ee(() => s.actionHandler, (t, e) => {
      if (t !== e) {
        for (const a of A.values()) a.abort();
        A.clear(), E.clear(), f.value = {}, O.clear();
      }
    }), Ie(() => {
      for (const t of A.values()) t.abort();
    }), (t, e) => (h(), g("section", tt, [
      u("header", at, [
        u("div", null, [
          e[18] || (e[18] = u("span", { class: "aheart-ai-workbench__eyebrow" }, "智能工作区", -1)),
          u("h2", null, $(l.title), 1),
          l.description ? (h(), g("p", ot, $(l.description), 1)) : C("", !0)
        ]),
        u("div", st, [
          u("span", {
            "data-workbench-status": "",
            class: Ne(`is-${ge.value.key}`)
          }, $(ge.value.label), 3),
          u("small", nt, $(ke.value) + " / " + $(l.tasks.length) + " 已完成", 1),
          z.value > 0 ? (h(), g("button", {
            key: 0,
            type: "button",
            "data-pending-approval-summary": "",
            class: "aheart-ai-workbench__pending-summary",
            "aria-label": ve.value,
            onClick: Re
          }, $(ve.value), 9, rt)) : C("", !0)
        ])
      ]),
      u("div", it, [
        m(y(We), {
          sizes: l.panelSizes,
          "default-sizes": [150, "auto", 200],
          "onUpdate:sizes": e[13] || (e[13] = (a) => v("update:panelSizes", a))
        }, {
          default: k(() => [
            m(y(ne), {
              min: 140,
              collapsible: ""
            }, {
              default: k(() => [
                u("aside", lt, [
                  e[22] || (e[22] = u("h2", null, "会话", -1)),
                  m(xe, {
                    "model-value": l.activeConversation,
                    conversations: l.conversations,
                    "onUpdate:modelValue": e[0] || (e[0] = (a) => v("update:activeConversation", a))
                  }, null, 8, ["model-value", "conversations"]),
                  l.contextItems.length ? (h(), g("section", dt, [
                    e[21] || (e[21] = u("h3", null, "上下文", -1)),
                    m(y(Ye), {
                      items: he.value,
                      "item-key": "id",
                      group: `agent-context-${Q.value}`,
                      disabled: l.disabled,
                      "onUpdate:items": _e
                    }, {
                      item: k(({ item: a, index: o }) => [
                        u("div", {
                          class: "aheart-ai-workbench__context-item",
                          "data-context-id": T(a).id
                        }, [
                          u("span", null, $(T(a).label), 1),
                          T(a).description ? (h(), g("small", ut, $(T(a).description), 1)) : C("", !0),
                          u("div", vt, [
                            m(y(N), {
                              type: "text",
                              disabled: H(o, -1),
                              onClick: (r) => q(o, -1)
                            }, {
                              default: k(() => [...e[19] || (e[19] = [
                                P("上移", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"]),
                            m(y(N), {
                              type: "text",
                              disabled: H(o, 1),
                              onClick: (r) => q(o, 1)
                            }, {
                              default: k(() => [...e[20] || (e[20] = [
                                P("下移", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ])
                        ], 8, ct)
                      ]),
                      _: 1
                    }, 8, ["items", "group", "disabled"])
                  ])) : C("", !0)
                ])
              ]),
              _: 1
            }),
            m(y(ne), { min: 230 }, {
              default: k(() => [
                u("main", pt, [
                  l.transport ? (h(), ae($e, {
                    key: 0,
                    to: K.value ? W.value : `#${Te}`,
                    disabled: !K.value || !U.value || j.value !== "chat" || !W.value && K.value
                  }, [
                    l.transport ? (h(), ae(Qe, Fe({ key: "chat-owner" }, Me.value, {
                      transport: l.transport,
                      "conversation-id": l.activeConversation,
                      prompts: l.prompts,
                      disabled: l.disabled,
                      "onUpdate:messages": e[1] || (e[1] = (a) => v("update:messages", a)),
                      onError: e[2] || (e[2] = (a) => v("error", a)),
                      onStop: e[3] || (e[3] = (a) => v("stop")),
                      onRetry: e[4] || (e[4] = (a) => v("chat-retry", a)),
                      onRegenerate: e[5] || (e[5] = (a) => v("chat-regenerate", a)),
                      onEdit: Ue,
                      onCopy: e[6] || (e[6] = (a) => v("chat-copy", a))
                    }), null, 16, ["transport", "conversation-id", "prompts", "disabled"])) : C("", !0)
                  ], 8, ["to", "disabled"])) : C("", !0),
                  l.transport ? C("", !0) : (h(), g("p", ft, "业务层尚未提供对话传输适配器。")),
                  _(t.$slots, "sources", { sources: l.sources }, () => [
                    m(Se, { sources: l.sources }, null, 8, ["sources"])
                  ]),
                  _(t.$slots, "attachments", { attachments: l.attachments }, () => [
                    m(Ce, { items: l.attachments }, null, 8, ["items"])
                  ])
                ])
              ]),
              _: 3
            }),
            m(y(ne), {
              min: 180,
              collapsible: ""
            }, {
              default: k(() => [
                u("aside", mt, [
                  (h(), ae($e, {
                    to: K.value ? G.value : `#${ie}`,
                    disabled: !K.value || !U.value || j.value !== "execution" || !G.value
                  }, [
                    m(et, {
                      key: "execution-owner",
                      tasks: l.tasks,
                      artifacts: l.artifacts,
                      "active-artifact": l.activeArtifact,
                      disabled: l.disabled,
                      reorderable: l.reorderable,
                      "tasks-revision": l.tasksRevision,
                      "scope-key": Q.value,
                      "action-disabled": pe,
                      "operation-messages": ze.value,
                      "validate-candidate": be,
                      "onUpdate:tasks": Oe,
                      onApprove: e[7] || (e[7] = (a) => Z("approve", a)),
                      onReject: e[8] || (e[8] = (a) => Z("reject", a)),
                      onCancel: e[9] || (e[9] = (a) => Z("cancel", a)),
                      onRetry: e[10] || (e[10] = (a) => Z("retry", a)),
                      onMoveTask: Ke,
                      onMoveTaskReject: e[11] || (e[11] = (a) => v("task-move-reject", a)),
                      onSelectArtifact: e[12] || (e[12] = (a) => v("update:activeArtifact", a.id))
                    }, Je({ _: 2 }, [
                      t.$slots.task ? {
                        name: "task",
                        fn: k(({ task: a, index: o }) => [
                          _(t.$slots, "task", {
                            task: a,
                            index: o
                          })
                        ]),
                        key: "0"
                      } : void 0,
                      t.$slots.artifact ? {
                        name: "artifact",
                        fn: k(({ artifact: a }) => [
                          _(t.$slots, "artifact", { artifact: a })
                        ]),
                        key: "1"
                      } : void 0,
                      t.$slots["artifact-preview"] ? {
                        name: "artifact-preview",
                        fn: k(({ artifact: a }) => [
                          _(t.$slots, "artifact-preview", { artifact: a })
                        ]),
                        key: "2"
                      } : void 0
                    ]), 1032, ["tasks", "artifacts", "active-artifact", "disabled", "reorderable", "tasks-revision", "scope-key", "operation-messages"])
                  ], 8, ["to", "disabled"])),
                  me.value ? (h(), g("p", bt, "无法排序：" + $(me.value), 1)) : C("", !0)
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["sizes"])
      ]),
      u("div", ht, [
        m(y(Ge), {
          items: je.value,
          "active-key": J(j.value),
          "onUpdate:activeKey": e[14] || (e[14] = (a) => j.value = String(a).split("--")[0])
        }, null, 8, ["items", "active-key"]),
        oe(u("section", kt, [
          m(xe, {
            "model-value": l.activeConversation,
            conversations: l.conversations,
            "onUpdate:modelValue": e[15] || (e[15] = (a) => v("update:activeConversation", a))
          }, null, 8, ["model-value", "conversations"]),
          l.contextItems.length ? (h(), g("section", gt, [
            e[25] || (e[25] = u("h3", null, "上下文", -1)),
            u("div", yt, [
              (h(!0), g(Ze, null, qe(he.value, (a, o) => (h(), g("div", {
                key: T(a).id,
                class: "aheart-ai-workbench__context-item",
                "data-context-id": T(a).id
              }, [
                u("span", null, $(T(a).label), 1),
                T(a).description ? (h(), g("small", It, $(T(a).description), 1)) : C("", !0),
                u("div", $t, [
                  m(y(N), {
                    type: "text",
                    disabled: H(o, -1),
                    onClick: (r) => q(o, -1)
                  }, {
                    default: k(() => [...e[23] || (e[23] = [
                      P("上移", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  m(y(N), {
                    type: "text",
                    disabled: H(o, 1),
                    onClick: (r) => q(o, 1)
                  }, {
                    default: k(() => [...e[24] || (e[24] = [
                      P("下移", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ], 8, wt))), 128))
            ])
          ])) : C("", !0)
        ], 512), [
          [se, j.value === "conversations"]
        ]),
        oe(u("section", Ct, [
          u("div", xt, [
            u("div", {
              id: `${Q.value}-chat-target`,
              ref_key: "mobileChatTarget",
              ref: W,
              class: "aheart-ai-workbench__mobile-owner-target"
            }, null, 8, St)
          ]),
          l.transport ? C("", !0) : (h(), g("p", At, "业务层尚未提供对话传输适配器。")),
          _(t.$slots, "sources", { sources: l.sources }, () => [
            m(Se, { sources: l.sources }, null, 8, ["sources"])
          ]),
          _(t.$slots, "attachments", { attachments: l.attachments }, () => [
            m(Ce, { items: l.attachments }, null, 8, ["items"])
          ])
        ], 512), [
          [se, j.value === "chat"]
        ]),
        oe(u("section", Tt, [
          m(y(N), {
            "data-action": "open-execution-drawer",
            type: "primary",
            onClick: e[16] || (e[16] = (a) => D.value = !0)
          }, {
            default: k(() => [...e[26] || (e[26] = [
              P("查看执行与产物", -1)
            ])]),
            _: 1
          })
        ], 512), [
          [se, j.value === "execution"]
        ]),
        m(y(Xe), {
          open: D.value,
          "onUpdate:open": e[17] || (e[17] = (a) => D.value = a),
          title: "执行与产物",
          "get-container": !1,
          "force-render": re.value,
          "destroy-on-close": !1,
          placement: "right"
        }, {
          default: k(() => [
            u("div", {
              id: ie,
              ref_key: "mobileExecutionTarget",
              ref: G,
              class: "aheart-ai-workbench__mobile-owner-target"
            }, null, 512)
          ]),
          _: 1
        }, 8, ["open", "force-render"])
      ])
    ]));
  }
});
export {
  Ut as default
};
