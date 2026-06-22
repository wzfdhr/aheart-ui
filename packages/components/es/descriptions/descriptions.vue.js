import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, toDisplayString, createCommentVNode, Fragment, renderList } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { descriptionsProps } from "./types.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADescriptions"
  },
  __name: "descriptions",
  props: descriptionsProps,
  setup(__props) {
    const props = __props;
    const config = useAheartConfig();
    const normalizedItems = computed(() => props.items ?? []);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const rows = computed(() => {
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
    const descriptionsClass = computed(() => [
      `aheart-descriptions--${props.layout}`,
      `aheart-descriptions--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered
      }
    ]);
    const descriptionsStyle = computed(() => ({
      "--aheart-descriptions-column": props.column
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: normalizeClass(["aheart-descriptions", descriptionsClass.value]),
        style: normalizeStyle(descriptionsStyle.value)
      }, [
        _ctx.title || _ctx.extra ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createElementVNode("div", _hoisted_2, toDisplayString(_ctx.title), 1),
          _ctx.extra ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(_ctx.extra), 1)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(rows.value, (row, rowIndex) => {
            return openBlock(), createElementBlock("div", {
              key: rowIndex,
              class: "aheart-descriptions__row",
              role: "row"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(row, (item) => {
                return openBlock(), createElementBlock("div", {
                  key: item.label,
                  class: "aheart-descriptions__item",
                  style: normalizeStyle({ "--aheart-descriptions-item-span": item.span ?? 1 }),
                  role: "cell"
                }, [
                  createElementVNode("div", _hoisted_5, toDisplayString(item.label), 1),
                  createElementVNode("div", _hoisted_6, toDisplayString(item.content), 1)
                ], 4);
              }), 128))
            ]);
          }), 128))
        ])
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
