import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { cardProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-card__cover"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-card__header"
};
const _hoisted_3 = { class: "aheart-card__title" };
const _hoisted_4 = {
  key: 0,
  class: "aheart-card__extra"
};
const _hoisted_5 = { class: "aheart-card__body" };
const _hoisted_6 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
};
const _hoisted_7 = {
  key: 2,
  class: "aheart-card__actions"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACard"
  },
  __name: "card",
  props: cardProps,
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const config = useAheartConfig();
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const hasHeader = computed(() => Boolean(props.title || slots.title || props.extra || slots.extra));
    const hasExtra = computed(() => Boolean(props.extra || slots.extra));
    const cardClass = computed(() => [
      `aheart-card--${resolvedSize.value}`,
      {
        "is-borderless": !props.bordered,
        "is-hoverable": props.hoverable,
        "is-loading": props.loading
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: normalizeClass(["aheart-card", cardClass.value]),
        role: "region"
      }, [
        _ctx.$slots.cover ? (openBlock(), createElementBlock("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "cover")
        ])) : createCommentVNode("", true),
        hasHeader.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ]),
          hasExtra.value ? (openBlock(), createElementBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createTextVNode(toDisplayString(_ctx.extra), 1)
            ])
          ])) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_5, [
          _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_6, [..._cache[0] || (_cache[0] = [
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : renderSlot(_ctx.$slots, "default", { key: 1 })
        ]),
        _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_7, [
          renderSlot(_ctx.$slots, "actions")
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
