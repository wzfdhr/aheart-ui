"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASkeleton"
  },
  __name: "skeleton",
  props: types.skeletonProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = vue.defineComponent({
      name: "ASkeletonRenderNode",
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
    const toCssValue = (value) => {
      if (typeof value === "number") {
        return `${value}px`;
      }
      return value;
    };
    const isLocallyActive = (active) => props.active || active;
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
    const buttonConfig = vue.computed(() => {
      if (!props.button) {
        return void 0;
      }
      return typeof props.button === "boolean" ? { size: "default", shape: "default" } : { size: "default", shape: "default", ...props.button };
    });
    const inputConfig = vue.computed(() => {
      if (!props.input) {
        return void 0;
      }
      return typeof props.input === "boolean" ? { size: "default" } : { size: "default", ...props.input };
    });
    const imageConfig = vue.computed(() => {
      if (!props.image) {
        return void 0;
      }
      return typeof props.image === "boolean" ? { width: 96, height: 96 } : { width: 96, height: 96, ...props.image };
    });
    const nodeConfig = vue.computed(() => {
      if (!props.node) {
        return void 0;
      }
      return typeof props.node === "boolean" ? { width: 48, height: 48 } : { width: 48, height: 48, ...props.node };
    });
    const hasTextContent = vue.computed(() => Boolean(titleConfig.value || paragraphConfig.value));
    const skeletonClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-active": props.active,
        "is-round": props.round
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
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
    const buttonClass = vue.computed(() => {
      var _a, _b, _c, _d;
      return [
        props.classNames.button,
        `aheart-skeleton__button--${(_a = buttonConfig.value) == null ? void 0 : _a.size}`,
        `aheart-skeleton__button--${(_b = buttonConfig.value) == null ? void 0 : _b.shape}`,
        {
          "is-active": isLocallyActive((_c = buttonConfig.value) == null ? void 0 : _c.active),
          "is-block": (_d = buttonConfig.value) == null ? void 0 : _d.block
        }
      ];
    });
    const buttonStyle = vue.computed(() => {
      var _a;
      return {
        width: toCssValue((_a = buttonConfig.value) == null ? void 0 : _a.width)
      };
    });
    const inputClass = vue.computed(() => {
      var _a, _b, _c;
      return [
        props.classNames.input,
        `aheart-skeleton__input--${(_a = inputConfig.value) == null ? void 0 : _a.size}`,
        {
          "is-active": isLocallyActive((_b = inputConfig.value) == null ? void 0 : _b.active),
          "is-block": (_c = inputConfig.value) == null ? void 0 : _c.block
        }
      ];
    });
    const inputStyle = vue.computed(() => {
      var _a;
      return {
        width: toCssValue((_a = inputConfig.value) == null ? void 0 : _a.width)
      };
    });
    const imageClass = vue.computed(() => {
      var _a;
      return [
        props.classNames.image,
        {
          "is-active": isLocallyActive((_a = imageConfig.value) == null ? void 0 : _a.active)
        }
      ];
    });
    const imageStyle = vue.computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = imageConfig.value) == null ? void 0 : _a.width),
        height: toCssValue((_b = imageConfig.value) == null ? void 0 : _b.height)
      };
    });
    const nodeClass = vue.computed(() => {
      var _a;
      return [
        props.classNames.node,
        {
          "is-active": isLocallyActive((_a = nodeConfig.value) == null ? void 0 : _a.active)
        }
      ];
    });
    const nodeStyle = vue.computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = nodeConfig.value) == null ? void 0 : _a.width),
        height: toCssValue((_b = nodeConfig.value) == null ? void 0 : _b.height)
      };
    });
    return (_ctx, _cache) => {
      return !_ctx.loading ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(["aheart-skeleton", skeletonClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        "aria-busy": "true"
      }, [
        avatarConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-skeleton__avatar", [_ctx.classNames.avatar, `aheart-skeleton__avatar--${avatarConfig.value.shape}`]]),
          style: vue.normalizeStyle([avatarStyle.value, _ctx.styles.avatar]),
          "aria-hidden": "true"
        }, null, 6)) : vue.createCommentVNode("", true),
        buttonConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 1,
          class: vue.normalizeClass(["aheart-skeleton__button", buttonClass.value]),
          style: vue.normalizeStyle([buttonStyle.value, _ctx.styles.button]),
          "aria-hidden": "true"
        }, null, 6)) : vue.createCommentVNode("", true),
        inputConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass(["aheart-skeleton__input", inputClass.value]),
          style: vue.normalizeStyle([inputStyle.value, _ctx.styles.input]),
          "aria-hidden": "true"
        }, null, 6)) : vue.createCommentVNode("", true),
        imageConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 3,
          class: vue.normalizeClass(["aheart-skeleton__image", imageClass.value]),
          style: vue.normalizeStyle([imageStyle.value, _ctx.styles.image]),
          "aria-hidden": "true"
        }, null, 6)) : vue.createCommentVNode("", true),
        nodeConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 4,
          class: vue.normalizeClass(["aheart-skeleton__node", nodeClass.value]),
          style: vue.normalizeStyle([nodeStyle.value, _ctx.styles.node]),
          "aria-hidden": "true"
        }, [
          vue.createVNode(vue.unref(ARenderNode), {
            node: nodeConfig.value.children
          }, null, 8, ["node"])
        ], 6)) : vue.createCommentVNode("", true),
        hasTextContent.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 5,
          class: vue.normalizeClass(["aheart-skeleton__content", _ctx.classNames.content]),
          style: vue.normalizeStyle(_ctx.styles.content)
        }, [
          titleConfig.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-skeleton__title", _ctx.classNames.title]),
            style: vue.normalizeStyle([titleStyle.value, _ctx.styles.title]),
            "aria-hidden": "true"
          }, null, 6)) : vue.createCommentVNode("", true),
          paragraphConfig.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(["aheart-skeleton__paragraph", _ctx.classNames.paragraph]),
            style: vue.normalizeStyle(_ctx.styles.paragraph)
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(paragraphRows.value, (row) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: row,
                class: vue.normalizeClass(["aheart-skeleton__paragraph-row", _ctx.classNames.paragraphRow]),
                style: vue.normalizeStyle([getParagraphRowStyle(row), _ctx.styles.paragraphRow]),
                "aria-hidden": "true"
              }, null, 6);
            }), 128))
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true)
      ], 6));
    };
  }
});
exports.default = _sfc_main;
