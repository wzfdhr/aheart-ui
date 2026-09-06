import { defineComponent, reactive, ref, computed, watch, provide, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot, nextTick } from "vue";
import { formProps, formEmits, formContextKey } from "./types.js";
import { namePathKey, normalizeNamePath, getNamePathValue, deleteNamePathValue, setNamePathValue, namePathLabel } from "./name-path.js";
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
    const externalErrors = reactive(/* @__PURE__ */ new Map());
    let submissionRun = 0;
    let validationRevision = 0;
    let disposed = false;
    let resetting = false;
    const staleValidation = Symbol("stale-validation");
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
    const cloneValues = () => cloneInitialValue(props.model);
    const getRules = (name) => {
      var _a;
      return [...typeof name === "string" ? props.rules[name] ?? [] : [], ...((_a = fieldStates[namePathKey(name)]) == null ? void 0 : _a.rules) ?? []];
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
      const label = namePathLabel(name);
      if (rule.required) {
        return `${label} is required`;
      }
      if (rule.type) {
        return `${label} is not a valid ${rule.type}`;
      }
      if (rule.len !== void 0) {
        return `${label} length must be ${rule.len}`;
      }
      if (rule.min !== void 0) {
        return `${label} must be at least ${rule.min}`;
      }
      if (rule.max !== void 0) {
        return `${label} must be at most ${rule.max}`;
      }
      if (rule.pattern) {
        return `${label} format is invalid`;
      }
      return `${label} is invalid`;
    };
    const stringifyMessageVariable = (value) => value === void 0 || value === null ? "" : String(value);
    const interpolateMessage = (message, variables) => message.replace(
      /\\?\$\{([^}]+)\}/g,
      (match, key) => match.startsWith("\\") ? match.slice(1) : stringifyMessageVariable(variables[key.trim()])
    );
    const getRuleMessageVariables = (name, rule) => {
      var _a;
      return {
        name: namePathLabel(name),
        ...((_a = fieldStates[namePathKey(name)]) == null ? void 0 : _a.messageVariables) ?? {},
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
      const key = namePathKey(name);
      if (!fieldStates[key]) {
        fieldStates[key] = { errors: [], validating: false, rules: [], validateFirst: false, messageVariables: {}, dependencies: [], validateTrigger: props.validateTrigger, preserve: props.preserve };
      }
      return fieldStates[key];
    };
    const collectRuleErrors = (name, rules, validateFirst) => {
      if (validateFirst === true) {
        const runNext = (index) => {
          for (let ruleIndex = index; ruleIndex < rules.length; ruleIndex += 1) {
            const result = validateRule(name, getNamePathValue(props.model, name), rules[ruleIndex]);
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
      const results = rules.map((rule) => validateRule(name, getNamePathValue(props.model, name), rule));
      const finalize = (resolved) => {
        const errors = resolved.filter((error) => Boolean(error));
        return validateFirst === "parallel" ? errors.slice(0, 1) : errors;
      };
      return results.some(isPromiseLike) ? Promise.all(results.map((result) => Promise.resolve(result))).then(finalize) : finalize(results);
    };
    const validateField = (name, trigger) => {
      const key = namePathKey(name);
      const fieldState = ensureFieldState(name);
      if (!fieldNames.has(key) && !retiredFieldNames.has(key))
        fieldNames.set(key, normalizeNamePath(name));
      const startedModel = cloneValues();
      const runId = (validationRuns.get(key) ?? 0) + 1;
      validationRuns.set(key, runId);
      const rules = getRules(name).filter((rule) => {
        if (!trigger || rule.validateTrigger === void 0)
          return true;
        if (rule.validateTrigger === false)
          return false;
        return rule.validateTrigger === trigger || Array.isArray(rule.validateTrigger) && rule.validateTrigger.includes(trigger);
      });
      const result = collectRuleErrors(name, rules, fieldState.validateFirst);
      const finish = (errors) => {
        if (disposed || validationRuns.get(key) !== runId || retiredFieldNames.has(key) || !isSameFormValue(startedModel, props.model)) {
          if (validationRuns.get(key) === runId && fieldStates[key])
            fieldStates[key].validating = false;
          return staleValidation;
        }
        if (fieldStates[key]) {
          fieldStates[key].errors = errors;
          fieldStates[key].validating = false;
        }
        const allErrors = [...externalErrors.get(key) ?? [], ...errors];
        emit("validate", name, allErrors.length === 0, allErrors);
        return allErrors.length > 0 ? { name, errors: allErrors } : void 0;
      };
      if (isPromiseLike(result)) {
        fieldState.validating = true;
        return result.then(finish);
      }
      return finish(result);
    };
    const fieldNames = /* @__PURE__ */ new Map();
    const getFieldNames = () => Array.from(fieldNames.entries()).filter(([key]) => !retiredFieldNames.has(key)).map(([, name]) => name).concat(Object.keys(props.rules).filter((name) => !fieldNames.has(namePathKey(name)) && !retiredFieldNames.has(namePathKey(name))).map((name) => name));
    const validateFields = (names) => {
      const startRevision = validationRevision;
      const targets = names ?? getFieldNames();
      const results = targets.map((name) => validateField(name));
      const expectedRuns = targets.map((name) => validationRuns.get(namePathKey(name)));
      const finish = (resolved) => {
        const outOfDate = disposed || startRevision !== validationRevision || resolved.includes(staleValidation) || targets.some((name, index) => validationRuns.get(namePathKey(name)) !== expectedRuns[index]);
        return {
          values: cloneValues(),
          errorFields: resolved.filter((error) => error !== void 0 && error !== staleValidation),
          ...outOfDate ? { outOfDate: true } : {}
        };
      };
      return results.some(isPromiseLike) ? Promise.all(results.map((result) => Promise.resolve(result))).then(finish) : finish(results);
    };
    const validate = () => validateFields();
    const resetFields = (names) => {
      const targetNames = (names ?? getFieldNames()).map(normalizeNamePath);
      submissionRun += 1;
      validationRevision += 1;
      resetting = true;
      pendingValidations.clear();
      targetNames.forEach((name) => {
        const key = namePathKey(name);
        validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1);
        externalErrors.delete(key);
        if (typeof name === "string" && Object.prototype.hasOwnProperty.call(initialValues, name)) {
          setNamePathValue(props.model, name, cloneInitialValue(initialValues[name]));
        } else if (typeof name !== "string" && getNamePathValue(initialValues, name) !== void 0) {
          setNamePathValue(props.model, name, cloneInitialValue(getNamePathValue(initialValues, name)));
        } else {
          deleteNamePathValue(props.model, name);
        }
        if (fieldStates[key]) {
          fieldStates[key].errors = [];
          fieldStates[key].validating = false;
        }
      });
      resetting = false;
      observedModel = cloneValues();
      targetNames.forEach((name) => notifiedValues.set(namePathKey(name), cloneInitialValue(getNamePathValue(props.model, name))));
    };
    const clearValidate = (names) => {
      const targetNames = names ?? getFieldNames();
      targetNames.forEach((name) => {
        const key = namePathKey(name);
        externalErrors.delete(key);
        pendingValidations.delete(key);
        validationRevision += 1;
        if (fieldStates[key]) {
          validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1);
          fieldStates[key].errors = [];
          fieldStates[key].validating = false;
        }
      });
    };
    const setFieldValue = (name, value) => {
      setNamePathValue(props.model, name, value);
      observeModel();
      clearValidate([name]);
    };
    const setFieldsValue = (values) => {
      Object.entries(values).forEach(([name, value]) => {
        setNamePathValue(props.model, name, value);
      });
      observeModel();
      clearValidate(Object.keys(values));
    };
    const getFieldValue = (name) => getNamePathValue(props.model, name);
    const pickValues = (names) => names.reduce((values, name) => {
      if (typeof name === "string")
        values[name] = getNamePathValue(props.model, name);
      else
        setNamePathValue(values, name, getNamePathValue(props.model, name));
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
      return [...((_a = fieldStates[namePathKey(name)]) == null ? void 0 : _a.errors) ?? [], ...externalErrors.get(namePathKey(name)) ?? []];
    };
    const getFieldsError = (names) => (names ?? getFieldNames()).map((name) => ({
      name,
      errors: getFieldError(name)
    }));
    const scrollToField = (name, options) => {
      var _a;
      const target = Array.from(((_a = formElement.value) == null ? void 0 : _a.querySelectorAll("[data-name]")) ?? []).find(
        (element) => element.dataset.name === (typeof name === "string" ? name : JSON.stringify(name))
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
    const notifiedValues = /* @__PURE__ */ new Map();
    let observedModel = cloneValues();
    const fieldOptions = /* @__PURE__ */ new Map();
    const pendingValidations = /* @__PURE__ */ new Map();
    let validationScheduled = false;
    const queueValidation = (name, event) => {
      const key = namePathKey(name);
      const existing = pendingValidations.get(key);
      if (!existing || existing.event !== void 0)
        pendingValidations.set(key, { name, event });
      if (validationScheduled)
        return;
      validationScheduled = true;
      void nextTick(() => {
        validationScheduled = false;
        const batch = [...pendingValidations.values()];
        pendingValidations.clear();
        if (disposed)
          return;
        for (const task of batch) {
          if (!retiredFieldNames.has(namePathKey(task.name)))
            void validateField(task.name, task.event);
        }
      });
    };
    const clearExternalError = (name) => externalErrors.delete(namePathKey(name));
    const invalidateField = (name) => {
      validationRevision += 1;
      const key = namePathKey(name);
      validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1);
      if (fieldStates[key]) {
        fieldStates[key].errors = [];
        fieldStates[key].validating = false;
      }
    };
    const shouldTrigger = (trigger, event) => trigger !== false && (trigger === event || Array.isArray(trigger) && trigger.includes(event));
    const observeModel = () => {
      var _a;
      const previous = observedModel;
      observedModel = cloneValues();
      for (const name of getFieldNames()) {
        const key = namePathKey(name);
        if (!isSameFormValue(getNamePathValue(previous, name), getNamePathValue(props.model, name))) {
          invalidateField(name);
          clearExternalError(name);
        }
        const dependencies = ((_a = fieldStates[key]) == null ? void 0 : _a.dependencies) ?? [];
        if (!resetting && dependencies.some((path) => !isSameFormValue(getNamePathValue(previous, path), getNamePathValue(props.model, path)))) {
          invalidateField(name);
          queueValidation(name);
        }
      }
    };
    watch(() => props.model, observeModel, { deep: true, flush: "sync" });
    watch(() => props.rules, () => {
      for (const name of getFieldNames())
        invalidateField(name);
    }, { deep: true, flush: "sync" });
    watch(() => [props.validateTrigger, props.preserve], () => {
      fieldNames.forEach((_name, key) => {
        var _a, _b;
        const state = fieldStates[key];
        if (!state)
          return;
        state.validateTrigger = ((_a = fieldOptions.get(key)) == null ? void 0 : _a.validateTrigger) ?? props.validateTrigger;
        state.preserve = ((_b = fieldOptions.get(key)) == null ? void 0 : _b.preserve) ?? props.preserve;
      });
    }, { deep: true });
    const formContext = {
      requiredMark: computed(() => props.requiredMark),
      colon: computed(() => props.colon),
      registerField(name, rules, validateFirst, messageVariables, options) {
        var _a, _b;
        const key = namePathKey(name);
        const previousState = fieldStates[key];
        const effectiveTrigger = (options == null ? void 0 : options.validateTrigger) === void 0 ? props.validateTrigger : options.validateTrigger;
        const effectivePreserve = (options == null ? void 0 : options.preserve) === void 0 ? props.preserve : options.preserve;
        const changed = previousState && (!isSameFormValue(previousState.rules, rules) || previousState.validateFirst !== validateFirst || !isSameFormValue(previousState.messageVariables, messageVariables) || !isSameFormValue(previousState.dependencies, (options == null ? void 0 : options.dependencies) ?? []));
        retiredFieldNames.delete(key);
        fieldNames.set(key, normalizeNamePath(name));
        if (!notifiedValues.has(key))
          notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)));
        fieldOptions.set(key, { validateTrigger: options == null ? void 0 : options.validateTrigger, preserve: options == null ? void 0 : options.preserve });
        if (changed)
          invalidateField(name);
        fieldStates[key] = {
          errors: ((_a = fieldStates[key]) == null ? void 0 : _a.errors) ?? [],
          validating: ((_b = fieldStates[key]) == null ? void 0 : _b.validating) ?? false,
          rules,
          validateFirst,
          messageVariables,
          dependencies: (options == null ? void 0 : options.dependencies) ?? [],
          validateTrigger: effectiveTrigger,
          preserve: effectivePreserve
        };
      },
      unregisterField(name) {
        const key = namePathKey(name);
        const state = fieldStates[key];
        retiredFieldNames.add(key);
        validationRevision += 1;
        validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1);
        externalErrors.delete(key);
        delete fieldStates[key];
        fieldNames.delete(key);
        fieldOptions.delete(key);
        pendingValidations.delete(key);
        notifiedValues.delete(key);
        if ((state == null ? void 0 : state.preserve) === false)
          deleteNamePathValue(props.model, name);
      },
      getFieldErrors(name) {
        return getFieldError(name);
      },
      isFieldValidating(name) {
        var _a;
        return ((_a = fieldStates[namePathKey(name)]) == null ? void 0 : _a.validating) ?? false;
      },
      isFieldRequired(name) {
        return getRules(name).some((rule) => rule.required);
      },
      onFieldChange(name) {
        var _a;
        observeModel();
        const key = namePathKey(name);
        const value = getNamePathValue(props.model, name);
        if (isSameFormValue(value, notifiedValues.get(key)))
          return;
        notifiedValues.set(key, cloneInitialValue(value));
        if (shouldTrigger((_a = fieldStates[key]) == null ? void 0 : _a.validateTrigger, "change"))
          queueValidation(name, "change");
      },
      onFieldBlur(name) {
        var _a;
        observeModel();
        if (shouldTrigger((_a = fieldStates[namePathKey(name)]) == null ? void 0 : _a.validateTrigger, "blur"))
          queueValidation(name, "blur");
      }
    };
    provide(formContextKey, formContext);
    const handleSubmit = (event) => {
      emit("submit", event);
      pendingValidations.clear();
      submissionRun += 1;
      const runId = submissionRun;
      const submitRevision = validationRevision;
      const submittedValues = cloneInitialValue(props.model);
      const validationResult = validate();
      const finishSubmission = (result) => {
        if (disposed || result.outOfDate || runId !== submissionRun || submitRevision !== validationRevision || !isSameFormValue(submittedValues, props.model)) {
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
    const setFieldsErrors = (fields) => {
      fields.forEach(({ name, errors }) => {
        const key = namePathKey(name);
        fieldNames.set(key, normalizeNamePath(name));
        ensureFieldState(name);
        retiredFieldNames.delete(key);
        pendingValidations.delete(key);
        notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)));
        validationRevision += 1;
        validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1);
        if (errors.length === 0)
          externalErrors.delete(key);
        else
          externalErrors.set(key, [...errors]);
        if (fieldStates[key]) {
          fieldStates[key].errors = [];
          fieldStates[key].validating = false;
        }
      });
    };
    onBeforeUnmount(() => {
      disposed = true;
      pendingValidations.clear();
      submissionRun += 1;
      validationRevision += 1;
    });
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
      scrollToField,
      setFieldsErrors
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
