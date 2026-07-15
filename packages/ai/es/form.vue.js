import { defineComponent, computed, reactive, watch, openBlock, createElementBlock, withModifiers, toDisplayString, createCommentVNode, createElementVNode, Fragment, renderList, createBlock, resolveDynamicComponent, withCtx, createVNode, unref, createTextVNode, nextTick } from "vue";
import { Button } from "aheart-ui";
import _sfc_main$1 from "./form-field.vue.js";
import { validateAIFormSchema } from "./form-schema.js";
const _hoisted_1 = ["aria-busy"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-ai-form__header"
};
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = {
  key: 1,
  class: "aheart-ai-form__error-summary",
  role: "alert",
  tabindex: "-1"
};
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { key: 0 };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = {
  key: 2,
  class: "aheart-ai-form__submit-error",
  role: "alert"
};
const _hoisted_10 = { class: "aheart-ai-form__footer" };
const _hoisted_11 = {
  key: 1,
  class: "aheart-ai-form__error",
  role: "alert"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIForm" },
  __name: "form",
  props: {
    modelValue: { default: () => ({}) },
    schema: {},
    disabled: { type: Boolean, default: false },
    submitting: { type: Boolean, default: false },
    submitText: { default: "提交" },
    submitError: { default: void 0 }
  },
  emits: ["update:modelValue", "submit", "schema-error", "validation-error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const validation = computed(() => validateAIFormSchema(props.schema));
    const values = computed(() => props.modelValue);
    const resolvedValues = computed(
      () => {
        var _a;
        return (((_a = validation.value.schema) == null ? void 0 : _a.fields) ?? []).reduce(
          (result, field) => {
            result[field.key] = Object.prototype.hasOwnProperty.call(values.value, field.key) ? values.value[field.key] : field.defaultValue;
            return result;
          },
          { ...values.value }
        );
      }
    );
    const errors = reactive({});
    const fieldRevisions = reactive({});
    const fieldRefs = /* @__PURE__ */ new Map();
    watch(
      validation,
      (result) => {
        if (!result.valid) emit("schema-error", result.errors);
      },
      { immediate: true }
    );
    const matches = (condition) => {
      if (!condition) return true;
      const value = resolvedValues.value[condition.field];
      if (condition.operator === "equals") return value === condition.value;
      if (condition.operator === "not-equals") return value !== condition.value;
      if (condition.operator === "includes") {
        return Array.isArray(value) ? value.includes(condition.value) : String(value ?? "").includes(String(condition.value ?? ""));
      }
      if (condition.operator === "not-includes") {
        return Array.isArray(value) ? !value.includes(condition.value) : !String(value ?? "").includes(String(condition.value ?? ""));
      }
      if (condition.operator === "is-empty") return isEmptyValue(value);
      return !isEmptyValue(value);
    };
    const visibleFields = computed(
      () => {
        var _a;
        return ((_a = validation.value.schema) == null ? void 0 : _a.fields.filter((field) => matches(field.visibleWhen))) ?? [];
      }
    );
    const isDisabled = (field) => props.disabled || props.submitting || Boolean(field.disabledWhen && matches(field.disabledWhen));
    const sections = computed(() => {
      const schema = validation.value.schema;
      if (!schema) return [];
      const result = (schema.groups ?? []).map((group) => ({
        key: group.key,
        group,
        fields: visibleFields.value.filter((field) => field.group === group.key)
      })).filter((section) => section.fields.length > 0);
      const ungrouped = visibleFields.value.filter((field) => !field.group);
      if (ungrouped.length) result.push({ key: "__ungrouped", fields: ungrouped });
      return result;
    });
    const errorList = computed(
      () => visibleFields.value.filter((field) => errors[field.key]).map((field) => ({ key: field.key, message: errors[field.key] }))
    );
    watch([resolvedValues, visibleFields], () => {
      var _a;
      const fields = ((_a = validation.value.schema) == null ? void 0 : _a.fields) ?? [];
      Object.keys(errors).forEach((key) => {
        const field = fields.find((candidate) => candidate.key === key);
        if (!field || !matches(field.visibleWhen) || isDisabled(field)) delete errors[key];
      });
    });
    function isEmptyValue(value) {
      return value === void 0 || value === null || value === "" || value === false || Array.isArray(value) && (value.length === 0 || value.every((item) => item === void 0 || item === null || item === ""));
    }
    const isMissingRequiredValue = (field, value) => field.type === "date-range" || field.type === "time-range" ? !Array.isArray(value) || value.length !== 2 || value.some((item) => item === void 0 || item === null || item === "") : isEmptyValue(value);
    const fieldValue = (field) => {
      const value = resolvedValues.value[field.key];
      if (value !== void 0) return value;
      if (field.type === "checkbox" || field.type === "upload") return [];
      if (field.type === "date-range" || field.type === "time-range") return void 0;
      return "";
    };
    const fieldKey = (field) => `${field.key}-${fieldRevisions[field.key] ?? 0}`;
    const setFieldRef = (key, instance) => {
      if (instance && typeof instance.focus === "function") fieldRefs.set(key, instance);
      else fieldRefs.delete(key);
    };
    const focusField = (key) => {
      var _a;
      return (_a = fieldRefs.get(key)) == null ? void 0 : _a.focus();
    };
    const update = async (key, value) => {
      delete errors[key];
      emit("update:modelValue", { ...values.value, [key]: value });
      await nextTick();
      if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1;
    };
    const submit = async () => {
      if (props.disabled || props.submitting) return;
      Object.keys(errors).forEach((key) => delete errors[key]);
      const validationErrors = visibleFields.value.filter((field) => field.required && !isDisabled(field) && isMissingRequiredValue(field, resolvedValues.value[field.key])).map((field) => ({ key: field.key, message: `${field.label}为必填项` }));
      validationErrors.forEach((error) => {
        errors[error.key] = error.message;
      });
      if (validationErrors.length) {
        emit("validation-error", validationErrors);
        await nextTick();
        focusField(validationErrors[0].key);
        return;
      }
      emit("submit", { ...resolvedValues.value });
    };
    return (_ctx, _cache) => {
      return validation.value.valid && validation.value.schema ? (openBlock(), createElementBlock("form", {
        key: 0,
        ref: "formElement",
        class: "aheart-ai-form",
        "aria-busy": __props.submitting ? "true" : "false",
        onSubmit: withModifiers(submit, ["prevent"])
      }, [
        validation.value.schema.title || validation.value.schema.description ? (openBlock(), createElementBlock("header", _hoisted_2, [
          validation.value.schema.title ? (openBlock(), createElementBlock("h2", _hoisted_3, toDisplayString(validation.value.schema.title), 1)) : createCommentVNode("", true),
          validation.value.schema.description ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(validation.value.schema.description), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        errorList.value.length ? (openBlock(), createElementBlock("div", _hoisted_5, [
          createElementVNode("strong", null, "请完成 " + toDisplayString(errorList.value.length) + " 个必填项", 1),
          createElementVNode("ul", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(errorList.value, (error) => {
              return openBlock(), createElementBlock("li", {
                key: error.key
              }, [
                createElementVNode("button", {
                  type: "button",
                  onClick: ($event) => focusField(error.key)
                }, toDisplayString(error.message), 9, _hoisted_6)
              ]);
            }), 128))
          ])
        ])) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(sections.value, (section) => {
          var _a;
          return openBlock(), createBlock(resolveDynamicComponent(section.group ? "fieldset" : "section"), {
            key: section.key,
            class: "aheart-ai-form__group",
            "data-group-key": (_a = section.group) == null ? void 0 : _a.key
          }, {
            default: withCtx(() => [
              section.group ? (openBlock(), createElementBlock("legend", _hoisted_7, [
                createElementVNode("span", null, toDisplayString(section.group.title), 1),
                section.group.description ? (openBlock(), createElementBlock("small", _hoisted_8, toDisplayString(section.group.description), 1)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(section.fields, (field) => {
                return openBlock(), createBlock(_sfc_main$1, {
                  key: fieldKey(field),
                  ref_for: true,
                  ref: (instance) => setFieldRef(field.key, instance),
                  field,
                  value: fieldValue(field),
                  disabled: isDisabled(field),
                  error: errors[field.key],
                  onUpdate: ($event) => update(field.key, $event)
                }, null, 8, ["field", "value", "disabled", "error", "onUpdate"]);
              }), 128))
            ]),
            _: 2
          }, 1032, ["data-group-key"]);
        }), 128)),
        __props.submitError ? (openBlock(), createElementBlock("p", _hoisted_9, toDisplayString(__props.submitError), 1)) : createCommentVNode("", true),
        createElementVNode("footer", _hoisted_10, [
          createVNode(unref(Button), {
            "html-type": "submit",
            type: "primary",
            loading: __props.submitting,
            disabled: __props.disabled
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.submitText), 1)
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ])
      ], 40, _hoisted_1)) : (openBlock(), createElementBlock("div", _hoisted_11, [
        _cache[0] || (_cache[0] = createElementVNode("strong", null, "表单配置无效", -1)),
        createElementVNode("ul", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(validation.value.errors, (error) => {
            return openBlock(), createElementBlock("li", { key: error }, toDisplayString(error), 1);
          }), 128))
        ])
      ]));
    };
  }
});
export {
  _sfc_main as default
};
