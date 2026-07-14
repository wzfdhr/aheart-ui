import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, Fragment, renderList, createVNode, unref, createCommentVNode } from "vue";
import { breadcrumbProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-current", "aria-disabled"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["href", "onClick"];
const _hoisted_4 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ABreadcrumb"
  },
  __name: "breadcrumb",
  props: breadcrumbProps,
  setup(__props) {
    const props = __props;
    const ARenderNode = defineComponent({
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
    const normalizedItems = computed(() => props.items ?? []);
    const renderEntries = computed(
      () => normalizedItems.value.map(
        (item, index) => isSeparatorItem(item) ? { kind: "separator", item, index } : { kind: "route", item, index }
      )
    );
    const routePathSegmentsByIndex = computed(() => {
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
    const lastRouteIndex = computed(() => {
      for (let index = normalizedItems.value.length - 1; index >= 0; index -= 1) {
        if (!isSeparatorItem(normalizedItems.value[index])) {
          return index;
        }
      }
      return -1;
    });
    const breadcrumbClass = computed(() => [props.className, props.classNames.root]);
    const rootStyle = computed(() => [props.style, props.styles.root]);
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
      return openBlock(), createElementBlock("nav", {
        class: normalizeClass(["aheart-breadcrumb", breadcrumbClass.value]),
        style: normalizeStyle(rootStyle.value),
        "aria-label": "breadcrumb"
      }, [
        createElementVNode("ol", {
          class: normalizeClass(["aheart-breadcrumb__list", _ctx.classNames.list]),
          style: normalizeStyle(_ctx.styles.list)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(renderEntries.value, (entry) => {
            return openBlock(), createElementBlock("li", {
              key: getEntryKey(entry),
              class: normalizeClass(["aheart-breadcrumb__item", itemClass(entry)]),
              style: normalizeStyle(itemStyle(entry)),
              "aria-current": entry.kind === "route" && isCurrent(entry.index) ? "page" : void 0,
              "aria-disabled": entry.kind === "route" && entry.item.disabled ? "true" : void 0
            }, [
              entry.kind === "separator" ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                style: normalizeStyle(_ctx.styles.separator),
                "aria-hidden": "true"
              }, [
                createVNode(unref(ARenderNode), {
                  node: entry.item.separator ?? _ctx.separator
                }, null, 8, ["node"])
              ], 6)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                _ctx.itemRender ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: "aheart-breadcrumb__custom",
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: renderItem(entry.item, entry.index)
                  }, null, 8, ["node"])
                ], 8, _hoisted_2)) : shouldRenderLink(entry.item, entry.index) ? (openBlock(), createElementBlock("a", {
                  key: 1,
                  class: normalizeClass(["aheart-breadcrumb__link", _ctx.classNames.link]),
                  style: normalizeStyle(_ctx.styles.link),
                  href: getItemHref(entry.item, entry.index),
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: entry.item.title
                  }, null, 8, ["node"])
                ], 14, _hoisted_3)) : (openBlock(), createElementBlock("span", {
                  key: 2,
                  class: normalizeClass(["aheart-breadcrumb__text", _ctx.classNames.text]),
                  style: normalizeStyle(_ctx.styles.text),
                  onClick: ($event) => handleItemClick($event, entry.item, entry.index)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: entry.item.title
                  }, null, 8, ["node"])
                ], 14, _hoisted_4)),
                shouldRenderAutomaticSeparator(entry.index) ? (openBlock(), createElementBlock("span", {
                  key: 3,
                  class: normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                  style: normalizeStyle(_ctx.styles.separator),
                  "aria-hidden": "true"
                }, [
                  createVNode(unref(ARenderNode), { node: _ctx.separator }, null, 8, ["node"])
                ], 6)) : createCommentVNode("", true)
              ], 64))
            ], 14, _hoisted_1);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
