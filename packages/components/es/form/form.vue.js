import { defineComponent, reactive, ref, computed, provide, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot } from "vue";
import { formProps, formEmits, formContextKey } from "./types.js";
import "./style.css.js";
import { provideAheartConfig } from "../config/context.js";
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
    const formElement = ref();
    const cloneInitialValue = (value) => {
      if (Array.isArray(value)) {
        return value.map((item) => cloneInitialValue(item));
      }
      if (value instanceof Date) {
        return new Date(value.getTime());
      }
      if (value instanceof Map) {
        return new Map(Array.from(value, ([key, item]) => [cloneInitialValue(key), cloneInitialValue(item)]));
      }
      if (value instanceof Set) {
        return new Set(Array.from(value, (item) => cloneInitialValue(item)));
      }
      if (value && typeof value === "object") {
        const prototype = Object.getPrototypeOf(value);
        if (prototype === Object.prototype || prototype === null) {
          return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, cloneInitialValue(item)])
          );
        }
      }
      return value;
    };
    const isSameFormValue = (left, right) => {
      if (Object.is(left, right)) {
        return true;
      }
      if (Array.isArray(left) || Array.isArray(right)) {
        return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => isSameFormValue(item, right[index]));
      }
      if (left instanceof Date || right instanceof Date) {
        return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
      }
      if (left instanceof Map || right instanceof Map) {
        if (!(left instanceof Map) || !(right instanceof Map) || left.size !== right.size) {
          return false;
        }
        const leftEntries = Array.from(left.entries());
        const rightEntries = Array.from(right.entries());
        return leftEntries.every(
          ([key, value], index) => {
            var _a, _b;
            return isSameFormValue(key, (_a = rightEntries[index]) == null ? void 0 : _a[0]) && isSameFormValue(value, (_b = rightEntries[index]) == null ? void 0 : _b[1]);
          }
        );
      }
      if (left instanceof Set || right instanceof Set) {
        if (!(left instanceof Set) || !(right instanceof Set) || left.size !== right.size) {
          return false;
        }
        const leftValues = Array.from(left.values());
        const rightValues = Array.from(right.values());
        return leftValues.every((value, index) => isSameFormValue(value, rightValues[index]));
      }
      if (left && right && typeof left === "object" && typeof right === "object") {
        const leftPrototype = Object.getPrototypeOf(left);
        const rightPrototype = Object.getPrototypeOf(right);
        const isPlainObject = (prototype) => prototype === Object.prototype || prototype === null;
        if (!isPlainObject(leftPrototype) || !isPlainObject(rightPrototype)) {
          return false;
        }
        const leftRecord = left;
        const rightRecord = right;
        const leftKeys = Object.keys(leftRecord);
        const rightKeys = Object.keys(rightRecord);
        return leftKeys.length === rightKeys.length && leftKeys.every(
          (key) => Object.prototype.hasOwnProperty.call(rightRecord, key) && isSameFormValue(leftRecord[key], rightRecord[key])
        );
      }
      return false;
    };
    const initialValues = cloneInitialValue(props.model);
    const retiredFieldNames = /* @__PURE__ */ new Set();
    const validationRuns = /* @__PURE__ */ new Map();
    let submissionRun = 0;
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
    const interpolateMessage = (message, variables) => message.replace(
      /\\?\$\{([^}]+)\}/g,
      (match, key) => match.startsWith("\\") ? match.slice(1) : stringifyMessageVariable(variables[key.trim()])
    );
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
    const isPromiseLike = (value) => typeof (value == null ? void 0 : value.then) === "function";
    const normalizeValidatorResult = (result, message) => {
      if (typeof result === "string") {
        return result;
      }
      return result === false ? message : void 0;
    };
    const normalizeValidatorError = (error, message) => {
      if (error instanceof Error && error.message) {
        return error.message;
      }
      return typeof error === "string" && error ? error : message;
    };
    const validateRule = (name, value, rule) => {
      const message = interpolateMessage(rule.message ?? getDefaultMessage(name, rule), getRuleMessageVariables(name, rule));
      if (rule.required && isEmptyValue(value)) {
        return message;
      }
      if (!isEmptyValue(value)) {
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
      }
      if (!rule.validator) {
        return void 0;
      }
      try {
        const result = rule.validator(rule, value, props.model);
        if (isPromiseLike(result)) {
          return result.then(
            (resolved) => normalizeValidatorResult(resolved, message),
            (error) => normalizeValidatorError(error, message)
          );
        }
        return normalizeValidatorResult(result, message);
      } catch (error) {
        return normalizeValidatorError(error, message);
      }
    };
    const ensureFieldState = (name) => {
      if (!fieldStates[name]) {
        fieldStates[name] = { errors: [], validating: false, rules: [], validateFirst: false, messageVariables: {} };
      }
      return fieldStates[name];
    };
    const collectRuleErrors = (name, rules, validateFirst) => {
      if (validateFirst === true) {
        const runNext = (index) => {
          for (let ruleIndex = index; ruleIndex < rules.length; ruleIndex += 1) {
            const result = validateRule(name, props.model[name], rules[ruleIndex]);
            if (isPromiseLike(result)) {
              return result.then((error) => error ? [error] : runNext(ruleIndex + 1));
            }
            if (result) {
              return [result];
            }
          }
          return [];
        };
        return runNext(0);
      }
      const results = rules.map((rule) => validateRule(name, props.model[name], rule));
      const finalize = (resolved) => {
        const errors = resolved.filter((error) => Boolean(error));
        return validateFirst === "parallel" ? errors.slice(0, 1) : errors;
      };
      return results.some(isPromiseLike) ? Promise.all(results.map((result) => Promise.resolve(result))).then(finalize) : finalize(results);
    };
    const validateField = (name) => {
      const fieldState = ensureFieldState(name);
      const runId = (validationRuns.get(name) ?? 0) + 1;
      validationRuns.set(name, runId);
      const result = collectRuleErrors(name, getRules(name), fieldState.validateFirst);
      const finish = (errors) => {
        if (validationRuns.get(name) !== runId || retiredFieldNames.has(name)) {
          return void 0;
        }
        if (fieldStates[name]) {
          fieldStates[name].errors = errors;
          fieldStates[name].validating = false;
        }
        emit("validate", name, errors.length === 0, errors);
        return errors.length > 0 ? { name, errors } : void 0;
      };
      if (isPromiseLike(result)) {
        fieldState.validating = true;
        return result.then(finish);
      }
      return finish(result);
    };
    const getFieldNames = () => Array.from(/* @__PURE__ */ new Set([...Object.keys(props.rules), ...Object.keys(fieldStates)])).filter(
      (name) => !retiredFieldNames.has(name)
    );
    const validateFields = (names) => {
      const results = (names ?? getFieldNames()).map((name) => validateField(name));
      const finish = (resolved) => ({
        values: cloneValues(),
        errorFields: resolved.filter((error) => Boolean(error))
      });
      return results.some(isPromiseLike) ? Promise.all(results.map((result) => Promise.resolve(result))).then(finish) : finish(results);
    };
    const validate = () => validateFields();
    const resetFields = (names) => {
      submissionRun += 1;
      const targetNames = names ?? getFieldNames();
      targetNames.forEach((name) => {
        validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1);
        if (Object.prototype.hasOwnProperty.call(initialValues, name)) {
          props.model[name] = cloneInitialValue(initialValues[name]);
        } else {
          delete props.model[name];
        }
        if (fieldStates[name]) {
          fieldStates[name].errors = [];
          fieldStates[name].validating = false;
        }
      });
    };
    const clearValidate = (names) => {
      const targetNames = names ?? Object.keys(fieldStates);
      targetNames.forEach((name) => {
        if (fieldStates[name]) {
          validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1);
          fieldStates[name].errors = [];
          fieldStates[name].validating = false;
        }
      });
    };
    const setFieldValue = (name, value) => {
      props.model[name] = value;
      clearValidate([name]);
    };
    const setFieldsValue = (values) => {
      Object.entries(values).forEach(([name, value]) => {
        props.model[name] = value;
      });
      clearValidate(Object.keys(values));
    };
    const getFieldValue = (name) => props.model[name];
    const pickValues = (names) => names.reduce((values, name) => {
      values[name] = props.model[name];
      return values;
    }, {});
    const getFieldsValue = (names) => {
      if (names === true) {
        return cloneValues();
      }
      return pickValues(names ?? getFieldNames());
    };
    const getFieldError = (name) => {
      var _a;
      return [...((_a = fieldStates[name]) == null ? void 0 : _a.errors) ?? []];
    };
    const getFieldsError = (names) => (names ?? getFieldNames()).map((name) => ({
      name,
      errors: getFieldError(name)
    }));
    const scrollToField = (name, options) => {
      var _a;
      const target = Array.from(((_a = formElement.value) == null ? void 0 : _a.querySelectorAll("[data-name]")) ?? []).find(
        (element) => element.dataset.name === name
      );
      if (!target) {
        return;
      }
      if (options === void 0) {
        target.scrollIntoView();
        return;
      }
      target.scrollIntoView(options);
    };
    const scrollToFirstError = (errorFields) => {
      if (!props.scrollToFirstError || errorFields.length === 0) {
        return;
      }
      scrollToField(errorFields[0].name, props.scrollToFirstError === true ? void 0 : props.scrollToFirstError);
    };
    const formContext = {
      requiredMark: computed(() => props.requiredMark),
      colon: computed(() => props.colon),
      registerField(name, rules, validateFirst, messageVariables) {
        var _a, _b;
        retiredFieldNames.delete(name);
        fieldStates[name] = {
          errors: ((_a = fieldStates[name]) == null ? void 0 : _a.errors) ?? [],
          validating: ((_b = fieldStates[name]) == null ? void 0 : _b.validating) ?? false,
          rules,
          validateFirst,
          messageVariables
        };
      },
      unregisterField(name) {
        retiredFieldNames.add(name);
        validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1);
        delete fieldStates[name];
      },
      getFieldErrors(name) {
        var _a;
        return ((_a = fieldStates[name]) == null ? void 0 : _a.errors) ?? [];
      },
      isFieldValidating(name) {
        var _a;
        return ((_a = fieldStates[name]) == null ? void 0 : _a.validating) ?? false;
      },
      isFieldRequired(name) {
        return getRules(name).some((rule) => rule.required);
      }
    };
    provide(formContextKey, formContext);
    const handleSubmit = (event) => {
      emit("submit", event);
      submissionRun += 1;
      const runId = submissionRun;
      const submittedValues = cloneInitialValue(props.model);
      const validationResult = validate();
      const finishSubmission = (result) => {
        if (runId !== submissionRun || !isSameFormValue(submittedValues, props.model)) {
          return;
        }
        if (result.errorFields.length > 0) {
          emit("finishFailed", result);
          scrollToFirstError(result.errorFields);
          return;
        }
        emit("finish", result.values);
      };
      if (isPromiseLike(validationResult)) {
        void validationResult.then(finishSubmission);
        return;
      }
      finishSubmission(validationResult);
    };
    __expose({
      validate,
      validateFields,
      resetFields,
      clearValidate,
      setFieldValue,
      setFieldsValue,
      getFieldValue,
      getFieldsValue,
      getFieldError,
      getFieldsError,
      scrollToField
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("form", {
        ref_key: "formElement",
        ref: formElement,
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
