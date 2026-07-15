"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const aheartUi = require("aheart-ui");
const _hoisted_1 = ["data-field-key", "aria-invalid", "aria-describedby"];
const _hoisted_2 = ["id", "for"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-form__required",
  "aria-hidden": "true"
};
const _hoisted_4 = ["id"];
const _hoisted_5 = ["id"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
    const fieldElement = vue.ref();
    const rangeControl = vue.ref();
    const treeData = vue.computed(
      () => (props.field.options ?? []).map((option) => ({
        key: option.value,
        title: option.label,
        disabled: option.disabled
      }))
    );
    const describedBy = vue.computed(
      () => [props.field.description && `${props.field.key}-description`, props.error && `${props.field.key}-error`].filter(Boolean).join(" ") || void 0
    );
    const controlId = vue.computed(
      () => props.field.type === "date-range" || props.field.type === "time-range" ? `${props.field.key}-start` : props.field.key
    );
    __expose({
      focus: () => {
        var _a, _b;
        if (rangeControl.value) {
          rangeControl.value.focus("start");
          return;
        }
        (_b = (_a = fieldElement.value) == null ? void 0 : _a.querySelector('input, button, [role="combobox"], [tabindex="0"]')) == null ? void 0 : _b.focus({ preventScroll: true });
      }
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "fieldElement",
        ref: fieldElement,
        class: vue.normalizeClass(["aheart-ai-form__field", { "is-error": Boolean(__props.error), "is-disabled": __props.disabled }]),
        "data-field-key": __props.field.key,
        "aria-invalid": __props.error ? "true" : void 0,
        "aria-describedby": describedBy.value,
        tabindex: "-1"
      }, [
        vue.createElementVNode("label", {
          id: `${__props.field.key}-label`,
          for: controlId.value
        }, [
          vue.createTextVNode(vue.toDisplayString(__props.field.label) + " ", 1),
          __props.field.required ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, "*")) : vue.createCommentVNode("", true)
        ], 8, _hoisted_2),
        __props.field.description ? (vue.openBlock(), vue.createElementBlock("p", {
          key: 0,
          id: `${__props.field.key}-description`,
          class: "aheart-ai-form__field-description"
        }, vue.toDisplayString(__props.field.description), 9, _hoisted_4)) : vue.createCommentVNode("", true),
        __props.field.type === "textarea" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Textarea), {
          key: 1,
          id: __props.field.key,
          "aria-labelledby": `${__props.field.key}-label`,
          "aria-describedby": describedBy.value,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update", $event))
        }, null, 8, ["id", "aria-labelledby", "aria-describedby", "model-value", "placeholder", "disabled"])) : __props.field.type === "tree-select" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.TreeSelect), {
          key: 2,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "model-value": __props.value,
          "tree-data": treeData.value,
          multiple: Array.isArray(__props.value),
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "model-value", "tree-data", "multiple", "disabled"])) : __props.field.type === "upload" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Upload), {
          key: 3,
          "file-list": __props.value,
          disabled: __props.disabled,
          "onUpdate:fileList": _cache[2] || (_cache[2] = ($event) => emit("update", $event))
        }, null, 8, ["file-list", "disabled"])) : __props.field.type === "radio" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.RadioGroup), {
          key: 4,
          "model-value": __props.value,
          options: __props.field.options,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => emit("update", $event))
        }, null, 8, ["model-value", "options", "disabled"])) : __props.field.type === "checkbox" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.CheckboxGroup), {
          key: 5,
          "model-value": __props.value,
          options: __props.field.options,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => emit("update", $event))
        }, null, 8, ["model-value", "options", "disabled"])) : __props.field.type === "select" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Select), {
          key: 6,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "model-value": __props.value,
          disabled: __props.disabled,
          options: __props.field.options,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "model-value", "disabled", "options"])) : __props.field.type === "switch" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Switch), {
          key: 7,
          id: __props.field.key,
          "model-value": Boolean(__props.value),
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "disabled"])) : __props.field.type === "number" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.InputNumber), {
          key: 8,
          id: __props.field.key,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "placeholder", "disabled"])) : __props.field.type === "date" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.DatePicker), {
          key: 9,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "described-by": describedBy.value,
          status: __props.error ? "error" : void 0,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "placeholder", "disabled"])) : __props.field.type === "date-range" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.DateRangePicker), {
          key: 10,
          ref_key: "rangeControl",
          ref: rangeControl,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "described-by": describedBy.value,
          status: __props.error ? "error" : void 0,
          "model-value": __props.value,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "disabled"])) : __props.field.type === "time" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.TimePicker), {
          key: 11,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "described-by": describedBy.value,
          status: __props.error ? "error" : void 0,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "placeholder", "disabled"])) : __props.field.type === "time-range" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.TimeRangePicker), {
          key: 12,
          ref_key: "rangeControl",
          ref: rangeControl,
          id: __props.field.key,
          "labelled-by": `${__props.field.key}-label`,
          "described-by": describedBy.value,
          status: __props.error ? "error" : void 0,
          "model-value": __props.value,
          disabled: __props.disabled,
          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => emit("update", $event))
        }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "disabled"])) : (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Input), {
          key: 13,
          id: __props.field.key,
          "model-value": __props.value,
          placeholder: __props.field.placeholder,
          disabled: __props.disabled,
          "aria-describedby": describedBy.value,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => emit("update", $event))
        }, null, 8, ["id", "model-value", "placeholder", "disabled", "aria-describedby"])),
        __props.error ? (vue.openBlock(), vue.createElementBlock("p", {
          key: 14,
          id: `${__props.field.key}-error`,
          class: "aheart-ai-form__field-error",
          role: "alert"
        }, vue.toDisplayString(__props.error), 9, _hoisted_5)) : vue.createCommentVNode("", true)
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
