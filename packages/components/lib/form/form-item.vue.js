"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["data-name"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-form-item__label"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-form-item__required",
  "aria-hidden": "true"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-form-item__optional"
};
const _hoisted_5 = { class: "aheart-form-item__control" };
const _hoisted_6 = { class: "aheart-form-item__content" };
const _hoisted_7 = {
  key: 0,
  class: "aheart-form-item__feedback",
  "aria-hidden": "true"
};
const _hoisted_8 = {
  key: 0,
  class: "aheart-form-item__help"
};
const _hoisted_9 = {
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
      return value !== void 0 && value !== null && value !== false && value !== "";
    };
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
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": _ctx.name
      }, [
        _ctx.$slots.label || _ctx.label !== void 0 && _ctx.label !== null ? (vue.openBlock(), vue.createElementBlock("label", _hoisted_2, [
          showRequiredMark.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "*")) : vue.createCommentVNode("", true),
          vue.renderSlot(_ctx.$slots, "label", {}, () => [
            vue.createVNode(vue.unref(AFormItemRenderNode), { node: _ctx.label }, null, 8, ["node"])
          ]),
          showOptionalMark.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "optional")) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_5, [
          vue.createElementVNode("div", _hoisted_6, [
            vue.renderSlot(_ctx.$slots, "default"),
            _ctx.hasFeedback ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, vue.toDisplayString(feedbackIcon.value), 1)) : vue.createCommentVNode("", true)
          ]),
          hasHelp.value || _ctx.$slots.help ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
            vue.renderSlot(_ctx.$slots, "help", {}, () => [
              vue.createVNode(vue.unref(AFormItemRenderNode), { node: effectiveHelp.value }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true),
          hasExtra.value || _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createVNode(vue.unref(AFormItemRenderNode), { node: _ctx.extra }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true)
        ])
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
