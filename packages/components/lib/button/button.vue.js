"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-button__loading-spinner"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: types.buttonProps,
  emits: types.buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const slots = vue.useSlots();
    const delayedLoading = vue.ref(false);
    let loadingTimer;
    const ARenderNode = vue.defineComponent({
      name: "AButtonRenderNode",
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
    const isTwoChineseCharacters = (value) => /^[\u4e00-\u9fa5]{2}$/.test(value);
    const getAutoSpacedText = (value) => {
      if (!props.autoInsertSpace || !isTwoChineseCharacters(value)) {
        return value;
      }
      return `${value[0]} ${value[1]}`;
    };
    const getContentNode = () => {
      var _a;
      const nodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (!nodes) {
        return getAutoSpacedText("按钮");
      }
      const meaningfulNodes = nodes.filter((node2) => node2.type !== vue.Comment);
      if (meaningfulNodes.length !== 1) {
        return nodes;
      }
      const [node] = meaningfulNodes;
      if (typeof node.children !== "string") {
        return nodes;
      }
      if (node.type === vue.Text) {
        return getAutoSpacedText(node.children);
      }
      return nodes;
    };
    const colorTokens = {
      default: "var(--aheart-color-text)",
      primary: "var(--aheart-color-primary)",
      danger: "var(--aheart-color-danger)",
      success: "var(--aheart-color-success)",
      warning: "var(--aheart-color-warning)",
      info: "var(--aheart-color-info)",
      blue: "#1677ff",
      purple: "#722ed1",
      cyan: "#13c2c2",
      green: "#52c41a",
      magenta: "#eb2f96",
      pink: "#eb2f96",
      red: "#f5222d",
      orange: "#fa8c16",
      yellow: "#fadb14",
      volcano: "#fa541c",
      geekblue: "#2f54eb",
      lime: "#a0d911",
      gold: "#faad14"
    };
    const typeColorMap = {
      primary: "primary",
      success: "success",
      warning: "warning",
      danger: "danger"
    };
    const typeVariantMap = {
      primary: "solid",
      success: "solid",
      warning: "solid",
      danger: "solid",
      dashed: "dashed",
      link: "link",
      text: "text"
    };
    const resolvedSize = vue.computed(() => {
      const providerSize = config.value.size === "middle" ? "normal" : config.value.size;
      return context.resolveConfigValue(props.size, providerSize, "normal");
    });
    const loadingDelay = vue.computed(() => {
      if (typeof props.loading === "object" && props.loading !== null) {
        return props.loading.delay ?? 0;
      }
      return 0;
    });
    const rawLoading = vue.computed(() => props.loading === true || typeof props.loading === "object" && props.loading !== null);
    const clearLoadingTimer = () => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = void 0;
      }
    };
    vue.watch(
      [rawLoading, loadingDelay],
      ([loading, delay]) => {
        clearLoadingTimer();
        if (!loading) {
          delayedLoading.value = false;
          return;
        }
        if (delay > 0) {
          delayedLoading.value = false;
          loadingTimer = setTimeout(() => {
            delayedLoading.value = true;
            loadingTimer = void 0;
          }, delay);
          return;
        }
        delayedLoading.value = true;
      },
      { immediate: true }
    );
    vue.onBeforeUnmount(() => {
      clearLoadingTimer();
    });
    const isLoading = vue.computed(() => delayedLoading.value);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const isInteractiveDisabled = vue.computed(() => isDisabled.value || isLoading.value);
    const rootTag = vue.computed(() => props.href ? "a" : "button");
    const resolvedNativeType = vue.computed(() => props.htmlType || props.nativeType);
    const isDanger = vue.computed(() => props.danger || props.type === "danger");
    const resolvedColor = vue.computed(() => props.color || (isDanger.value ? "danger" : typeColorMap[props.type] || "default"));
    const resolvedVariant = vue.computed(() => props.variant || typeVariantMap[props.type] || "outlined");
    const resolvedIconPlacement = vue.computed(() => props.iconPlacement || props.iconPosition || "start");
    const isStringIcon = vue.computed(() => typeof props.icon === "string");
    const stringIcon = vue.computed(() => isStringIcon.value ? props.icon : "");
    const hasRenderableIcon = vue.computed(() => {
      if (Array.isArray(props.icon)) {
        return props.icon.length > 0;
      }
      return props.icon !== void 0 && props.icon !== null && props.icon !== false && props.icon !== true && props.icon !== "";
    });
    const hasIcon = vue.computed(() => Boolean(slots.icon) || hasRenderableIcon.value);
    const showStartIcon = vue.computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === "start");
    const showEndIcon = vue.computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === "end");
    const objectLoadingIcon = vue.computed(
      () => typeof props.loading === "object" && props.loading !== null ? props.loading.icon : void 0
    );
    const hasObjectLoadingIcon = vue.computed(
      () => objectLoadingIcon.value !== void 0 && objectLoadingIcon.value !== null && objectLoadingIcon.value !== false
    );
    const buttonClass = vue.computed(() => {
      var _a;
      return [
        `aheart-button--${props.type}`,
        `aheart-button--${resolvedSize.value}`,
        `aheart-button--color-${resolvedColor.value}`,
        `aheart-button--variant-${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-block": props.block,
          "is-round": props.round || props.shape === "round",
          "is-circle": props.shape === "circle",
          "is-loading": isLoading.value,
          "is-danger": isDanger.value,
          "is-ghost": props.ghost,
          "is-anchor": rootTag.value === "a"
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [
        {
          "--aheart-button-color": colorTokens[resolvedColor.value],
          "--aheart-button-color-hover": resolvedColor.value === "default" ? "var(--aheart-color-primary-hover)" : colorTokens[resolvedColor.value]
        },
        props.style,
        (_a = props.styles) == null ? void 0 : _a.root
      ];
    });
    const iconClass = vue.computed(() => {
      var _a;
      return ["aheart-button__icon", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const iconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentClass = vue.computed(() => {
      var _a;
      return ["aheart-button__content", (_a = props.classNames) == null ? void 0 : _a.content];
    });
    const contentStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const contentNode = vue.computed(() => getContentNode());
    const handleClick = (event) => {
      if (isInteractiveDisabled.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      emit("click", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(rootTag.value), {
        class: vue.normalizeClass(["aheart-button", buttonClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        type: rootTag.value === "button" ? resolvedNativeType.value : void 0,
        href: rootTag.value === "a" && !isInteractiveDisabled.value ? _ctx.href : void 0,
        target: rootTag.value === "a" ? _ctx.target : void 0,
        disabled: rootTag.value === "button" ? isInteractiveDisabled.value : void 0,
        "aria-disabled": rootTag.value === "a" && isInteractiveDisabled.value ? "true" : void 0,
        tabindex: rootTag.value === "a" && isInteractiveDisabled.value ? -1 : void 0,
        "aria-busy": isLoading.value,
        onClick: handleClick
      }, {
        default: vue.withCtx(() => [
          isLoading.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
            vue.renderSlot(_ctx.$slots, "loadingIcon", {}, () => [
              hasObjectLoadingIcon.value ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 0,
                node: objectLoadingIcon.value
              }, null, 8, ["node"])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2))
            ])
          ])) : vue.createCommentVNode("", true),
          showStartIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(iconClass.value),
            style: vue.normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, [
            vue.renderSlot(_ctx.$slots, "icon", {}, () => [
              isStringIcon.value ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 0,
                name: stringIcon.value
              }, null, 8, ["name"])) : (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 1,
                node: _ctx.icon
              }, null, 8, ["node"]))
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(contentClass.value),
            style: vue.normalizeStyle(contentStyle.value)
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: contentNode.value }, null, 8, ["node"])
          ], 6),
          showEndIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(iconClass.value),
            style: vue.normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, [
            vue.renderSlot(_ctx.$slots, "icon", {}, () => [
              isStringIcon.value ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 0,
                name: stringIcon.value
              }, null, 8, ["name"])) : (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 1,
                node: _ctx.icon
              }, null, 8, ["node"]))
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style", "type", "href", "target", "disabled", "aria-disabled", "tabindex", "aria-busy"]);
    };
  }
});
exports.default = _sfc_main;
