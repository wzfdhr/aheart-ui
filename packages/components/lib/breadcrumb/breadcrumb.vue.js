"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-current", "aria-disabled"];
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
    const renderEntries = vue.computed(
      () => normalizedItems.value.map(
        (item, index) => isSeparatorItem(item) ? { kind: "separator", item, index } : { kind: "route", item, index }
      )
    );
    const routePathSegmentsByIndex = vue.computed(() => {
      const segments = [];
      const segmentMap = /* @__PURE__ */ new Map();
      normalizedItems.value.forEach((item, index) => {
        if (isSeparatorItem(item)) {
          return;
        }
        if (item.path) {
          const segment = normalizePathSegment(resolvePath(item.path));
          if (segment) {
            segments.push(segment);
          }
        }
        segmentMap.set(index, [...segments]);
      });
      return segmentMap;
    });
    const lastRouteIndex = vue.computed(() => {
      for (let index = normalizedItems.value.length - 1; index >= 0; index -= 1) {
        if (!isSeparatorItem(normalizedItems.value[index])) {
          return index;
        }
      }
      return -1;
    });
    const breadcrumbClass = vue.computed(() => [props.className, props.classNames.root]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
    const isSeparatorItem = (item) => item.type === "separator";
    const isCurrent = (index) => index === lastRouteIndex.value;
    const shouldRenderLink = (item, index) => {
      return Boolean(getItemHref(item, index) && !item.disabled && !isCurrent(index));
    };
    const getItemHref = (item, index) => {
      if (item.href) {
        return item.href;
      }
      if (!item.path) {
        return "";
      }
      return joinPaths(getCumulativePaths(index));
    };
    const shouldRenderAutomaticSeparator = (index) => {
      if (isCurrent(index)) {
        return false;
      }
      const nextItem = normalizedItems.value[index + 1];
      return Boolean(nextItem && !isSeparatorItem(nextItem));
    };
    const getEntryKey = (entry) => {
      if (entry.item.key !== void 0) {
        return entry.item.key;
      }
      if (entry.kind === "separator") {
        return `separator-${entry.index}`;
      }
      const item = entry.item;
      if (item.href || item.path) {
        return `${item.href ?? item.path}-${entry.index}`;
      }
      if (typeof item.title === "string" || typeof item.title === "number") {
        return `${item.title}-${entry.index}`;
      }
      return entry.index;
    };
    const itemClass = (entry) => {
      const isRoute = entry.kind === "route";
      return [
        props.classNames.item,
        entry.item.className,
        {
          "aheart-breadcrumb__item--separator": entry.kind === "separator",
          "is-current": isRoute && isCurrent(entry.index),
          "is-disabled": isRoute && entry.item.disabled
        }
      ];
    };
    const itemStyle = (entry) => [props.styles.item, entry.item.style];
    const getCumulativePaths = (index) => routePathSegmentsByIndex.value.get(index) ?? [];
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
    const normalizePathSegment = (path) => path.replace(/^\/+|\/+$/g, "");
    const joinPaths = (paths) => paths.length ? `/${paths.join("/")}` : "";
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
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(renderEntries.value, (entry) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: getEntryKey(entry),
              class: vue.normalizeClass(["aheart-breadcrumb__item", itemClass(entry)]),
              style: vue.normalizeStyle(itemStyle(entry)),
              "aria-current": entry.kind === "route" && isCurrent(entry.index) ? "page" : void 0,
              "aria-disabled": entry.kind === "route" && entry.item.disabled ? "true" : void 0
            }, [
              entry.kind === "separator" ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                style: vue.normalizeStyle(_ctx.styles.separator),
                "aria-hidden": "true"
              }, [
                vue.createVNode(vue.unref(ARenderNode), {
                  node: entry.item.separator ?? _ctx.separator
                }, null, 8, ["node"])
              ], 6)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                _ctx.itemRender ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: "aheart-breadcrumb__custom",
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: renderItem(entry.item, entry.index)
                  }, null, 8, ["node"])
                ], 8, _hoisted_2)) : shouldRenderLink(entry.item, entry.index) ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 1,
                  class: vue.normalizeClass(["aheart-breadcrumb__link", _ctx.classNames.link]),
                  style: vue.normalizeStyle(_ctx.styles.link),
                  href: getItemHref(entry.item, entry.index),
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: entry.item.title
                  }, null, 8, ["node"])
                ], 14, _hoisted_3)) : (vue.openBlock(), vue.createElementBlock("span", {
                  key: 2,
                  class: vue.normalizeClass(["aheart-breadcrumb__text", _ctx.classNames.text]),
                  style: vue.normalizeStyle(_ctx.styles.text),
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: entry.item.title
                  }, null, 8, ["node"])
                ], 14, _hoisted_4)),
                shouldRenderAutomaticSeparator(entry.index) ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 3,
                  class: vue.normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                  style: vue.normalizeStyle(_ctx.styles.separator),
                  "aria-hidden": "true"
                }, [
                  vue.createVNode(vue.unref(ARenderNode), { node: _ctx.separator }, null, 8, ["node"])
                ], 6)) : vue.createCommentVNode("", true)
              ], 64))
            ], 14, _hoisted_1);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
