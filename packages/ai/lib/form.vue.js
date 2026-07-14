"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const aheartUi = require("aheart-ui");
const formSchema = require("./form-schema.js");
const _hoisted_1 = ["id", "for"];
const _hoisted_2 = {
  key: 11,
  class: "aheart-ai-form__field-error"
};
const _hoisted_3 = {
  key: 1,
  class: "aheart-ai-form__error",
  role: "alert"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIForm" },
  __name: "form",
  props: {
    modelValue: { default: () => ({}) },
    schema: {}
  },
  emits: ["update:modelValue", "submit", "schema-error", "validation-error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const validation = vue.computed(() => formSchema.validateAIFormSchema(props.schema));
    const values = vue.computed(() => props.modelValue);
    const resolvedValues = vue.computed(() => {
      var _a;
      return (((_a = validation.value.schema) == null ? void 0 : _a.fields) ?? []).reduce((result, field) => {
        result[field.key] = Object.prototype.hasOwnProperty.call(values.value, field.key) ? values.value[field.key] : field.defaultValue;
        return result;
      }, { ...values.value });
    });
    const errors = vue.reactive({});
    const fieldRevisions = vue.reactive({});
    vue.watch(validation, (result) => {
      if (!result.valid) emit("schema-error", result.errors);
    }, { immediate: true });
    const matches = (condition) => {
      if (!condition) return true;
      const value = resolvedValues.value[condition.field];
      if (condition.operator === "equals") return value === condition.value;
      if (condition.operator === "not-equals") return value !== condition.value;
      if (condition.operator === "includes") return Array.isArray(value) ? value.includes(condition.value) : String(value ?? "").includes(String(condition.value ?? ""));
      if (condition.operator === "not-includes") return Array.isArray(value) ? !value.includes(condition.value) : !String(value ?? "").includes(String(condition.value ?? ""));
      if (condition.operator === "is-empty") return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
      return !(value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0);
    };
    const visibleFields = vue.computed(() => {
      var _a;
      return ((_a = validation.value.schema) == null ? void 0 : _a.fields.filter((field) => matches(field.visibleWhen))) ?? [];
    });
    const isDisabled = (field) => Boolean(field.disabledWhen && matches(field.disabledWhen));
    vue.watch([resolvedValues, visibleFields], () => {
      var _a;
      const fields = ((_a = validation.value.schema) == null ? void 0 : _a.fields) ?? [];
      Object.keys(errors).forEach((key) => {
        const field = fields.find((candidate) => candidate.key === key);
        if (!field || !matches(field.visibleWhen) || isDisabled(field)) delete errors[key];
      });
    });
    const fieldValue = (field) => {
      const value = resolvedValues.value[field.key];
      if (value !== void 0) return value;
      return field.type === "checkbox" || field.type === "upload" ? [] : "";
    };
    const fieldKey = (field) => `${field.key}-${fieldRevisions[field.key] ?? 0}`;
    const update = async (key, value) => {
      delete errors[key];
      emit("update:modelValue", { ...values.value, [key]: value });
      await vue.nextTick();
      if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1;
    };
    const isEmptyValue = (value) => value === void 0 || value === null || value === "" || value === false || Array.isArray(value) && value.length === 0;
    const treeData = (field) => (field.options ?? []).map((option) => ({ key: option.value, title: option.label, disabled: option.disabled }));
    const submit = () => {
      Object.keys(errors).forEach((key) => delete errors[key]);
      const validationErrors = visibleFields.value.filter((field) => field.required && !isDisabled(field) && isEmptyValue(resolvedValues.value[field.key])).map((field) => ({ key: field.key, message: `${field.label}为必填项` }));
      validationErrors.forEach((error) => {
        errors[error.key] = error.message;
      });
      if (validationErrors.length) {
        emit("validation-error", validationErrors);
        return;
      }
      emit("submit", { ...resolvedValues.value });
    };
    return (_ctx, _cache) => {
      return validation.value.valid && validation.value.schema ? (vue.openBlock(), vue.createElementBlock("form", {
        key: 0,
        class: "aheart-ai-form",
        onSubmit: vue.withModifiers(submit, ["prevent"])
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleFields.value, (field) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: field.key,
            class: "aheart-ai-form__field"
          }, [
            vue.createElementVNode("label", {
              id: `${field.key}-label`,
              for: field.key
            }, vue.toDisplayString(field.label), 9, _hoisted_1),
            field.type === "textarea" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Textarea), {
              key: fieldKey(field),
              id: field.key,
              "aria-labelledby": `${field.key}-label`,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "aria-labelledby", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "tree-select" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.TreeSelect), {
              key: fieldKey(field),
              id: field.key,
              "labelled-by": `${field.key}-label`,
              "model-value": fieldValue(field),
              "tree-data": treeData(field),
              multiple: Array.isArray(fieldValue(field)),
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "labelled-by", "model-value", "tree-data", "multiple", "disabled", "onUpdate:modelValue"])) : field.type === "upload" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Upload), {
              key: fieldKey(field),
              "file-list": fieldValue(field),
              disabled: isDisabled(field),
              "onUpdate:fileList": ($event) => update(field.key, $event)
            }, null, 8, ["file-list", "disabled", "onUpdate:fileList"])) : field.type === "radio" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.RadioGroup), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              options: field.options,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "options", "disabled", "onUpdate:modelValue"])) : field.type === "checkbox" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.CheckboxGroup), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              options: field.options,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "options", "disabled", "onUpdate:modelValue"])) : field.type === "select" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Select), {
              key: fieldKey(field),
              id: field.key,
              "labelled-by": `${field.key}-label`,
              "model-value": fieldValue(field),
              disabled: isDisabled(field),
              options: field.options,
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "labelled-by", "model-value", "disabled", "options", "onUpdate:modelValue"])) : field.type === "switch" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Switch), {
              key: fieldKey(field),
              id: field.key,
              "model-value": Boolean(fieldValue(field)),
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "disabled", "onUpdate:modelValue"])) : field.type === "number" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.InputNumber), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "date" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.DatePicker), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "time" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.TimePicker), {
              key: fieldKey(field),
              id: field.key,
              "labelled-by": `${field.key}-label`,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "labelled-by", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "input" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Input), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : vue.createCommentVNode("", true),
            errors[field.key] ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_2, vue.toDisplayString(errors[field.key]), 1)) : vue.createCommentVNode("", true)
          ]);
        }), 128)),
        vue.createVNode(vue.unref(aheartUi.Button), {
          "html-type": "submit",
          type: "primary"
        }, {
          default: vue.withCtx(() => [..._cache[0] || (_cache[0] = [
            vue.createTextVNode("提交", -1)
          ])]),
          _: 1
        })
      ], 32)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, "表单配置无效"));
    };
  }
});
exports.default = _sfc_main;
