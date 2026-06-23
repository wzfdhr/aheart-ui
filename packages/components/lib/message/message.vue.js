"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["onClick", "onMouseenter", "onMouseleave"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-message-notice__stack-count",
  "aria-label": "Stacked message count"
};
const _hoisted_3 = ["onClick"];
const defaultStackThreshold = 3;
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AMessage"
  },
  __name: "message",
  props: types.messageProps,
  emits: types.messageEmits,
  setup(__props) {
    const props = __props;
    const ARenderNode = vue.defineComponent({
      name: "AMessageRenderNode",
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
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×",
      loading: "…"
    };
    const normalizeTop = (top) => typeof top === "number" ? `${top}px` : top;
    const getStackThreshold = (stack) => {
      if (!stack) {
        return void 0;
      }
      if (stack === true) {
        return defaultStackThreshold;
      }
      return Math.max(1, stack.threshold);
    };
    const stackThreshold = vue.computed(() => getStackThreshold(props.stack));
    const isStacked = vue.computed(() => stackThreshold.value !== void 0 && props.notices.length > stackThreshold.value);
    const visibleNotices = vue.computed(() => isStacked.value ? props.notices.slice(-1) : props.notices);
    const stackedCount = vue.computed(() => Math.max(0, props.notices.length - visibleNotices.value.length));
    const messageClass = vue.computed(() => [
      props.prefixCls,
      props.classNames.root,
      {
        "is-rtl": props.rtl,
        "is-stacked": isStacked.value
      }
    ]);
    const messageStyle = vue.computed(() => [
      {
        top: normalizeTop(props.top)
      },
      props.styles.root
    ]);
    const getNoticeClass = (notice) => {
      var _a;
      return [
        `aheart-message-notice--${notice.type}`,
        props.prefixCls ? `${props.prefixCls}-notice` : void 0,
        notice.className,
        props.classNames.notice,
        (_a = notice.classNames) == null ? void 0 : _a.notice,
        {
          "is-rtl": props.rtl
        }
      ];
    };
    const getNoticeStyle = (notice) => {
      var _a;
      return [props.styles.notice, notice.style, (_a = notice.styles) == null ? void 0 : _a.notice];
    };
    const getIconClass = (notice) => {
      var _a;
      return [
        props.prefixCls ? `${props.prefixCls}-notice-icon` : void 0,
        props.classNames.icon,
        (_a = notice.classNames) == null ? void 0 : _a.icon
      ];
    };
    const getIconStyle = (notice) => {
      var _a;
      return [props.styles.icon, (_a = notice.styles) == null ? void 0 : _a.icon];
    };
    const getContentClass = (notice) => {
      var _a;
      return [
        props.prefixCls ? `${props.prefixCls}-notice-content` : void 0,
        props.classNames.content,
        (_a = notice.classNames) == null ? void 0 : _a.content
      ];
    };
    const getContentStyle = (notice) => {
      var _a;
      return [props.styles.content, (_a = notice.styles) == null ? void 0 : _a.content];
    };
    const getCloseClass = (notice) => {
      var _a;
      return [
        props.prefixCls ? `${props.prefixCls}-notice-close` : void 0,
        props.classNames.close,
        (_a = notice.classNames) == null ? void 0 : _a.close
      ];
    };
    const getCloseStyle = (notice) => {
      var _a;
      return [props.styles.close, (_a = notice.styles) == null ? void 0 : _a.close];
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-message", messageClass.value]),
        style: vue.normalizeStyle(messageStyle.value)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleNotices.value, (notice) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: notice.key,
            class: vue.normalizeClass(["aheart-message-notice", getNoticeClass(notice)]),
            style: vue.normalizeStyle(getNoticeStyle(notice)),
            role: "status",
            "aria-live": "polite",
            onClick: ($event) => {
              var _a;
              return (_a = notice.onClick) == null ? void 0 : _a.call(notice);
            },
            onMouseenter: ($event) => _ctx.$emit("noticeMouseEnter", notice.key),
            onMouseleave: ($event) => _ctx.$emit("noticeMouseLeave", notice.key)
          }, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-message-notice__icon", getIconClass(notice)]),
              style: vue.normalizeStyle(getIconStyle(notice)),
              "aria-hidden": "true"
            }, [
              vue.createVNode(vue.unref(ARenderNode), {
                node: notice.icon ?? iconMap[notice.type]
              }, null, 8, ["node"])
            ], 6),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(["aheart-message-notice__content", getContentClass(notice)]),
              style: vue.normalizeStyle(getContentStyle(notice))
            }, [
              vue.createVNode(vue.unref(ARenderNode), {
                node: notice.content
              }, null, 8, ["node"])
            ], 6),
            isStacked.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, "+" + vue.toDisplayString(stackedCount.value), 1)) : vue.createCommentVNode("", true),
            notice.closable ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 1,
              class: vue.normalizeClass(["aheart-message-notice__close", getCloseClass(notice)]),
              style: vue.normalizeStyle(getCloseStyle(notice)),
              type: "button",
              "aria-label": "Close",
              onClick: vue.withModifiers(($event) => _ctx.$emit("close", notice.key), ["stop"])
            }, [
              vue.createVNode(vue.unref(ARenderNode), {
                node: notice.closeIcon ?? "×"
              }, null, 8, ["node"])
            ], 14, _hoisted_3)) : vue.createCommentVNode("", true)
          ], 46, _hoisted_1);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
