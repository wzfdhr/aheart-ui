import { defineComponent as Ae, computed as R, reactive as D, ref as q, onMounted as Fe, watch as k, toRaw as J, onBeforeUnmount as Ve, openBlock as c, createBlock as Q, unref as X, withCtx as W, createElementBlock as d, toDisplayString as v, createCommentVNode as V, createElementVNode as j, Fragment as K, renderList as I, resolveDynamicComponent as je, createVNode as ne, createTextVNode as we, nextTick as le } from "vue";
import { Form as Ee, FormItem as $e, Button as Se } from "aheart-ui";
import Re from "./form-field.vue.js";
import { validateAIFormSchema as qe } from "./form-schema.js";
const Ce = {
  key: 0,
  class: "aheart-ai-form__header"
}, xe = { key: 0 }, Me = { key: 1 }, Ne = {
  key: 1,
  class: "aheart-ai-form__error-summary",
  role: "alert",
  tabindex: "-1"
}, Te = ["onClick"], Pe = { key: 0 }, Ue = { key: 0 }, Be = {
  key: 2,
  class: "aheart-ai-form__submit-error",
  role: "alert"
}, De = { class: "aheart-ai-form__footer" }, We = {
  key: 1,
  class: "aheart-ai-form__error",
  role: "alert"
}, Qe = /* @__PURE__ */ Ae({
  name: "AAIForm",
  __name: "form",
  props: {
    modelValue: { default: () => ({}) },
    schema: {},
    disabled: { type: Boolean, default: !1 },
    submitting: { type: Boolean, default: !1 },
    submitText: { default: "提交" },
    submitError: { default: void 0 },
    validators: { default: () => ({}) }
  },
  emits: ["update:modelValue", "submit", "schema-error", "validation-error"],
  setup(p, { expose: ie, emit: ce }) {
    const u = p, w = ce, i = R(() => {
      const e = qe(u.schema);
      if (!e.valid || !e.schema) return e;
      const t = e.schema.fields.flatMap((r) => (r.rules ?? []).filter((a) => a.kind === "async" && !(Object.prototype.hasOwnProperty.call(u.validators, a.validator) && typeof u.validators[a.validator] == "function")).map((a) => `fields.${r.key}.rules.${a.validator} validator 不存在`));
      return t.length ? { valid: !1, errors: [...e.errors, ...t] } : e;
    }), h = R(() => u.modelValue), b = R(
      () => {
        var e;
        return (((e = i.value.schema) == null ? void 0 : e.fields) ?? []).reduce(
          (t, r) => {
            const a = Object.prototype.hasOwnProperty.call(h.value, r.key);
            return !a && P.has(r.key) || (t[r.key] = a ? h.value[r.key] : r.defaultValue), t;
          },
          { ...h.value }
        );
      }
    ), l = D({}), N = D({}), T = /* @__PURE__ */ new Map(), L = D({}), z = /* @__PURE__ */ new Map(), _ = q(), m = /* @__PURE__ */ new Map(), Z = () => {
      for (const e of m.values()) e.abort();
      m.clear();
    }, G = q({}), P = D(/* @__PURE__ */ new Set()), g = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), ue = q(!1);
    Fe(() => {
      ue.value = !0;
    });
    const ee = q(!1), de = q(0), $ = q(!1);
    k(
      i,
      (e) => {
        e.valid || w("schema-error", e.errors);
      },
      { immediate: !0 }
    ), k(b, (e) => {
      Object.keys(G.value).length || (G.value = M(e));
    }, { immediate: !0, deep: !0 }), k(
      b,
      (e, t) => {
        Object.keys(N).forEach((r) => {
          Object.prototype.hasOwnProperty.call(e, r) || delete N[r];
        }), Object.entries(e).forEach(([r, a]) => {
          const s = T.get(r);
          T.has(r) ? F(a, s) && (T.delete(r), delete l[r]) : t && !F(a, t[r]) && delete l[r], N[r] = M(a);
        });
      },
      { immediate: !0, deep: !0 }
    ), k(h, (e) => {
      for (const t of [...g]) {
        const r = O.get(t), a = A.get(t), s = J(e);
        if (s !== r) {
          if (s !== r && !F(s, a)) {
            g.delete(t), E.delete(t), O.delete(t), A.delete(t);
            continue;
          }
          Object.prototype.hasOwnProperty.call(e, t) ? (g.delete(t), E.delete(t), O.delete(t), A.delete(t)) : (P.add(t), g.delete(t), E.delete(t), O.delete(t), A.delete(t));
        }
      }
    }, { deep: !0 });
    const H = (e) => {
      if (!e) return !0;
      const t = b.value[e.field];
      return e.operator === "equals" ? t === e.value : e.operator === "not-equals" ? t !== e.value : e.operator === "includes" ? Array.isArray(t) ? t.includes(e.value) : String(t ?? "").includes(String(e.value ?? "")) : e.operator === "not-includes" ? Array.isArray(t) ? !t.includes(e.value) : !String(t ?? "").includes(String(e.value ?? "")) : e.operator === "is-empty" ? S(t) : !S(t);
    }, C = R(
      () => {
        var e;
        return ((e = i.value.schema) == null ? void 0 : e.fields.filter((t) => H(t.visibleWhen))) ?? [];
      }
    );
    k(b, (e, t) => {
      var n;
      const r = t ?? {}, a = { ...h.value };
      let s = !1;
      for (const o of ((n = i.value.schema) == null ? void 0 : n.fields) ?? []) {
        const f = te(o.visibleWhen, r), y = te(o.visibleWhen, e);
        y && g.has(o.key) && !P.has(o.key) && (g.delete(o.key), E.delete(o.key), O.delete(o.key), A.delete(o.key)), f && !y && o.preserve === !1 && (delete a[o.key], g.add(o.key), E.set(o.key, Object.prototype.hasOwnProperty.call(h.value, o.key)), O.set(o.key, J(h.value)), A.set(o.key, J(a)), s = !0);
      }
      s && w("update:modelValue", a);
    }, { deep: !0 }), k(b, (e, t) => {
      var a, s;
      const r = t ?? {};
      for (const n of ((a = i.value.schema) == null ? void 0 : a.fields) ?? []) {
        const o = oe(n);
        (!F(e[n.key], r[n.key]) || o.some((y) => !F(e[y], r[y]))) && ((s = m.get(n.key)) == null || s.abort(), m.delete(n.key));
      }
    }, { deep: !0 }), k(() => u.schema, () => {
      for (const e of m.values()) e.abort();
      m.clear();
    });
    const te = (e, t) => {
      if (!e) return !0;
      const r = t[e.field];
      return e.operator === "equals" ? r === e.value : e.operator === "not-equals" ? r !== e.value : e.operator === "is-empty" ? S(r) : e.operator === "is-not-empty" ? !S(r) : e.operator === "includes" ? Array.isArray(r) ? r.includes(e.value) : String(r ?? "").includes(String(e.value ?? "")) : Array.isArray(r) ? !r.includes(e.value) : !String(r ?? "").includes(String(e.value ?? ""));
    }, x = (e) => u.disabled || u.submitting || !!(e.disabledWhen && H(e.disabledWhen)), me = R(() => {
      const e = i.value.schema;
      if (!e) return [];
      const t = (e.groups ?? []).map((a) => ({
        key: a.key,
        group: a,
        fields: C.value.filter((s) => s.group === a.key)
      })).filter((a) => a.fields.length > 0), r = C.value.filter((a) => !a.group);
      return r.length && t.push({ key: "__ungrouped", fields: r }), t;
    }), Y = R(
      () => C.value.filter((e) => l[e.key]).map((e) => ({ key: e.key, message: l[e.key] }))
    );
    k([b, C], () => {
      var t;
      const e = ((t = i.value.schema) == null ? void 0 : t.fields) ?? [];
      Object.keys(l).forEach((r) => {
        const a = e.find((s) => s.key === r);
        (!a || !H(a.visibleWhen) || x(a)) && delete l[r];
      });
    });
    function S(e) {
      return e == null || e === "" || e === !1 || Array.isArray(e) && (e.length === 0 || e.every((t) => t == null || t === ""));
    }
    function F(e, t) {
      if (Object.is(e, t)) return !0;
      if (Array.isArray(e) || Array.isArray(t))
        return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((r, a) => F(r, t[a]));
      if (e && t && typeof e == "object" && typeof t == "object") {
        const r = e, a = t, s = Object.keys(r), n = Object.keys(a);
        return s.length === n.length && s.every((o) => Object.prototype.hasOwnProperty.call(a, o) && F(r[o], a[o]));
      }
      return !1;
    }
    function M(e) {
      return Array.isArray(e) ? e.map((t) => M(t)) : e && typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype ? Object.fromEntries(Object.entries(e).map(([t, r]) => [t, M(r)])) : e;
    }
    const fe = (e, t) => e.type === "date-range" || e.type === "time-range" ? !Array.isArray(t) || t.length !== 2 || t.some((r) => r == null || r === "") : S(t), ye = (e) => {
      const t = b.value[e.key];
      if (t !== void 0) return t;
      if (e.type === "checkbox" || e.type === "upload") return [];
      if (!(e.type === "date-range" || e.type === "time-range"))
        return "";
    }, pe = (e) => `${e.key}-${L[e.key] ?? 0}`, he = (e, t) => {
      t && typeof t.focus == "function" ? z.set(e, t) : z.delete(e);
    }, re = (e) => {
      var t;
      return (t = z.get(e)) == null ? void 0 : t.focus();
    }, be = async (e, t) => {
      T.set(e, t), w("update:modelValue", { ...h.value, [e]: t }), await le(), h.value[e] !== t && (L[e] = (L[e] ?? 0) + 1);
    }, ve = (e) => {
      if (x(e)) return [];
      const t = [];
      if (e.required && !x(e)) {
        const r = `${e.label}为必填项`;
        t.push({ required: !0, message: r }, { message: r, validator: (a, s) => fe(e, s) ? r : void 0 });
      }
      for (const r of e.rules ?? []) t.push(ge(e, r));
      return t;
    }, ae = (e) => {
      if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return !1;
      const [t, r, a] = e.split("-").map(Number), s = new Date(Date.UTC(t, r - 1, a));
      return s.getUTCFullYear() === t && s.getUTCMonth() === r - 1 && s.getUTCDate() === a;
    }, se = (e) => typeof e == "string" && /^\d{2}:\d{2}:\d{2}$/.test(e) && e.split(":").map(Number).every((t, r) => r === 0 ? t < 24 : t < 60), ge = (e, t) => ({
      ...t.kind === "format" && t.format === "email" ? { type: "email" } : {},
      ...t.kind === "range" && t.min !== void 0 ? { min: t.min } : {},
      ...t.kind === "range" && t.max !== void 0 ? { max: t.max } : {},
      message: t.message ?? `${e.label}校验失败`,
      validator: (r, a) => {
        if (!e.required && S(a)) return;
        if (t.kind === "range") {
          const o = t.valueType === "number" ? typeof a == "number" && Number.isFinite(a) ? a : void 0 : typeof a == "string" || Array.isArray(a) ? a.length : void 0;
          return o === void 0 || t.min !== void 0 && o < t.min || t.max !== void 0 && o > t.max ? t.message ?? `${e.label}范围不合法` : void 0;
        }
        if (t.kind === "format")
          return typeof a != "string" ? t.message ?? `${e.label}格式不合法` : (t.format === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a) : t.format === "url" ? (() => {
            try {
              const f = new URL(a);
              return f.protocol === "http:" || f.protocol === "https:";
            } catch {
              return !1;
            }
          })() : t.format === "date" ? /^\d{4}-\d{2}-\d{2}$/.test(a) && ae(a) : se(a)) ? void 0 : t.message ?? `${e.label}格式不合法`;
        if (t.kind === "compare") {
          const o = b.value[t.field];
          if (!(typeof a == typeof o && (typeof a == "number" ? Number.isFinite(a) && Number.isFinite(o) : !0))) return t.message ?? `${e.label}与${t.field}类型不匹配`;
          if (["greater-than", "greater-than-or-equal", "less-than", "less-than-or-equal"].includes(t.operator)) {
            const U = (B) => typeof B == "number" && Number.isFinite(B) ? "number" : ae(B) ? "date" : se(B) ? "time" : void 0;
            if (!U(a) || !U(o) || U(a) !== U(o)) return t.message ?? `${e.label}有序比较不合法`;
          }
          return (t.operator === "equals" ? a === o : t.operator === "not-equals" ? a !== o : t.operator === "greater-than" ? a > o : t.operator === "greater-than-or-equal" ? a >= o : t.operator === "less-than" ? a < o : a <= o) ? void 0 : t.message ?? `${e.label}比较不成立`;
        }
        const s = m.get(e.key) ?? new AbortController();
        m.set(e.key, s);
        const n = Object.prototype.hasOwnProperty.call(u.validators, t.validator) && typeof u.validators[t.validator] == "function" ? u.validators[t.validator] : void 0;
        if (!n) return `${e.label}校验器不存在`;
        try {
          const o = n(a, { values: b.value, field: e, signal: s.signal }), f = (y) => {
            if (!s.signal.aborted) {
              if (y === !1) return t.message ?? `${e.label}校验失败`;
              if (typeof y == "string") return y;
            }
          };
          return o && typeof o.then == "function" ? o.then(f) : f(o);
        } catch (o) {
          return s.signal.aborted ? void 0 : o instanceof Error ? o.message : t.message ?? `${e.label}校验失败`;
        }
      }
    }), ke = () => {
      var e, t;
      u.disabled || u.submitting || ($.value = !1, Z(), (t = (e = _.value) == null ? void 0 : e.clearValidate) == null || t.call(e), Object.keys(l).forEach((r) => delete l[r]), ee.value = !1);
    }, oe = (e) => Array.from(/* @__PURE__ */ new Set([...e.dependencies ?? [], ...(e.rules ?? []).filter((t) => t.kind === "compare").map((t) => t.field)])), _e = (e) => {
      if ($.value) {
        $.value = !1;
        return;
      }
      u.disabled || u.submitting || ee.value || w("submit", { ...e });
    }, Oe = (e) => {
      if ($.value) {
        $.value = !1;
        return;
      }
      if (u.disabled || u.submitting) return;
      const t = e.errorFields.map((r) => {
        var o;
        const a = typeof r.name == "string" ? r.name : String(r.name[0]), s = (o = i.value.schema) == null ? void 0 : o.fields.find((f) => f.key === a), n = r.errors[0] || `${(s == null ? void 0 : s.label) ?? a}为必填项`;
        return { key: a, message: n };
      }).filter((r) => C.value.some((a) => a.key === r.key) && !x(i.value.schema.fields.find((a) => a.key === r.key)));
      t.forEach((r) => {
        l[r.key] = r.message;
      }), t.length && (w("validation-error", t), le(() => re(t[0].key)));
    };
    return ie({ validate: () => {
      var e, t;
      return Z(), Promise.resolve(((t = (e = _.value) == null ? void 0 : e.validate) == null ? void 0 : t.call(e)) ?? { errorFields: [] }).then((r) => {
        var a;
        Object.keys(l).forEach((s) => delete l[s]);
        for (const s of r.errorFields ?? []) {
          const n = typeof s.name == "string" ? s.name : String(s.name[0]);
          (a = s.errors) != null && a[0] && (l[n] = s.errors[0]);
        }
        return r;
      });
    }, resetFields: () => {
      var t, r, a, s, n;
      for (const o of m.values()) o.abort();
      m.clear(), P.clear(), g.clear(), E.clear(), O.clear(), A.clear(), de.value += 1, $.value = !0, Object.keys(l).forEach((o) => delete l[o]);
      const e = (((t = i.value.schema) == null ? void 0 : t.fields) ?? []).map((o) => ({ name: o.key, errors: [] }));
      (a = (r = _.value) == null ? void 0 : r.clearValidate) == null || a.call(r), (n = (s = _.value) == null ? void 0 : s.setFieldsErrors) == null || n.call(s, e), Object.keys(l).forEach((o) => delete l[o]), w("update:modelValue", M(G.value));
    }, clearValidate: (e) => {
      var t, r;
      e ? e.forEach((a) => delete l[a]) : Object.keys(l).forEach((a) => delete l[a]), (r = (t = _.value) == null ? void 0 : t.clearValidate) == null || r.call(t, e);
    }, setFieldsErrors: (e) => {
      var t, r;
      e.forEach((a) => {
        a.errors[0] ? l[a.name] = a.errors[0] : delete l[a.name];
      }), (r = (t = _.value) == null ? void 0 : t.setFieldsErrors) == null || r.call(t, e);
    } }), Ve(() => {
      for (const e of m.values()) e.abort();
    }), (e, t) => i.value.valid && i.value.schema ? (c(), Q(X(Ee), {
      key: 0,
      ref_key: "formElement",
      ref: _,
      class: "aheart-ai-form",
      model: N,
      disabled: p.disabled || p.submitting,
      "required-mark": !1,
      layout: "vertical",
      "aria-busy": p.submitting ? "true" : "false",
      onSubmit: ke,
      onFinish: _e,
      onFinishFailed: Oe
    }, {
      default: W(() => [
        i.value.schema.title || i.value.schema.description ? (c(), d("header", Ce, [
          i.value.schema.title ? (c(), d("h2", xe, v(i.value.schema.title), 1)) : V("", !0),
          i.value.schema.description ? (c(), d("p", Me, v(i.value.schema.description), 1)) : V("", !0)
        ])) : V("", !0),
        Y.value.length ? (c(), d("div", Ne, [
          j("strong", null, "请解决 " + v(Y.value.length) + " 个校验问题", 1),
          j("ul", null, [
            (c(!0), d(K, null, I(Y.value, (r) => (c(), d("li", {
              key: r.key
            }, [
              j("button", {
                type: "button",
                onClick: (a) => re(r.key)
              }, v(r.message), 9, Te)
            ]))), 128))
          ])
        ])) : V("", !0),
        (c(!0), d(K, null, I(me.value, (r) => {
          var a;
          return c(), Q(je(r.group ? "fieldset" : "section"), {
            key: r.key,
            class: "aheart-ai-form__group",
            "data-group-key": (a = r.group) == null ? void 0 : a.key
          }, {
            default: W(() => [
              r.group ? (c(), d("legend", Pe, [
                j("span", null, v(r.group.title), 1),
                r.group.description ? (c(), d("small", Ue, v(r.group.description), 1)) : V("", !0)
              ])) : V("", !0),
              (c(!0), d(K, null, I(r.fields, (s) => (c(), Q(X($e), {
                key: pe(s),
                name: s.key,
                rules: ve(s),
                dependencies: oe(s),
                "no-style": ""
              }, {
                default: W(() => [
                  ne(Re, {
                    ref_for: !0,
                    ref: (n) => he(s.key, n),
                    field: s,
                    value: ye(s),
                    disabled: x(s),
                    error: l[s.key],
                    onUpdate: (n) => be(s.key, n)
                  }, null, 8, ["field", "value", "disabled", "error", "onUpdate"])
                ]),
                _: 2
              }, 1032, ["name", "rules", "dependencies"]))), 128))
            ]),
            _: 2
          }, 1032, ["data-group-key"]);
        }), 128)),
        p.submitError ? (c(), d("p", Be, v(p.submitError), 1)) : V("", !0),
        j("footer", De, [
          ne(X(Se), {
            "html-type": "submit",
            type: "primary",
            loading: p.submitting,
            disabled: p.disabled
          }, {
            default: W(() => [
              we(v(p.submitText), 1)
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ])
      ]),
      _: 1
    }, 8, ["model", "disabled", "aria-busy"])) : (c(), d("div", We, [
      t[0] || (t[0] = j("strong", null, "表单配置无效", -1)),
      j("ul", null, [
        (c(!0), d(K, null, I(i.value.errors, (r) => (c(), d("li", { key: r }, v(r), 1))), 128))
      ])
    ]));
  }
});
export {
  Qe as default
};
