import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, createElementVNode, Fragment, renderList } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { paginationProps, paginationEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-pagination__total"
};
const _hoisted_2 = ["disabled"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-pagination__simple"
};
const _hoisted_4 = ["aria-current", "disabled", "onClick"];
const _hoisted_5 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APagination"
  },
  __name: "pagination",
  props: paginationProps,
  emits: paginationEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const innerCurrent = ref(props.defaultCurrent);
    const isControlled = computed(() => props.current !== void 0);
    const mergedPageSize = computed(() => props.pageSize ?? props.defaultPageSize);
    const pageCount = computed(() => Math.max(1, Math.ceil(props.total / mergedPageSize.value)));
    const mergedCurrent = computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value));
    const shouldRender = computed(() => !(props.hideOnSinglePage && pageCount.value <= 1));
    const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const paginationClass = computed(() => [
      `aheart-pagination--${resolvedSize.value}`,
      {
        "is-disabled": isDisabled.value,
        "is-simple": props.simple
      }
    ]);
    watch(
      () => props.total,
      () => {
        if (!isControlled.value && innerCurrent.value > pageCount.value) {
          innerCurrent.value = pageCount.value;
        }
      }
    );
    const setCurrent = (nextCurrent) => {
      if (isDisabled.value) {
        return;
      }
      const normalizedCurrent = Math.min(Math.max(nextCurrent, 1), pageCount.value);
      if (normalizedCurrent === mergedCurrent.value) {
        return;
      }
      if (!isControlled.value) {
        innerCurrent.value = normalizedCurrent;
      }
      emit("update:current", normalizedCurrent);
      emit("change", normalizedCurrent, mergedPageSize.value);
    };
    return (_ctx, _cache) => {
      return shouldRender.value ? (openBlock(), createElementBlock("nav", {
        key: 0,
        class: normalizeClass(["aheart-pagination", paginationClass.value]),
        "aria-label": "pagination"
      }, [
        _ctx.showTotal ? (openBlock(), createElementBlock("span", _hoisted_1, "Total " + toDisplayString(_ctx.total) + " items", 1)) : createCommentVNode("", true),
        createElementVNode("button", {
          class: "aheart-pagination__prev",
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value <= 1,
          "aria-label": "Previous Page",
          onClick: _cache[0] || (_cache[0] = ($event) => setCurrent(mergedCurrent.value - 1))
        }, " ‹ ", 8, _hoisted_2),
        _ctx.simple ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(mergedCurrent.value) + " / " + toDisplayString(pageCount.value), 1)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(pages.value, (page) => {
          return openBlock(), createElementBlock("button", {
            key: page,
            class: normalizeClass(["aheart-pagination__page", { "is-active": page === mergedCurrent.value }]),
            type: "button",
            "aria-current": page === mergedCurrent.value ? "page" : void 0,
            disabled: isDisabled.value,
            onClick: ($event) => setCurrent(page)
          }, toDisplayString(page), 11, _hoisted_4);
        }), 128)),
        createElementVNode("button", {
          class: "aheart-pagination__next",
          type: "button",
          disabled: isDisabled.value || mergedCurrent.value >= pageCount.value,
          "aria-label": "Next Page",
          onClick: _cache[1] || (_cache[1] = ($event) => setCurrent(mergedCurrent.value + 1))
        }, " › ", 8, _hoisted_5)
      ], 2)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
