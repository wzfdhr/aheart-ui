import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, renderList, createBlock, withCtx, createTextVNode, toDisplayString } from "vue";
import _sfc_main$1 from "./checkable-tag.vue.js";
import { tagGroupProps, tagGroupEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATagGroup"
  },
  __name: "tag-group",
  props: tagGroupProps,
  emits: tagGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const internalValue = ref(props.defaultValue ?? (props.multiple ? [] : null));
    const isControlled = computed(() => props.value !== void 0 || props.modelValue !== void 0);
    const mergedValue = computed(() => props.value ?? props.modelValue ?? internalValue.value);
    const normalizedOptions = computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const tagGroupClass = computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-disabled": props.disabled,
        "is-multiple": props.multiple
      }
    ]);
    const tagGroupStyle = computed(() => [props.style, props.styles.root]);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const normalizeMultipleValue = (value) => {
      if (Array.isArray(value)) {
        return value;
      }
      return value === null ? [] : [value];
    };
    const normalizeSingleValue = (value) => {
      if (Array.isArray(value)) {
        return value[0] ?? null;
      }
      return value;
    };
    const isChecked = (value) => props.multiple ? normalizeMultipleValue(mergedValue.value).includes(value) : normalizeSingleValue(mergedValue.value) === value;
    const getOptionSemanticClass = (value) => [props.classNames.item, isChecked(value) ? props.classNames.activeItem : void 0].filter(Boolean).join(" ");
    const getOptionStyle = (option) => [
      props.styles.item,
      option.style,
      isChecked(option.value) ? props.styles.activeItem : void 0
    ];
    const handleOptionChange = (value, checked) => {
      if (props.disabled) {
        return;
      }
      const nextValue = props.multiple ? checked ? Array.from(/* @__PURE__ */ new Set([...normalizeMultipleValue(mergedValue.value), value])) : normalizeMultipleValue(mergedValue.value).filter((currentValue) => currentValue !== value) : checked ? value : null;
      if (!isControlled.value) {
        internalValue.value = nextValue;
      }
      emit("update:modelValue", nextValue);
      emit("update:value", nextValue);
      emit("change", nextValue);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-tag-group", tagGroupClass.value]),
        style: normalizeStyle(tagGroupStyle.value)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedOptions.value, (option) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: getOptionKey(option.value),
            checked: isChecked(option.value),
            disabled: _ctx.disabled || option.disabled,
            icon: option.icon,
            title: option.title,
            "class-name": option.className,
            style: normalizeStyle(getOptionStyle(option)),
            "class-names": { root: getOptionSemanticClass(option.value) },
            onChange: (checked) => handleOptionChange(option.value, checked)
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(option.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "disabled", "icon", "title", "class-name", "style", "class-names", "onChange"]);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
