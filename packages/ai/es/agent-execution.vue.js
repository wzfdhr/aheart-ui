import { defineComponent as fa, computed as w, openBlock as r, createElementBlock as l, createElementVNode as o, toDisplayString as n, createCommentVNode as i, Fragment as N, createVNode as S, unref as k, withCtx as y, createTextVNode as m, renderSlot as x, normalizeClass as D, normalizeStyle as ga, createBlock as ia, renderList as wa } from "vue";
import { Button as C } from "aheart-ui";
import { SortableList as ma } from "@aheart-ui/dnd";
import { getSafeUrl as da } from "./safe-markdown.js";
const Ca = { class: "aheart-ai-workbench__execution-content" }, $a = {
  key: 0,
  class: "aheart-ai-workbench__mobile-priority",
  role: "region",
  "aria-label": "移动端优先处理"
}, Aa = { class: "aheart-ai-workbench__priority-heading" }, ja = { class: "aheart-ai-workbench__eyebrow" }, Sa = { key: 0 }, Ba = { key: 1 }, Ia = {
  key: 0,
  class: "aheart-ai-workbench__priority-approval"
}, Ma = { key: 0 }, Ka = { class: "aheart-ai-workbench__priority-actions" }, Ra = {
  key: 1,
  class: "aheart-ai-workbench__approval-result"
}, za = ["aria-label"], La = { key: 0 }, Na = ["aria-label"], xa = { key: 0 }, Da = ["aria-labelledby"], Ta = { class: "aheart-ai-workbench__section-heading" }, Va = ["id"], Ea = { class: "aheart-ai-workbench__timeline" }, Fa = ["data-task-id"], Ha = { class: "aheart-ai-workbench__task-body" }, Ua = { class: "aheart-ai-workbench__task-summary" }, Pa = {
  key: 0,
  class: "aheart-ai-workbench__tool-name"
}, Wa = { class: "aheart-ai-workbench__task-status" }, Za = {
  key: 0,
  class: "aheart-ai-workbench__task-detail"
}, qa = {
  key: 1,
  class: "aheart-ai-workbench__tool-call",
  "aria-label": "工具调用摘要"
}, Ga = { key: 0 }, Ja = { key: 1 }, Oa = { key: 2 }, Qa = {
  key: 2,
  class: "aheart-ai-workbench__task-lock-reason",
  role: "status"
}, Xa = {
  key: 3,
  class: "aheart-ai-workbench__task-lock-reason",
  role: "status"
}, Ya = {
  key: 4,
  class: "aheart-ai-workbench__task-lock-reason",
  role: "status"
}, ae = {
  key: 5,
  class: "aheart-ai-workbench__task-progress"
}, ee = ["aria-valuenow"], te = {
  key: 6,
  class: "aheart-ai-workbench__task-time"
}, se = { key: 0 }, oe = { key: 1 }, re = {
  key: 7,
  class: "aheart-ai-workbench__task-error"
}, le = { class: "aheart-ai-workbench__task-actions" }, ne = {
  key: 8,
  class: "aheart-ai-workbench__operation-status",
  role: "status"
}, ie = ["data-approval-id"], de = { key: 0 }, ce = {
  key: 1,
  class: "aheart-ai-workbench__approval-result"
}, ue = {
  key: 0,
  class: "aheart-ai-workbench__empty"
}, pe = ["aria-labelledby"], ve = { class: "aheart-ai-workbench__section-heading" }, _e = ["id"], ke = {
  key: 0,
  class: "aheart-ai-workbench__artifact-list"
}, he = ["data-artifact-id"], be = ["aria-pressed", "onClick"], ye = { key: 0 }, fe = {
  key: 1,
  class: "aheart-ai-workbench__empty"
}, ge = {
  key: 2,
  class: "aheart-ai-workbench__artifact-preview",
  "aria-label": "产物预览"
}, we = { class: "aheart-ai-workbench__artifact-preview-header" }, me = ["href"], Ce = { key: 0 }, Be = /* @__PURE__ */ fa({
  name: "AIAgentWorkbenchExecution",
  __name: "agent-execution",
  props: {
    tasks: { default: () => [] },
    artifacts: { default: () => [] },
    activeArtifact: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    reorderable: { type: Boolean, default: !0 },
    tasksRevision: {},
    scopeKey: { default: "default" },
    actionDisabled: { type: Function, default: () => !1 },
    operationMessages: { default: () => ({}) },
    validateCandidate: { type: Function, default: () => {
    } }
  },
  emits: ["update:tasks", "approve", "reject", "cancel", "retry", "move-task", "move-task-reject", "select-artifact"],
  setup(v, { emit: ca }) {
    const d = v, T = w(() => `aheart-agent-execution-${String(d.scopeKey ?? "default").replace(/[^a-zA-Z0-9_-]/g, "-")}`), V = w(() => `${T.value}-tasks`), E = w(() => `${T.value}-artifacts`), _ = ca, ua = {
      pending: "等待执行",
      running: "执行中",
      "waiting-approval": "等待审批",
      complete: "已完成",
      error: "执行失败",
      cancelled: "已取消"
    }, pa = w(() => d.tasks.map((t, s) => ({ ...t, __sortableKey: `${t.id}::${s}` }))), c = w(
      () => d.artifacts.find((t) => t.id === d.activeArtifact) ?? d.artifacts[0]
    ), u = w(
      () => d.tasks.find((t) => t.approval && (!t.approval.status || t.approval.status === "pending")) ?? d.tasks.find((t) => t.approval)
    ), $ = w(
      () => d.artifacts.find((t) => {
        var s, p;
        return t.id === ((p = (s = u.value) == null ? void 0 : s.approval) == null ? void 0 : p.artifactId);
      }) ?? c.value
    ), va = w(() => {
      var t;
      return (t = u.value) != null && t.approval && (!u.value.approval.status || u.value.approval.status === "pending") ? "等待审批" : u.value ? "审批结果" : "当前产物";
    }), e = (t) => t, h = (t) => t.toolCall, K = (t) => {
      var s;
      return `${t.id}:${String(t.revision ?? "")}:${((s = t.approval) == null ? void 0 : s.id) ?? ""}`;
    }, _a = (t) => {
      _("move-task-reject", {
        "stale-revision": "任务版本已变化，排序已拒绝",
        "source-missing": "源任务已不存在，排序已拒绝",
        "target-missing": "目标位置已不存在，排序已拒绝",
        "duplicate-key": "任务标识重复，无法排序",
        "group-mismatch": "任务不属于当前排序分组",
        disabled: "任务当前不可排序，排序已拒绝",
        "invalid-position": "目标位置无效，排序已拒绝",
        "parent-rejected": "任务版本已变化，排序已拒绝",
        "rollback-rejected": "排序回滚失败，请刷新后重试",
        unmounted: "排序目标已卸载",
        cancelled: "排序已取消"
      }[t.reason ?? ""] ?? "任务当前不可排序，排序已拒绝");
    }, ka = (t) => ua[t], ha = (t) => t.status, ba = (t) => ka(t.status), R = (t) => Math.min(100, Math.max(0, Math.round(t ?? 0))), ya = (t) => {
      var s;
      if (!d.disabled && d.reorderable) {
        const p = t.map(({ __sortableKey: B, ...j }) => j), f = (s = d.validateCandidate) == null ? void 0 : s.call(d, p);
        if (f) {
          _("move-task-reject", f);
          return;
        }
        _("update:tasks", p);
      }
    }, F = (t, s) => {
      var j;
      if (z(d.tasks[t], t, s)) return;
      const p = [...d.tasks], [f] = p.splice(t, 1);
      p.splice(t + s, 0, f);
      const B = (j = d.validateCandidate) == null ? void 0 : j.call(d, p);
      if (B) {
        _("move-task-reject", B);
        return;
      }
      _("update:tasks", p), _("move-task", f.id, s < 0 ? "up" : "down");
    }, A = (t, s) => {
      var p;
      return d.disabled || !!((p = d.actionDisabled) != null && p.call(d, t, s));
    }, z = (t, s, p) => !!(d.disabled || !d.reorderable || s + p < 0 || s + p >= d.tasks.length || (t == null ? void 0 : t.reorderable) === !1 || t != null && t.lockedReason || (t == null ? void 0 : t.status) === "running" || (t == null ? void 0 : t.status) === "waiting-approval");
    return (t, s) => {
      var p, f, B, j, H, U;
      return r(), l("div", Ca, [
        u.value || c.value ? (r(), l("section", $a, [
          o("div", Aa, [
            o("span", ja, n(va.value), 1),
            u.value ? (r(), l("strong", Sa, n((p = u.value.approval) == null ? void 0 : p.title), 1)) : (r(), l("strong", Ba, "查看当前产物"))
          ]),
          u.value ? (r(), l("div", Ia, [
            (f = u.value.approval) != null && f.description ? (r(), l("p", Ma, n(u.value.approval.description), 1)) : i("", !0),
            o("div", Ka, [
              !((B = u.value.approval) != null && B.status) || u.value.approval.status === "pending" ? (r(), l(N, { key: 0 }, [
                S(k(C), {
                  "data-action": "approve",
                  type: "primary",
                  disabled: A(u.value, "approve"),
                  onClick: s[0] || (s[0] = (a) => _("approve", u.value))
                }, {
                  default: y(() => [...s[4] || (s[4] = [
                    m("批准", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                S(k(C), {
                  "data-action": "reject",
                  danger: "",
                  disabled: A(u.value, "reject"),
                  onClick: s[1] || (s[1] = (a) => _("reject", u.value))
                }, {
                  default: y(() => [...s[5] || (s[5] = [
                    m("拒绝", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ], 64)) : (r(), l("span", Ra, n(u.value.approval.status === "approved" ? "已批准" : "已拒绝"), 1))
            ])
          ])) : i("", !0),
          $.value ? (r(), l("button", {
            key: 1,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "approval",
            "aria-label": $.value.title,
            onClick: s[2] || (s[2] = (a) => _("select-artifact", $.value))
          }, [
            o("span", null, n((H = (j = u.value) == null ? void 0 : j.approval) != null && H.artifactId ? "审批对象" : "当前产物"), 1),
            o("strong", null, n($.value.title), 1),
            $.value.description ? (r(), l("small", La, n($.value.description), 1)) : i("", !0)
          ], 8, za)) : i("", !0),
          c.value && c.value.id !== ((U = $.value) == null ? void 0 : U.id) ? (r(), l("button", {
            key: 2,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "current",
            "aria-label": c.value.title,
            onClick: s[3] || (s[3] = (a) => _("select-artifact", c.value))
          }, [
            s[6] || (s[6] = o("span", null, "当前产物", -1)),
            o("strong", null, n(c.value.title), 1),
            c.value.description ? (r(), l("small", xa, n(c.value.description), 1)) : i("", !0)
          ], 8, Na)) : i("", !0)
        ])) : i("", !0),
        o("section", {
          class: "aheart-ai-workbench__tasks",
          "aria-labelledby": V.value
        }, [
          o("div", Ta, [
            o("div", null, [
              s[7] || (s[7] = o("span", { class: "aheart-ai-workbench__eyebrow" }, "执行流程", -1)),
              o("h2", { id: V.value }, "执行时间线", 8, Va)
            ]),
            o("span", null, n(v.tasks.length) + " 项", 1)
          ]),
          o("div", Ea, [
            S(k(ma), {
              items: pa.value,
              "item-key": "__sortableKey",
              disabled: v.disabled || !v.reorderable,
              revision: v.tasksRevision,
              group: `agent-tasks-${v.scopeKey}`,
              "onUpdate:items": ya,
              onMoveReject: _a
            }, {
              item: y(({ item: a, index: g }) => [
                x(t.$slots, "task", {
                  task: e(a),
                  index: g
                }, () => {
                  var I, L, P, W, Z, q, G, J, O, Q, X, Y, aa, ea, ta, sa, oa, ra, la, na;
                  return [
                    o("article", {
                      "data-task-id": e(a).id,
                      class: D(["aheart-ai-workbench__timeline-item", [`is-${ha(e(a))}`, { "has-approval-summary": !!e(a).approval }]])
                    }, [
                      s[15] || (s[15] = o("span", {
                        class: "aheart-ai-workbench__timeline-marker",
                        "aria-hidden": "true"
                      }, null, -1)),
                      o("div", Ha, [
                        o("header", Ua, [
                          o("div", null, [
                            o("strong", null, n(e(a).label), 1),
                            e(a).toolName ? (r(), l("span", Pa, n(e(a).toolName), 1)) : i("", !0)
                          ]),
                          o("span", Wa, n(ba(e(a))), 1)
                        ]),
                        e(a).detail && !h(e(a)) ? (r(), l("p", Za, n(e(a).detail), 1)) : i("", !0),
                        h(e(a)) ? (r(), l("section", qa, [
                          o("strong", null, n((I = h(e(a))) == null ? void 0 : I.name), 1),
                          o("span", null, n((L = h(e(a))) == null ? void 0 : L.summary), 1),
                          (P = h(e(a))) != null && P.inputSummary ? (r(), l("small", Ga, n((W = h(e(a))) == null ? void 0 : W.inputSummary), 1)) : i("", !0),
                          (Z = h(e(a))) != null && Z.resultSummary ? (r(), l("small", Ja, n((q = h(e(a))) == null ? void 0 : q.resultSummary), 1)) : i("", !0),
                          (G = h(e(a))) != null && G.error ? (r(), l("small", Oa, n((J = h(e(a))) == null ? void 0 : J.error), 1)) : i("", !0)
                        ])) : i("", !0),
                        e(a).lockedReason || ((O = v.operationMessages) == null ? void 0 : O[K(e(a))]) === "" ? (r(), l("p", Qa, n(e(a).lockedReason), 1)) : i("", !0),
                        e(a).revision === void 0 && A(e(a), "approve") ? (r(), l("p", Xa, "缺少任务版本")) : i("", !0),
                        (Q = e(a).approval) != null && Q.artifactId && (!v.artifacts.some((b) => {
                          var M;
                          return b.id === ((M = e(a).approval) == null ? void 0 : M.artifactId);
                        }) || v.artifacts.some((b) => {
                          var M;
                          return b.id === ((M = e(a).approval) == null ? void 0 : M.artifactId) && b.revision === void 0;
                        })) ? (r(), l("p", Ya, "缺少产物版本")) : i("", !0),
                        e(a).progress !== void 0 ? (r(), l("div", ae, [
                          o("div", {
                            role: "progressbar",
                            "aria-label": "任务进度",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            "aria-valuenow": R(e(a).progress)
                          }, [
                            o("span", {
                              style: ga({ inlineSize: `${R(e(a).progress)}%` })
                            }, null, 4)
                          ], 8, ee),
                          o("small", null, n(R(e(a).progress)) + "%", 1)
                        ])) : i("", !0),
                        e(a).startedAt || e(a).completedAt ? (r(), l("div", te, [
                          e(a).startedAt ? (r(), l("span", se, "开始 " + n(e(a).startedAt), 1)) : i("", !0),
                          e(a).completedAt ? (r(), l("span", oe, "完成 " + n(e(a).completedAt), 1)) : i("", !0)
                        ])) : i("", !0),
                        e(a).error ? (r(), l("details", re, [
                          s[8] || (s[8] = o("summary", null, "查看错误详情", -1)),
                          o("p", null, n(e(a).error), 1)
                        ])) : i("", !0),
                        o("div", le, [
                          e(a).status === "running" ? (r(), ia(k(C), {
                            key: 0,
                            "data-action": "cancel",
                            type: "text",
                            disabled: A(e(a), "cancel"),
                            onClick: (b) => _("cancel", e(a))
                          }, {
                            default: y(() => [...s[9] || (s[9] = [
                              m("取消", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])) : i("", !0),
                          e(a).status === "error" || (X = v.operationMessages) != null && X[K(e(a))] ? (r(), ia(k(C), {
                            key: 1,
                            "data-action": "retry",
                            type: "text",
                            disabled: A(e(a), "retry"),
                            onClick: (b) => _("retry", e(a))
                          }, {
                            default: y(() => [...s[10] || (s[10] = [
                              m("重试", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])) : i("", !0),
                          S(k(C), {
                            "data-action": "move-up",
                            type: "text",
                            disabled: z(e(a), g, -1),
                            onClick: (b) => F(g, -1)
                          }, {
                            default: y(() => [...s[11] || (s[11] = [
                              m("上移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"]),
                          S(k(C), {
                            "data-action": "move-down",
                            type: "text",
                            disabled: z(e(a), g, 1),
                            onClick: (b) => F(g, 1)
                          }, {
                            default: y(() => [...s[12] || (s[12] = [
                              m("下移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])
                        ]),
                        (Y = v.operationMessages) != null && Y[K(e(a))] ? (r(), l("p", ne, n(v.operationMessages[K(e(a))]), 1)) : i("", !0),
                        e(a).approval ? (r(), l("div", {
                          key: 9,
                          "data-approval-id": (aa = e(a).approval) == null ? void 0 : aa.id,
                          class: D(["aheart-ai-workbench__approval", `is-${((ea = e(a).approval) == null ? void 0 : ea.status) ?? "pending"}`])
                        }, [
                          o("div", null, [
                            o("strong", null, n((ta = e(a).approval) == null ? void 0 : ta.title), 1),
                            (sa = e(a).approval) != null && sa.description ? (r(), l("p", de, n((oa = e(a).approval) == null ? void 0 : oa.description), 1)) : i("", !0)
                          ]),
                          !((ra = e(a).approval) != null && ra.status) || ((la = e(a).approval) == null ? void 0 : la.status) === "pending" ? (r(), l(N, { key: 0 }, [
                            S(k(C), {
                              "data-action": "approve",
                              type: "primary",
                              disabled: A(e(a), "approve"),
                              onClick: (b) => _("approve", e(a))
                            }, {
                              default: y(() => [...s[13] || (s[13] = [
                                m("批准", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"]),
                            S(k(C), {
                              "data-action": "reject",
                              danger: "",
                              disabled: A(e(a), "reject"),
                              onClick: (b) => _("reject", e(a))
                            }, {
                              default: y(() => [...s[14] || (s[14] = [
                                m("拒绝", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ], 64)) : (r(), l("span", ce, n(((na = e(a).approval) == null ? void 0 : na.status) === "approved" ? "已批准" : "已拒绝"), 1))
                        ], 10, ie)) : i("", !0)
                      ])
                    ], 10, Fa)
                  ];
                })
              ]),
              _: 3
            }, 8, ["items", "disabled", "revision", "group"])
          ]),
          v.tasks.length ? i("", !0) : (r(), l("p", ue, "尚无执行任务。"))
        ], 8, Da),
        o("section", {
          class: "aheart-ai-workbench__artifacts",
          "aria-labelledby": E.value
        }, [
          o("div", ve, [
            o("div", null, [
              s[16] || (s[16] = o("span", { class: "aheart-ai-workbench__eyebrow" }, "产物输出", -1)),
              o("h2", { id: E.value }, "产物", 8, _e)
            ]),
            o("span", null, n(v.artifacts.length) + " 项", 1)
          ]),
          v.artifacts.length ? (r(), l("ul", ke, [
            (r(!0), l(N, null, wa(v.artifacts, (a) => {
              var g, I;
              return r(), l("li", {
                key: a.id,
                "data-artifact-id": a.id,
                class: D({ "is-active": a.id === ((g = c.value) == null ? void 0 : g.id) })
              }, [
                o("button", {
                  type: "button",
                  "aria-pressed": a.id === ((I = c.value) == null ? void 0 : I.id),
                  onClick: (L) => _("select-artifact", a)
                }, [
                  x(t.$slots, "artifact", { artifact: a }, () => [
                    o("span", null, n(a.title), 1),
                    a.description ? (r(), l("small", ye, n(a.description), 1)) : i("", !0)
                  ])
                ], 8, be)
              ], 10, he);
            }), 128))
          ])) : (r(), l("p", fe, "任务完成后，产物会出现在这里。")),
          c.value ? (r(), l("section", ge, [
            x(t.$slots, "artifact-preview", { artifact: c.value }, () => [
              o("div", we, [
                o("div", null, [
                  o("span", null, n(c.value.type ?? "文件"), 1),
                  o("h3", null, n(c.value.title), 1)
                ]),
                k(da)(c.value.url) ? (r(), l("a", {
                  key: 0,
                  href: k(da)(c.value.url),
                  target: "_blank",
                  rel: "noreferrer"
                }, "打开产物", 8, me)) : i("", !0)
              ]),
              o("p", null, n(c.value.description ?? "业务层可通过 artifact-preview 插槽提供自定义预览。"), 1),
              c.value.updatedAt ? (r(), l("small", Ce, "更新于 " + n(c.value.updatedAt), 1)) : i("", !0)
            ])
          ])) : i("", !0)
        ], 8, pe)
      ]);
    };
  }
});
export {
  Be as default
};
