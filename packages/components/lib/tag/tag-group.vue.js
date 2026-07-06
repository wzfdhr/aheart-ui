"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const checkableTag_vue_vue_type_script_setup_true_lang = require("./checkable-tag.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATagGroup"
  },
  __name: "tag-group",
  props: types.tagGroupProps,
  emits: types.tagGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const internalValue = vue.ref(props.defaultValue ?? (props.multiple ? [] : null));
    const ATagGroupRenderNode = vue.defineComponent({
      name: "ATagGroupRenderNode",
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
    const isControlled = vue.computed(() => props.value !== void 0 || props.modelValue !== void 0);
    const mergedValue = vue.computed(() => props.value ?? props.modelValue ?? internalValue.value);
    const normalizedOptions = vue.computed(
      () => props.options.map(
        (option) => typeof option === "object" && option !== null ? option : {
          label: String(option),
          value: option
        }
      )
    );
    const tagGroupClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-disabled": props.disabled,
        "is-multiple": props.multiple
      }
    ]);
    const tagGroupStyle = vue.computed(() => [props.style, props.styles.root]);
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
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-tag-group", tagGroupClass.value]),
        style: vue.normalizeStyle(tagGroupStyle.value)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedOptions.value, (option) => {
          return vue.openBlock(), vue.createBlock(checkableTag_vue_vue_type_script_setup_true_lang.default, {
            key: getOptionKey(option.value),
            checked: isChecked(option.value),
            disabled: _ctx.disabled || option.disabled,
            icon: option.icon,
            title: option.title,
            "class-name": option.className,
            style: vue.normalizeStyle(getOptionStyle(option)),
            "class-names": { root: getOptionSemanticClass(option.value) },
            onChange: (checked) => handleOptionChange(option.value, checked)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ATagGroupRenderNode), {
                node: option.label
              }, null, 8, ["node"])
            ]),
            _: 2
          }, 1032, ["checked", "disabled", "icon", "title", "class-name", "style", "class-names", "onChange"]);
        }), 128))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
