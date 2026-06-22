import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, createElementBlock, renderSlot, createElementVNode, createCommentVNode, createVNode, createTextVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import _sfc_main$1 from "../icon/icon.vue.js";
import { buttonProps, buttonEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-button__loading",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AButton"
  },
  __name: "button",
  props: buttonProps,
  emits: buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const slots = useSlots();
    const delayedLoading = ref(false);
    let loadingTimer;
    const resolvedSize = computed(() => {
      const providerSize = config.value.size === "middle" ? "normal" : config.value.size;
      return resolveConfigValue(props.size, providerSize, "normal");
    });
    const loadingDelay = computed(() => {
      if (typeof props.loading === "object" && props.loading !== null) {
        return props.loading.delay ?? 0;
      }
      return 0;
    });
    const rawLoading = computed(() => props.loading === true || typeof props.loading === "object" && props.loading !== null);
    const clearLoadingTimer = () => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = void 0;
      }
    };
    watch(
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
    onBeforeUnmount(() => {
      clearLoadingTimer();
    });
    const isLoading = computed(() => delayedLoading.value);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isInteractiveDisabled = computed(() => isDisabled.value || isLoading.value);
    const rootTag = computed(() => props.href ? "a" : "button");
    const resolvedNativeType = computed(() => props.htmlType || props.nativeType);
    const isDanger = computed(() => props.danger || props.type === "danger");
    const resolvedIconPlacement = computed(() => props.iconPlacement || props.iconPosition || "start");
    const hasIcon = computed(() => Boolean(slots.icon) || Boolean(props.icon));
    const showStartIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === "start");
    const showEndIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === "end");
    const buttonClass = computed(() => {
      var _a;
      return [
        `aheart-button--${props.type}`,
        `aheart-button--${resolvedSize.value}`,
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconClass = computed(() => {
      var _a;
      return ["aheart-button__icon", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentClass = computed(() => {
      var _a;
      return ["aheart-button__content", (_a = props.classNames) == null ? void 0 : _a.content];
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const handleClick = (event) => {
      if (isInteractiveDisabled.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      emit("click", event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(rootTag.value), {
        class: normalizeClass(["aheart-button", buttonClass.value]),
        style: normalizeStyle(rootStyle.value),
        type: rootTag.value === "button" ? resolvedNativeType.value : void 0,
        href: rootTag.value === "a" && !isInteractiveDisabled.value ? _ctx.href : void 0,
        target: rootTag.value === "a" ? _ctx.target : void 0,
        disabled: rootTag.value === "button" ? isInteractiveDisabled.value : void 0,
        "aria-disabled": rootTag.value === "a" && isInteractiveDisabled.value ? "true" : void 0,
        tabindex: rootTag.value === "a" && isInteractiveDisabled.value ? -1 : void 0,
        "aria-busy": isLoading.value,
        onClick: handleClick
      }, {
        default: withCtx(() => [
          isLoading.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
            renderSlot(_ctx.$slots, "loadingIcon", {}, () => [
              _cache[0] || (_cache[0] = createElementVNode("span", { class: "aheart-button__loading-spinner" }, null, -1))
            ])
          ])) : createCommentVNode("", true),
          showStartIcon.value ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(iconClass.value),
            style: normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, [
            renderSlot(_ctx.$slots, "icon", {}, () => [
              createVNode(_sfc_main$1, { name: _ctx.icon }, null, 8, ["name"])
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(contentClass.value),
            style: normalizeStyle(contentStyle.value)
          }, [
            renderSlot(_ctx.$slots, "default", {}, () => [
              _cache[1] || (_cache[1] = createTextVNode("按钮", -1))
            ])
          ], 6),
          showEndIcon.value ? (openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(iconClass.value),
            style: normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, [
            renderSlot(_ctx.$slots, "icon", {}, () => [
              createVNode(_sfc_main$1, { name: _ctx.icon }, null, 8, ["name"])
            ])
          ], 6)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style", "type", "href", "target", "disabled", "aria-disabled", "tabindex", "aria-busy"]);
    };
  }
});
export {
  _sfc_main as default
};
