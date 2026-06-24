"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../button/index.js");
const dropdown_vue_vue_type_script_setup_true_lang = require("./dropdown.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADropdownButton"
  },
  __name: "dropdown-button",
  props: types.dropdownButtonProps,
  emits: types.dropdownButtonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ADropdownButtonRenderNode",
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
    const isLoading = vue.computed(() => props.loading === true || typeof props.loading === "object" && props.loading !== null);
    const triggerDisabled = vue.computed(() => isLoading.value ? true : props.disabled);
    const rootClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      {
        "is-disabled": props.disabled,
        "is-loading": isLoading.value
      }
    ]);
    const rootStyle = vue.computed(() => props.style);
    const toggleIcon = vue.computed(
      () => props.icon === void 0 ? vue.h("span", { class: "aheart-dropdown-button__default-icon" }, "v") : props.icon
    );
    const handleMainClick = (event) => {
      emit("click", event);
    };
    const handleOpenChange = (open, info) => {
      emit("openChange", open, info);
    };
    const handleMenuClick = (info) => {
      emit("menuClick", info);
    };
    const mainButtonNode = vue.computed(
      () => vue.h(
        index.default,
        {
          className: "aheart-dropdown-button__main",
          type: props.type,
          size: props.size,
          nativeType: props.nativeType,
          htmlType: props.htmlType,
          danger: props.danger,
          loading: props.loading,
          disabled: props.disabled,
          href: props.href,
          target: props.target,
          title: props.title,
          onClick: handleMainClick
        },
        {
          default: () => {
            var _a;
            return (_a = slots.default) == null ? void 0 : _a.call(slots);
          }
        }
      )
    );
    const dropdownNode = vue.computed(
      () => vue.h(
        dropdown_vue_vue_type_script_setup_true_lang.default,
        {
          className: "aheart-dropdown-button__dropdown",
          menu: props.menu,
          trigger: props.trigger,
          placement: props.placement,
          getPopupContainer: props.getPopupContainer,
          open: props.open,
          defaultOpen: props.defaultOpen,
          disabled: triggerDisabled.value,
          arrow: props.arrow,
          destroyOnHidden: props.destroyOnHidden,
          destroyPopupOnHide: props.destroyPopupOnHide,
          overlayClassName: props.overlayClassName,
          overlayStyle: props.overlayStyle,
          classNames: props.classNames,
          styles: props.styles,
          popupRender: props.popupRender,
          dropdownRender: props.dropdownRender,
          "onUpdate:open": (open) => emit("update:open", open),
          onOpenChange: handleOpenChange,
          onClick: handleMenuClick
        },
        {
          default: () => vue.h(
            index.default,
            {
              className: "aheart-dropdown-button__toggle",
              type: props.type,
              size: props.size,
              danger: props.danger,
              disabled: triggerDisabled.value,
              icon: toggleIcon.value,
              title: props.title,
              "aria-label": "Open menu"
            },
            {
              default: () => []
            }
          ),
          popup: slots.popup
        }
      )
    );
    const buttonNodes = vue.computed(() => [mainButtonNode.value, dropdownNode.value]);
    const renderedButtons = vue.computed(() => props.buttonsRender ? props.buttonsRender(buttonNodes.value) : buttonNodes.value);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-dropdown-button", rootClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        vue.createVNode(vue.unref(ARenderNode), { node: renderedButtons.value }, null, 8, ["node"])
      ], 6);
    };
  }
});
exports.default = _sfc_main;
