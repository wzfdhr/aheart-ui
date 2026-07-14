"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
require("./style.css.js");
const _hoisted_1 = ["tabindex", "aria-expanded", "aria-disabled"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-cascader__value aheart-cascader__tags"
};
const _hoisted_3 = { class: "aheart-cascader__tag-label" };
const _hoisted_4 = ["aria-label", "onClick"];
const _hoisted_5 = {
  key: 0,
  class: "aheart-cascader__tag aheart-cascader__tag--rest"
};
const _hoisted_6 = {
  key: 1,
  class: "aheart-cascader__search-results"
};
const _hoisted_7 = ["data-cascader-path", "disabled", "onClick"];
const _hoisted_8 = {
  key: 0,
  class: "aheart-cascader__empty",
  role: "status"
};
const _hoisted_9 = ["data-cascader-value", "disabled", "aria-busy", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ACascader" },
  __name: "cascader",
  props: {
    options: { default: () => [] },
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    showSearch: { type: Boolean },
    placeholder: { default: "请选择" },
    disabled: { type: Boolean },
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    allowClear: { type: Boolean },
    maxTagCount: {},
    placement: { default: "bottomLeft" },
    autoAdjustOverflow: { type: Boolean, default: true },
    getPopupContainer: {},
    loadData: {}
  },
  emits: ["update:modelValue", "change", "openChange", "clear"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const cloneOptions = (options) => options.map((option) => ({
      ...option,
      children: option.children ? cloneOptions(option.children) : void 0
    }));
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const columnsRef = vue.ref(null);
    const innerOpen = vue.ref(props.defaultOpen);
    const searchText = vue.ref("");
    const activePath = vue.ref([]);
    const loadingPaths = vue.ref([]);
    const innerOptions = vue.ref(cloneOptions(props.options));
    const innerValue = vue.ref(props.defaultValue);
    const isControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const mergedOpen = vue.computed(() => isOpenControlled.value ? props.open : innerOpen.value);
    const mergedValue = vue.computed(() => isControlled.value ? props.modelValue : innerValue.value);
    const selectedPaths = vue.computed(() => {
      if (props.multiple) {
        return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray) ? mergedValue.value : [];
      }
      return Array.isArray(mergedValue.value) ? [mergedValue.value] : [];
    });
    vue.watch(() => props.options, (options) => {
      innerOptions.value = cloneOptions(options);
    });
    const pathKey = (path) => path.join("/");
    const samePath = (left, right) => left.length === right.length && left.every((key, index) => key === right[index]);
    const isBranch = (option) => {
      var _a;
      return Boolean((_a = option.children) == null ? void 0 : _a.length) || option.isLeaf === false;
    };
    const columns = vue.computed(() => {
      var _a;
      const result = [innerOptions.value];
      let siblings = innerOptions.value;
      for (const key of activePath.value) {
        const option = siblings.find((current) => current.value === key);
        if (!((_a = option == null ? void 0 : option.children) == null ? void 0 : _a.length))
          break;
        siblings = option.children;
        result.push(siblings);
      }
      return result;
    });
    const findOption = (path, options = innerOptions.value) => {
      let siblings = options;
      let current;
      for (const key of path) {
        current = siblings.find((option) => option.value === key);
        if (!current)
          return void 0;
        siblings = current.children ?? [];
      }
      return current;
    };
    const findLabels = (path) => {
      const labels = [];
      let siblings = innerOptions.value;
      for (const key of path) {
        const option = siblings.find((current) => current.value === key);
        if (!option)
          return [];
        labels.push(option.label);
        siblings = option.children ?? [];
      }
      return labels;
    };
    const pathHasDisabledOption = (path) => {
      let siblings = innerOptions.value;
      for (const key of path) {
        const option = siblings.find((current) => current.value === key);
        if (!option || option.disabled)
          return true;
        siblings = option.children ?? [];
      }
      return false;
    };
    const displayLabel = vue.computed(() => selectedPaths.value.map((path) => findLabels(path).join(" / ")).filter(Boolean).join(", "));
    const selectedTags = vue.computed(() => selectedPaths.value.map((path) => ({ path, label: findLabels(path).join(" / ") })).filter((tag) => tag.label));
    const visibleSelectedTags = vue.computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = vue.computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const collectLeaves = (options, parentPath = [], parentLabels = [], parentDisabled = false) => options.flatMap((option) => {
      var _a;
      const path = [...parentPath, option.value];
      const labels = [...parentLabels, option.label];
      const disabled = parentDisabled || Boolean(option.disabled);
      if ((_a = option.children) == null ? void 0 : _a.length)
        return collectLeaves(option.children, path, labels, disabled);
      return option.isLeaf === false ? [] : [{ path, labels, disabled }];
    });
    const searchResults = vue.computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return collectLeaves(innerOptions.value).filter((result) => result.labels.join(" / ").toLowerCase().includes(query));
    });
    const isSelected = (columnIndex, option) => selectedPaths.value.some((path) => path[columnIndex] === option.value && path.length === columnIndex + 1);
    const isLoading = (columnIndex, option) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const requestOpen = (open) => {
      if (props.disabled)
        return;
      if (!isOpenControlled.value)
        innerOpen.value = open;
      emit("openChange", open);
    };
    const toggleOpen = () => requestOpen(!mergedOpen.value);
    const emitValue = (value) => {
      if (!isControlled.value)
        innerValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const clearValue = () => {
      emitValue(props.multiple ? [] : void 0);
      activePath.value = [];
      searchText.value = "";
      emit("clear");
    };
    const removePath = (path) => {
      if (props.disabled)
        return;
      emitValue(selectedPaths.value.filter((current) => !samePath(current, path)));
    };
    const selectPath = (path) => {
      const option = findOption(path);
      if (props.disabled || !option || pathHasDisabledOption(path) || isBranch(option))
        return;
      if (props.multiple) {
        const paths = selectedPaths.value.some((current) => samePath(current, path)) ? selectedPaths.value.filter((current) => !samePath(current, path)) : [...selectedPaths.value, path];
        emitValue(paths);
        return;
      }
      emitValue(path);
      requestOpen(false);
    };
    const replaceChildren = (options, path, children) => options.map((option) => {
      if (option.value !== path[0])
        return option;
      if (path.length === 1)
        return { ...option, children };
      return { ...option, children: replaceChildren(option.children ?? [], path.slice(1), children) };
    });
    const revealLastColumn = async () => {
      await vue.nextTick();
      if (columnsRef.value)
        columnsRef.value.scrollLeft = columnsRef.value.scrollWidth;
    };
    const handleOption = async (option, columnIndex) => {
      var _a;
      if (props.disabled || option.disabled)
        return;
      const path = [...activePath.value.slice(0, columnIndex), option.value];
      if (!isBranch(option)) {
        selectPath(path);
        return;
      }
      activePath.value = path;
      void revealLastColumn();
      if (!((_a = option.children) == null ? void 0 : _a.length) && props.loadData) {
        if (loadingPaths.value.some((current) => samePath(current, path)))
          return;
        loadingPaths.value = [...loadingPaths.value, path];
        try {
          const children = await props.loadData(option);
          innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children));
          void revealLastColumn();
        } catch {
        } finally {
          loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path));
        }
      }
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestOpen(true);
        void vue.nextTick(() => {
          var _a, _b;
          return (_b = (_a = panelRef.value) == null ? void 0 : _a.querySelector(".aheart-cascader__option:not(:disabled)")) == null ? void 0 : _b.focus();
        });
      } else if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void vue.nextTick(() => {
          var _a;
          return (_a = triggerRef.value) == null ? void 0 : _a.focus();
        });
      }
    };
    const handleOptionKeydown = (event) => {
      var _a, _b;
      const current = event.currentTarget;
      const options = Array.from(((_a = current.parentElement) == null ? void 0 : _a.querySelectorAll(".aheart-cascader__option:not(:disabled)")) ?? []);
      const index = options.indexOf(current);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        (_b = options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]) == null ? void 0 : _b.focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        requestOpen(false);
        void vue.nextTick(() => {
          var _a2;
          return (_a2 = triggerRef.value) == null ? void 0 : _a2.focus();
        });
      }
    };
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = vue.computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`
    ]);
    const panelStyle = vue.computed(() => floatingPosition.popupStyle.value);
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
    });
    vue.watch(() => props.defaultOpen, (open) => {
      if (!isOpenControlled.value)
        innerOpen.value = open;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-cascader", { "is-open": mergedOpen.value, "is-disabled": __props.disabled }])
      }, [
        vue.createElementVNode("div", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-cascader__trigger",
          role: "combobox",
          tabindex: __props.disabled ? -1 : 0,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": __props.disabled ? "true" : void 0,
          "aria-haspopup": "dialog",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown
        }, [
          __props.multiple && selectedTags.value.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSelectedTags.value, (tag) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: pathKey(tag.path),
                class: "aheart-cascader__tag"
              }, [
                vue.createElementVNode("span", _hoisted_3, vue.toDisplayString(tag.label), 1),
                !__props.disabled ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  class: "aheart-cascader__tag-remove",
                  type: "button",
                  "aria-label": `移除 ${tag.label}`,
                  onClick: vue.withModifiers(($event) => removePath(tag.path), ["stop"])
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_4)) : vue.createCommentVNode("", true)
              ]);
            }), 128)),
            hiddenTagCount.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, "+" + vue.toDisplayString(hiddenTagCount.value), 1)) : vue.createCommentVNode("", true)
          ])) : (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(["aheart-cascader__value", { "is-placeholder": !displayLabel.value }])
          }, vue.toDisplayString(displayLabel.value || __props.placeholder), 3)),
          __props.allowClear && selectedPaths.value.length && !__props.disabled ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            class: "aheart-cascader__clear",
            type: "button",
            "aria-label": "清除级联选择",
            onClick: vue.withModifiers(clearValue, ["stop"])
          }, [
            vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
              name: "close",
              size: 12
            })
          ])) : vue.createCommentVNode("", true),
          vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
            class: "aheart-cascader__arrow",
            name: "chevron-down",
            size: 16,
            "aria-hidden": "true"
          })
        ], 40, _hoisted_1),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          vue.unref(motion).isMounted.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: vue.normalizeClass(["aheart-cascader__panel", panelClass.value]),
            style: vue.normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": "级联选择"
          }, [
            __props.showSearch ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
              class: "aheart-cascader__search",
              type: "search",
              placeholder: "搜索",
              "aria-label": "搜索级联选项"
            }, null, 512)), [
              [vue.vModelText, searchText.value]
            ]) : vue.createCommentVNode("", true),
            searchText.value.trim() ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(searchResults.value, (result) => {
                return vue.openBlock(), vue.createElementBlock("button", {
                  key: pathKey(result.path),
                  class: "aheart-cascader__option",
                  type: "button",
                  "data-cascader-path": pathKey(result.path),
                  disabled: __props.disabled || result.disabled,
                  onClick: ($event) => selectPath(result.path)
                }, vue.toDisplayString(result.labels.join(" / ")), 9, _hoisted_7);
              }), 128)),
              searchResults.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, "暂无匹配选项")) : vue.createCommentVNode("", true)
            ])) : (vue.openBlock(), vue.createElementBlock("div", {
              key: 2,
              ref_key: "columnsRef",
              ref: columnsRef,
              class: "aheart-cascader__columns"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(columns.value, (column, columnIndex) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: columnIndex,
                  class: "aheart-cascader__column"
                }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(column, (option) => {
                    return vue.openBlock(), vue.createElementBlock("button", {
                      key: option.value,
                      class: vue.normalizeClass(["aheart-cascader__option", { "is-active": activePath.value[columnIndex] === option.value, "is-selected": isSelected(columnIndex, option), "is-loading": isLoading(columnIndex, option) }]),
                      type: "button",
                      "data-cascader-value": option.value,
                      disabled: __props.disabled || option.disabled || isLoading(columnIndex, option),
                      "aria-busy": isLoading(columnIndex, option) ? "true" : void 0,
                      onClick: ($event) => handleOption(option, columnIndex),
                      onKeydown: handleOptionKeydown
                    }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(option.label), 1),
                      isLoading(columnIndex, option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 0,
                        name: "loading",
                        size: 16,
                        spin: "",
                        "aria-hidden": "true"
                      })) : isBranch(option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 1,
                        name: "chevron-right",
                        size: 16,
                        "aria-hidden": "true"
                      })) : vue.createCommentVNode("", true)
                    ], 42, _hoisted_9);
                  }), 128))
                ]);
              }), 128))
            ], 512))
          ], 6)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
