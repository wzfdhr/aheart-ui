import { defineComponent, useSlots, computed, h, openBlock, createElementBlock, normalizeClass, normalizeStyle, createVNode, unref } from "vue";
import Button from "../button/index.js";
import _sfc_main$1 from "./dropdown.vue.js";
import { dropdownButtonProps, dropdownButtonEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADropdownButton"
  },
  __name: "dropdown-button",
  props: dropdownButtonProps,
  emits: dropdownButtonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const ARenderNode = defineComponent({
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
    const isLoading = computed(() => props.loading === true || typeof props.loading === "object" && props.loading !== null);
    const triggerDisabled = computed(() => isLoading.value ? true : props.disabled);
    const rootClass = computed(() => [
      props.className,
      props.rootClassName,
      {
        "is-disabled": props.disabled,
        "is-loading": isLoading.value
      }
    ]);
    const rootStyle = computed(() => props.style);
    const toggleIcon = computed(
      () => props.icon === void 0 ? h("span", { class: "aheart-dropdown-button__default-icon" }, "v") : props.icon
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
    const mainButtonNode = computed(
      () => h(
        Button,
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
    const dropdownNode = computed(
      () => h(
        _sfc_main$1,
        {
          className: "aheart-dropdown-button__dropdown",
          menu: props.menu,
          trigger: props.trigger,
          placement: props.placement,
          getPopupContainer: props.getPopupContainer,
          mouseEnterDelay: props.mouseEnterDelay,
          mouseLeaveDelay: props.mouseLeaveDelay,
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
          default: () => h(
            Button,
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
    const buttonNodes = computed(() => [mainButtonNode.value, dropdownNode.value]);
    const renderedButtons = computed(() => props.buttonsRender ? props.buttonsRender(buttonNodes.value) : buttonNodes.value);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-dropdown-button", rootClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        createVNode(unref(ARenderNode), { node: renderedButtons.value }, null, 8, ["node"])
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
