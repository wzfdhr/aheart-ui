"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-label"];
const _hoisted_2 = ["disabled", "aria-label"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-pagination__simple"
};
const _hoisted_4 = {
  key: 0,
  class: "aheart-pagination__ellipsis",
  "aria-hidden": "true"
};
const _hoisted_5 = ["aria-current", "disabled", "onClick"];
const _hoisted_6 = ["disabled", "aria-label"];
const _hoisted_7 = ["value", "disabled", "aria-label"];
const _hoisted_8 = ["value"];
const _hoisted_9 = { class: "aheart-pagination__quick-jumper-label" };
const _hoisted_10 = ["max", "disabled"];
const _hoisted_11 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "APagination"
  },
  __name: "pagination",
  props: types.paginationProps,
  emits: types.paginationEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
      name: "APaginationRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const innerCurrent = vue.ref(props.defaultCurrent);
    const innerPageSize = vue.ref(props.defaultPageSize);
    const quickJumpValue = vue.ref("");
    const isControlled = vue.computed(() => props.current !== void 0);
    const isPageSizeControlled = vue.computed(() => props.pageSize !== void 0);
    const mergedPageSize = vue.computed(() => props.pageSize ?? innerPageSize.value);
    const pageCount = vue.computed(() => getPageCount(props.total, mergedPageSize.value));
    const mergedCurrent = vue.computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value));
    const shouldRender = vue.computed(() => !(props.hideOnSinglePage && pageCount.value <= 1));
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const normalizedPageSizeOptions = vue.computed(() => {
      const options = props.pageSizeOptions.map((option) => Number(option)).filter((option) => Number.isInteger(option) && option > 0);
      return Array.from(new Set(options.length > 0 ? options : [10, 20, 50, 100]));
    });
    const normalizedSizeChangerBoundary = vue.computed(() => Math.max(0, props.totalBoundaryShowSizeChanger));
    const shouldShowSizeChanger = vue.computed(
      () => props.showSizeChanger ?? props.total > normalizedSizeChangerBoundary.value
    );
    const isQuickJumperConfig = (value) => typeof value === "object" && value !== null;
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const quickJumperConfig = vue.computed(() => isQuickJumperConfig(props.showQuickJumper) ? props.showQuickJumper : void 0);
    const paginationLocale = vue.computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      return {
        ariaLabel: ((_b = (_a = config.value.locale) == null ? void 0 : _a.pagination) == null ? void 0 : _b.ariaLabel) ?? "pagination",
        prevPage: ((_d = (_c = config.value.locale) == null ? void 0 : _c.pagination) == null ? void 0 : _d.prevPage) ?? "Previous Page",
        nextPage: ((_f = (_e = config.value.locale) == null ? void 0 : _e.pagination) == null ? void 0 : _f.nextPage) ?? "Next Page",
        pageSizeLabel: ((_h = (_g = config.value.locale) == null ? void 0 : _g.pagination) == null ? void 0 : _h.pageSizeLabel) ?? "Page Size",
        pageSize: ((_j = (_i = config.value.locale) == null ? void 0 : _i.pagination) == null ? void 0 : _j.pageSize) ?? ((pageSize) => `${pageSize} / page`),
        quickJumper: ((_l = (_k = config.value.locale) == null ? void 0 : _k.pagination) == null ? void 0 : _l.quickJumper) ?? "Go to",
        goButton: ((_n = (_m = config.value.locale) == null ? void 0 : _m.pagination) == null ? void 0 : _n.goButton) ?? "Go",
        total: ((_p = (_o = config.value.locale) == null ? void 0 : _o.pagination) == null ? void 0 : _p.total) ?? ((total) => `Total ${total} items`)
      };
    });
    const quickJumperGoButton = vue.computed(() => {
      var _a;
      return ((_a = quickJumperConfig.value) == null ? void 0 : _a.goButton) ?? paginationLocale.value.goButton;
    });
    const showQuickJumperGoButton = vue.computed(
      () => {
        var _a;
        return props.showQuickJumper === true || hasRenderable((_a = quickJumperConfig.value) == null ? void 0 : _a.goButton);
      }
    );
    const paginationClass = vue.computed(() => {
      var _a;
      return [
        `aheart-pagination--${resolvedSize.value}`,
        props.align ? `aheart-pagination--align-${props.align}` : void 0,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-disabled": isDisabled.value,
          "is-simple": props.simple,
          "is-compact": props.showLessItems
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const totalClass = vue.computed(() => {
      var _a;
      return ["aheart-pagination__total", (_a = props.classNames) == null ? void 0 : _a.total];
    });
    const totalStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.total;
    });
    const prevClass = vue.computed(() => {
      var _a;
      return ["aheart-pagination__prev", (_a = props.classNames) == null ? void 0 : _a.prev];
    });
    const prevStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prev;
    });
    const nextClass = vue.computed(() => {
      var _a;
      return ["aheart-pagination__next", (_a = props.classNames) == null ? void 0 : _a.next];
    });
    const nextStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.next;
    });
    const sizeChangerClass = vue.computed(() => {
      var _a;
      return ["aheart-pagination__size-changer", (_a = props.classNames) == null ? void 0 : _a.sizeChanger];
    });
    const sizeChangerStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.sizeChanger;
    });
    const quickJumperClass = vue.computed(() => {
      var _a;
      return ["aheart-pagination__quick-jumper", (_a = props.classNames) == null ? void 0 : _a.quickJumper];
    });
    const quickJumperStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.quickJumper;
    });
    const currentRange = vue.computed(() => {
      if (props.total <= 0) {
        return [0, 0];
      }
      const start = (mergedCurrent.value - 1) * mergedPageSize.value + 1;
      const end = Math.min(mergedCurrent.value * mergedPageSize.value, props.total);
      return [start, end];
    });
    const showTotalContent = vue.computed(() => Boolean(props.showTotal));
    const totalText = vue.computed(() => {
      if (typeof props.showTotal === "function") {
        return props.showTotal(props.total, currentRange.value);
      }
      return paginationLocale.value.total(props.total, currentRange.value);
    });
    const pageItems = vue.computed(() => {
      const count = pageCount.value;
      const current = mergedCurrent.value;
      const siblingCount = props.showLessItems ? 1 : 2;
      const allPagesLimit = siblingCount * 2 + 5;
      if (count <= allPagesLimit) {
        return Array.from({ length: count }, (_, index) => ({
          key: `page-${index + 1}`,
          type: "page",
          page: index + 1
        }));
      }
      const items = [{ key: "page-1", type: "page", page: 1 }];
      const left = Math.max(2, current - siblingCount);
      const right = Math.min(count - 1, current + siblingCount);
      if (left > 2) {
        if (left === 3) {
          items.push({ key: "page-2", type: "page", page: 2 });
        } else {
          items.push({ key: "ellipsis-left", type: "ellipsis" });
        }
      }
      for (let page = left; page <= right; page += 1) {
        items.push({ key: `page-${page}`, type: "page", page });
      }
      if (right < count - 1) {
        if (right === count - 2) {
          items.push({ key: `page-${count - 1}`, type: "page", page: count - 1 });
        } else {
          items.push({ key: "ellipsis-right", type: "ellipsis" });
        }
      }
      items.push({ key: `page-${count}`, type: "page", page: count });
      return items;
    });
    const prevLabel = vue.computed(() => renderItem(Math.max(mergedCurrent.value - 1, 1), "prev", "‹"));
    const nextLabel = vue.computed(() => renderItem(Math.min(mergedCurrent.value + 1, pageCount.value), "next", "›"));
    vue.watch(
      () => [props.total, mergedPageSize.value],
      () => {
        if (!isControlled.value && innerCurrent.value > pageCount.value) {
          innerCurrent.value = pageCount.value;
        }
      }
    );
    const getPageCount = (total, pageSize) => Math.max(1, Math.ceil(total / pageSize));
    const normalizeCurrent = (nextCurrent) => Math.min(Math.max(nextCurrent, 1), pageCount.value);
    const setCurrent = (nextCurrent) => {
      if (isDisabled.value) {
        return;
      }
      const normalizedCurrent = normalizeCurrent(nextCurrent);
      if (normalizedCurrent === mergedCurrent.value) {
        return;
      }
      if (!isControlled.value) {
        innerCurrent.value = normalizedCurrent;
      }
      emit("update:current", normalizedCurrent);
      emit("change", normalizedCurrent, mergedPageSize.value);
    };
    const getPageClass = (page) => {
      var _a, _b, _c;
      return [
        (_a = props.classNames) == null ? void 0 : _a.page,
        {
          "is-active": page === mergedCurrent.value,
          [String((_b = props.classNames) == null ? void 0 : _b.activePage)]: page === mergedCurrent.value && ((_c = props.classNames) == null ? void 0 : _c.activePage)
        }
      ];
    };
    const getPageStyle = (page) => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.page, page === mergedCurrent.value ? (_b = props.styles) == null ? void 0 : _b.activePage : void 0];
    };
    const renderItem = (page, type, originalElement) => {
      var _a;
      return ((_a = props.itemRender) == null ? void 0 : _a.call(props, page, type, originalElement)) ?? originalElement;
    };
    const handlePageSizeChange = (event) => {
      if (isDisabled.value) {
        return;
      }
      const nextPageSize = Number(event.target.value);
      if (!Number.isInteger(nextPageSize) || nextPageSize <= 0 || nextPageSize === mergedPageSize.value) {
        return;
      }
      const nextPageCount = getPageCount(props.total, nextPageSize);
      const nextCurrent = Math.min(mergedCurrent.value, nextPageCount);
      if (!isPageSizeControlled.value) {
        innerPageSize.value = nextPageSize;
      }
      if (!isControlled.value) {
        innerCurrent.value = nextCurrent;
      }
      if (nextCurrent !== mergedCurrent.value) {
        emit("update:current", nextCurrent);
      }
      emit("update:pageSize", nextPageSize);
      emit("showSizeChange", nextCurrent, nextPageSize);
      emit("change", nextCurrent, nextPageSize);
    };
    const jumpToQuickPage = () => {
      const nextInputValue = String(quickJumpValue.value).trim();
      if (isDisabled.value || !nextInputValue) {
        return;
      }
      const nextCurrent = Number(nextInputValue);
      if (!Number.isFinite(nextCurrent)) {
        return;
      }
      setCurrent(Math.trunc(nextCurrent));
    };
    return (_ctx, _cache) => {
      return shouldRender.value ? (vue.openBlock(), vue.createElementBlock("nav", {
        key: 0,
        class: vue.normalizeClass(["aheart-pagination", paginationClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        "aria-label": paginationLocale.value.ariaLabel
      }, [
        showTotalContent.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(totalClass.value),
          style: vue.normalizeStyle(totalStyle.value)
        }, vue.toDisplayString(totalText.value), 7)) : vue.createCommentVNode("", true),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(prevClass.value),
          style: vue.normalizeStyle(prevStyle.value),
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value <= 1,
          "aria-label": paginationLocale.value.prevPage,
          onClick: _cache[0] || (_cache[0] = ($event) => setCurrent(mergedCurrent.value - 1))
        }, vue.toDisplayString(prevLabel.value), 15, _hoisted_2),
        _ctx.simple ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(mergedCurrent.value) + " / " + vue.toDisplayString(pageCount.value), 1)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 2 }, vue.renderList(pageItems.value, (item) => {
          return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
            key: item.key
          }, [
            item.type === "ellipsis" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "...")) : (vue.openBlock(), vue.createElementBlock("button", {
              key: 1,
              class: vue.normalizeClass(["aheart-pagination__page", getPageClass(item.page)]),
              type: "button",
              style: vue.normalizeStyle(getPageStyle(item.page)),
              "aria-current": item.page === mergedCurrent.value ? "page" : void 0,
              disabled: isDisabled.value,
              onClick: ($event) => setCurrent(item.page)
            }, vue.toDisplayString(renderItem(item.page, "page", String(item.page))), 15, _hoisted_5))
          ], 64);
        }), 128)),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(nextClass.value),
          style: vue.normalizeStyle(nextStyle.value),
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value >= pageCount.value,
          "aria-label": paginationLocale.value.nextPage,
          onClick: _cache[1] || (_cache[1] = ($event) => setCurrent(mergedCurrent.value + 1))
        }, vue.toDisplayString(nextLabel.value), 15, _hoisted_6),
        shouldShowSizeChanger.value ? (vue.openBlock(), vue.createElementBlock("select", {
          key: 3,
          class: vue.normalizeClass(sizeChangerClass.value),
          style: vue.normalizeStyle(sizeChangerStyle.value),
          value: mergedPageSize.value,
          disabled: isDisabled.value,
          "aria-label": paginationLocale.value.pageSizeLabel,
          onChange: handlePageSizeChange
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedPageSizeOptions.value, (option) => {
            return vue.openBlock(), vue.createElementBlock("option", {
              key: option,
              value: option
            }, vue.toDisplayString(paginationLocale.value.pageSize(option)), 9, _hoisted_8);
          }), 128))
        ], 46, _hoisted_7)) : vue.createCommentVNode("", true),
        _ctx.showQuickJumper ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 4,
          class: vue.normalizeClass(quickJumperClass.value),
          style: vue.normalizeStyle(quickJumperStyle.value)
        }, [
          vue.createElementVNode("span", _hoisted_9, vue.toDisplayString(paginationLocale.value.quickJumper), 1),
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => quickJumpValue.value = $event),
            class: "aheart-pagination__quick-jumper-input",
            type: "number",
            min: "1",
            max: pageCount.value,
            disabled: isDisabled.value,
            onKeydown: vue.withKeys(jumpToQuickPage, ["enter"])
          }, null, 40, _hoisted_10), [
            [vue.vModelText, quickJumpValue.value]
          ]),
          showQuickJumperGoButton.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "aheart-pagination__quick-jumper-go",
            type: "button",
            disabled: isDisabled.value,
            onClick: jumpToQuickPage
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: quickJumperGoButton.value }, null, 8, ["node"])
          ], 8, _hoisted_11)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
