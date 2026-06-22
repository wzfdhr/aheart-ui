import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, Fragment, renderList } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { cardProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
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
    const isBorderless = computed(() => {
      if (props.variant) {
        return props.variant === "borderless";
      }
      return !props.bordered;
    });
    const showActions = computed(() => {
      var _a;
      return Boolean(slots.actions) || Boolean((_a = props.actions) == null ? void 0 : _a.length);
    });
    const cardClass = computed(() => {
      var _a;
      return [
        `aheart-card--${resolvedSize.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-borderless": isBorderless.value,
          "aheart-card--inner": props.type === "inner",
          "is-hoverable": props.hoverable,
          "is-loading": props.loading
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const coverClass = computed(() => {
      var _a;
      return ["aheart-card__cover", (_a = props.classNames) == null ? void 0 : _a.cover];
    });
    const coverStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cover;
    });
    const headerClass = computed(() => {
      var _a;
      return ["aheart-card__header", (_a = props.classNames) == null ? void 0 : _a.header];
    });
    const headerStyle = computed(() => {
      var _a;
      return [props.headStyle, (_a = props.styles) == null ? void 0 : _a.header];
    });
    const titleClass = computed(() => {
      var _a;
      return ["aheart-card__title", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const titleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const extraClass = computed(() => {
      var _a;
      return ["aheart-card__extra", (_a = props.classNames) == null ? void 0 : _a.extra];
    });
    const extraStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.extra;
    });
    const bodyClass = computed(() => {
      var _a;
      return ["aheart-card__body", (_a = props.classNames) == null ? void 0 : _a.body];
    });
    const bodyStyleValue = computed(() => {
      var _a;
      return [props.bodyStyle, (_a = props.styles) == null ? void 0 : _a.body];
    });
    const actionsClass = computed(() => {
      var _a;
      return ["aheart-card__actions", (_a = props.classNames) == null ? void 0 : _a.actions];
    });
    const actionsStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: normalizeClass(["aheart-card", cardClass.value]),
        style: normalizeStyle(rootStyle.value),
        role: "region"
      }, [
        _ctx.$slots.cover ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(coverClass.value),
          style: normalizeStyle(coverStyle.value)
        }, [
          renderSlot(_ctx.$slots, "cover")
        ], 6)) : createCommentVNode("", true),
        hasHeader.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(headerClass.value),
          style: normalizeStyle(headerStyle.value)
        }, [
          createElementVNode("div", {
            class: normalizeClass(titleClass.value),
            style: normalizeStyle(titleStyle.value)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ], 6),
          hasExtra.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(extraClass.value),
            style: normalizeStyle(extraStyle.value)
          }, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createTextVNode(toDisplayString(_ctx.extra), 1)
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(bodyClass.value),
          style: normalizeStyle(bodyStyleValue.value)
        }, [
          _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_1, [..._cache[0] || (_cache[0] = [
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : renderSlot(_ctx.$slots, "default", { key: 1 })
        ], 6),
        showActions.value ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(actionsClass.value),
          style: normalizeStyle(actionsStyle.value)
        }, [
          renderSlot(_ctx.$slots, "actions", {}, () => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.actions, (action, index) => {
              return openBlock(), createElementBlock("span", {
                key: index,
                class: "aheart-card__action"
              }, toDisplayString(action), 1);
            }), 128))
          ])
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
