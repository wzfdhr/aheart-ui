import { defineComponent as x, ref as k, computed as f, openBlock as a, createElementBlock as y, normalizeClass as g, createElementVNode as B, createTextVNode as C, toDisplayString as m, createCommentVNode as v, createBlock as t, unref as u } from "vue";
import { Textarea as S, TreeSelect as T, Upload as h, RadioGroup as D, CheckboxGroup as E, Select as N, Switch as P, InputNumber as q, DatePicker as I, DateRangePicker as R, TimePicker as w, TimeRangePicker as A, Input as G } from "aheart-ui";
const j = ["data-field-key", "aria-invalid", "aria-describedby"], z = ["id", "for"], L = {
  key: 0,
  class: "aheart-ai-form__required",
  "aria-hidden": "true"
}, F = ["id"], H = ["id"], M = /* @__PURE__ */ x({
  __name: "form-field",
  props: {
    field: {},
    value: {},
    disabled: { type: Boolean },
    error: {}
  },
  emits: ["update"],
  setup(e, { expose: c, emit: V }) {
    const b = e, i = V, s = k(), n = k(), U = f(
      () => (b.field.options ?? []).map((r) => ({
        key: r.value,
        title: r.label,
        disabled: r.disabled
      }))
    ), o = f(
      () => [b.field.description && `${b.field.key}-description`, b.error && `${b.field.key}-error`].filter(Boolean).join(" ") || void 0
    ), $ = f(
      () => b.field.type === "date-range" || b.field.type === "time-range" ? `${b.field.key}-start` : b.field.key
    );
    return c({
      focus: () => {
        var r, l;
        if (n.value) {
          n.value.focus("start");
          return;
        }
        (l = (r = s.value) == null ? void 0 : r.querySelector('input, button, [role="combobox"], [tabindex="0"]')) == null || l.focus({ preventScroll: !0 });
      }
    }), (r, l) => (a(), y("div", {
      ref_key: "fieldElement",
      ref: s,
      class: g(["aheart-ai-form__field", { "is-error": !!e.error, "is-disabled": e.disabled }]),
      "data-field-key": e.field.key,
      "aria-invalid": e.error ? "true" : void 0,
      "aria-describedby": o.value,
      tabindex: "-1"
    }, [
      B("label", {
        id: `${e.field.key}-label`,
        for: $.value
      }, [
        C(m(e.field.label) + " ", 1),
        e.field.required ? (a(), y("span", L, "*")) : v("", !0)
      ], 8, z),
      e.field.description ? (a(), y("p", {
        key: 0,
        id: `${e.field.key}-description`,
        class: "aheart-ai-form__field-description"
      }, m(e.field.description), 9, F)) : v("", !0),
      e.field.type === "textarea" ? (a(), t(u(S), {
        key: 1,
        id: e.field.key,
        "aria-labelledby": `${e.field.key}-label`,
        "aria-describedby": o.value,
        "model-value": e.value,
        placeholder: e.field.placeholder,
        disabled: e.disabled,
        "onUpdate:modelValue": l[0] || (l[0] = (d) => i("update", d))
      }, null, 8, ["id", "aria-labelledby", "aria-describedby", "model-value", "placeholder", "disabled"])) : e.field.type === "tree-select" ? (a(), t(u(T), {
        key: 2,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "model-value": e.value,
        "tree-data": U.value,
        multiple: Array.isArray(e.value),
        disabled: e.disabled,
        "onUpdate:modelValue": l[1] || (l[1] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "model-value", "tree-data", "multiple", "disabled"])) : e.field.type === "upload" ? (a(), t(u(h), {
        key: 3,
        "file-list": e.value,
        disabled: e.disabled,
        "onUpdate:fileList": l[2] || (l[2] = (d) => i("update", d))
      }, null, 8, ["file-list", "disabled"])) : e.field.type === "radio" ? (a(), t(u(D), {
        key: 4,
        "model-value": e.value,
        options: e.field.options,
        disabled: e.disabled,
        "onUpdate:modelValue": l[3] || (l[3] = (d) => i("update", d))
      }, null, 8, ["model-value", "options", "disabled"])) : e.field.type === "checkbox" ? (a(), t(u(E), {
        key: 5,
        "model-value": e.value,
        options: e.field.options,
        disabled: e.disabled,
        "onUpdate:modelValue": l[4] || (l[4] = (d) => i("update", d))
      }, null, 8, ["model-value", "options", "disabled"])) : e.field.type === "select" ? (a(), t(u(N), {
        key: 6,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "model-value": e.value,
        disabled: e.disabled,
        options: e.field.options,
        "onUpdate:modelValue": l[5] || (l[5] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "model-value", "disabled", "options"])) : e.field.type === "switch" ? (a(), t(u(P), {
        key: 7,
        id: e.field.key,
        "model-value": !!e.value,
        disabled: e.disabled,
        "onUpdate:modelValue": l[6] || (l[6] = (d) => i("update", d))
      }, null, 8, ["id", "model-value", "disabled"])) : e.field.type === "number" ? (a(), t(u(q), {
        key: 8,
        id: e.field.key,
        "model-value": e.value,
        placeholder: e.field.placeholder,
        disabled: e.disabled,
        "onUpdate:modelValue": l[7] || (l[7] = (d) => i("update", d))
      }, null, 8, ["id", "model-value", "placeholder", "disabled"])) : e.field.type === "date" ? (a(), t(u(I), {
        key: 9,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "described-by": o.value,
        status: e.error ? "error" : void 0,
        "model-value": e.value,
        placeholder: e.field.placeholder,
        disabled: e.disabled,
        "onUpdate:modelValue": l[8] || (l[8] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "placeholder", "disabled"])) : e.field.type === "date-range" ? (a(), t(u(R), {
        key: 10,
        ref_key: "rangeControl",
        ref: n,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "described-by": o.value,
        status: e.error ? "error" : void 0,
        "model-value": e.value,
        disabled: e.disabled,
        "onUpdate:modelValue": l[9] || (l[9] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "disabled"])) : e.field.type === "time" ? (a(), t(u(w), {
        key: 11,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "described-by": o.value,
        status: e.error ? "error" : void 0,
        "model-value": e.value,
        placeholder: e.field.placeholder,
        disabled: e.disabled,
        "onUpdate:modelValue": l[10] || (l[10] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "placeholder", "disabled"])) : e.field.type === "time-range" ? (a(), t(u(A), {
        key: 12,
        ref_key: "rangeControl",
        ref: n,
        id: e.field.key,
        "labelled-by": `${e.field.key}-label`,
        "described-by": o.value,
        status: e.error ? "error" : void 0,
        "model-value": e.value,
        disabled: e.disabled,
        "onUpdate:modelValue": l[11] || (l[11] = (d) => i("update", d))
      }, null, 8, ["id", "labelled-by", "described-by", "status", "model-value", "disabled"])) : (a(), t(u(G), {
        key: 13,
        id: e.field.key,
        "model-value": e.value,
        placeholder: e.field.placeholder,
        disabled: e.disabled,
        "aria-describedby": o.value,
        "onUpdate:modelValue": l[12] || (l[12] = (d) => i("update", d))
      }, null, 8, ["id", "model-value", "placeholder", "disabled", "aria-describedby"])),
      e.error ? (a(), y("p", {
        key: 14,
        id: `${e.field.key}-error`,
        class: "aheart-ai-form__field-error",
        role: "alert"
      }, m(e.error), 9, H)) : v("", !0)
    ], 10, j));
  }
});
export {
  M as default
};
