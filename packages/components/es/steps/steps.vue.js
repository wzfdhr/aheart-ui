import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createElementVNode, createVNode, unref, createCommentVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { stepsProps, stepsEmits } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASteps"
  },
  __name: "steps",
  props: stepsProps,
  emits: stepsEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
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
    const config = useAheartConfig();
    const normalizedItems = computed(() => props.items ?? []);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedDirection = computed(() => props.orientation ?? props.direction);
    const stepsClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const buttonClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.button;
    });
    const buttonStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.button;
    });
    const indicatorClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.indicator;
    });
    const indicatorStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.indicator;
    });
    const iconClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.icon;
    });
    const contentClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const titleClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.title;
    });
    const titleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const subTitleClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.subTitle;
    });
    const subTitleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.subTitle;
    });
    const descriptionClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.description;
    });
    const descriptionStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const connectorClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.connector;
    });
    const connectorStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.connector;
    });
    const clampedPercent = computed(() => {
      if (props.percent === void 0 || Number.isNaN(props.percent)) {
        return 0;
      }
      return Math.min(100, Math.max(0, props.percent));
    });
    const percentText = computed(
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
    const isDotType = computed(() => props.type === "dot");
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-steps", stepsClass.value]),
        style: normalizeStyle(rootStyle.value),
        role: "list"
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item, index) => {
          return openBlock(), createElementBlock("div", {
            key: `${item.title}-${index}`,
            class: normalizeClass(["aheart-steps__item", getItemClass(item, index)]),
            style: normalizeStyle(getItemStyle(index)),
            role: "listitem",
            "aria-current": index === _ctx.current ? "step" : void 0
          }, [
            createElementVNode("button", {
              class: normalizeClass(["aheart-steps__button", buttonClass.value]),
              style: normalizeStyle(buttonStyle.value),
              type: "button",
              disabled: item.disabled,
              "aria-disabled": item.disabled ? "true" : void 0,
              onClick: ($event) => handleStepClick(item, index)
            }, [
              createElementVNode("span", {
                class: normalizeClass(["aheart-steps__indicator", indicatorClass.value]),
                style: normalizeStyle(indicatorStyle.value),
                "aria-hidden": "true"
              }, [
                createElementVNode("span", {
                  class: normalizeClass(["aheart-steps__icon", iconClass.value]),
                  style: normalizeStyle(getIconStyle(item, index))
                }, [
                  showIconText(item, index) ? (openBlock(), createElementBlock("span", _hoisted_3, [
                    createVNode(unref(ARenderNode), {
                      node: getIndicatorText(item, index)
                    }, null, 8, ["node"])
                  ])) : createCommentVNode("", true),
                  hasPercent(item, index) ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(percentText.value) + "%", 1)) : createCommentVNode("", true)
                ], 6)
              ], 6),
              createElementVNode("span", {
                class: normalizeClass(["aheart-steps__content", contentClass.value]),
                style: normalizeStyle(contentStyle.value)
              }, [
                createElementVNode("span", _hoisted_5, [
                  createElementVNode("span", {
                    class: normalizeClass(["aheart-steps__title", titleClass.value]),
                    style: normalizeStyle(titleStyle.value)
                  }, [
                    createVNode(unref(ARenderNode), {
                      node: item.title
                    }, null, 8, ["node"])
                  ], 6),
                  item.subTitle ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass(["aheart-steps__subtitle", subTitleClass.value]),
                    style: normalizeStyle(subTitleStyle.value)
                  }, [
                    createVNode(unref(ARenderNode), {
                      node: item.subTitle
                    }, null, 8, ["node"])
                  ], 6)) : createCommentVNode("", true)
                ]),
                item.description ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass(["aheart-steps__description", descriptionClass.value]),
                  style: normalizeStyle(descriptionStyle.value)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: item.description
                  }, null, 8, ["node"])
                ], 6)) : createCommentVNode("", true),
                item.content ? (openBlock(), createElementBlock("span", _hoisted_6, [
                  createVNode(unref(ARenderNode), {
                    node: item.content
                  }, null, 8, ["node"])
                ])) : createCommentVNode("", true)
              ], 6)
            ], 14, _hoisted_2),
            index < normalizedItems.value.length - 1 ? (openBlock(), createElementBlock("span", {
              key: 0,
              class: normalizeClass(["aheart-steps__connector", connectorClass.value]),
              style: normalizeStyle(connectorStyle.value),
              "aria-hidden": "true"
            }, null, 6)) : createCommentVNode("", true)
          ], 14, _hoisted_1);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
