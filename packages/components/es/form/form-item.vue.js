import { defineComponent, inject, computed, watch, onBeforeUnmount, renderSlot, withDirectives, openBlock, createElementBlock, normalizeClass, createCommentVNode, createVNode, unref, normalizeProps, guardReactiveProps, withCtx, createElementVNode, toDisplayString, vShow, isVNode } from "vue";
import _sfc_main$1 from "../tooltip/tooltip.vue.js";
import { formItemProps, formContextKey } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AFormItem"
  },
  __name: "form-item",
  props: formItemProps,
  setup(__props) {
    const props = __props;
    const formContext = inject(formContextKey, void 0);
    const ATooltip = _sfc_main$1;
    const AFormItemRenderNode = defineComponent({
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
    const isTooltipConfig = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && !isVNode(value);
    const tooltipTitle = computed(() => {
      if (isTooltipConfig(props.tooltip)) {
        return props.tooltip.title;
      }
      return props.tooltip;
    });
    const tooltipIcon = computed(
      () => isTooltipConfig(props.tooltip) && props.tooltip.icon !== void 0 ? props.tooltip.icon : "?"
    );
    const resolvedTooltipProps = computed(() => {
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
    const effectiveRules = computed(() => props.rules ?? []);
    const fieldErrors = computed(() => props.name ? (formContext == null ? void 0 : formContext.getFieldErrors(props.name)) ?? [] : []);
    const isRequired = computed(() => Boolean(props.required || props.name && (formContext == null ? void 0 : formContext.isFieldRequired(props.name))));
    const showRequiredMark = computed(() => isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) !== false);
    const showOptionalMark = computed(
      () => Boolean(props.label || props.name) && !isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) === "optional"
    );
    const effectiveValidateStatus = computed(() => props.validateStatus ?? (fieldErrors.value.length > 0 ? "error" : void 0));
    const effectiveHelp = computed(() => props.help !== void 0 ? props.help : fieldErrors.value[0] ?? "");
    const hasHelp = computed(() => hasRenderableContent(effectiveHelp.value));
    const hasExtra = computed(() => hasRenderableContent(props.extra));
    const hasTooltip = computed(() => hasRenderableContent(tooltipTitle.value));
    watch(
      () => [props.name, effectiveRules.value, props.validateFirst],
      ([name, rules, validateFirst], previous) => {
        const previousName = previous == null ? void 0 : previous[0];
        if (previousName && previousName !== name) {
          formContext == null ? void 0 : formContext.unregisterField(previousName);
        }
        if (name) {
          formContext == null ? void 0 : formContext.registerField(name, rules, validateFirst);
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
      [`aheart-form-item--${props.layout}`]: props.layout,
      [`aheart-form-item--label-${props.labelAlign}`]: props.labelAlign,
      "aheart-form-item--colon": props.colon === true,
      "aheart-form-item--no-colon": props.colon === false,
      "aheart-form-item--hidden": props.hidden,
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
      return _ctx.noStyle ? renderSlot(_ctx.$slots, "default", { key: 0 }) : withDirectives((openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": _ctx.name
      }, [
        _ctx.$slots.label || _ctx.label !== void 0 && _ctx.label !== null ? (openBlock(), createElementBlock("label", {
          key: 0,
          class: "aheart-form-item__label",
          for: _ctx.htmlFor
        }, [
          showRequiredMark.value ? (openBlock(), createElementBlock("span", _hoisted_3, "*")) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "label", {}, () => [
            createVNode(unref(AFormItemRenderNode), { node: _ctx.label }, null, 8, ["node"])
          ]),
          showOptionalMark.value ? (openBlock(), createElementBlock("span", _hoisted_4, "optional")) : createCommentVNode("", true),
          hasTooltip.value ? (openBlock(), createElementBlock("span", _hoisted_5, [
            createVNode(unref(ATooltip), normalizeProps(guardReactiveProps(resolvedTooltipProps.value)), {
              default: withCtx(() => [
                createElementVNode("span", _hoisted_6, [
                  createVNode(unref(AFormItemRenderNode), { node: tooltipIcon.value }, null, 8, ["node"])
                ])
              ]),
              _: 1
            }, 16)
          ])) : createCommentVNode("", true)
        ], 8, _hoisted_2)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_7, [
          createElementVNode("div", _hoisted_8, [
            renderSlot(_ctx.$slots, "default"),
            _ctx.hasFeedback ? (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString(feedbackIcon.value), 1)) : createCommentVNode("", true)
          ]),
          hasHelp.value || _ctx.$slots.help ? (openBlock(), createElementBlock("div", _hoisted_10, [
            renderSlot(_ctx.$slots, "help", {}, () => [
              createVNode(unref(AFormItemRenderNode), { node: effectiveHelp.value }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true),
          hasExtra.value || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_11, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createVNode(unref(AFormItemRenderNode), { node: _ctx.extra }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true)
        ])
      ], 10, _hoisted_1)), [
        [vShow, !_ctx.hidden]
      ]);
    };
  }
});
export {
  _sfc_main as default
};
