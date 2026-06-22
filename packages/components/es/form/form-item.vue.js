import { defineComponent, inject, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, createCommentVNode, renderSlot, createTextVNode, toDisplayString, createElementVNode } from "vue";
import { formItemProps, formContextKey } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AFormItem"
  },
  __name: "form-item",
  props: formItemProps,
  setup(__props) {
    const props = __props;
    const formContext = inject(formContextKey, void 0);
    const effectiveRules = computed(() => props.rules ?? []);
    const fieldErrors = computed(() => props.name ? (formContext == null ? void 0 : formContext.getFieldErrors(props.name)) ?? [] : []);
    const isRequired = computed(() => Boolean(props.required || props.name && (formContext == null ? void 0 : formContext.isFieldRequired(props.name))));
    const showRequiredMark = computed(() => isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) !== false);
    const showOptionalMark = computed(
      () => Boolean(props.label || props.name) && !isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) === "optional"
    );
    const effectiveValidateStatus = computed(() => props.validateStatus ?? (fieldErrors.value.length > 0 ? "error" : void 0));
    const effectiveHelp = computed(() => props.help ?? fieldErrors.value[0] ?? "");
    const hasHelp = computed(() => Boolean(effectiveHelp.value));
    watch(
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
    onBeforeUnmount(() => {
      if (props.name) {
        formContext == null ? void 0 : formContext.unregisterField(props.name);
      }
    });
    const formItemClass = computed(() => ({
      [`aheart-form-item--${effectiveValidateStatus.value}`]: effectiveValidateStatus.value,
      "is-required": isRequired.value,
      "is-optional": showOptionalMark.value,
      "has-feedback": props.hasFeedback
    }));
    const feedbackIcon = computed(() => {
      const iconMap = {
        success: "✓",
        warning: "!",
        error: "×",
        validating: "…"
      };
      return effectiveValidateStatus.value ? iconMap[effectiveValidateStatus.value] : "";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": _ctx.name
      }, [
        _ctx.label || _ctx.$slots.label ? (openBlock(), createElementBlock("label", _hoisted_2, [
          showRequiredMark.value ? (openBlock(), createElementBlock("span", _hoisted_3, "*")) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "label", {}, () => [
            createTextVNode(toDisplayString(_ctx.label), 1)
          ]),
          showOptionalMark.value ? (openBlock(), createElementBlock("span", _hoisted_4, "optional")) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_5, [
          createElementVNode("div", _hoisted_6, [
            renderSlot(_ctx.$slots, "default"),
            _ctx.hasFeedback ? (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(feedbackIcon.value), 1)) : createCommentVNode("", true)
          ]),
          hasHelp.value || _ctx.$slots.help ? (openBlock(), createElementBlock("div", _hoisted_8, [
            renderSlot(_ctx.$slots, "help", {}, () => [
              createTextVNode(toDisplayString(effectiveHelp.value), 1)
            ])
          ])) : createCommentVNode("", true),
          _ctx.extra || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_9, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createTextVNode(toDisplayString(_ctx.extra), 1)
            ])
          ])) : createCommentVNode("", true)
        ])
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
