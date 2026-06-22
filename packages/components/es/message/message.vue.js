import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createElementVNode, createVNode, unref, withModifiers } from "vue";
import { messageProps, messageEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["onClick", "onMouseenter", "onMouseleave"];
const _hoisted_2 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AMessage"
  },
  __name: "message",
  props: messageProps,
  emits: messageEmits,
  setup(__props) {
    const props = __props;
    const ARenderNode = defineComponent({
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
    const messageClass = computed(() => [
      props.prefixCls,
      props.classNames.root,
      {
        "is-rtl": props.rtl
      }
    ]);
    const messageStyle = computed(() => [
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-message", messageClass.value]),
        style: normalizeStyle(messageStyle.value)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.notices, (notice) => {
          return openBlock(), createElementBlock("div", {
            key: notice.key,
            class: normalizeClass(["aheart-message-notice", getNoticeClass(notice)]),
            style: normalizeStyle(getNoticeStyle(notice)),
            role: "status",
            "aria-live": "polite",
            onClick: ($event) => {
              var _a;
              return (_a = notice.onClick) == null ? void 0 : _a.call(notice);
            },
            onMouseenter: ($event) => _ctx.$emit("noticeMouseEnter", notice.key),
            onMouseleave: ($event) => _ctx.$emit("noticeMouseLeave", notice.key)
          }, [
            createElementVNode("span", {
              class: normalizeClass(["aheart-message-notice__icon", getIconClass(notice)]),
              style: normalizeStyle(getIconStyle(notice)),
              "aria-hidden": "true"
            }, [
              createVNode(unref(ARenderNode), {
                node: notice.icon ?? iconMap[notice.type]
              }, null, 8, ["node"])
            ], 6),
            createElementVNode("span", {
              class: normalizeClass(["aheart-message-notice__content", getContentClass(notice)]),
              style: normalizeStyle(getContentStyle(notice))
            }, [
              createVNode(unref(ARenderNode), {
                node: notice.content
              }, null, 8, ["node"])
            ], 6),
            createElementVNode("button", {
              class: normalizeClass(["aheart-message-notice__close", getCloseClass(notice)]),
              style: normalizeStyle(getCloseStyle(notice)),
              type: "button",
              "aria-label": "Close",
              onClick: withModifiers(($event) => _ctx.$emit("close", notice.key), ["stop"])
            }, " × ", 14, _hoisted_2)
          ], 46, _hoisted_1);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
