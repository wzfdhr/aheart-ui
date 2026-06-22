import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode } from "vue";
import { cardMetaProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACardMeta"
  },
  __name: "meta",
  props: cardMetaProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const ARenderNode = defineComponent({
      name: "ACardMetaRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false;
    const hasAvatar = computed(() => hasRenderable(props.avatar) || Boolean(slots.avatar));
    const hasTitle = computed(() => hasRenderable(props.title) || Boolean(slots.title));
    const hasDescription = computed(() => hasRenderable(props.description) || Boolean(slots.description));
    const hasSection = computed(() => hasTitle.value || hasDescription.value || Boolean(slots.default));
    const metaClass = computed(() => {
      var _a;
      return [props.className, props.rootClassName, (_a = props.classNames) == null ? void 0 : _a.root];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-card-meta", metaClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        hasAvatar.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-card-meta__avatar", (_a = _ctx.classNames) == null ? void 0 : _a.avatar]),
          style: normalizeStyle((_b = _ctx.styles) == null ? void 0 : _b.avatar)
        }, [
          renderSlot(_ctx.$slots, "avatar", {}, () => [
            createVNode(unref(ARenderNode), { node: _ctx.avatar }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        hasSection.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["aheart-card-meta__section", (_c = _ctx.classNames) == null ? void 0 : _c.section]),
          style: normalizeStyle((_d = _ctx.styles) == null ? void 0 : _d.section)
        }, [
          hasTitle.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["aheart-card-meta__title", (_e = _ctx.classNames) == null ? void 0 : _e.title]),
            style: normalizeStyle((_f = _ctx.styles) == null ? void 0 : _f.title)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          hasDescription.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["aheart-card-meta__description", (_g = _ctx.classNames) == null ? void 0 : _g.description]),
            style: normalizeStyle((_h = _ctx.styles) == null ? void 0 : _h.description)
          }, [
            renderSlot(_ctx.$slots, "description", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          !hasTitle.value && !hasDescription.value ? renderSlot(_ctx.$slots, "default", { key: 2 }) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
