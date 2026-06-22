import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, Fragment, renderList, createVNode, unref, createCommentVNode } from "vue";
import { breadcrumbProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-current"];
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
    const resolvedPaths = computed(() => normalizedItems.value.map((item) => resolvePath(item.path ?? item.href ?? "")));
    const breadcrumbClass = computed(() => [props.className, props.classNames.root]);
    const rootStyle = computed(() => [props.style, props.styles.root]);
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
      return openBlock(), createElementBlock("nav", {
        class: normalizeClass(["aheart-breadcrumb", breadcrumbClass.value]),
        style: normalizeStyle(rootStyle.value),
        "aria-label": "breadcrumb"
      }, [
        createElementVNode("ol", {
          class: normalizeClass(["aheart-breadcrumb__list", _ctx.classNames.list]),
          style: normalizeStyle(_ctx.styles.list)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item, index) => {
            return openBlock(), createElementBlock("li", {
              key: getItemKey(item, index),
              class: normalizeClass(["aheart-breadcrumb__item", itemClass(item, index)]),
              style: normalizeStyle([_ctx.styles.item, item.style]),
              "aria-current": isCurrent(index) ? "page" : void 0
            }, [
              _ctx.itemRender ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: "aheart-breadcrumb__custom",
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                createVNode(unref(ARenderNode), {
                  node: renderItem(item, index)
                }, null, 8, ["node"])
              ], 8, _hoisted_2)) : shouldRenderLink(item, index) ? (openBlock(), createElementBlock("a", {
                key: 1,
                class: normalizeClass(["aheart-breadcrumb__link", _ctx.classNames.link]),
                style: normalizeStyle(_ctx.styles.link),
                href: getItemHref(item),
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                createVNode(unref(ARenderNode), {
                  node: item.title
                }, null, 8, ["node"])
              ], 14, _hoisted_3)) : (openBlock(), createElementBlock("span", {
                key: 2,
                class: normalizeClass(["aheart-breadcrumb__text", _ctx.classNames.text]),
                style: normalizeStyle(_ctx.styles.text),
                onClick: ($event) => handleItemClick($event, item, index)
              }, [
                createVNode(unref(ARenderNode), {
                  node: item.title
                }, null, 8, ["node"])
              ], 14, _hoisted_4)),
              !isCurrent(index) ? (openBlock(), createElementBlock("span", {
                key: 3,
                class: normalizeClass(["aheart-breadcrumb__separator", _ctx.classNames.separator]),
                style: normalizeStyle(_ctx.styles.separator),
                "aria-hidden": "true"
              }, [
                createVNode(unref(ARenderNode), { node: _ctx.separator }, null, 8, ["node"])
              ], 6)) : createCommentVNode("", true)
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
