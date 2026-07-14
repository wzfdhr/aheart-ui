"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const AI_FORM_FIELD_TYPES = [
  "input",
  "textarea",
  "number",
  "select",
  "checkbox",
  "radio",
  "switch",
  "date",
  "time",
  "upload",
  "tree-select"
];
const AI_FORM_CONDITION_OPERATORS = ["equals", "not-equals", "includes", "not-includes", "is-empty", "is-not-empty"];
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isOptionValue = (value) => typeof value === "string" || typeof value === "number";
const isOptionValueArray = (value) => Array.isArray(value) && value.every(isOptionValue);
const isUploadFileDefault = (value) => isRecord(value) && typeof value.uid === "string" && typeof value.name === "string";
const hasCompatibleDefaultValue = (type, value) => {
  if (value === void 0) return true;
  if (type === "switch") return typeof value === "boolean";
  if (type === "number") return typeof value === "number";
  if (type === "checkbox") return isOptionValueArray(value);
  if (type === "upload") return Array.isArray(value) && value.every(isUploadFileDefault);
  if (type === "tree-select") return isOptionValue(value) || isOptionValueArray(value);
  if (type === "select" || type === "radio") return isOptionValue(value);
  return typeof value === "string";
};
const validateCondition = (value, path, errors) => {
  if (!isRecord(value) || typeof value.field !== "string" || !value.field.trim()) {
    errors.push(`${path} 必须包含字段名`);
    return false;
  }
  if (typeof value.operator !== "string" || !AI_FORM_CONDITION_OPERATORS.includes(value.operator)) {
    errors.push(`${path} 包含不支持的条件操作符`);
    return false;
  }
  if (value.value !== void 0 && !isOptionValue(value.value) && typeof value.value !== "boolean" && !Array.isArray(value.value)) {
    errors.push(`${path}.value 类型不安全`);
    return false;
  }
  if (Array.isArray(value.value) && !value.value.every((item) => typeof item === "string")) {
    errors.push(`${path}.value 数组只能包含字符串`);
    return false;
  }
  return true;
};
const validateAIFormSchema = (schema) => {
  const errors = [];
  if (!isRecord(schema) || schema.version !== "1" || !Array.isArray(schema.fields)) {
    return { valid: false, errors: ["AIForm schema 必须是 version 为 1 的 fields 数组"] };
  }
  const keys = /* @__PURE__ */ new Set();
  schema.fields.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!isRecord(field) || typeof field.key !== "string" || !field.key.trim()) {
      errors.push(`${path}.key 必须是非空字符串`);
      return;
    }
    if (keys.has(field.key)) errors.push(`${path}.key 不能重复`);
    keys.add(field.key);
    if (typeof field.label !== "string") errors.push(`${path}.label 必须是字符串`);
    if (typeof field.type !== "string" || !AI_FORM_FIELD_TYPES.includes(field.type)) {
      errors.push(`${path}.type 不受支持`);
    }
    if (field.required !== void 0 && typeof field.required !== "boolean") errors.push(`${path}.required 必须是布尔值`);
    if (field.placeholder !== void 0 && typeof field.placeholder !== "string") errors.push(`${path}.placeholder 必须是字符串`);
    if (!hasCompatibleDefaultValue(field.type, field.defaultValue)) errors.push(`${path}.defaultValue 与字段类型不兼容`);
    if (field.visibleWhen !== void 0) validateCondition(field.visibleWhen, `${path}.visibleWhen`, errors);
    if (field.disabledWhen !== void 0) validateCondition(field.disabledWhen, `${path}.disabledWhen`, errors);
    if (field.options !== void 0) {
      if (!Array.isArray(field.options)) {
        errors.push(`${path}.options 必须是数组`);
      } else {
        field.options.forEach((option, optionIndex) => {
          if (!isRecord(option) || typeof option.label !== "string" || !isOptionValue(option.value) || option.disabled !== void 0 && typeof option.disabled !== "boolean") {
            errors.push(`${path}.options[${optionIndex}] 不合法`);
          }
        });
      }
    }
  });
  return errors.length ? { valid: false, errors } : { valid: true, errors: [], schema };
};
exports.AI_FORM_CONDITION_OPERATORS = AI_FORM_CONDITION_OPERATORS;
exports.AI_FORM_FIELD_TYPES = AI_FORM_FIELD_TYPES;
exports.validateAIFormSchema = validateAIFormSchema;
