"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-skeleton__content" };
const _hoisted_2 = {
  key: 1,
  class: "aheart-skeleton__paragraph"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASkeleton"
  },
  __name: "skeleton",
  props: types.skeletonProps,
  setup(__props) {
    const props = __props;
    const toCssValue = (value) => {
      if (typeof value === "number") {
        return `${value}px`;
      }
      return value;
    };
    const avatarConfig = vue.computed(() => {
      if (!props.avatar) {
        return void 0;
      }
      return typeof props.avatar === "boolean" ? { size: 32, shape: "circle" } : { shape: "circle", ...props.avatar };
    });
    const titleConfig = vue.computed(() => {
      if (!props.title) {
        return void 0;
      }
      return typeof props.title === "boolean" ? { width: "38%" } : props.title;
    });
    const paragraphConfig = vue.computed(() => {
      if (!props.paragraph) {
        return void 0;
      }
      return typeof props.paragraph === "boolean" ? { rows: 3 } : props.paragraph;
    });
    const skeletonClass = vue.computed(() => ({
      "is-active": props.active,
      "is-round": props.round
    }));
    const avatarStyle = vue.computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = avatarConfig.value) == null ? void 0 : _a.size),
        height: toCssValue((_b = avatarConfig.value) == null ? void 0 : _b.size)
      };
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return {
        width: toCssValue((_a = titleConfig.value) == null ? void 0 : _a.width)
      };
    });
    const paragraphRows = vue.computed(() => {
      var _a;
      return Array.from({ length: ((_a = paragraphConfig.value) == null ? void 0 : _a.rows) ?? 3 }, (_, index) => index + 1);
    });
    const getParagraphRowStyle = (row) => {
      var _a;
      const width = (_a = paragraphConfig.value) == null ? void 0 : _a.width;
      const rowWidth = Array.isArray(width) ? width[row - 1] : row === paragraphRows.value.length ? width : void 0;
      return {
        width: toCssValue(rowWidth)
      };
    };
    return (_ctx, _cache) => {
      return !_ctx.loading ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(["aheart-skeleton", skeletonClass.value]),
        "aria-busy": "true"
      }, [
        avatarConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-skeleton__avatar", `aheart-skeleton__avatar--${avatarConfig.value.shape}`]),
          style: vue.normalizeStyle(avatarStyle.value),
          "aria-hidden": "true"
        }, null, 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_1, [
          titleConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: "aheart-skeleton__title",
            style: vue.normalizeStyle(titleStyle.value),
            "aria-hidden": "true"
          }, null, 4)) : vue.createCommentVNode("", true),
          paragraphConfig.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(paragraphRows.value, (row) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: row,
                class: "aheart-skeleton__paragraph-row",
                style: vue.normalizeStyle(getParagraphRowStyle(row)),
                "aria-hidden": "true"
              }, null, 4);
            }), 128))
          ])) : vue.createCommentVNode("", true)
        ])
      ], 2));
    };
  }
});
exports.default = _sfc_main;
