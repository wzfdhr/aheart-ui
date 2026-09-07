import { defineComponent, inject, useSlots, ref, computed, onMounted, onUpdated, provide, watch, onBeforeUnmount, openBlock, createBlock, unref, withDirectives, createElementBlock, normalizeClass, createCommentVNode, renderSlot, createVNode, normalizeProps, guardReactiveProps, withCtx, createElementVNode, toDisplayString, vShow, nextTick, isVNode, cloneVNode, Fragment } from "vue";
import _sfc_main$1 from "../tooltip/tooltip.vue.js";
import { useStableId } from "../utils/use-stable-id.js";
import { mergeAriaIds, formControlKey } from "./control-context.js";
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
const _hoisted_10 = ["id", "role"];
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
    const slots = useSlots();
    const itemRef = ref();
    const explicitControlId = ref();
    const stableId = useStableId(void 0, "aheart-field").value;
    const controlId = computed(() => props.htmlFor ?? `${stableId}-control`);
    const labelId = `${stableId}-label`;
    const helpId = `${stableId}-help`;
    const errorId = `${stableId}-error`;
    const extraId = `${stableId}-extra`;
    const declaredControlId = () => {
      var _a;
      const find = (nodes) => {
        var _a2;
        for (const node of nodes) {
          if (Array.isArray(node)) {
            const id = find(node);
            if (id)
              return id;
          } else if (isVNode(node)) {
            const componentName = typeof node.type === "object" && node.type ? node.type.name : void 0;
            if (componentName === "AFormItem")
              continue;
            const isControl = typeof node.type !== "string" ? node.type !== Fragment : ["input", "select", "textarea"].includes(node.type);
            if (isControl && typeof ((_a2 = node.props) == null ? void 0 : _a2.id) === "string") {
              return componentName === "ADateRangePicker" || componentName === "ATimeRangePicker" ? `${node.props.id}-start` : node.props.id;
            }
            if (componentName === "ADateRangePicker" || componentName === "ATimeRangePicker")
              return `${controlId.value}-start`;
            if ((typeof node.type === "string" || node.type === Fragment) && Array.isArray(node.children)) {
              const id = find(node.children);
              if (id)
                return id;
            }
          }
        }
      };
      return find(((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
    let disposed = false;
    const notifyControl = (kind) => {
      const name = typeof props.name === "string" ? props.name : props.name ? [...props.name] : void 0;
      if (name === void 0)
        return;
      void nextTick(() => {
        if (disposed || JSON.stringify(name) !== JSON.stringify(props.name))
          return;
        if (kind === "change")
          formContext == null ? void 0 : formContext.onFieldChange(name);
        else
          formContext == null ? void 0 : formContext.onFieldBlur(name);
      });
    };
    const syncExplicitControlId = () => {
      var _a, _b;
      explicitControlId.value = ((_b = (_a = itemRef.value) == null ? void 0 : _a.querySelector('.aheart-form-item__content input:not([type="hidden"]), .aheart-form-item__content [role="combobox"], .aheart-form-item__content select, .aheart-form-item__content textarea')) == null ? void 0 : _b.id) || void 0;
    };
    onMounted(syncExplicitControlId);
    onUpdated(syncExplicitControlId);
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
    const labelMessageVariable = computed(
      () => typeof props.label === "string" || typeof props.label === "number" ? String(props.label) : void 0
    );
    const effectiveMessageVariables = computed(() => {
      var _a;
      return {
        name: typeof props.name === "string" ? props.name : ((_a = props.name) == null ? void 0 : _a.join(".")) ?? "",
        ...labelMessageVariable.value !== void 0 ? { label: labelMessageVariable.value } : {},
        ...props.messageVariables
      };
    });
    const fieldErrors = computed(() => props.name !== void 0 ? (formContext == null ? void 0 : formContext.getFieldErrors(props.name)) ?? [] : []);
    const isRequired = computed(() => Boolean(props.required || props.name !== void 0 && (formContext == null ? void 0 : formContext.isFieldRequired(props.name))));
    const showRequiredMark = computed(() => isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) !== false);
    const showOptionalMark = computed(
      () => Boolean(props.label || props.name) && !isRequired.value && (formContext == null ? void 0 : formContext.requiredMark.value) === "optional"
    );
    const effectiveValidateStatus = computed(
      () => props.validateStatus ?? (props.name !== void 0 && (formContext == null ? void 0 : formContext.isFieldValidating(props.name)) ? "validating" : fieldErrors.value.length > 0 ? "error" : void 0)
    );
    const effectiveHelp = computed(() => props.help !== void 0 ? props.help : fieldErrors.value[0] ?? "");
    const hasHelp = computed(() => hasRenderableContent(effectiveHelp.value));
    const hasExtra = computed(() => hasRenderableContent(props.extra));
    const hasTooltip = computed(() => hasRenderableContent(tooltipTitle.value));
    const labelledBy = computed(() => !props.noStyle && (slots.label || props.label !== void 0 && props.label !== null) ? labelId : void 0);
    const describedBy = computed(() => props.noStyle ? void 0 : mergeAriaIds(
      hasHelp.value || slots.help ? effectiveValidateStatus.value === "error" ? errorId : helpId : void 0,
      hasExtra.value || slots.extra ? extraId : void 0
    ));
    provide(formControlKey, {
      controlId,
      labelledBy,
      describedBy,
      invalid: computed(() => effectiveValidateStatus.value === "error"),
      status: effectiveValidateStatus,
      change: () => notifyControl("change"),
      blur: () => notifyControl("blur")
    });
    const AFormControlSlot = defineComponent({
      name: "AFormControlSlot",
      setup() {
        return () => {
          var _a;
          let nativeIndex = 0;
          const visit = (node) => {
            var _a2, _b, _c, _d, _e;
            if (Array.isArray(node))
              return node.map(visit);
            if (!isVNode(node))
              return node;
            if (typeof node.type === "string" && ["input", "select", "textarea"].includes(node.type) && ((_a2 = node.props) == null ? void 0 : _a2.type) !== "hidden") {
              const index = nativeIndex++;
              return cloneVNode(node, {
                id: ((_b = node.props) == null ? void 0 : _b.id) ?? (index ? `${controlId.value}-${index}` : controlId.value),
                "aria-labelledby": mergeAriaIds((_c = node.props) == null ? void 0 : _c["aria-labelledby"], labelledBy.value),
                "aria-describedby": mergeAriaIds((_d = node.props) == null ? void 0 : _d["aria-describedby"], describedBy.value),
                "aria-invalid": ((_e = node.props) == null ? void 0 : _e["aria-invalid"]) ?? (effectiveValidateStatus.value === "error" ? "true" : void 0),
                onInput: () => notifyControl("change"),
                onChange: () => notifyControl("change"),
                onBlur: () => notifyControl("blur")
              });
            }
            if ((typeof node.type === "string" || node.type === Fragment) && Array.isArray(node.children)) {
              const copy = cloneVNode(node);
              copy.children = node.children.map((child) => visit(child));
              return copy;
            }
            return node;
          };
          return visit(((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
        };
      }
    });
    let registeredName;
    watch(
      () => [props.name, effectiveRules.value, props.validateFirst, effectiveMessageVariables.value, props.dependencies, props.validateTrigger, props.preserve],
      ([name, rules, validateFirst, messageVariables, dependencies, validateTrigger, preserve]) => {
        const previousName = registeredName;
        if (previousName !== void 0 && JSON.stringify(previousName) !== JSON.stringify(name)) {
          formContext == null ? void 0 : formContext.unregisterField(previousName);
        }
        if (name !== void 0) {
          formContext == null ? void 0 : formContext.registerField(name, rules, validateFirst, messageVariables, { dependencies, validateTrigger, preserve });
        }
        registeredName = typeof name === "string" ? name : name ? [...name] : void 0;
      },
      { immediate: true, deep: true }
    );
    onBeforeUnmount(() => {
      disposed = true;
      if (registeredName !== void 0) {
        formContext == null ? void 0 : formContext.unregisterField(registeredName);
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
      return _ctx.noStyle ? (openBlock(), createBlock(unref(AFormControlSlot), { key: 0 })) : withDirectives((openBlock(), createElementBlock("div", {
        key: 1,
        ref_key: "itemRef",
        ref: itemRef,
        class: normalizeClass(["aheart-form-item", formItemClass.value]),
        "data-name": typeof _ctx.name === "string" ? _ctx.name : JSON.stringify(_ctx.name)
      }, [
        _ctx.$slots.label || _ctx.label !== void 0 && _ctx.label !== null ? (openBlock(), createElementBlock("label", {
          key: 0,
          class: "aheart-form-item__label",
          id: labelId,
          for: _ctx.htmlFor ?? declaredControlId() ?? explicitControlId.value ?? controlId.value
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
            createVNode(unref(AFormControlSlot)),
            _ctx.hasFeedback ? (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString(feedbackIcon.value), 1)) : createCommentVNode("", true)
          ]),
          hasHelp.value || _ctx.$slots.help ? (openBlock(), createElementBlock("div", {
            key: 0,
            id: effectiveValidateStatus.value === "error" ? errorId : helpId,
            class: "aheart-form-item__help",
            role: effectiveValidateStatus.value === "error" ? "alert" : void 0
          }, [
            renderSlot(_ctx.$slots, "help", {}, () => [
              createVNode(unref(AFormItemRenderNode), { node: effectiveHelp.value }, null, 8, ["node"])
            ])
          ], 8, _hoisted_10)) : createCommentVNode("", true),
          hasExtra.value || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
            key: 1,
            id: extraId,
            class: "aheart-form-item__extra"
          }, [
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
