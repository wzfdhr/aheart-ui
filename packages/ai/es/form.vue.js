import { defineComponent, computed, reactive, watch, openBlock, createElementBlock, withModifiers, Fragment, renderList, createElementVNode, toDisplayString, createBlock, unref, createCommentVNode, createVNode, withCtx, createTextVNode, nextTick } from "vue";
import { Textarea, TreeSelect, Upload, RadioGroup, CheckboxGroup, Select, Switch, InputNumber, DatePicker, TimePicker, Input, Button } from "aheart-ui";
import { validateAIFormSchema } from "./form-schema.js";
const _hoisted_1 = ["for"];
const _hoisted_2 = {
  key: 11,
  class: "aheart-ai-form__field-error"
};
const _hoisted_3 = {
  key: 1,
  class: "aheart-ai-form__error",
  role: "alert"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const validation = computed(() => validateAIFormSchema(props.schema));
    const values = computed(() => props.modelValue);
    const resolvedValues = computed(() => {
      var _a;
      return (((_a = validation.value.schema) == null ? void 0 : _a.fields) ?? []).reduce((result, field) => {
        result[field.key] = Object.prototype.hasOwnProperty.call(values.value, field.key) ? values.value[field.key] : field.defaultValue;
        return result;
      }, { ...values.value });
    });
    const errors = reactive({});
    const fieldRevisions = reactive({});
    watch(validation, (result) => {
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
    const visibleFields = computed(() => {
      var _a;
      return ((_a = validation.value.schema) == null ? void 0 : _a.fields.filter((field) => matches(field.visibleWhen))) ?? [];
    });
    const isDisabled = (field) => Boolean(field.disabledWhen && matches(field.disabledWhen));
    watch([resolvedValues, visibleFields], () => {
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
      await nextTick();
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
      return validation.value.valid && validation.value.schema ? (openBlock(), createElementBlock("form", {
        key: 0,
        class: "aheart-ai-form",
        onSubmit: withModifiers(submit, ["prevent"])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(visibleFields.value, (field) => {
          return openBlock(), createElementBlock("div", {
            key: field.key,
            class: "aheart-ai-form__field"
          }, [
            createElementVNode("label", {
              for: field.key
            }, toDisplayString(field.label), 9, _hoisted_1),
            field.type === "textarea" ? (openBlock(), createBlock(unref(Textarea), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "tree-select" ? (openBlock(), createBlock(unref(TreeSelect), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              "tree-data": treeData(field),
              multiple: Array.isArray(fieldValue(field)),
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "tree-data", "multiple", "disabled", "onUpdate:modelValue"])) : field.type === "upload" ? (openBlock(), createBlock(unref(Upload), {
              key: fieldKey(field),
              "file-list": fieldValue(field),
              disabled: isDisabled(field),
              "onUpdate:fileList": ($event) => update(field.key, $event)
            }, null, 8, ["file-list", "disabled", "onUpdate:fileList"])) : field.type === "radio" ? (openBlock(), createBlock(unref(RadioGroup), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              options: field.options,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "options", "disabled", "onUpdate:modelValue"])) : field.type === "checkbox" ? (openBlock(), createBlock(unref(CheckboxGroup), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              options: field.options,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "options", "disabled", "onUpdate:modelValue"])) : field.type === "select" ? (openBlock(), createBlock(unref(Select), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              disabled: isDisabled(field),
              options: field.options,
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "disabled", "options", "onUpdate:modelValue"])) : field.type === "switch" ? (openBlock(), createBlock(unref(Switch), {
              key: fieldKey(field),
              id: field.key,
              "model-value": Boolean(fieldValue(field)),
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "disabled", "onUpdate:modelValue"])) : field.type === "number" ? (openBlock(), createBlock(unref(InputNumber), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "date" ? (openBlock(), createBlock(unref(DatePicker), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "time" ? (openBlock(), createBlock(unref(TimePicker), {
              key: fieldKey(field),
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : field.type === "input" ? (openBlock(), createBlock(unref(Input), {
              key: fieldKey(field),
              id: field.key,
              "model-value": fieldValue(field),
              placeholder: field.placeholder,
              disabled: isDisabled(field),
              "onUpdate:modelValue": ($event) => update(field.key, $event)
            }, null, 8, ["id", "model-value", "placeholder", "disabled", "onUpdate:modelValue"])) : createCommentVNode("", true),
            errors[field.key] ? (openBlock(), createElementBlock("p", _hoisted_2, toDisplayString(errors[field.key]), 1)) : createCommentVNode("", true)
          ]);
        }), 128)),
        createVNode(unref(Button), {
          "html-type": "submit",
          type: "primary"
        }, {
          default: withCtx(() => [..._cache[0] || (_cache[0] = [
            createTextVNode("提交", -1)
          ])]),
          _: 1
        })
      ], 32)) : (openBlock(), createElementBlock("div", _hoisted_3, "表单配置无效"));
    };
  }
});
export {
  _sfc_main as default
};
