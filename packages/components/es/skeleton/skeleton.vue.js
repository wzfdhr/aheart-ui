import { defineComponent, computed, renderSlot, openBlock, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createElementVNode, Fragment, renderList } from "vue";
import { skeletonProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-skeleton__content" };
const _hoisted_2 = {
  key: 1,
  class: "aheart-skeleton__paragraph"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASkeleton"
  },
  __name: "skeleton",
  props: skeletonProps,
  setup(__props) {
    const props = __props;
    const toCssValue = (value) => {
      if (typeof value === "number") {
        return `${value}px`;
      }
      return value;
    };
    const avatarConfig = computed(() => {
      if (!props.avatar) {
        return void 0;
      }
      return typeof props.avatar === "boolean" ? { size: 32, shape: "circle" } : { shape: "circle", ...props.avatar };
    });
    const titleConfig = computed(() => {
      if (!props.title) {
        return void 0;
      }
      return typeof props.title === "boolean" ? { width: "38%" } : props.title;
    });
    const paragraphConfig = computed(() => {
      if (!props.paragraph) {
        return void 0;
      }
      return typeof props.paragraph === "boolean" ? { rows: 3 } : props.paragraph;
    });
    const skeletonClass = computed(() => ({
      "is-active": props.active,
      "is-round": props.round
    }));
    const avatarStyle = computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = avatarConfig.value) == null ? void 0 : _a.size),
        height: toCssValue((_b = avatarConfig.value) == null ? void 0 : _b.size)
      };
    });
    const titleStyle = computed(() => {
      var _a;
      return {
        width: toCssValue((_a = titleConfig.value) == null ? void 0 : _a.width)
      };
    });
    const paragraphRows = computed(() => {
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
      return !_ctx.loading ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(["aheart-skeleton", skeletonClass.value]),
        "aria-busy": "true"
      }, [
        avatarConfig.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-skeleton__avatar", `aheart-skeleton__avatar--${avatarConfig.value.shape}`]),
          style: normalizeStyle(avatarStyle.value),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_1, [
          titleConfig.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: "aheart-skeleton__title",
            style: normalizeStyle(titleStyle.value),
            "aria-hidden": "true"
          }, null, 4)) : createCommentVNode("", true),
          paragraphConfig.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(paragraphRows.value, (row) => {
              return openBlock(), createElementBlock("span", {
                key: row,
                class: "aheart-skeleton__paragraph-row",
                style: normalizeStyle(getParagraphRowStyle(row)),
                "aria-hidden": "true"
              }, null, 4);
            }), 128))
          ])) : createCommentVNode("", true)
        ])
      ], 2));
    };
  }
});
export {
  _sfc_main as default
};
