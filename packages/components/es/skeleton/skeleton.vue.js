import { defineComponent, computed, renderSlot, openBlock, createElementBlock, normalizeClass, normalizeStyle, createCommentVNode, createVNode, unref, Fragment, renderList } from "vue";
import { skeletonProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASkeleton"
  },
  __name: "skeleton",
  props: skeletonProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = defineComponent({
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
    const buttonConfig = computed(() => {
      if (!props.button) {
        return void 0;
      }
      return typeof props.button === "boolean" ? { size: "default", shape: "default" } : { size: "default", shape: "default", ...props.button };
    });
    const inputConfig = computed(() => {
      if (!props.input) {
        return void 0;
      }
      return typeof props.input === "boolean" ? { size: "default" } : { size: "default", ...props.input };
    });
    const imageConfig = computed(() => {
      if (!props.image) {
        return void 0;
      }
      return typeof props.image === "boolean" ? { width: 96, height: 96 } : { width: 96, height: 96, ...props.image };
    });
    const nodeConfig = computed(() => {
      if (!props.node) {
        return void 0;
      }
      return typeof props.node === "boolean" ? { width: 48, height: 48 } : { width: 48, height: 48, ...props.node };
    });
    const hasTextContent = computed(() => Boolean(titleConfig.value || paragraphConfig.value));
    const skeletonClass = computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-active": props.active,
        "is-round": props.round
      }
    ]);
    const rootStyle = computed(() => [props.style, props.styles.root]);
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
    const buttonClass = computed(() => {
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
    const buttonStyle = computed(() => {
      var _a;
      return {
        width: toCssValue((_a = buttonConfig.value) == null ? void 0 : _a.width)
      };
    });
    const inputClass = computed(() => {
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
    const inputStyle = computed(() => {
      var _a;
      return {
        width: toCssValue((_a = inputConfig.value) == null ? void 0 : _a.width)
      };
    });
    const imageClass = computed(() => {
      var _a;
      return [
        props.classNames.image,
        {
          "is-active": isLocallyActive((_a = imageConfig.value) == null ? void 0 : _a.active)
        }
      ];
    });
    const imageStyle = computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = imageConfig.value) == null ? void 0 : _a.width),
        height: toCssValue((_b = imageConfig.value) == null ? void 0 : _b.height)
      };
    });
    const nodeClass = computed(() => {
      var _a;
      return [
        props.classNames.node,
        {
          "is-active": isLocallyActive((_a = nodeConfig.value) == null ? void 0 : _a.active)
        }
      ];
    });
    const nodeStyle = computed(() => {
      var _a, _b;
      return {
        width: toCssValue((_a = nodeConfig.value) == null ? void 0 : _a.width),
        height: toCssValue((_b = nodeConfig.value) == null ? void 0 : _b.height)
      };
    });
    return (_ctx, _cache) => {
      return !_ctx.loading ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(["aheart-skeleton", skeletonClass.value]),
        style: normalizeStyle(rootStyle.value),
        "aria-busy": "true"
      }, [
        avatarConfig.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-skeleton__avatar", [_ctx.classNames.avatar, `aheart-skeleton__avatar--${avatarConfig.value.shape}`]]),
          style: normalizeStyle([avatarStyle.value, _ctx.styles.avatar]),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true),
        buttonConfig.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(["aheart-skeleton__button", buttonClass.value]),
          style: normalizeStyle([buttonStyle.value, _ctx.styles.button]),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true),
        inputConfig.value ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(["aheart-skeleton__input", inputClass.value]),
          style: normalizeStyle([inputStyle.value, _ctx.styles.input]),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true),
        imageConfig.value ? (openBlock(), createElementBlock("span", {
          key: 3,
          class: normalizeClass(["aheart-skeleton__image", imageClass.value]),
          style: normalizeStyle([imageStyle.value, _ctx.styles.image]),
          "aria-hidden": "true"
        }, null, 6)) : createCommentVNode("", true),
        nodeConfig.value ? (openBlock(), createElementBlock("span", {
          key: 4,
          class: normalizeClass(["aheart-skeleton__node", nodeClass.value]),
          style: normalizeStyle([nodeStyle.value, _ctx.styles.node]),
          "aria-hidden": "true"
        }, [
          createVNode(unref(ARenderNode), {
            node: nodeConfig.value.children
          }, null, 8, ["node"])
        ], 6)) : createCommentVNode("", true),
        hasTextContent.value ? (openBlock(), createElementBlock("div", {
          key: 5,
          class: normalizeClass(["aheart-skeleton__content", _ctx.classNames.content]),
          style: normalizeStyle(_ctx.styles.content)
        }, [
          titleConfig.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-skeleton__title", _ctx.classNames.title]),
            style: normalizeStyle([titleStyle.value, _ctx.styles.title]),
            "aria-hidden": "true"
          }, null, 6)) : createCommentVNode("", true),
          paragraphConfig.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["aheart-skeleton__paragraph", _ctx.classNames.paragraph]),
            style: normalizeStyle(_ctx.styles.paragraph)
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(paragraphRows.value, (row) => {
              return openBlock(), createElementBlock("span", {
                key: row,
                class: normalizeClass(["aheart-skeleton__paragraph-row", _ctx.classNames.paragraphRow]),
                style: normalizeStyle([getParagraphRowStyle(row), _ctx.styles.paragraphRow]),
                "aria-hidden": "true"
              }, null, 6);
            }), 128))
          ], 6)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ], 6));
    };
  }
});
export {
  _sfc_main as default
};
