import { defineComponent as d, computed as c, openBlock as s, createElementBlock as a, normalizeClass as y, createElementVNode as t, toDisplayString as l, createVNode as r, unref as h, Fragment as i, createCommentVNode as n, renderSlot as f } from "vue";
import S from "./attachments.vue.js";
import k from "./process.vue.js";
import N from "./sources.vue.js";
import { renderSafeMarkdown as A } from "./safe-markdown.js";
const B = { class: "aheart-ai-bubble__header" }, $ = { class: "aheart-ai-bubble__content" }, I = {
  key: 0,
  class: "aheart-ai-bubble__tool-call",
  "aria-label": "工具调用摘要"
}, R = { class: "aheart-ai-bubble__tool-heading" }, v = { class: "aheart-ai-bubble__tool-details" }, V = { key: 0 }, E = { key: 0 }, F = {
  key: 1,
  class: "aheart-ai-bubble__error"
}, M = /* @__PURE__ */ d({
  name: "AAIBubble",
  __name: "bubble",
  props: {
    message: {},
    contentRenderer: { type: Function }
  },
  setup(e) {
    const o = e, b = c(() => ({ user: "你", assistant: "AI 助手", system: "系统", tool: "工具" })[o.message.role]), g = c(() => {
      var m;
      return o.message.toolCall ? "" : ((m = o.contentRenderer) == null ? void 0 : m.call(o, o.message)) ?? A(o.message.content);
    }), C = d({
      name: "AIBubbleRenderNode",
      props: {
        node: { type: null, default: void 0 }
      },
      setup(m) {
        return () => m.node;
      }
    });
    return (m, u) => (s(), a("article", {
      class: y(["aheart-ai-bubble", `is-${e.message.role}`])
    }, [
      t("header", B, l(b.value), 1),
      t("p", $, [
        r(h(C), { node: g.value }, null, 8, ["node"])
      ]),
      e.message.toolCall ? (s(), a("section", I, [
        t("header", R, [
          t("strong", null, l(e.message.toolCall.name), 1),
          t("span", null, l(e.message.toolCall.summary), 1)
        ]),
        t("dl", v, [
          e.message.toolCall.inputSummary || e.message.toolCall.inputStatus ? (s(), a(i, { key: 0 }, [
            u[0] || (u[0] = t("dt", null, "输入", -1)),
            t("dd", null, [
              t("span", null, l(e.message.toolCall.inputSummary), 1),
              e.message.toolCall.inputStatus ? (s(), a("small", V, l(e.message.toolCall.inputStatus), 1)) : n("", !0)
            ])
          ], 64)) : n("", !0),
          e.message.toolCall.resultSummary || e.message.toolCall.resultStatus ? (s(), a(i, { key: 1 }, [
            u[1] || (u[1] = t("dt", null, "结果", -1)),
            t("dd", null, [
              t("span", null, l(e.message.toolCall.resultSummary), 1),
              e.message.toolCall.resultStatus ? (s(), a("small", E, l(e.message.toolCall.resultStatus), 1)) : n("", !0)
            ])
          ], 64)) : n("", !0),
          e.message.toolCall.error ? (s(), a(i, { key: 2 }, [
            u[2] || (u[2] = t("dt", null, "错误", -1)),
            t("dd", null, l(e.message.toolCall.error), 1)
          ], 64)) : n("", !0)
        ])
      ])) : n("", !0),
      e.message.error ? (s(), a("p", F, l(e.message.error), 1)) : n("", !0),
      r(k, {
        items: e.message.process
      }, null, 8, ["items"]),
      r(N, {
        sources: e.message.sources
      }, null, 8, ["sources"]),
      r(S, {
        items: e.message.attachments
      }, null, 8, ["items"]),
      f(m.$slots, "actions", { message: e.message })
    ], 2));
  }
});
export {
  M as default
};
