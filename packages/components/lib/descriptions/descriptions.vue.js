"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
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
    const normalizedColumn = vue.computed(() => Math.max(1, Math.floor(props.column)));
    const resolveItemContent = (item) => item.content ?? item.children ?? "";
    const resolveNumericSpan = (item, currentSpan) => {
      if (item.span === "filled") {
        const remainingSpan = normalizedColumn.value - currentSpan;
        return remainingSpan > 0 ? remainingSpan : normalizedColumn.value;
      }
      return Math.max(1, Math.min(item.span ?? 1, normalizedColumn.value));
    };
    const resolveRenderedItem = (item, index, span) => ({
      ...item,
      resolvedKey: item.key ?? `${item.label}-${index}`,
      resolvedContent: resolveItemContent(item),
      span
    });
    const rows = vue.computed(() => {
      const nextRows = [];
      let currentRow = [];
      let currentSpan = 0;
      normalizedItems.value.forEach((item, index) => {
        let itemSpan = resolveNumericSpan(item, currentSpan);
        if (currentRow.length > 0 && currentSpan + itemSpan > normalizedColumn.value) {
          nextRows.push(currentRow);
          currentRow = [];
          currentSpan = 0;
          itemSpan = resolveNumericSpan(item, currentSpan);
        }
        currentRow.push(resolveRenderedItem(item, index, itemSpan));
        currentSpan += itemSpan;
        if (currentSpan >= normalizedColumn.value) {
          nextRows.push(currentRow);
          currentRow = [];
          currentSpan = 0;
        }
      });
      if (currentRow.length > 0) {
        nextRows.push(currentRow);
      }
      return nextRows;
    });
    const descriptionsClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      `aheart-descriptions--${props.layout}`,
      `aheart-descriptions--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered
      }
    ]);
    const descriptionsStyle = vue.computed(() => [
      {
        "--aheart-descriptions-column": normalizedColumn.value
      },
      props.style,
      props.styles.root
    ]);
    const getItemClass = (item) => [props.classNames.item, item.className];
    const getItemStyle = (item) => [
      {
        "--aheart-descriptions-item-span": item.span
      },
      props.styles.item,
      item.style
    ];
    const getLabelClass = () => [
      props.classNames.label,
      {
        "has-colon": props.colon
      }
    ];
    const getLabelStyle = (item) => [props.labelStyle, props.styles.label, item.labelStyle];
    const getContentStyle = (item) => [props.contentStyle, props.styles.content, item.contentStyle];
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-descriptions", descriptionsClass.value]),
        style: vue.normalizeStyle(descriptionsStyle.value)
      }, [
        _ctx.title || _ctx.extra ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-descriptions__header", _ctx.classNames.header]),
          style: vue.normalizeStyle(_ctx.styles.header)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["aheart-descriptions__title", _ctx.classNames.title]),
            style: vue.normalizeStyle(_ctx.styles.title)
          }, vue.toDisplayString(_ctx.title), 7),
          _ctx.extra ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(["aheart-descriptions__extra", _ctx.classNames.extra]),
            style: vue.normalizeStyle(_ctx.styles.extra)
          }, vue.toDisplayString(_ctx.extra), 7)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["aheart-descriptions__table", _ctx.classNames.table]),
          style: vue.normalizeStyle(_ctx.styles.table),
          role: "table"
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(rows.value, (row, rowIndex) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: rowIndex,
              class: vue.normalizeClass(["aheart-descriptions__row", _ctx.classNames.row]),
              style: vue.normalizeStyle(_ctx.styles.row),
              role: "row"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(row, (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: item.resolvedKey,
                  class: vue.normalizeClass(["aheart-descriptions__item", getItemClass(item)]),
                  style: vue.normalizeStyle(getItemStyle(item)),
                  role: "cell"
                }, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["aheart-descriptions__label", getLabelClass()]),
                    style: vue.normalizeStyle(getLabelStyle(item))
                  }, vue.toDisplayString(item.label), 7),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["aheart-descriptions__content", _ctx.classNames.content]),
                    style: vue.normalizeStyle(getContentStyle(item))
                  }, vue.toDisplayString(item.resolvedContent), 7)
                ], 6);
              }), 128))
            ], 6);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
