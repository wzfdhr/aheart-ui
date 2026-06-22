import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, toDisplayString, createCommentVNode, createElementVNode, Fragment, renderList, withDirectives, withKeys, vModelText, createVNode, unref } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { paginationProps, paginationEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["disabled"];
const _hoisted_2 = {
  key: 1,
  class: "aheart-pagination__simple"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-pagination__ellipsis",
  "aria-hidden": "true"
};
const _hoisted_4 = ["aria-current", "disabled", "onClick"];
const _hoisted_5 = ["disabled"];
const _hoisted_6 = ["value", "disabled"];
const _hoisted_7 = ["value"];
const _hoisted_8 = ["max", "disabled"];
const _hoisted_9 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APagination"
  },
  __name: "pagination",
  props: paginationProps,
  emits: paginationEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
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
    const config = useAheartConfig();
    const innerCurrent = ref(props.defaultCurrent);
    const innerPageSize = ref(props.defaultPageSize);
    const quickJumpValue = ref("");
    const isControlled = computed(() => props.current !== void 0);
    const isPageSizeControlled = computed(() => props.pageSize !== void 0);
    const mergedPageSize = computed(() => props.pageSize ?? innerPageSize.value);
    const pageCount = computed(() => getPageCount(props.total, mergedPageSize.value));
    const mergedCurrent = computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value));
    const shouldRender = computed(() => !(props.hideOnSinglePage && pageCount.value <= 1));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const normalizedPageSizeOptions = computed(() => {
      const options = props.pageSizeOptions.map((option) => Number(option)).filter((option) => Number.isInteger(option) && option > 0);
      return Array.from(new Set(options.length > 0 ? options : [10, 20, 50, 100]));
    });
    const normalizedSizeChangerBoundary = computed(() => Math.max(0, props.totalBoundaryShowSizeChanger));
    const shouldShowSizeChanger = computed(
      () => props.showSizeChanger ?? props.total > normalizedSizeChangerBoundary.value
    );
    const isQuickJumperConfig = (value) => typeof value === "object" && value !== null;
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const quickJumperConfig = computed(() => isQuickJumperConfig(props.showQuickJumper) ? props.showQuickJumper : void 0);
    const quickJumperGoButton = computed(() => {
      var _a;
      return ((_a = quickJumperConfig.value) == null ? void 0 : _a.goButton) ?? "Go";
    });
    const showQuickJumperGoButton = computed(
      () => {
        var _a;
        return props.showQuickJumper === true || hasRenderable((_a = quickJumperConfig.value) == null ? void 0 : _a.goButton);
      }
    );
    const paginationClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const totalClass = computed(() => {
      var _a;
      return ["aheart-pagination__total", (_a = props.classNames) == null ? void 0 : _a.total];
    });
    const totalStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.total;
    });
    const prevClass = computed(() => {
      var _a;
      return ["aheart-pagination__prev", (_a = props.classNames) == null ? void 0 : _a.prev];
    });
    const prevStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prev;
    });
    const nextClass = computed(() => {
      var _a;
      return ["aheart-pagination__next", (_a = props.classNames) == null ? void 0 : _a.next];
    });
    const nextStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.next;
    });
    const sizeChangerClass = computed(() => {
      var _a;
      return ["aheart-pagination__size-changer", (_a = props.classNames) == null ? void 0 : _a.sizeChanger];
    });
    const sizeChangerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.sizeChanger;
    });
    const quickJumperClass = computed(() => {
      var _a;
      return ["aheart-pagination__quick-jumper", (_a = props.classNames) == null ? void 0 : _a.quickJumper];
    });
    const quickJumperStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.quickJumper;
    });
    const currentRange = computed(() => {
      if (props.total <= 0) {
        return [0, 0];
      }
      const start = (mergedCurrent.value - 1) * mergedPageSize.value + 1;
      const end = Math.min(mergedCurrent.value * mergedPageSize.value, props.total);
      return [start, end];
    });
    const showTotalContent = computed(() => Boolean(props.showTotal));
    const totalText = computed(() => {
      if (typeof props.showTotal === "function") {
        return props.showTotal(props.total, currentRange.value);
      }
      return `Total ${props.total} items`;
    });
    const pageItems = computed(() => {
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
    const prevLabel = computed(() => renderItem(Math.max(mergedCurrent.value - 1, 1), "prev", "‹"));
    const nextLabel = computed(() => renderItem(Math.min(mergedCurrent.value + 1, pageCount.value), "next", "›"));
    watch(
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
      return shouldRender.value ? (openBlock(), createElementBlock("nav", {
        key: 0,
        class: normalizeClass(["aheart-pagination", paginationClass.value]),
        style: normalizeStyle(rootStyle.value),
        "aria-label": "pagination"
      }, [
        showTotalContent.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(totalClass.value),
          style: normalizeStyle(totalStyle.value)
        }, toDisplayString(totalText.value), 7)) : createCommentVNode("", true),
        createElementVNode("button", {
          class: normalizeClass(prevClass.value),
          style: normalizeStyle(prevStyle.value),
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value <= 1,
          "aria-label": "Previous Page",
          onClick: _cache[0] || (_cache[0] = ($event) => setCurrent(mergedCurrent.value - 1))
        }, toDisplayString(prevLabel.value), 15, _hoisted_1),
        _ctx.simple ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(mergedCurrent.value) + " / " + toDisplayString(pageCount.value), 1)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(pageItems.value, (item) => {
          return openBlock(), createElementBlock(Fragment, {
            key: item.key
          }, [
            item.type === "ellipsis" ? (openBlock(), createElementBlock("span", _hoisted_3, "...")) : (openBlock(), createElementBlock("button", {
              key: 1,
              class: normalizeClass(["aheart-pagination__page", getPageClass(item.page)]),
              type: "button",
              style: normalizeStyle(getPageStyle(item.page)),
              "aria-current": item.page === mergedCurrent.value ? "page" : void 0,
              disabled: isDisabled.value,
              onClick: ($event) => setCurrent(item.page)
            }, toDisplayString(renderItem(item.page, "page", String(item.page))), 15, _hoisted_4))
          ], 64);
        }), 128)),
        createElementVNode("button", {
          class: normalizeClass(nextClass.value),
          style: normalizeStyle(nextStyle.value),
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value >= pageCount.value,
          "aria-label": "Next Page",
          onClick: _cache[1] || (_cache[1] = ($event) => setCurrent(mergedCurrent.value + 1))
        }, toDisplayString(nextLabel.value), 15, _hoisted_5),
        shouldShowSizeChanger.value ? (openBlock(), createElementBlock("select", {
          key: 3,
          class: normalizeClass(sizeChangerClass.value),
          style: normalizeStyle(sizeChangerStyle.value),
          value: mergedPageSize.value,
          disabled: isDisabled.value,
          "aria-label": "Page Size",
          onChange: handlePageSizeChange
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedPageSizeOptions.value, (option) => {
            return openBlock(), createElementBlock("option", {
              key: option,
              value: option
            }, toDisplayString(option) + " / page ", 9, _hoisted_7);
          }), 128))
        ], 46, _hoisted_6)) : createCommentVNode("", true),
        _ctx.showQuickJumper ? (openBlock(), createElementBlock("span", {
          key: 4,
          class: normalizeClass(quickJumperClass.value),
          style: normalizeStyle(quickJumperStyle.value)
        }, [
          _cache[3] || (_cache[3] = createElementVNode("span", { class: "aheart-pagination__quick-jumper-label" }, "Go to", -1)),
          withDirectives(createElementVNode("input", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => quickJumpValue.value = $event),
            class: "aheart-pagination__quick-jumper-input",
            type: "number",
            min: "1",
            max: pageCount.value,
            disabled: isDisabled.value,
            onKeydown: withKeys(jumpToQuickPage, ["enter"])
          }, null, 40, _hoisted_8), [
            [vModelText, quickJumpValue.value]
          ]),
          showQuickJumperGoButton.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "aheart-pagination__quick-jumper-go",
            type: "button",
            disabled: isDisabled.value,
            onClick: jumpToQuickPage
          }, [
            createVNode(unref(ARenderNode), { node: quickJumperGoButton.value }, null, 8, ["node"])
          ], 8, _hoisted_9)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ], 6)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
