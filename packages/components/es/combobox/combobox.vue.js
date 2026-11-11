import { defineComponent, ref, computed, watch, openBlock, createElementBlock, createElementVNode, mergeProps, unref, createBlock, Teleport, normalizeClass, normalizeStyle, withModifiers, Fragment, renderList, toDisplayString, renderSlot, createTextVNode, createCommentVNode } from "vue";
import { useControllableState } from "../utils/use-controllable-state.js";
import { useFloatingLayer } from "../utils/use-floating-layer.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { getNextEnabledKey } from "../utils/use-roving-focus.js";
import { useStableId } from "../utils/use-stable-id.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const inputRef = ref(null);
    const panelRef = ref(null);
    const inputId = useStableId(() => props.id, "aheart-combobox");
    const listboxId = computed(() => `${inputId.value}-listbox`);
    const selection = useControllableState({
      controlled: () => props.modelValue,
      isControlled: usePropPresence("modelValue", "model-value"),
      defaultValue: () => props.defaultValue,
      onChange: (value) => emit("update:modelValue", value)
    });
    const selectedLabel = computed(() => {
      var _a;
      return ((_a = props.options.find(({ value }) => Object.is(value, selection.state.value))) == null ? void 0 : _a.label) ?? "";
    });
    const open = ref(false);
    const query = ref();
    const activeKey = ref();
    const composing = ref(false);
    const inputText = computed(() => query.value ?? selectedLabel.value);
    const filteredOptions = computed(() => {
      var _a;
      const filter = (_a = query.value) == null ? void 0 : _a.trim().toLowerCase();
      return props.options.map((option, index) => ({
        option,
        key: `${typeof option.value}:${String(option.value)}`,
        id: `${listboxId.value}-option-${index}`
      })).filter(({ option }) => !filter || option.label.toLowerCase().includes(filter));
    });
    const enabledOptions = computed(() => filteredOptions.value.filter(({ option }) => !option.disabled));
    const activeOption = computed(() => enabledOptions.value.find(({ key }) => key === activeKey.value));
    const motion = useMotionPresence(open, { destroyOnHidden: true, duration: 120 });
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
    const { shouldTeleport, teleportTo, floatingPosition } = useFloatingLayer({
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
        activeKey.value = getNextEnabledKey(enabledOptions.value, (_a = activeOption.value) == null ? void 0 : _a.key, event.key);
      } else if (event.key === "Enter" && open.value && activeOption.value) {
        event.preventDefault();
        select(activeOption.value.option);
      }
    };
    watch(activeOption, (entry) => {
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
    watch(() => props.disabled, (disabled) => {
      if (disabled)
        close();
    });
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("input", mergeProps(_ctx.$attrs, {
          id: unref(inputId),
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
        (openBlock(), createBlock(Teleport, {
          to: unref(teleportTo),
          disabled: !unref(shouldTeleport)
        }, [
          unref(motion).isMounted.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: normalizeClass(["aheart-combobox__popup", [`aheart-floating--${unref(floatingPosition).placement.value}`, `is-${unref(motion).phase.value}`]]),
            style: normalizeStyle(unref(floatingPosition).popupStyle.value),
            "aria-hidden": open.value ? void 0 : true,
            onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
            }, ["prevent"]))
          }, [
            createElementVNode("div", {
              id: listboxId.value,
              role: "listbox",
              "aria-label": _ctx.$attrs["aria-label"] || "Suggestions",
              "aria-labelledby": _ctx.$attrs["aria-labelledby"]
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredOptions.value, (entry) => {
                return openBlock(), createElementBlock("div", {
                  id: entry.id,
                  key: entry.key,
                  class: normalizeClass(["aheart-combobox__option", { "is-active": entry.key === activeKey.value }]),
                  role: "option",
                  "aria-selected": Object.is(entry.option.value, unref(selection).state.value),
                  "aria-disabled": entry.option.disabled || void 0,
                  onClick: ($event) => select(entry.option)
                }, toDisplayString(entry.option.label), 11, _hoisted_5);
              }), 128))
            ], 8, _hoisted_4),
            !filteredOptions.value.length ? (openBlock(), createElementBlock("div", _hoisted_6, [
              renderSlot(_ctx.$slots, "empty", {}, () => [
                _cache[2] || (_cache[2] = createTextVNode("No matching options", -1))
              ])
            ])) : createCommentVNode("", true)
          ], 46, _hoisted_3)) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
