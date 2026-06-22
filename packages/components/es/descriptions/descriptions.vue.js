import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, toDisplayString, createCommentVNode, Fragment, renderList } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { descriptionsProps } from "./types.js";
import "./style.css.js";
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
    const normalizedColumn = computed(() => Math.max(1, Math.floor(props.column)));
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
    const rows = computed(() => {
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
    const descriptionsClass = computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      `aheart-descriptions--${props.layout}`,
      `aheart-descriptions--${resolvedSize.value}`,
      {
        "is-bordered": props.bordered
      }
    ]);
    const descriptionsStyle = computed(() => [
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
      return openBlock(), createElementBlock("section", {
        class: normalizeClass(["aheart-descriptions", descriptionsClass.value]),
        style: normalizeStyle(descriptionsStyle.value)
      }, [
        _ctx.title || _ctx.extra ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-descriptions__header", _ctx.classNames.header]),
          style: normalizeStyle(_ctx.styles.header)
        }, [
          createElementVNode("div", {
            class: normalizeClass(["aheart-descriptions__title", _ctx.classNames.title]),
            style: normalizeStyle(_ctx.styles.title)
          }, toDisplayString(_ctx.title), 7),
          _ctx.extra ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["aheart-descriptions__extra", _ctx.classNames.extra]),
            style: normalizeStyle(_ctx.styles.extra)
          }, toDisplayString(_ctx.extra), 7)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(["aheart-descriptions__table", _ctx.classNames.table]),
          style: normalizeStyle(_ctx.styles.table),
          role: "table"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(rows.value, (row, rowIndex) => {
            return openBlock(), createElementBlock("div", {
              key: rowIndex,
              class: normalizeClass(["aheart-descriptions__row", _ctx.classNames.row]),
              style: normalizeStyle(_ctx.styles.row),
              role: "row"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(row, (item) => {
                return openBlock(), createElementBlock("div", {
                  key: item.resolvedKey,
                  class: normalizeClass(["aheart-descriptions__item", getItemClass(item)]),
                  style: normalizeStyle(getItemStyle(item)),
                  role: "cell"
                }, [
                  createElementVNode("div", {
                    class: normalizeClass(["aheart-descriptions__label", getLabelClass()]),
                    style: normalizeStyle(getLabelStyle(item))
                  }, toDisplayString(item.label), 7),
                  createElementVNode("div", {
                    class: normalizeClass(["aheart-descriptions__content", _ctx.classNames.content]),
                    style: normalizeStyle(getContentStyle(item))
                  }, toDisplayString(item.resolvedContent), 7)
                ], 6);
              }), 128))
            ], 6);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
