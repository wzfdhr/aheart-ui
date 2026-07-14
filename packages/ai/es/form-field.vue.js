import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, createTextVNode, toDisplayString, createCommentVNode, createBlock, unref } from "vue";
import { Textarea, TreeSelect, Upload, RadioGroup, CheckboxGroup, Select, Switch, InputNumber, DatePicker, TimePicker, Input } from "aheart-ui";
const _hoisted_1 = ["data-field-key", "aria-invalid", "aria-describedby"];
const _hoisted_2 = ["id", "for"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-form__required",
  "aria-hidden": "true"
};
const _hoisted_4 = ["id"];
const _hoisted_5 = ["id"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "form-field",
  props: {
    field: {},
    value: {},
    disabled: { type: Boolean },
    error: {}
  },
  emits: ["update"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const fieldElement = ref();
    const treeData = computed(
      () => (props.field.options ?? []).map((option) => ({
        key: option.value,
        title: option.label,
        disabled: option.disabled
      }))
    );
    const describedBy = computed(
      () => [props.field.description && `${props.field.key}-description`, props.error && `${props.field.key}-error`].filter(Boolean).join(" ") || void 0
    );
    __expose({
      focus: () => {
        var _a;
        return (_a = fieldElement.value) == null ? void 0 : _a.focus({ preventScroll: true });
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "fieldElement",
        ref: fieldElement,
        class: normalizeClass(["aheart-ai-form__field", { "is-error": Boolean(__props.error), "is-disabled": __props.disabled }]),
        "data-field-key": __props.field.key,
        "aria-invalid": __props.error ? "true" : void 0,
        "aria-describedby": describedBy.value,
        tabindex: "-1"
      }, [
        createElementVNode("label", {
          id: `${__props.field.key}-label`,
          for: __props.field.key
        }, [
          createTextVNode(toDisplayString(__props.field.label) + " ", 1),
          __props.field.required ? (openBlock(), createElementBlock("span", _hoisted_3, "*")) : createCommentVNode("", true)
        ], 8, _hoisted_2),
        __props.field.description ? (openBlock(), createElementBlock("p", {
          key: 0,
          id: `${__props.field.key}-description`,
          class: "aheart-ai-form__field-description"
        }, toDisplayString(__props.field.description), 9, _hoisted_4)) : createCommentVNode("", true),
        __props.field.type === "textarea" ? (openBlock(), createBlock(unref(Textarea), {
          key: 1,
          id: __props.field.key,
          "aria-labelledby": `${__props.field.key}-label`,
          "aria-describedby": describedBy.value,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update", $event))
        }, null, 8, ["id", "aria-labelledby", "aria-describedby", "model-value", "placeholder", "disabled"])) : __props.field.type === "tree-select" ? (openBlock(), createBlock(unref(TreeSelect), {
          key: 2,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "model-value": __props.value,
          "tree-data": treeData.value,
          multiple: Array.isArray(__props.value),
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "model-value", "tree-data", "multiple", "disabled"])) : __props.field.type === "upload" ? (openBlock(), createBlock(unref(Upload), {
          key: 3,
          "file-list": __props.value,
          disabled: __props.disabled,
          "onUpdate:fileList": _cache[2] || (_cache[2] = ($event) => emit("update", $event))
        }, null, 8, ["file-list", "disabled"])) : __props.field.type === "radio" ? (openBlock(), createBlock(unref(RadioGroup), {
          key: 4,
          "model-value": __props.value,
          options: __props.field.options,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => emit("update", $event))
        }, null, 8, ["model-value", "options", "disabled"])) : __props.field.type === "checkbox" ? (openBlock(), createBlock(unref(CheckboxGroup), {
          key: 5,
          "model-value": __props.value,
          options: __props.field.options,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => emit("update", $event))
        }, null, 8, ["model-value", "options", "disabled"])) : __props.field.type === "select" ? (openBlock(), createBlock(unref(Select), {
          key: 6,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "model-value": __props.value,
          disabled: __props.disabled,
          options: __props.field.options,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "model-value", "disabled", "options"])) : __props.field.type === "switch" ? (openBlock(), createBlock(unref(Switch), {
          key: 7,
          id: __props.field.key,
          "model-value": Boolean(__props.value),
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "disabled"])) : __props.field.type === "number" ? (openBlock(), createBlock(unref(InputNumber), {
          key: 8,
          id: __props.field.key,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "placeholder", "disabled"])) : __props.field.type === "date" ? (openBlock(), createBlock(unref(DatePicker), {
          key: 9,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => emit("update", $event))
        }, null, 8, ["model-value", "placeholder", "disabled"])) : __props.field.type === "time" ? (openBlock(), createBlock(unref(TimePicker), {
          key: 10,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "model-value", "placeholder", "disabled"])) : (openBlock(), createBlock(unref(Input), {
          key: 11,
          id: __props.field.key,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "aria-describedby": describedBy.value,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "placeholder", "disabled", "aria-describedby"])),
        __props.error ? (openBlock(), createElementBlock("p", {
          key: 12,
          id: `${__props.field.key}-error`,
          class: "aheart-ai-form__field-error",
          role: "alert"
        }, toDisplayString(__props.error), 9, _hoisted_5)) : createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
