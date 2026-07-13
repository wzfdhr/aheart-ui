import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createElementVNode, createVNode, unref, createBlock, withCtx } from "vue";
import _sfc_main$1 from "./radio.vue.js";
import { radioGroupProps, radioGroupEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["title"];
const _hoisted_2 = ["name", "value", "checked", "disabled", "onChange"];
const _hoisted_3 = { class: "aheart-radio-button__label" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ARadioGroup"
  },
  __name: "radio-group",
  props: radioGroupProps,
  emits: radioGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const internalValue = ref(props.defaultValue);
    const ARadioGroupRenderNode = defineComponent({
      name: "ARadioGroupRenderNode",
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
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isControlled = computed(() => props.value !== void 0 || props.modelValue !== void 0);
    const mergedValue = computed(() => props.value ?? props.modelValue ?? internalValue.value);
    const resolvedDirection = computed(
      () => props.orientation ?? (props.vertical ? "vertical" : props.direction)
    );
    const normalizedOptions = computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const radioGroupClass = computed(() => [
      `aheart-radio-group--${resolvedDirection.value}`,
      `aheart-radio-group--${resolvedSize.value}`,
      props.className,
      props.rootClassName,
      {
        "aheart-radio-group--button": props.optionType === "button",
        "aheart-radio-group--solid": props.buttonStyle === "solid",
        "aheart-radio-group--block": props.block,
        "is-disabled": isDisabled.value
      }
    ]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const isSelected = (value) => mergedValue.value === value;
    const getButtonClass = (option) => [
      option.className,
      {
        "is-checked": isSelected(option.value),
        "is-disabled": isDisabled.value || option.disabled
      }
    ];
    const handleOptionChange = (option) => {
      if (isDisabled.value || option.disabled) {
        return;
      }
      if (!isControlled.value) {
        internalValue.value = option.value;
      }
      emit("update:modelValue", option.value);
      emit("update:value", option.value);
      emit("change", option.value);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-radio-group", radioGroupClass.value]),
        style: normalizeStyle(_ctx.style)
      }, [
        _ctx.optionType === "button" ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(normalizedOptions.value, (option) => {
          return openBlock(), createElementBlock("label", {
            key: getOptionKey(option.value),
            class: normalizeClass(["aheart-radio-button", getButtonClass(option)]),
            style: normalizeStyle(option.style),
            title: option.title
          }, [
            createElementVNode("input", {
              class: "aheart-radio-button__input",
              type: "radio",
              name: _ctx.name,
              value: option.value,
              checked: isSelected(option.value),
              disabled: isDisabled.value || option.disabled,
              onChange: ($event) => handleOptionChange(option)
            }, null, 40, _hoisted_2),
            createElementVNode("span", _hoisted_3, [
              createVNode(unref(ARadioGroupRenderNode), {
                node: option.label
              }, null, 8, ["node"])
            ])
          ], 14, _hoisted_1);
        }), 128)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(normalizedOptions.value, (option) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: getOptionKey(option.value),
            "model-value": isSelected(option.value),
            value: option.value,
            name: _ctx.name,
            disabled: isDisabled.value || option.disabled,
            "class-name": option.className,
            style: normalizeStyle(option.style),
            title: option.title,
            onChange: () => handleOptionChange(option)
          }, {
            default: withCtx(() => [
              createVNode(unref(ARadioGroupRenderNode), {
                node: option.label
              }, null, 8, ["node"])
            ]),
            _: 2
          }, 1032, ["model-value", "value", "name", "disabled", "class-name", "style", "title", "onChange"]);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
