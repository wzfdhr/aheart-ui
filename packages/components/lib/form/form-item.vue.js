"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const tooltip_vue_vue_type_script_setup_true_lang = require("../tooltip/tooltip.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["data-name"];
const _hoisted_2 = ["for"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-form-item__required",
  "aria-hidden": "true"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-form-item__optional"
};
const _hoisted_5 = {
  key: 2,
  class: "aheart-form-item__tooltip"
};
const _hoisted_6 = {
  class: "aheart-form-item__tooltip-icon",
  "aria-hidden": "true"
};
const _hoisted_7 = { class: "aheart-form-item__control" };
const _hoisted_8 = { class: "aheart-form-item__content" };
const _hoisted_9 = {
  key: 0,
  class: "aheart-form-item__feedback",
  "aria-hidden": "true"
};
const _hoisted_10 = {
  key: 0,
  class: "aheart-form-item__help"
};
const _hoisted_11 = {
  key: 1,
  class: "aheart-form-item__extra"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AFormItem"
  },
  __name: "form-item",
  props: types.formItemProps,
  setup(__props) {
    const props = __props;
    const formContext = vue.inject(types.formContextKey, void 0);
    const ATooltip = tooltip_vue_vue_type_script_setup_true_lang.default;
    const AFormItemRenderNode = vue.defineComponent({
      name: "AFormItemRenderNode",
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
    const hasRenderableContent = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "function") {
        return true;
      }
      return value !== void 0 && value !== null && value !== false && value !== "";
    };
    const isTooltipConfig = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && !vue.isVNode(value);
    const tooltipTitle = vue.computed(() => {
      if (isTooltipConfig(props.tooltip)) {
        return props.tooltip.title;
      }
      return props.tooltip;
    });
    const tooltipIcon = vue.computed(
      () => isTooltipConfig(props.tooltip) && props.tooltip.icon !== void 0 ? props.tooltip.icon : "?"
    );
    const resolvedTooltipProps = vue.computed(() => {
      if (isTooltipConfig(props.tooltip)) {
        const { icon: _icon, title: _title, ...tooltipProps } = props.tooltip;
        return {
          ...tooltipProps,
          title: tooltipTitle.value
        };
      }
      return {
        title: tooltipTitle.value
      };
    });
    const effectiveRules = vue.computed(() => props.rules ?? []);
    const fieldErrors = vue.computed(() => props.name ? (formContext == null ? void 0 : formContext.getFieldErrors(props.name)) ?? [] : []);
    const isRequired = vue.computed(() => Boolean(props.required || props.name && (formContext == null ? void 0 : formContext.isFieldRequired(props.name))));
    const showRequiredMark = vue.computed(() => isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) !== false);
    const showOptionalMark = vue.computed(
      () => Boolean(props.label || props.name) && !isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) === "optional"
    );
    const effectiveValidateStatus = vue.computed(() => props.validateStatus ?? (fieldErrors.value.length > 0 ? "error" : void 0));
    const effectiveHelp = vue.computed(() => props.help !== void 0 ? props.help : fieldErrors.value[0] ?? "");
    const hasHelp = vue.computed(() => hasRenderableContent(effectiveHelp.value));
    const hasExtra = vue.computed(() => hasRenderableContent(props.extra));
    const hasTooltip = vue.computed(() => hasRenderableContent(tooltipTitle.value));
    vue.watch(
      () => [props.name, effectiveRules.value],
      ([name, rules], previous) => {
        const previousName = previous == null ? void 0 : previous[0];
        if (previousName && previousName !== name) {
          formContext == null ? void 0 : formContext.unregisterField(previousName);
        }
        if (name) {
          formContext == null ? void 0 : formContext.registerField(name, rules);
        }
      },
      { immediate: true, deep: true }
    );
    vue.onBeforeUnmount(() => {
      if (props.name) {
        formContext == null ? void 0 : formContext.unregisterField(props.name);
      }
    });
    const formItemClass = vue.computed(() => ({
      [`aheart-form-item--${effectiveValidateStatus.value}`]: effectiveValidateStatus.value,
      [`aheart-form-item--${props.layout}`]: props.layout,
      [`aheart-form-item--label-${props.labelAlign}`]: props.labelAlign,
      "aheart-form-item--colon": props.colon === true,
      "aheart-form-item--no-colon": props.colon === false,
      "aheart-form-item--hidden": props.hidden,
      "is-required": isRequired.value,
      "is-optional": showOptionalMark.value,
      "has-feedback": props.hasFeedback
    }));
    const feedbackIcon = vue.computed(() => {
      const iconMap = {
        success: "✓",
        warning: "!",
        error: "×",
        validating: "…"
      };
      return effectiveValidateStatus.value ? iconMap[effectiveValidateStatus.value] : "";
    });
    return (_ctx, _cache) => {
      return _ctx.noStyle ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": _ctx.name
      }, [
        _ctx.$slots.label || _ctx.label !== void 0 && _ctx.label !== null ? (vue.openBlock(), vue.createElementBlock("label", {
          key: 0,
          class: "aheart-form-item__label",
          for: _ctx.htmlFor
        }, [
          showRequiredMark.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "*")) : vue.createCommentVNode("", true),
          vue.renderSlot(_ctx.$slots, "label", {}, () => [
            vue.createVNode(vue.unref(AFormItemRenderNode), { node: _ctx.label }, null, 8, ["node"])
          ]),
          showOptionalMark.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "optional")) : vue.createCommentVNode("", true),
          hasTooltip.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, [
            vue.createVNode(vue.unref(ATooltip), vue.normalizeProps(vue.guardReactiveProps(resolvedTooltipProps.value)), {
              default: vue.withCtx(() => [
                vue.createElementVNode("span", _hoisted_6, [
                  vue.createVNode(vue.unref(AFormItemRenderNode), { node: tooltipIcon.value }, null, 8, ["node"])
                ])
              ]),
              _: 1
            }, 16)
          ])) : vue.createCommentVNode("", true)
        ], 8, _hoisted_2)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_7, [
          vue.createElementVNode("div", _hoisted_8, [
            vue.renderSlot(_ctx.$slots, "default"),
            _ctx.hasFeedback ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9, vue.toDisplayString(feedbackIcon.value), 1)) : vue.createCommentVNode("", true)
          ]),
          hasHelp.value || _ctx.$slots.help ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
            vue.renderSlot(_ctx.$slots, "help", {}, () => [
              vue.createVNode(vue.unref(AFormItemRenderNode), { node: effectiveHelp.value }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true),
          hasExtra.value || _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createVNode(vue.unref(AFormItemRenderNode), { node: _ctx.extra }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true)
        ])
      ], 10, _hoisted_1)), [
        [vue.vShow, !_ctx.hidden]
      ]);
    };
  }
});
exports.default = _sfc_main;
