const $ = [
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
], b = ["equals", "not-equals", "includes", "not-includes", "is-empty", "is-not-empty"], a = (e) => typeof e == "object" && e !== null && !Array.isArray(e), u = (e) => typeof e == "string" || typeof e == "number", c = (e) => Array.isArray(e) && e.every(u), k = (e) => a(e) && typeof e.uid == "string" && typeof e.name == "string", l = (e) => {
  if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return !1;
  const [t, i, o] = e.split("-").map(Number), r = new Date(Date.UTC(t, i - 1, o));
  return r.getUTCFullYear() === t && r.getUTCMonth() === i - 1 && r.getUTCDate() === o;
}, h = (e) => {
  if (typeof e != "string" || !/^\d{2}:\d{2}:\d{2}$/.test(e)) return !1;
  const [t, i, o] = e.split(":").map(Number);
  return t <= 23 && i <= 59 && o <= 59;
}, m = (e, t) => Array.isArray(e) && e.length === 2 && e.every(t), A = /* @__PURE__ */ new Set(["version", "title", "description", "groups", "fields"]), S = /* @__PURE__ */ new Set(["key", "title", "description"]), O = /* @__PURE__ */ new Set([
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
  "disabledWhen",
  "rules",
  "dependencies",
  "preserve"
]), w = /* @__PURE__ */ new Set(["label", "value", "disabled"]), T = /* @__PURE__ */ new Set(["field", "operator", "value"]), E = /* @__PURE__ */ new Set(["select", "checkbox", "radio", "tree-select"]), d = (e, t, i, o) => {
  const r = Object.keys(e).filter((p) => !t.has(p));
  r.length && o.push(`${i} 包含不支持的属性：${r.join("、")}`);
}, _ = (e, t) => t === void 0 ? !0 : e === "switch" ? typeof t == "boolean" : e === "number" ? typeof t == "number" : e === "checkbox" ? c(t) : e === "upload" ? Array.isArray(t) && t.every(k) : e === "date" ? l(t) : e === "time" ? h(t) : e === "date-range" ? m(t, l) : e === "time-range" ? m(t, h) : e === "tree-select" ? u(t) || c(t) : e === "select" || e === "radio" ? u(t) : typeof t == "string", g = (e, t, i) => !a(e) || typeof e.field != "string" || !e.field.trim() ? (i.push(`${t} 必须包含字段名`), !1) : (d(e, T, t, i), typeof e.operator != "string" || !b.includes(e.operator) ? (i.push(`${t} 包含不支持的条件操作符`), !1) : e.value !== void 0 && !u(e.value) && typeof e.value != "boolean" && !Array.isArray(e.value) ? (i.push(`${t}.value 类型不安全`), !1) : Array.isArray(e.value) && !e.value.every((o) => typeof o == "string") ? (i.push(`${t}.value 数组只能包含字符串`), !1) : !0), D = (e) => {
  const t = [];
  if (!a(e) || e.version !== "1" || !Array.isArray(e.fields))
    return { valid: !1, errors: ["AIForm schema 必须是 version 为 1 的 fields 数组"] };
  d(e, A, "schema", t), e.title !== void 0 && typeof e.title != "string" && t.push("schema.title 必须是字符串"), e.description !== void 0 && typeof e.description != "string" && t.push("schema.description 必须是字符串");
  const i = /* @__PURE__ */ new Set();
  e.groups !== void 0 && (Array.isArray(e.groups) ? e.groups.forEach((r, p) => {
    const s = `groups[${p}]`;
    if (!a(r)) {
      t.push(`${s} 必须是对象`);
      return;
    }
    d(r, S, s, t), typeof r.key != "string" || !r.key.trim() ? t.push(`${s}.key 必须是非空字符串`) : i.has(r.key) ? t.push(`${s}.key 不能重复`) : i.add(r.key), (typeof r.title != "string" || !r.title.trim()) && t.push(`${s}.title 必须是非空字符串`), r.description !== void 0 && typeof r.description != "string" && t.push(`${s}.description 必须是字符串`);
  }) : t.push("schema.groups 必须是数组"));
  const o = /* @__PURE__ */ new Set();
  return e.fields.forEach((r, p) => {
    const s = `fields[${p}]`;
    if (!a(r) || typeof r.key != "string" || !r.key.trim()) {
      t.push(`${s}.key 必须是非空字符串`);
      return;
    }
    d(r, O, s, t), o.has(r.key) && t.push(`${s}.key 不能重复`), o.add(r.key), typeof r.label != "string" && t.push(`${s}.label 必须是字符串`), (typeof r.type != "string" || !$.includes(r.type)) && t.push(`${s}.type 不受支持`), r.required !== void 0 && typeof r.required != "boolean" && t.push(`${s}.required 必须是布尔值`), r.placeholder !== void 0 && typeof r.placeholder != "string" && t.push(`${s}.placeholder 必须是字符串`), r.description !== void 0 && typeof r.description != "string" && t.push(`${s}.description 必须是字符串`), r.group !== void 0 && (typeof r.group != "string" || !i.has(r.group)) && t.push(`${s}.group 必须引用已声明的分组`), _(r.type, r.defaultValue) || t.push(`${s}.defaultValue 与字段类型不兼容`), r.visibleWhen !== void 0 && g(r.visibleWhen, `${s}.visibleWhen`, t), r.disabledWhen !== void 0 && g(r.disabledWhen, `${s}.disabledWhen`, t), r.dependencies !== void 0 && (!Array.isArray(r.dependencies) || !r.dependencies.every((n) => typeof n == "string" && n.trim())) && t.push(`${s}.dependencies 必须是非空字段名数组`), r.preserve !== void 0 && typeof r.preserve != "boolean" && t.push(`${s}.preserve 必须是布尔值`), r.rules !== void 0 && (Array.isArray(r.rules) ? r.rules.forEach((n, f) => q(n, `${s}.rules[${f}]`, t)) : t.push(`${s}.rules 必须是数组`)), r.options !== void 0 && (Array.isArray(r.options) ? r.options.forEach((n, f) => {
      !a(n) || typeof n.label != "string" || !u(n.value) || n.disabled !== void 0 && typeof n.disabled != "boolean" ? t.push(`${s}.options[${f}] 不合法`) : d(n, w, `${s}.options[${f}]`, t);
    }) : t.push(`${s}.options 必须是数组`)), r.required === !0 && E.has(r.type) && (!Array.isArray(r.options) || !r.options.some((n) => a(n) && n.disabled !== !0)) && t.push(`${s}.options 必须为必填字段提供至少一个可用选项`);
  }), e.fields.forEach((r, p) => {
    if (a(r)) {
      for (const s of ["visibleWhen", "disabledWhen"]) {
        const n = r[s];
        a(n) && typeof n.field == "string" && !o.has(n.field) && t.push(`fields[${p}].${s}.field 必须引用已声明的字段`);
      }
      if (Array.isArray(r.dependencies))
        for (const s of r.dependencies) typeof s == "string" && !o.has(s) && t.push(`fields[${p}].dependencies 必须引用已声明的字段`);
      if (Array.isArray(r.rules))
        for (const s of r.rules) a(s) && s.kind === "compare" && typeof s.field == "string" && !o.has(s.field) && t.push(`fields[${p}].rules.compare.field 必须引用已声明的字段`);
      if (Array.isArray(r.rules)) {
        for (const s of r.rules) if (a(s) && (s.kind === "range" && (s.valueType === "number" && r.type !== "number" || s.valueType === "length" && !["input", "textarea", "checkbox"].includes(String(r.type))) && t.push(`fields[${p}].rules.range 与字段类型组合不合法`), s.kind === "format" && ((s.format === "email" || s.format === "url" ? ["input", "textarea"] : s.format === "date" ? ["date"] : ["time"]).includes(String(r.type)) || t.push(`fields[${p}].rules.format 与字段类型组合不合法`)), s.kind === "compare" && typeof s.field == "string")) {
          const n = e.fields.find((f) => a(f) && f.key === s.field);
          n && ["greater-than", "greater-than-or-equal", "less-than", "less-than-or-equal"].includes(String(s.operator)) && (r.type === "number" && n.type === "number" || ["date", "time"].includes(String(r.type)) && r.type === n.type || t.push(`fields[${p}].rules.compare 有序比较类型不兼容`));
        }
      }
    }
  }), t.length ? { valid: !1, errors: t } : { valid: !0, errors: [], schema: e };
}, y = /* @__PURE__ */ Object.create(null);
Object.assign(y, {
  range: /* @__PURE__ */ new Set(["kind", "valueType", "min", "max", "message"]),
  format: /* @__PURE__ */ new Set(["kind", "format", "message"]),
  compare: /* @__PURE__ */ new Set(["kind", "field", "operator", "message"]),
  async: /* @__PURE__ */ new Set(["kind", "validator", "message"])
});
const q = (e, t, i) => {
  if (!a(e) || typeof e.kind != "string" || !Object.prototype.hasOwnProperty.call(y, e.kind)) {
    i.push(`${t} kind 不受支持`);
    return;
  }
  if (d(e, y[e.kind], t, i), e.message !== void 0 && typeof e.message != "string" && i.push(`${t}.message 必须是字符串`), e.kind === "range") {
    e.valueType !== "number" && e.valueType !== "length" && i.push(`${t}.valueType 不受支持`), e.min === void 0 && e.max === void 0 && i.push(`${t} 至少需要一个范围边界`);
    for (const o of ["min", "max"]) e[o] !== void 0 && (typeof e[o] != "number" || !Number.isFinite(e[o])) && i.push(`${t}.${o} 必须是有限数字`);
    typeof e.min == "number" && typeof e.max == "number" && e.min > e.max && i.push(`${t} min 不能大于 max`);
  } else e.kind === "format" ? ["email", "url", "date", "time"].includes(String(e.format)) || i.push(`${t}.format 不受支持`) : e.kind === "compare" ? ((typeof e.field != "string" || !e.field.trim()) && i.push(`${t}.field 必须是字段名`), ["equals", "not-equals", "greater-than", "greater-than-or-equal", "less-than", "less-than-or-equal"].includes(String(e.operator)) || i.push(`${t}.operator 不受支持`)) : (typeof e.validator != "string" || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(e.validator)) && i.push(`${t}.validator 必须是安全名称`);
};
export {
  b as AI_FORM_CONDITION_OPERATORS,
  $ as AI_FORM_FIELD_TYPES,
  D as validateAIFormSchema
};
