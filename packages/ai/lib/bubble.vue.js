"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const attachments_vue_vue_type_script_setup_true_lang = require("./attachments.vue.js");
const process_vue_vue_type_script_setup_true_lang = require("./process.vue.js");
const sources_vue_vue_type_script_setup_true_lang = require("./sources.vue.js");
const safeMarkdown = require("./safe-markdown.js");
const _hoisted_1 = { class: "aheart-ai-bubble__header" };
const _hoisted_2 = { class: "aheart-ai-bubble__content" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-bubble__error"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIBubble" },
  __name: "bubble",
  props: {
    message: {},
    contentRenderer: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const roleLabel = vue.computed(() => ({ user: "你", assistant: "AI 助手", system: "系统", tool: "工具" })[props.message.role]);
    const contentNode = vue.computed(() => {
      var _a;
      return ((_a = props.contentRenderer) == null ? void 0 : _a.call(props, props.message)) ?? safeMarkdown.renderSafeMarkdown(props.message.content);
    });
    const AIBubbleRenderNode = vue.defineComponent({
      name: "AIBubbleRenderNode",
      props: {
        node: { type: null, default: void 0 }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("article", {
        class: vue.normalizeClass(["aheart-ai-bubble", `is-${__props.message.role}`])
      }, [
        vue.createElementVNode("header", _hoisted_1, vue.toDisplayString(roleLabel.value), 1),
        vue.createElementVNode("p", _hoisted_2, [
          vue.createVNode(vue.unref(AIBubbleRenderNode), { node: contentNode.value }, null, 8, ["node"])
        ]),
        __props.message.error ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_3, vue.toDisplayString(__props.message.error), 1)) : vue.createCommentVNode("", true),
        vue.createVNode(process_vue_vue_type_script_setup_true_lang.default, {
          items: __props.message.process
        }, null, 8, ["items"]),
        vue.createVNode(sources_vue_vue_type_script_setup_true_lang.default, {
          sources: __props.message.sources
        }, null, 8, ["sources"]),
        vue.createVNode(attachments_vue_vue_type_script_setup_true_lang.default, {
          items: __props.message.attachments
        }, null, 8, ["items"]),
        vue.renderSlot(_ctx.$slots, "actions", { message: __props.message })
      ], 2);
    };
  }
});
exports.default = _sfc_main;
