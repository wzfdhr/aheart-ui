import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString, createVNode, unref, createCommentVNode, renderSlot } from "vue";
import _sfc_main$3 from "./attachments.vue.js";
import _sfc_main$1 from "./process.vue.js";
import _sfc_main$2 from "./sources.vue.js";
import { renderSafeMarkdown } from "./safe-markdown.js";
const _hoisted_1 = { class: "aheart-ai-bubble__header" };
const _hoisted_2 = { class: "aheart-ai-bubble__content" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-bubble__error"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIBubble" },
  __name: "bubble",
  props: {
    message: {},
    contentRenderer: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const roleLabel = computed(() => ({ user: "你", assistant: "AI 助手", system: "系统", tool: "工具" })[props.message.role]);
    const contentNode = computed(() => {
      var _a;
      return ((_a = props.contentRenderer) == null ? void 0 : _a.call(props, props.message)) ?? renderSafeMarkdown(props.message.content);
    });
    const AIBubbleRenderNode = defineComponent({
      name: "AIBubbleRenderNode",
      props: {
        node: { type: null, default: void 0 }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", {
        class: normalizeClass(["aheart-ai-bubble", `is-${__props.message.role}`])
      }, [
        createElementVNode("header", _hoisted_1, toDisplayString(roleLabel.value), 1),
        createElementVNode("p", _hoisted_2, [
          createVNode(unref(AIBubbleRenderNode), { node: contentNode.value }, null, 8, ["node"])
        ]),
        __props.message.error ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(__props.message.error), 1)) : createCommentVNode("", true),
        createVNode(_sfc_main$1, {
          items: __props.message.process
        }, null, 8, ["items"]),
        createVNode(_sfc_main$2, {
          sources: __props.message.sources
        }, null, 8, ["sources"]),
        createVNode(_sfc_main$3, {
          items: __props.message.attachments
        }, null, 8, ["items"]),
        renderSlot(_ctx.$slots, "actions", { message: __props.message })
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
