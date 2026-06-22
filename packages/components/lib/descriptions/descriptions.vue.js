"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-descriptions__header"
};
const _hoisted_2 = { class: "aheart-descriptions__title" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-descriptions__extra"
};
const _hoisted_4 = {
  class: "aheart-descriptions__table",
  role: "table"
};
const _hoisted_5 = { class: "aheart-descriptions__label" };
const _hoisted_6 = { class: "aheart-descriptions__content" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADescriptions"
  },
  __name: "descriptions",
  props: types.descriptionsProps,
  setup(__props) {
    const props = __props;
    const config = context.useAheartConfig();
    const normalizedItems = vue.computed(() => props.items ?? []);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const rows = vue.computed(() => {
      const nextRows = [];
      let currentRow = [];
      let currentSpan = 0;
      normalizedItems.value.forEach((item) => {
        const itemSpan = Math.max(1, Math.min(item.span ?? 1, props.column));
        if (currentRow.length > 0 && currentSpan + itemSpan > props.column) {
          nextRows.push(currentRow);
          currentRow = [];
          currentSpan = 0;
        }
        currentRow.push({ ...item, span: itemSpan });
        currentSpan += itemSpan;
      });
      if (currentRow.length > 0) {
        nextRows.push(currentRow);
      }
      return nextRows;
    });
    const descriptionsClass = vue.computed(() => [
      `aheart-descriptions--${props.layout}`,
      `aheart-descriptions--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered
      }
    ]);
    const descriptionsStyle = vue.computed(() => ({
      "--aheart-descriptions-column": props.column
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-descriptions", descriptionsClass.value]),
        style: vue.normalizeStyle(descriptionsStyle.value)
      }, [
        _ctx.title || _ctx.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, vue.toDisplayString(_ctx.title), 1),
          _ctx.extra ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, vue.toDisplayString(_ctx.extra), 1)) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_4, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(rows.value, (row, rowIndex) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: rowIndex,
              class: "aheart-descriptions__row",
              role: "row"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(row, (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.label,
                  class: "aheart-descriptions__item",
                  style: vue.normalizeStyle({ "--aheart-descriptions-item-span": item.span ?? 1 }),
                  role: "cell"
                }, [
                  vue.createElementVNode("div", _hoisted_5, vue.toDisplayString(item.label), 1),
                  vue.createElementVNode("div", _hoisted_6, vue.toDisplayString(item.content), 1)
                ], 4);
              }), 128))
            ]);
          }), 128))
        ])
      ], 6);
    };
  }
});
exports.default = _sfc_main;
