"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useControllableState = require("../utils/use-controllable-state.js");
const useFloatingLayer = require("../utils/use-floating-layer.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const utils_useRovingFocus = require("../utils/use-roving-focus.js");
const useStableId = require("../utils/use-stable-id.js");
const _hoisted_1 = { class: "aheart-combobox" };
const _hoisted_2 = ["id", "aria-expanded", "aria-controls", "aria-activedescendant", "disabled", "placeholder", "value"];
const _hoisted_3 = ["aria-hidden"];
const _hoisted_4 = ["id", "aria-label", "aria-labelledby"];
const _hoisted_5 = ["id", "aria-selected", "aria-disabled", "onClick"];
const _hoisted_6 = {
  key: 0,
  class: "aheart-combobox__empty",
  role: "status"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ACombobox", inheritAttrs: false },
  __name: "combobox",
  props: {
    id: {},
    modelValue: {},
    defaultValue: {},
    options: {},
    placeholder: {},
    disabled: { type: Boolean },
    getPopupContainer: { type: Function }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const inputId = useStableId.useStableId(() => props.id, "aheart-combobox");
    const listboxId = vue.computed(() => `${inputId.value}-listbox`);
    const selection = useControllableState.useControllableState({
      controlled: () => props.modelValue,
      isControlled: usePropPresence.usePropPresence("modelValue", "model-value"),
      defaultValue: () => props.defaultValue,
      onChange: (value) => emit("update:modelValue", value)
    });
    const selectedLabel = vue.computed(() => {
      var _a;
      return ((_a = props.options.find(({ value }) => Object.is(value, selection.state.value))) == null ? void 0 : _a.label) ?? "";
    });
    const open = vue.ref(false);
    const query = vue.ref();
    const activeKey = vue.ref();
    const composing = vue.ref(false);
    const inputText = vue.computed(() => query.value ?? selectedLabel.value);
    const filteredOptions = vue.computed(() => {
      var _a;
      const filter = (_a = query.value) == null ? void 0 : _a.trim().toLowerCase();
      return props.options.map((option, index) => ({
        option,
        key: `${typeof option.value}:${String(option.value)}`,
        id: `${listboxId.value}-option-${index}`
      })).filter(({ option }) => !filter || option.label.toLowerCase().includes(filter));
    });
    const enabledOptions = vue.computed(() => filteredOptions.value.filter(({ option }) => !option.disabled));
    const activeOption = vue.computed(() => enabledOptions.value.find(({ key }) => key === activeKey.value));
    const motion = useMotionPresence.useMotionPresence(open, { destroyOnHidden: true, duration: 120 });
    const close = () => {
      open.value = false;
      query.value = void 0;
      activeKey.value = void 0;
      composing.value = false;
    };
    const showOptions = () => {
      if (!props.disabled)
        open.value = true;
    };
    const select = (option) => {
      var _a;
      if (!open.value || props.disabled || option.disabled)
        return;
      if (selection.setState(option.value))
        emit("change", option.value, option);
      close();
      (_a = inputRef.value) == null ? void 0 : _a.focus({ preventScroll: true });
    };
    const { shouldTeleport, teleportTo, floatingPosition } = useFloatingLayer.useFloatingLayer({
      reference: inputRef,
      floating: panelRef,
      getPopupContainer: () => props.getPopupContainer,
      position: { open: () => motion.isMounted.value, strategy: "fixed", offset: 4 },
      dismiss: { open, ignoreEscape: composing, onDismiss: close }
    });
    const handleInput = (event) => {
      if (composing.value)
        return;
      query.value = event.target.value;
      activeKey.value = void 0;
      showOptions();
    };
    const handleCompositionEnd = (event) => {
      var _a;
      composing.value = false;
      if (event.target === ((_a = inputRef.value) == null ? void 0 : _a.ownerDocument.activeElement))
        handleInput(event);
    };
    const handleKeydown = (event) => {
      var _a;
      if (props.disabled || composing.value || event.isComposing || event.keyCode === 229)
        return;
      if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)
        return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        showOptions();
        activeKey.value = utils_useRovingFocus.getNextEnabledKey(enabledOptions.value, (_a = activeOption.value) == null ? void 0 : _a.key, event.key);
      } else if (event.key === "Enter" && open.value && activeOption.value) {
        event.preventDefault();
        select(activeOption.value.option);
      }
    };
    vue.watch(activeOption, (entry) => {
      if (!entry)
        return;
      const panel = panelRef.value;
      const option = panel == null ? void 0 : panel.ownerDocument.getElementById(entry.id);
      if (!panel || !option)
        return;
      const bounds = panel.getBoundingClientRect();
      const row = option.getBoundingClientRect();
      if (row.top < bounds.top)
        panel.scrollTop += row.top - bounds.top;
      else if (row.bottom > bounds.bottom)
        panel.scrollTop += row.bottom - bounds.bottom;
    }, { flush: "post" });
    vue.watch(() => props.disabled, (disabled) => {
      if (disabled)
        close();
    });
    return (_ctx, _cache) => {
      var _a;
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        vue.createElementVNode("input", vue.mergeProps(_ctx.$attrs, {
          id: vue.unref(inputId),
          ref_key: "inputRef",
          ref: inputRef,
          class: "aheart-combobox__input",
          type: "text",
          role: "combobox",
          autocomplete: "off",
          "aria-autocomplete": "list",
          "aria-expanded": open.value,
          "aria-controls": open.value ? listboxId.value : void 0,
          "aria-activedescendant": open.value ? (_a = activeOption.value) == null ? void 0 : _a.id : void 0,
          disabled: __props.disabled,
          placeholder: __props.placeholder,
          value: inputText.value,
          onClick: showOptions,
          onBlur: close,
          onInput: handleInput,
          onCompositionstart: _cache[0] || (_cache[0] = ($event) => composing.value = true),
          onCompositionend: handleCompositionEnd,
          onKeydown: handleKeydown
        }), null, 16, _hoisted_2),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: vue.unref(teleportTo),
          disabled: !vue.unref(shouldTeleport)
        }, [
          vue.unref(motion).isMounted.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: vue.normalizeClass(["aheart-combobox__popup", [`aheart-floating--${vue.unref(floatingPosition).placement.value}`, `is-${vue.unref(motion).phase.value}`]]),
            style: vue.normalizeStyle(vue.unref(floatingPosition).popupStyle.value),
            "aria-hidden": open.value ? void 0 : true,
            onMousedown: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["prevent"]))
          }, [
            vue.createElementVNode("div", {
              id: listboxId.value,
              role: "listbox",
              "aria-label": _ctx.$attrs["aria-label"] || "Suggestions",
              "aria-labelledby": _ctx.$attrs["aria-labelledby"]
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredOptions.value, (entry) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  id: entry.id,
                  key: entry.key,
                  class: vue.normalizeClass(["aheart-combobox__option", { "is-active": entry.key === activeKey.value }]),
                  role: "option",
                  "aria-selected": Object.is(entry.option.value, vue.unref(selection).state.value),
                  "aria-disabled": entry.option.disabled || void 0,
                  onClick: ($event) => select(entry.option)
                }, vue.toDisplayString(entry.option.label), 11, _hoisted_5);
              }), 128))
            ], 8, _hoisted_4),
            !filteredOptions.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                _cache[2] || (_cache[2] = vue.createTextVNode("No matching options", -1))
              ])
            ])) : vue.createCommentVNode("", true)
          ], 46, _hoisted_3)) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ]);
    };
  }
});
exports.default = _sfc_main;
