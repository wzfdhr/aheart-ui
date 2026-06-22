"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-current"];
const _hoisted_2 = ["disabled", "aria-disabled", "onClick"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-steps__icon-text"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-steps__percent"
};
const _hoisted_5 = { class: "aheart-steps__title-row" };
const _hoisted_6 = {
  key: 1,
  class: "aheart-steps__extra-content"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASteps"
  },
  __name: "steps",
  props: types.stepsProps,
  emits: types.stepsEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "AStepsRenderNode",
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
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const normalizedItems = vue.computed(() => props.items ?? []);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedDirection = vue.computed(() => props.orientation ?? props.direction);
    const stepsClass = vue.computed(() => {
      var _a;
      return [
        `aheart-steps--${resolvedDirection.value}`,
        `aheart-steps--${resolvedSize.value}`,
        `aheart-steps--${props.type}`,
        `aheart-steps--title-${props.titlePlacement}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const buttonClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.button;
    });
    const buttonStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.button;
    });
    const indicatorClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.indicator;
    });
    const indicatorStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.indicator;
    });
    const iconClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.icon;
    });
    const contentClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const titleClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.title;
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const subTitleClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.subTitle;
    });
    const subTitleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.subTitle;
    });
    const descriptionClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.description;
    });
    const descriptionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const connectorClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.connector;
    });
    const connectorStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.connector;
    });
    const clampedPercent = vue.computed(() => {
      if (props.percent === void 0 || Number.isNaN(props.percent)) {
        return 0;
      }
      return Math.min(100, Math.max(0, props.percent));
    });
    const percentText = vue.computed(
      () => Number.isInteger(clampedPercent.value) ? String(clampedPercent.value) : String(Number(clampedPercent.value.toFixed(2)))
    );
    const getStatus = (item, index) => {
      if (item.status) {
        return item.status;
      }
      if (index < props.current) {
        return "finish";
      }
      if (index === props.current) {
        return props.status;
      }
      return "wait";
    };
    const getItemClass = (item, index) => {
      var _a, _b;
      const status = getStatus(item, index);
      return [
        (_a = props.classNames) == null ? void 0 : _a.item,
        index === props.current ? (_b = props.classNames) == null ? void 0 : _b.activeItem : void 0,
        {
          [`aheart-steps__item--${status}`]: true,
          "is-disabled": item.disabled
        }
      ];
    };
    const getItemStyle = (index) => {
      var _a, _b;
      return [
        (_a = props.styles) == null ? void 0 : _a.item,
        index === props.current ? (_b = props.styles) == null ? void 0 : _b.activeItem : void 0
      ];
    };
    const hasPercent = (item, index) => typeof props.percent === "number" && index === props.current && getStatus(item, index) === "process";
    const getIconStyle = (item, index) => {
      var _a;
      return [
        hasPercent(item, index) ? { "--aheart-steps-percent": percentText.value } : void 0,
        (_a = props.styles) == null ? void 0 : _a.icon
      ];
    };
    const getDisplayNumber = (index) => props.initial + index;
    const isDotType = vue.computed(() => props.type === "dot");
    const showIconText = (item, index) => !hasPercent(item, index) && (!isDotType.value || item.icon !== void 0);
    const getIndicatorText = (item, index) => {
      if (item.icon) {
        return item.icon;
      }
      const status = getStatus(item, index);
      if (status === "finish") {
        return "✓";
      }
      if (status === "error") {
        return "!";
      }
      return getDisplayNumber(index);
    };
    const handleStepClick = (item, index) => {
      if (item.disabled || index === props.current) {
        return;
      }
      emit("change", index);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-steps", stepsClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        role: "list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: `${item.title}-${index}`,
            class: vue.normalizeClass(["aheart-steps__item", getItemClass(item, index)]),
            style: vue.normalizeStyle(getItemStyle(index)),
            role: "listitem",
            "aria-current": index === _ctx.current ? "step" : void 0
          }, [
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["aheart-steps__button", buttonClass.value]),
              style: vue.normalizeStyle(buttonStyle.value),
              type: "button",
              disabled: item.disabled,
              "aria-disabled": item.disabled ? "true" : void 0,
              onClick: ($event) => handleStepClick(item, index)
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-steps__indicator", indicatorClass.value]),
                style: vue.normalizeStyle(indicatorStyle.value),
                "aria-hidden": "true"
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(["aheart-steps__icon", iconClass.value]),
                  style: vue.normalizeStyle(getIconStyle(item, index))
                }, [
                  showIconText(item, index) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, [
                    vue.createVNode(vue.unref(ARenderNode), {
                      node: getIndicatorText(item, index)
                    }, null, 8, ["node"])
                  ])) : vue.createCommentVNode("", true),
                  hasPercent(item, index) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, vue.toDisplayString(percentText.value) + "%", 1)) : vue.createCommentVNode("", true)
                ], 6)
              ], 6),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["aheart-steps__content", contentClass.value]),
                style: vue.normalizeStyle(contentStyle.value)
              }, [
                vue.createElementVNode("span", _hoisted_5, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(["aheart-steps__title", titleClass.value]),
                    style: vue.normalizeStyle(titleStyle.value)
                  }, [
                    vue.createVNode(vue.unref(ARenderNode), {
                      node: item.title
                    }, null, 8, ["node"])
                  ], 6),
                  item.subTitle ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    class: vue.normalizeClass(["aheart-steps__subtitle", subTitleClass.value]),
                    style: vue.normalizeStyle(subTitleStyle.value)
                  }, [
                    vue.createVNode(vue.unref(ARenderNode), {
                      node: item.subTitle
                    }, null, 8, ["node"])
                  ], 6)) : vue.createCommentVNode("", true)
                ]),
                item.description ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass(["aheart-steps__description", descriptionClass.value]),
                  style: vue.normalizeStyle(descriptionStyle.value)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: item.description
                  }, null, 8, ["node"])
                ], 6)) : vue.createCommentVNode("", true),
                item.content ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: item.content
                  }, null, 8, ["node"])
                ])) : vue.createCommentVNode("", true)
              ], 6)
            ], 14, _hoisted_2),
            index < normalizedItems.value.length - 1 ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(["aheart-steps__connector", connectorClass.value]),
              style: vue.normalizeStyle(connectorStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : vue.createCommentVNode("", true)
          ], 14, _hoisted_1);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
