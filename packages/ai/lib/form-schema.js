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
  "date-range",
  "time",
  "time-range",
  "upload",
  "tree-select"
];
const AI_FORM_CONDITION_OPERATORS = ["equals", "not-equals", "includes", "not-includes", "is-empty", "is-not-empty"];
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isOptionValue = (value) => typeof value === "string" || typeof value === "number";
const isOptionValueArray = (value) => Array.isArray(value) && value.every(isOptionValue);
const isUploadFileDefault = (value) => isRecord(value) && typeof value.uid === "string" && typeof value.name === "string";
const isDateValue = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};
const isTimeValue = (value) => {
  if (typeof value !== "string" || !/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute, second] = value.split(":").map(Number);
  return hour <= 23 && minute <= 59 && second <= 59;
};
const isRangeDefault = (value, validator) => Array.isArray(value) && value.length === 2 && value.every(validator);
const ROOT_KEYS = /* @__PURE__ */ new Set(["version", "title", "description", "groups", "fields"]);
const GROUP_KEYS = /* @__PURE__ */ new Set(["key", "title", "description"]);
const FIELD_KEYS = /* @__PURE__ */ new Set([
  "key",
  "label",
  "type",
  "defaultValue",
  "placeholder",
  "description",
  "group",
  "required",
  "options",
  "visibleWhen",
  "disabledWhen"
]);
const OPTION_KEYS = /* @__PURE__ */ new Set(["label", "value", "disabled"]);
const CONDITION_KEYS = /* @__PURE__ */ new Set(["field", "operator", "value"]);
const OPTION_FIELD_TYPES = /* @__PURE__ */ new Set(["select", "checkbox", "radio", "tree-select"]);
const rejectUnknownKeys = (value, allowed, path, errors) => {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) errors.push(`${path} 包含不支持的属性：${unknown.join("、")}`);
};
const hasCompatibleDefaultValue = (type, value) => {
  if (value === void 0) return true;
  if (type === "switch") return typeof value === "boolean";
  if (type === "number") return typeof value === "number";
  if (type === "checkbox") return isOptionValueArray(value);
  if (type === "upload") return Array.isArray(value) && value.every(isUploadFileDefault);
  if (type === "date") return isDateValue(value);
  if (type === "time") return isTimeValue(value);
  if (type === "date-range") return isRangeDefault(value, isDateValue);
  if (type === "time-range") return isRangeDefault(value, isTimeValue);
  if (type === "tree-select") return isOptionValue(value) || isOptionValueArray(value);
  if (type === "select" || type === "radio") return isOptionValue(value);
  return typeof value === "string";
};
const validateCondition = (value, path, errors) => {
  if (!isRecord(value) || typeof value.field !== "string" || !value.field.trim()) {
    errors.push(`${path} 必须包含字段名`);
    return false;
  }
  rejectUnknownKeys(value, CONDITION_KEYS, path, errors);
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
  rejectUnknownKeys(schema, ROOT_KEYS, "schema", errors);
  if (schema.title !== void 0 && typeof schema.title !== "string") errors.push("schema.title 必须是字符串");
  if (schema.description !== void 0 && typeof schema.description !== "string") errors.push("schema.description 必须是字符串");
  const groupKeys = /* @__PURE__ */ new Set();
  if (schema.groups !== void 0) {
    if (!Array.isArray(schema.groups)) {
      errors.push("schema.groups 必须是数组");
    } else {
      schema.groups.forEach((group, index) => {
        const path = `groups[${index}]`;
        if (!isRecord(group)) {
          errors.push(`${path} 必须是对象`);
          return;
        }
        rejectUnknownKeys(group, GROUP_KEYS, path, errors);
        if (typeof group.key !== "string" || !group.key.trim()) {
          errors.push(`${path}.key 必须是非空字符串`);
        } else if (groupKeys.has(group.key)) {
          errors.push(`${path}.key 不能重复`);
        } else {
          groupKeys.add(group.key);
        }
        if (typeof group.title !== "string" || !group.title.trim()) errors.push(`${path}.title 必须是非空字符串`);
        if (group.description !== void 0 && typeof group.description !== "string") errors.push(`${path}.description 必须是字符串`);
      });
    }
  }
  const keys = /* @__PURE__ */ new Set();
  schema.fields.forEach((field, index) => {
    const path = `fields[${index}]`;
    if (!isRecord(field) || typeof field.key !== "string" || !field.key.trim()) {
      errors.push(`${path}.key 必须是非空字符串`);
      return;
    }
    rejectUnknownKeys(field, FIELD_KEYS, path, errors);
    if (keys.has(field.key)) errors.push(`${path}.key 不能重复`);
    keys.add(field.key);
    if (typeof field.label !== "string") errors.push(`${path}.label 必须是字符串`);
    if (typeof field.type !== "string" || !AI_FORM_FIELD_TYPES.includes(field.type)) {
      errors.push(`${path}.type 不受支持`);
    }
    if (field.required !== void 0 && typeof field.required !== "boolean") errors.push(`${path}.required 必须是布尔值`);
    if (field.placeholder !== void 0 && typeof field.placeholder !== "string") errors.push(`${path}.placeholder 必须是字符串`);
    if (field.description !== void 0 && typeof field.description !== "string") errors.push(`${path}.description 必须是字符串`);
    if (field.group !== void 0 && (typeof field.group !== "string" || !groupKeys.has(field.group))) {
      errors.push(`${path}.group 必须引用已声明的分组`);
    }
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
          } else {
            rejectUnknownKeys(option, OPTION_KEYS, `${path}.options[${optionIndex}]`, errors);
          }
        });
      }
    }
    if (field.required === true && OPTION_FIELD_TYPES.has(field.type) && (!Array.isArray(field.options) || !field.options.some((option) => isRecord(option) && option.disabled !== true))) {
      errors.push(`${path}.options 必须为必填字段提供至少一个可用选项`);
    }
  });
  schema.fields.forEach((field, index) => {
    if (!isRecord(field)) return;
    for (const conditionName of ["visibleWhen", "disabledWhen"]) {
      const condition = field[conditionName];
      if (isRecord(condition) && typeof condition.field === "string" && !keys.has(condition.field)) {
        errors.push(`fields[${index}].${conditionName}.field 必须引用已声明的字段`);
      }
    }
  });
  return errors.length ? { valid: false, errors } : { valid: true, errors: [], schema };
};
exports.AI_FORM_CONDITION_OPERATORS = AI_FORM_CONDITION_OPERATORS;
exports.AI_FORM_FIELD_TYPES = AI_FORM_FIELD_TYPES;
exports.validateAIFormSchema = validateAIFormSchema;
