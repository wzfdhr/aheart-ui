"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
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
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AEmpty"
  },
  __name: "empty",
  props: types.emptyProps,
  setup(__props) {
    const props = __props;
    const config = context.useAheartConfig();
    const slots = vue.useSlots();
    const AEmptyRenderNode = vue.defineComponent({
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
      return value === types.EMPTY_PRESENTED_IMAGE_DEFAULT || value === types.EMPTY_PRESENTED_IMAGE_SIMPLE;
    };
    const imageUrl = vue.computed(() => {
      return typeof props.image === "string" && props.image && !isPresetImage(props.image) ? props.image : void 0;
    });
    const showImage = vue.computed(() => Boolean(slots.image) || props.image !== false);
    const isSimpleImage = vue.computed(() => props.image === types.EMPTY_PRESENTED_IMAGE_SIMPLE);
    const hasCustomImageNode = vue.computed(() => {
      return props.image !== void 0 && props.image !== false && !imageUrl.value && !isPresetImage(props.image);
    });
    const hasDescriptionProp = vue.computed(() => props.description !== void 0 && props.description !== false);
    const fallbackDescription = vue.computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) || "No Data";
    });
    const showDescription = vue.computed(() => Boolean(slots.description) || props.description !== false);
    const emptyClass = vue.computed(() => {
      var _a;
      return [props.className, props.rootClassName, (_a = props.classNames) == null ? void 0 : _a.root];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const imageClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__image", (_a = props.classNames) == null ? void 0 : _a.image];
    });
    const imageStyleValue = vue.computed(() => {
      var _a;
      return [props.imageStyle, (_a = props.styles) == null ? void 0 : _a.image];
    });
    const descriptionClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__description", (_a = props.classNames) == null ? void 0 : _a.description];
    });
    const descriptionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const footerClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__footer", (_a = props.classNames) == null ? void 0 : _a.footer];
    });
    const footerStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.footer;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-empty", emptyClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        showImage.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(imageClass.value),
          style: vue.normalizeStyle(imageStyleValue.value)
        }, [
          vue.renderSlot(_ctx.$slots, "image", {}, () => [
            imageUrl.value ? (vue.openBlock(), vue.createElementBlock("img", {
              key: 0,
              class: "aheart-empty__image-element",
              src: imageUrl.value,
              alt: ""
            }, null, 8, _hoisted_1)) : hasCustomImageNode.value ? (vue.openBlock(), vue.createBlock(vue.unref(AEmptyRenderNode), {
              key: 1,
              node: _ctx.image
            }, null, 8, ["node"])) : isSimpleImage.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, "∅")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "∅"))
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showDescription.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(descriptionClass.value),
          style: vue.normalizeStyle(descriptionStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "description", {}, () => [
            hasDescriptionProp.value ? (vue.openBlock(), vue.createBlock(vue.unref(AEmptyRenderNode), {
              key: 0,
              node: _ctx.description
            }, null, 8, ["node"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              vue.createTextVNode(vue.toDisplayString(fallbackDescription.value), 1)
            ], 64))
          ])
        ], 6)) : vue.createCommentVNode("", true),
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(footerClass.value),
          style: vue.normalizeStyle(footerStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
