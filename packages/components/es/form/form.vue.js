import { defineComponent, reactive, computed, provide, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot } from "vue";
import { provideAheartConfig } from "../config/context.js";
import { formProps, formEmits, formContextKey } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AForm"
  },
  __name: "form",
  props: formProps,
  emits: formEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const fieldStates = reactive({});
    provideAheartConfig(
      computed(() => ({
        size: props.size,
        disabled: props.disabled,
        variant: props.variant
      }))
    );
    const formClass = computed(() => [
      `aheart-form--${props.layout}`,
      `aheart-form--label-${props.labelAlign}`,
      `aheart-form--required-${props.requiredMark === false ? "hidden" : props.requiredMark === "optional" ? "optional" : "visible"}`,
      {
        [`aheart-form--${props.variant}`]: props.variant,
        "aheart-form--no-colon": !props.colon
      }
    ]);
    const cloneValues = () => ({ ...props.model });
    const getRules = (name) => {
      var _a;
      return [...props.rules[name] ?? [], ...((_a = fieldStates[name]) == null ? void 0 : _a.rules) ?? []];
    };
    const isEmptyValue = (value) => value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
    const getValueSize = (value) => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string" || Array.isArray(value)) {
        return value.length;
      }
      return void 0;
    };
    const getDefaultMessage = (name, rule) => {
      if (rule.required) {
        return `${name} is required`;
      }
      if (rule.type) {
        return `${name} is not a valid ${rule.type}`;
      }
      if (rule.len !== void 0) {
        return `${name} length must be ${rule.len}`;
      }
      if (rule.min !== void 0) {
        return `${name} must be at least ${rule.min}`;
      }
      if (rule.max !== void 0) {
        return `${name} must be at most ${rule.max}`;
      }
      if (rule.pattern) {
        return `${name} format is invalid`;
      }
      return `${name} is invalid`;
    };
    const stringifyMessageVariable = (value) => value === void 0 || value === null ? "" : String(value);
    const interpolateMessage = (message, variables) => message.replace(/\$\{([^}]+)\}/g, (_match, key) => stringifyMessageVariable(variables[key.trim()]));
    const getRuleMessageVariables = (name, rule) => {
      var _a;
      return {
        name,
        ...((_a = fieldStates[name]) == null ? void 0 : _a.messageVariables) ?? {},
        ...rule.type !== void 0 ? { type: rule.type } : {},
        ...rule.len !== void 0 ? { len: rule.len } : {},
        ...rule.min !== void 0 ? { min: rule.min } : {},
        ...rule.max !== void 0 ? { max: rule.max } : {}
      };
    };
    const validateRule = (name, value, rule) => {
      const message = interpolateMessage(rule.message ?? getDefaultMessage(name, rule), getRuleMessageVariables(name, rule));
      if (rule.required && isEmptyValue(value)) {
        return message;
      }
      if (isEmptyValue(value)) {
        return void 0;
      }
      if (rule.type === "email" && (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
        return message;
      }
      if (rule.type === "number" && typeof value !== "number") {
        return message;
      }
      if (rule.type === "string" && typeof value !== "string") {
        return message;
      }
      if (rule.type === "array" && !Array.isArray(value)) {
        return message;
      }
      const valueSize = getValueSize(value);
      if (rule.len !== void 0 && valueSize !== rule.len) {
        return message;
      }
      if (rule.min !== void 0 && valueSize !== void 0 && valueSize < rule.min) {
        return message;
      }
      if (rule.max !== void 0 && valueSize !== void 0 && valueSize > rule.max) {
        return message;
      }
      if (rule.pattern && (typeof value !== "string" || !rule.pattern.test(value))) {
        return message;
      }
      return void 0;
    };
    const validateField = (name) => {
      var _a;
      const validateFirst = Boolean((_a = fieldStates[name]) == null ? void 0 : _a.validateFirst);
      const errors = [];
      for (const rule of getRules(name)) {
        const error = validateRule(name, props.model[name], rule);
        if (error) {
          errors.push(error);
          if (validateFirst) {
            break;
          }
        }
      }
      if (!fieldStates[name]) {
        fieldStates[name] = { errors: [], rules: [], validateFirst: false, messageVariables: {} };
      }
      fieldStates[name].errors = errors;
      emit("validate", name, errors.length === 0, errors);
      return errors.length > 0 ? { name, errors } : void 0;
    };
    const getFieldNames = () => Array.from(/* @__PURE__ */ new Set([...Object.keys(props.rules), ...Object.keys(fieldStates)]));
    const validate = () => {
      const errorFields = getFieldNames().map((name) => validateField(name)).filter((error) => Boolean(error));
      return {
        values: cloneValues(),
        errorFields
      };
    };
    const clearValidate = (names) => {
      const targetNames = names ?? Object.keys(fieldStates);
      targetNames.forEach((name) => {
        if (fieldStates[name]) {
          fieldStates[name].errors = [];
        }
      });
    };
    const formContext = {
      requiredMark: computed(() => props.requiredMark),
      colon: computed(() => props.colon),
      registerField(name, rules, validateFirst, messageVariables) {
        var _a;
        fieldStates[name] = {
          errors: ((_a = fieldStates[name]) == null ? void 0 : _a.errors) ?? [],
          rules,
          validateFirst,
          messageVariables
        };
      },
      unregisterField(name) {
        delete fieldStates[name];
      },
      getFieldErrors(name) {
        var _a;
        return ((_a = fieldStates[name]) == null ? void 0 : _a.errors) ?? [];
      },
      isFieldRequired(name) {
        return getRules(name).some((rule) => rule.required);
      }
    };
    provide(formContextKey, formContext);
    const handleSubmit = (event) => {
      emit("submit", event);
      const validationResult = validate();
      if (validationResult.errorFields.length > 0) {
        emit("finishFailed", validationResult);
        return;
      }
      emit("finish", validationResult.values);
    };
    __expose({
      validate,
      clearValidate
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("form", {
        class: normalizeClass(["aheart-form", formClass.value]),
        onSubmit: withModifiers(handleSubmit, ["prevent"])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
