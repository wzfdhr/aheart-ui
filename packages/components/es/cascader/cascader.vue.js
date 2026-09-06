import { defineComponent, ref, computed, watch, useAttrs, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString, withModifiers, createVNode, createCommentVNode, createBlock, Teleport, unref, withDirectives, normalizeStyle, vModelText, vShow, nextTick } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { useStableId } from "../utils/use-stable-id.js";
import { useTeleportReady } from "../utils/use-teleport-ready.js";
import "./style.css.js";
const _hoisted_1 = ["tabindex", "aria-expanded", "aria-disabled", "aria-activedescendant", "aria-labelledby", "aria-describedby"];
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
const _hoisted_6 = ["aria-labelledby", "aria-describedby", "aria-label"];
const _hoisted_7 = {
  key: 1,
  class: "aheart-cascader__search-results"
};
const _hoisted_8 = ["data-cascader-path", "disabled", "onClick"];
const _hoisted_9 = {
  key: 0,
  class: "aheart-cascader__empty",
  role: "status"
};
const _hoisted_10 = ["data-cascader-value", "id", "data-cascader-column", "disabled", "aria-busy", "onClick", "onFocus"];
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const instanceId = useStableId(void 0, "aheart-cascader").value;
    const panelId = `aheart-cascader-panel-${instanceId}`;
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const columnsRef = ref(null);
    const searchText = ref("");
    const activePath = ref([]);
    const focusedPath = ref([]);
    const loadingPaths = ref([]);
    const innerOptions = ref(cloneOptions(props.options));
    const isControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const openState = useControllableState({
      controlled: () => props.open,
      isControlled: isOpenControlled,
      defaultValue: () => props.defaultOpen,
      onChange: (open) => {
        const nextOpen = Boolean(open);
        emit("openChange", nextOpen);
      }
    });
    const valueState = useControllableState({
      controlled: () => props.modelValue,
      isControlled,
      defaultValue: () => props.defaultValue,
      onChange: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      }
    });
    const mergedOpen = computed(() => Boolean(openState.state.value));
    const mergedValue = valueState.state;
    const selectedPaths = computed(() => {
      if (props.multiple) {
        return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray) ? mergedValue.value : [];
      }
      return Array.isArray(mergedValue.value) ? [mergedValue.value] : [];
    });
    watch(() => props.options, (options) => {
      innerOptions.value = cloneOptions(options);
    });
    const pathKey = (path) => path.join("/");
    const samePath = (left, right) => left.length === right.length && left.every((key, index) => key === right[index]);
    const isBranch = (option) => {
      var _a;
      return Boolean((_a = option.children) == null ? void 0 : _a.length) || option.isLeaf === false;
    };
    const columns = computed(() => {
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
    const displayLabel = computed(() => selectedPaths.value.map((path) => findLabels(path).join(" / ")).filter(Boolean).join(", "));
    const selectedTags = computed(() => selectedPaths.value.map((path) => ({ path, label: findLabels(path).join(" / ") })).filter((tag) => tag.label));
    const visibleSelectedTags = computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const collectLeaves = (options, parentPath = [], parentLabels = [], parentDisabled = false) => options.flatMap((option) => {
      var _a;
      const path = [...parentPath, option.value];
      const labels = [...parentLabels, option.label];
      const disabled = parentDisabled || Boolean(option.disabled);
      if ((_a = option.children) == null ? void 0 : _a.length)
        return collectLeaves(option.children, path, labels, disabled);
      return option.isLeaf === false ? [] : [{ path, labels, disabled }];
    });
    const searchResults = computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return collectLeaves(innerOptions.value).filter((result) => result.labels.join(" / ").toLowerCase().includes(query));
    });
    const attrs = useAttrs();
    const resolvedAriaLabelledby = computed(() => attrs["aria-labelledby"]);
    const resolvedAriaDescribedby = computed(() => attrs["aria-describedby"]);
    const optionId = (option, columnIndex) => {
      var _a;
      return `${instanceId}-option-${columnIndex}-${Math.max(0, ((_a = columns.value[columnIndex]) == null ? void 0 : _a.indexOf(option)) ?? 0)}`;
    };
    const activeDescendantId = computed(() => {
      var _a, _b, _c;
      if (!mergedOpen.value || searchText.value.trim())
        return void 0;
      const path = focusedPath.value;
      if (!path.length)
        return void 0;
      const option = ((_b = (_a = findOption(path.slice(0, -1))) == null ? void 0 : _a.children) == null ? void 0 : _b.find((item) => item.value === path.at(-1))) ?? (path.length === 1 ? innerOptions.value.find((item) => item.value === path[0]) : void 0);
      if (!option || !((_c = columns.value[path.length - 1]) == null ? void 0 : _c.includes(option)))
        return void 0;
      return optionId(option, path.length - 1);
    });
    const isSelected = (columnIndex, option) => selectedPaths.value.some((path) => path[columnIndex] === option.value && path.length === columnIndex + 1);
    const isLoading = (columnIndex, option) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const requestOpen = (open) => {
      if (props.disabled)
        return;
      openState.setState(open, { force: true });
    };
    const toggleOpen = () => requestOpen(!mergedOpen.value);
    const emitValue = (value) => {
      valueState.setState(value, { force: true });
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
      await nextTick();
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
    const handleOptionFocus = (option, columnIndex) => {
      focusedPath.value = [...activePath.value.slice(0, columnIndex), option.value];
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestOpen(true);
        void nextTick(() => {
          var _a, _b;
          return (_b = (_a = panelRef.value) == null ? void 0 : _a.querySelector(".aheart-cascader__option:not(:disabled)")) == null ? void 0 : _b.focus();
        });
      } else if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void nextTick(() => {
          var _a;
          return (_a = triggerRef.value) == null ? void 0 : _a.focus();
        });
      }
    };
    const handleOptionKeydown = (event) => {
      var _a, _b, _c, _d, _e, _f;
      const current = event.currentTarget;
      const options = Array.from(((_a = current.parentElement) == null ? void 0 : _a.querySelectorAll(".aheart-cascader__option:not(:disabled)")) ?? []);
      const index = options.indexOf(current);
      const columnIndex = Number(current.dataset.cascaderColumn);
      const option = (_b = columns.value[columnIndex]) == null ? void 0 : _b.find((item) => String(item.value) === current.dataset.cascaderValue);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        (_c = options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]) == null ? void 0 : _c.focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        requestOpen(false);
        void nextTick(() => {
          var _a2;
          return (_a2 = triggerRef.value) == null ? void 0 : _a2.focus();
        });
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        (_d = options[event.key === "Home" ? 0 : options.length - 1]) == null ? void 0 : _d.focus();
      } else if (event.key === "ArrowRight" && option && isBranch(option)) {
        event.preventDefault();
        void handleOption(option, columnIndex).then(() => nextTick(() => {
          var _a2, _b2;
          return (_b2 = (_a2 = panelRef.value) == null ? void 0 : _a2.querySelector(`[data-cascader-column="${columnIndex + 1}"]:not(:disabled)`)) == null ? void 0 : _b2.focus();
        }));
      } else if (event.key === "ArrowLeft" && columnIndex > 0) {
        event.preventDefault();
        const parentValue = focusedPath.value[columnIndex - 1] ?? activePath.value[columnIndex - 1];
        (_f = Array.from(((_e = panelRef.value) == null ? void 0 : _e.querySelectorAll(`[data-cascader-column="${columnIndex - 1}"]`)) ?? []).find((element) => element.dataset.cascaderValue === String(parentValue))) == null ? void 0 : _f.focus();
      }
    };
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const teleportReady = useTeleportReady();
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = computed(() => teleportReady.value && popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`
    ]);
    const panelStyle = computed(() => floatingPosition.popupStyle.value);
    useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-cascader", { "is-open": mergedOpen.value, "is-disabled": __props.disabled }])
      }, [
        createElementVNode("div", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-cascader__trigger",
          role: "combobox",
          tabindex: __props.disabled ? -1 : 0,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": __props.disabled ? "true" : void 0,
          "aria-controls": panelId,
          "aria-activedescendant": activeDescendantId.value,
          "aria-labelledby": resolvedAriaLabelledby.value,
          "aria-describedby": resolvedAriaDescribedby.value,
          "aria-haspopup": "dialog",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown
        }, [
          __props.multiple && selectedTags.value.length ? (openBlock(), createElementBlock("span", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSelectedTags.value, (tag) => {
              return openBlock(), createElementBlock("span", {
                key: pathKey(tag.path),
                class: "aheart-cascader__tag"
              }, [
                createElementVNode("span", _hoisted_3, toDisplayString(tag.label), 1),
                !__props.disabled ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  class: "aheart-cascader__tag-remove",
                  type: "button",
                  "aria-label": `移除 ${tag.label}`,
                  onClick: withModifiers(($event) => removePath(tag.path), ["stop"])
                }, [
                  createVNode(_sfc_main$1, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_4)) : createCommentVNode("", true)
              ]);
            }), 128)),
            hiddenTagCount.value ? (openBlock(), createElementBlock("span", _hoisted_5, "+" + toDisplayString(hiddenTagCount.value), 1)) : createCommentVNode("", true)
          ])) : (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["aheart-cascader__value", { "is-placeholder": !displayLabel.value }])
          }, toDisplayString(displayLabel.value || __props.placeholder), 3)),
          __props.allowClear && selectedPaths.value.length && !__props.disabled ? (openBlock(), createElementBlock("button", {
            key: 2,
            class: "aheart-cascader__clear",
            type: "button",
            "aria-label": "清除级联选择",
            onClick: withModifiers(clearValue, ["stop"])
          }, [
            createVNode(_sfc_main$1, {
              name: "close",
              size: 12
            })
          ])) : createCommentVNode("", true),
          createVNode(_sfc_main$1, {
            class: "aheart-cascader__arrow",
            name: "chevron-down",
            size: 16,
            "aria-hidden": "true"
          })
        ], 40, _hoisted_1),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: normalizeClass(["aheart-cascader__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            id: panelId,
            "aria-labelledby": resolvedAriaLabelledby.value || void 0,
            "aria-describedby": resolvedAriaDescribedby.value || void 0,
            "aria-label": resolvedAriaLabelledby.value ? void 0 : "级联选择"
          }, [
            __props.showSearch ? withDirectives((openBlock(), createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
              class: "aheart-cascader__search",
              type: "search",
              placeholder: "搜索",
              "aria-label": "搜索级联选项"
            }, null, 512)), [
              [vModelText, searchText.value]
            ]) : createCommentVNode("", true),
            searchText.value.trim() ? (openBlock(), createElementBlock("div", _hoisted_7, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(searchResults.value, (result) => {
                return openBlock(), createElementBlock("button", {
                  key: pathKey(result.path),
                  class: "aheart-cascader__option",
                  type: "button",
                  "data-cascader-path": pathKey(result.path),
                  disabled: __props.disabled || result.disabled,
                  onClick: ($event) => selectPath(result.path)
                }, toDisplayString(result.labels.join(" / ")), 9, _hoisted_8);
              }), 128)),
              searchResults.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_9, "暂无匹配选项")) : createCommentVNode("", true)
            ])) : (openBlock(), createElementBlock("div", {
              key: 2,
              ref_key: "columnsRef",
              ref: columnsRef,
              class: "aheart-cascader__columns"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(columns.value, (column, columnIndex) => {
                return openBlock(), createElementBlock("div", {
                  key: columnIndex,
                  class: "aheart-cascader__column"
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(column, (option) => {
                    return openBlock(), createElementBlock("button", {
                      key: option.value,
                      class: normalizeClass(["aheart-cascader__option", { "is-active": activePath.value[columnIndex] === option.value, "is-selected": isSelected(columnIndex, option), "is-loading": isLoading(columnIndex, option) }]),
                      type: "button",
                      "data-cascader-value": option.value,
                      id: optionId(option, columnIndex),
                      "data-cascader-column": columnIndex,
                      disabled: __props.disabled || option.disabled || isLoading(columnIndex, option),
                      "aria-busy": isLoading(columnIndex, option) ? "true" : void 0,
                      onClick: ($event) => handleOption(option, columnIndex),
                      onFocus: ($event) => handleOptionFocus(option, columnIndex),
                      onKeydown: handleOptionKeydown
                    }, [
                      createElementVNode("span", null, toDisplayString(option.label), 1),
                      isLoading(columnIndex, option) ? (openBlock(), createBlock(_sfc_main$1, {
                        key: 0,
                        name: "loading",
                        size: 16,
                        spin: "",
                        "aria-hidden": "true"
                      })) : isBranch(option) ? (openBlock(), createBlock(_sfc_main$1, {
                        key: 1,
                        name: "chevron-right",
                        size: 16,
                        "aria-hidden": "true"
                      })) : createCommentVNode("", true)
                    ], 42, _hoisted_10);
                  }), 128))
                ]);
              }), 128))
            ], 512))
          ], 14, _hoisted_6)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
