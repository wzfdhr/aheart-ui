import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createBlock, unref, createCommentVNode, Fragment, createTextVNode, toDisplayString } from "vue";
import { emptyProps, EMPTY_PRESENTED_IMAGE_SIMPLE, EMPTY_PRESENTED_IMAGE_DEFAULT } from "./types.js";
import "./style.css.js";
import { useAheartConfig } from "../config/context.js";
const _hoisted_1 = ["src"];
const _hoisted_2 = {
  key: 2,
  class: "aheart-empty__simple-image",
  "aria-hidden": "true"
};
const _hoisted_3 = {
  key: 3,
  class: "aheart-empty__default-image",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AEmpty"
  },
  __name: "empty",
  props: emptyProps,
  setup(__props) {
    const props = __props;
    const config = useAheartConfig();
    const slots = useSlots();
    const AEmptyRenderNode = defineComponent({
      name: "AEmptyRenderNode",
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
    const isPresetImage = (value) => {
      return value === EMPTY_PRESENTED_IMAGE_DEFAULT || value === EMPTY_PRESENTED_IMAGE_SIMPLE;
    };
    const imageUrl = computed(() => {
      return typeof props.image === "string" && props.image && !isPresetImage(props.image) ? props.image : void 0;
    });
    const showImage = computed(() => Boolean(slots.image) || props.image !== false);
    const isSimpleImage = computed(() => props.image === EMPTY_PRESENTED_IMAGE_SIMPLE);
    const hasCustomImageNode = computed(() => {
      return props.image !== void 0 && props.image !== false && !imageUrl.value && !isPresetImage(props.image);
    });
    const hasDescriptionProp = computed(() => props.description !== void 0 && props.description !== false);
    const fallbackDescription = computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) || "No Data";
    });
    const showDescription = computed(() => Boolean(slots.description) || props.description !== false);
    const emptyClass = computed(() => {
      var _a;
      return [props.className, props.rootClassName, (_a = props.classNames) == null ? void 0 : _a.root];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const imageClass = computed(() => {
      var _a;
      return ["aheart-empty__image", (_a = props.classNames) == null ? void 0 : _a.image];
    });
    const imageStyleValue = computed(() => {
      var _a;
      return [props.imageStyle, (_a = props.styles) == null ? void 0 : _a.image];
    });
    const descriptionClass = computed(() => {
      var _a;
      return ["aheart-empty__description", (_a = props.classNames) == null ? void 0 : _a.description];
    });
    const descriptionStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const footerClass = computed(() => {
      var _a;
      return ["aheart-empty__footer", (_a = props.classNames) == null ? void 0 : _a.footer];
    });
    const footerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.footer;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-empty", emptyClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        showImage.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(imageClass.value),
          style: normalizeStyle(imageStyleValue.value)
        }, [
          renderSlot(_ctx.$slots, "image", {}, () => [
            imageUrl.value ? (openBlock(), createElementBlock("img", {
              key: 0,
              class: "aheart-empty__image-element",
              src: imageUrl.value,
              alt: ""
            }, null, 8, _hoisted_1)) : hasCustomImageNode.value ? (openBlock(), createBlock(unref(AEmptyRenderNode), {
              key: 1,
              node: _ctx.image
            }, null, 8, ["node"])) : isSimpleImage.value ? (openBlock(), createElementBlock("span", _hoisted_2, "∅")) : (openBlock(), createElementBlock("span", _hoisted_3, "∅"))
          ])
        ], 6)) : createCommentVNode("", true),
        showDescription.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(descriptionClass.value),
          style: normalizeStyle(descriptionStyle.value)
        }, [
          renderSlot(_ctx.$slots, "description", {}, () => [
            hasDescriptionProp.value ? (openBlock(), createBlock(unref(AEmptyRenderNode), {
              key: 0,
              node: _ctx.description
            }, null, 8, ["node"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createTextVNode(toDisplayString(fallbackDescription.value), 1)
            ], 64))
          ])
        ], 6)) : createCommentVNode("", true),
        _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(footerClass.value),
          style: normalizeStyle(footerStyle.value)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
