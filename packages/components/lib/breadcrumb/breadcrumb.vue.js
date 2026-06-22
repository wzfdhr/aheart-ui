"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-current"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["href", "onClick"];
const _hoisted_4 = ["onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ABreadcrumb"
  },
  __name: "breadcrumb",
  props: types.breadcrumbProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = vue.defineComponent({
      name: "ABreadcrumbRenderNode",
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
    const normalizedItems = vue.computed(() => props.items ?? []);
    const resolvedPaths = vue.computed(() => normalizedItems.value.map((item) => resolvePath(item.path ?? item.href ?? "")));
    const breadcrumbClass = vue.computed(() => [props.className, props.classNames.root]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
    const isCurrent = (index) => index === normalizedItems.value.length - 1;
    const shouldRenderLink = (item, index) => {
      return Boolean(getItemHref(item) && !item.disabled && !isCurrent(index));
    };
    const getItemHref = (item) => {
      return item.href ?? resolvePath(item.path ?? "");
    };
    const getItemKey = (item, index) => {
      if (item.key !== void 0) {
        return item.key;
      }
      if (item.href || item.path) {
        return `${item.href ?? item.path}-${index}`;
      }
      if (typeof item.title === "string" || typeof item.title === "number") {
        return `${item.title}-${index}`;
      }
      return index;
    };
    const itemClass = (item, index) => [
      props.classNames.item,
      item.className,
      {
        "is-current": isCurrent(index),
        "is-disabled": item.disabled
      }
    ];
    const getCumulativePaths = (index) => resolvedPaths.value.slice(0, index + 1).filter(Boolean);
    const renderItem = (item, index) => {
      var _a;
      return (_a = props.itemRender) == null ? void 0 : _a.call(props, item, props.params, normalizedItems.value, getCumulativePaths(index), index);
    };
    const resolvePath = (path) => {
      return path.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
        const value = props.params[key];
        return value === void 0 ? `:${key}` : String(value);
      });
    };
    const handleItemClick = (event, item, index) => {
      var _a;
      if (item.disabled) {
        return;
      }
      (_a = item.onClick) == null ? void 0 : _a.call(item, event, item, index);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("nav", {
        class: vue.normalizeClass(["aheart-breadcrumb", breadcrumbClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        "aria-label": "breadcrumb"
      }, [
        vue.createElementVNode("ol", {
          class: vue.normalizeClass(["aheart-breadcrumb__list", _ctx.classNames.list]),
          style: vue.normalizeStyle(_ctx.styles.list)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: getItemKey(item, index),
              class: vue.normalizeClass(["aheart-breadcrumb__item", itemClass(item, index)]),
              style: vue.normalizeStyle([_ctx.styles.item, item.style]),
              "aria-current": isCurrent(index) ? "page" : void 0
            }, [
              _ctx.itemRender ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "aheart-breadcrumb__custom",
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                vue.createVNode(vue.unref(ARenderNode), {
                  node: renderItem(item, index)
                }, null, 8, ["node"])
              ], 8, _hoisted_2)) : shouldRenderLink(item, index) ? (vue.openBlock(), vue.createElementBlock("a", {
                key: 1,
                class: vue.normalizeClass(["aheart-breadcrumb__link", _ctx.classNames.link]),
                style: vue.normalizeStyle(_ctx.styles.link),
                href: getItemHref(item),
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                vue.createVNode(vue.unref(ARenderNode), {
                  node: item.title
                }, null, 8, ["node"])
              ], 14, _hoisted_3)) : (vue.openBlock(), vue.createElementBlock("span", {
                key: 2,
                class: vue.normalizeClass(["aheart-breadcrumb__text", _ctx.classNames.text]),
                style: vue.normalizeStyle(_ctx.styles.text),
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                vue.createVNode(vue.unref(ARenderNode), {
                  node: item.title
                }, null, 8, ["node"])
              ], 14, _hoisted_4)),
              !isCurrent(index) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 3,
                class: vue.normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                style: vue.normalizeStyle(_ctx.styles.separator),
                "aria-hidden": "true"
              }, [
                vue.createVNode(vue.unref(ARenderNode), { node: _ctx.separator }, null, 8, ["node"])
              ], 6)) : vue.createCommentVNode("", true)
            ], 14, _hoisted_1);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
