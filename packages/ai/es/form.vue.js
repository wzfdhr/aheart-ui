import { defineComponent, computed, reactive, watch, openBlock, createBlock, unref, withCtx, createElementBlock, toDisplayString, createCommentVNode, createElementVNode, Fragment, renderList, resolveDynamicComponent, createVNode, createTextVNode, nextTick } from "vue";
import { Form, FormItem, Button } from "aheart-ui";
import _sfc_main$1 from "./form-field.vue.js";
import { validateAIFormSchema } from "./form-schema.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-ai-form__header"
};
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
const _hoisted_4 = {
  key: 1,
  class: "aheart-ai-form__error-summary",
  role: "alert",
  tabindex: "-1"
};
const _hoisted_5 = ["onClick"];
const _hoisted_6 = { key: 0 };
const _hoisted_7 = { key: 0 };
const _hoisted_8 = {
  key: 2,
  class: "aheart-ai-form__submit-error",
  role: "alert"
};
const _hoisted_9 = { class: "aheart-ai-form__footer" };
const _hoisted_10 = {
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
    const formModel = reactive({});
    const pendingUpdates = /* @__PURE__ */ new Map();
    const fieldRevisions = reactive({});
    const fieldRefs = /* @__PURE__ */ new Map();
    watch(
      validation,
      (result) => {
        if (!result.valid) emit("schema-error", result.errors);
      },
      { immediate: true }
    );
    watch(
      resolvedValues,
      (next, previous) => {
        Object.keys(formModel).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(next, key)) delete formModel[key];
        });
        Object.entries(next).forEach(([key, value]) => {
          const accepted = pendingUpdates.get(key);
          if (pendingUpdates.has(key)) {
            if (isSameValue(value, accepted)) {
              pendingUpdates.delete(key);
              delete errors[key];
            }
          } else if (previous && !isSameValue(value, previous[key])) {
            delete errors[key];
          }
          formModel[key] = cloneSnapshot(value);
        });
      },
      { immediate: true, deep: true }
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
    function isSameValue(left, right) {
      if (Object.is(left, right)) return true;
      if (Array.isArray(left) || Array.isArray(right)) {
        return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => isSameValue(item, right[index]));
      }
      if (left && right && typeof left === "object" && typeof right === "object") {
        const leftRecord = left;
        const rightRecord = right;
        const leftKeys = Object.keys(leftRecord);
        const rightKeys = Object.keys(rightRecord);
        return leftKeys.length === rightKeys.length && leftKeys.every((key) => Object.prototype.hasOwnProperty.call(rightRecord, key) && isSameValue(leftRecord[key], rightRecord[key]));
      }
      return false;
    }
    function cloneSnapshot(value) {
      if (Array.isArray(value)) return value.map((item) => cloneSnapshot(item));
      if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneSnapshot(item)]));
      }
      return value;
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
      pendingUpdates.set(key, value);
      emit("update:modelValue", { ...values.value, [key]: value });
      await nextTick();
      if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1;
    };
    const fieldRules = (field) => {
      if (!field.required || isDisabled(field)) return [];
      const message = `${field.label}为必填项`;
      return [
        { required: true, message },
        {
          message,
          validator: (_rule, value) => isMissingRequiredValue(field, value) ? message : void 0
        }
      ];
    };
    const handleSubmit = () => {
      if (props.disabled || props.submitting) return;
      Object.keys(errors).forEach((key) => delete errors[key]);
    };
    const handleFinish = (result) => {
      if (props.disabled || props.submitting) return;
      emit("submit", { ...result });
    };
    const handleFinishFailed = (info) => {
      if (props.disabled || props.submitting) return;
      const validationErrors = info.errorFields.map((error) => {
        var _a;
        const key = typeof error.name === "string" ? error.name : String(error.name[0]);
        const field = (_a = validation.value.schema) == null ? void 0 : _a.fields.find((candidate) => candidate.key === key);
        const message = error.errors[0] || `${(field == null ? void 0 : field.label) ?? key}为必填项`;
        return { key, message };
      }).filter((error) => visibleFields.value.some((field) => field.key === error.key) && !isDisabled(validation.value.schema.fields.find((field) => field.key === error.key)));
      validationErrors.forEach((error) => {
        errors[error.key] = error.message;
      });
      if (validationErrors.length) {
        emit("validation-error", validationErrors);
        void nextTick(() => focusField(validationErrors[0].key));
      }
    };
    return (_ctx, _cache) => {
      return validation.value.valid && validation.value.schema ? (openBlock(), createBlock(unref(Form), {
        key: 0,
        ref: "formElement",
        class: "aheart-ai-form",
        model: formModel,
        disabled: __props.disabled || __props.submitting,
        "required-mark": false,
        layout: "vertical",
        "aria-busy": __props.submitting ? "true" : "false",
        onSubmit: handleSubmit,
        onFinish: handleFinish,
        onFinishFailed: handleFinishFailed
      }, {
        default: withCtx(() => [
          validation.value.schema.title || validation.value.schema.description ? (openBlock(), createElementBlock("header", _hoisted_1, [
            validation.value.schema.title ? (openBlock(), createElementBlock("h2", _hoisted_2, toDisplayString(validation.value.schema.title), 1)) : createCommentVNode("", true),
            validation.value.schema.description ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(validation.value.schema.description), 1)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true),
          errorList.value.length ? (openBlock(), createElementBlock("div", _hoisted_4, [
            createElementVNode("strong", null, "请完成 " + toDisplayString(errorList.value.length) + " 个必填项", 1),
            createElementVNode("ul", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(errorList.value, (error) => {
                return openBlock(), createElementBlock("li", {
                  key: error.key
                }, [
                  createElementVNode("button", {
                    type: "button",
                    onClick: ($event) => focusField(error.key)
                  }, toDisplayString(error.message), 9, _hoisted_5)
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
                section.group ? (openBlock(), createElementBlock("legend", _hoisted_6, [
                  createElementVNode("span", null, toDisplayString(section.group.title), 1),
                  section.group.description ? (openBlock(), createElementBlock("small", _hoisted_7, toDisplayString(section.group.description), 1)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(section.fields, (field) => {
                  return openBlock(), createBlock(unref(FormItem), {
                    key: fieldKey(field),
                    name: field.key,
                    rules: fieldRules(field),
                    "no-style": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$1, {
                        ref_for: true,
                        ref: (instance) => setFieldRef(field.key, instance),
                        field,
                        value: fieldValue(field),
                        disabled: isDisabled(field),
                        error: errors[field.key],
                        onUpdate: ($event) => update(field.key, $event)
                      }, null, 8, ["field", "value", "disabled", "error", "onUpdate"])
                    ]),
                    _: 2
                  }, 1032, ["name", "rules"]);
                }), 128))
              ]),
              _: 2
            }, 1032, ["data-group-key"]);
          }), 128)),
          __props.submitError ? (openBlock(), createElementBlock("p", _hoisted_8, toDisplayString(__props.submitError), 1)) : createCommentVNode("", true),
          createElementVNode("footer", _hoisted_9, [
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
        ]),
        _: 1
      }, 8, ["model", "disabled", "aria-busy"])) : (openBlock(), createElementBlock("div", _hoisted_10, [
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
