"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const useControllableState = require("../utils/use-controllable-state.js");
const useStableId = require("../utils/use-stable-id.js");
const useTeleportReady = require("../utils/use-teleport-ready.js");
const usePopupViewportBudget = require("../utils/use-popup-viewport-budget.js");
const cascaderVirtualList_vue_vue_type_script_setup_true_lang = require("./cascader-virtual-list.vue.js");
const virtualOptions = require("./virtual-options.js");
require("./style.css.js");
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
const _hoisted_7 = ["tabindex", "data-cascader-path", "data-cascader-path-token", "disabled", "onClick", "onFocus", "onKeydown"];
const _hoisted_8 = {
  key: 1,
  class: "aheart-cascader__empty",
  role: "status"
};
const _hoisted_9 = {
  key: 2,
  class: "aheart-cascader__search-results"
};
const _hoisted_10 = ["data-cascader-path", "data-cascader-path-token", "disabled", "onClick"];
const _hoisted_11 = {
  key: 0,
  class: "aheart-cascader__empty",
  role: "status"
};
const _hoisted_12 = ["tabindex", "data-cascader-value", "data-cascader-token", "id", "data-cascader-column", "disabled", "aria-busy", "aria-label", "onClick", "onFocus", "onKeydown"];
const _hoisted_13 = {
  key: 1,
  class: "aheart-cascader__load-error",
  "aria-hidden": "true"
};
const _hoisted_14 = ["data-cascader-value", "data-cascader-token", "id", "data-cascader-column", "disabled", "aria-busy", "aria-label", "onClick", "onFocus", "onKeydown"];
const _hoisted_15 = {
  key: 1,
  class: "aheart-cascader__load-error",
  "aria-hidden": "true"
};
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
    virtual: { type: [Boolean, Object] },
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
    const instanceId = useStableId.useStableId(void 0, "aheart-cascader").value;
    const panelId = `aheart-cascader-panel-${instanceId}`;
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const columnsRef = vue.ref(null);
    const searchRef = vue.ref(null);
    const searchText = vue.ref("");
    const activePath = vue.ref([]);
    const focusedPath = vue.ref([]);
    const loadingPaths = vue.ref([]);
    const errorPaths = vue.ref([]);
    const innerOptions = vue.ref(cloneOptions(props.options));
    const virtualConfig = vue.computed(() => virtualOptions.normalizeCascaderVirtual(props.virtual, (message) => {
    }));
    const virtualEnabled = vue.computed(() => virtualConfig.value !== null);
    const focusedSearchPath = vue.ref([]);
    const virtualListRefs = /* @__PURE__ */ new Map();
    let revealGeneration = 0;
    const rovingKeys = vue.ref({});
    const setVirtualListRef = (key, element) => {
      if (element && "$el" in element)
        virtualListRefs.set(key, element);
      else if (!element)
        virtualListRefs.delete(key);
    };
    const cancelVirtualFocus = () => virtualListRefs.forEach((list) => list.cancelFocus());
    const suspendVirtualLists = () => virtualListRefs.forEach((list) => list.suspend());
    let keyboardRequest = 0;
    let modeFocusGeneration = 0;
    let focusOwner;
    const retire = (owner) => {
      if (!owner)
        return;
      owner.dispose();
      if (focusOwner === owner)
        focusOwner = void 0;
    };
    const invalidateModeFocus = () => {
      modeFocusGeneration += 1;
      keyboardRequest += 1;
      retire(focusOwner);
      cancelVirtualFocus();
    };
    let loadGeneration = 0;
    let loadSequence = 0;
    let navigationVersion = 0;
    const activeLoadIds = /* @__PURE__ */ new Map();
    const activeLoadControllers = /* @__PURE__ */ new Map();
    const isControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const openState = useControllableState.useControllableState({
      controlled: () => props.open,
      isControlled: isOpenControlled,
      defaultValue: () => props.defaultOpen,
      onChange: (open) => {
        const nextOpen = Boolean(open);
        emit("openChange", nextOpen);
      }
    });
    const valueState = useControllableState.useControllableState({
      controlled: () => props.modelValue,
      isControlled,
      defaultValue: () => props.defaultValue,
      onChange: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      }
    });
    const mergedOpen = vue.computed(() => Boolean(openState.state.value));
    const ownedRenderBlur = (event) => {
      const owner = focusOwner;
      if (!owner || owner.request !== keyboardRequest || owner.loadGeneration !== loadGeneration || owner.modeFocusGeneration !== modeFocusGeneration || owner.navigationVersion !== navigationVersion)
        return false;
      if (event.target !== owner.source || event.currentTarget !== owner.source && event.currentTarget !== panelRef.value)
        return false;
      if (event.relatedTarget !== null || !owner.renderBlurArmed || !owner.source.isConnected)
        return false;
      const source = owner.source;
      if (!source.disabled && !source.hasAttribute("disabled"))
        return false;
      if (!loadingPaths.value.some((path) => samePath(path, owner.path)))
        return false;
      if (!samePath(activePath.value.slice(0, owner.path.length), owner.path))
        return false;
      const columnIndex = Number(source.dataset.cascaderColumn);
      if (!Number.isInteger(columnIndex) || columnIndex !== owner.path.length - 1 || source.dataset.cascaderToken !== cascaderKeyToken(owner.path.at(-1)))
        return false;
      owner.sawRenderBlur = true;
      return true;
    };
    vue.watch([panelRef, virtualEnabled, mergedOpen, () => props.disabled], ([panel, isVirtual, isOpen, isDisabled], _previous, cleanup) => {
      if (!panel || !isVirtual || !isOpen || isDisabled)
        return;
      const ownerDocument = panel.ownerDocument;
      const cancelOutside = (event) => {
        var _a;
        const target = event.target;
        if (target && !((_a = rootRef.value) == null ? void 0 : _a.contains(target)) && !panel.contains(target))
          invalidateModeFocus();
      };
      const cancelNavigation = () => invalidateModeFocus();
      const cancelFocusOut = (event) => {
        var _a;
        const target = event.target;
        if (ownedRenderBlur(event))
          return;
        const related = event.relatedTarget;
        if (related && !((_a = rootRef.value) == null ? void 0 : _a.contains(related)) && !panel.contains(related)) {
          invalidateModeFocus();
          return;
        }
        if (!related && (target == null ? void 0 : target.isConnected))
          invalidateModeFocus();
      };
      ownerDocument.addEventListener("focusin", cancelOutside);
      panel.addEventListener("focusout", cancelFocusOut, true);
      panel.addEventListener("wheel", cancelNavigation, { passive: true });
      panel.addEventListener("pointerdown", cancelNavigation, { passive: true });
      panel.addEventListener("touchstart", cancelNavigation, { passive: true });
      cleanup(() => {
        ownerDocument.removeEventListener("focusin", cancelOutside);
        panel.removeEventListener("focusout", cancelFocusOut, true);
        panel.removeEventListener("wheel", cancelNavigation);
        panel.removeEventListener("pointerdown", cancelNavigation);
        panel.removeEventListener("touchstart", cancelNavigation);
        invalidateModeFocus();
      });
    }, { flush: "post", immediate: true });
    const mergedValue = valueState.state;
    const selectedPaths = vue.computed(() => {
      if (props.multiple) {
        return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray) ? mergedValue.value : [];
      }
      return Array.isArray(mergedValue.value) ? [mergedValue.value] : [];
    });
    const pathKey = (path) => path.join("/");
    const cascaderKeyToken = (key) => `${typeof key === "number" ? "n" : "s"}-${Array.from(String(key), (character) => character.codePointAt(0).toString(16)).join("-")}`;
    const pathToken = (path) => path.map(cascaderKeyToken).join("--");
    const samePath = (left, right) => left.length === right.length && left.every((key, index) => key === right[index]);
    const closestExistingPath = (path, options) => {
      const existing = [];
      let siblings = options;
      for (const key of path) {
        const option = siblings.find((candidate) => candidate.value === key);
        if (!option)
          break;
        existing.push(key);
        siblings = option.children ?? [];
      }
      return existing;
    };
    const invalidateLoads = () => {
      retire(focusOwner);
      loadGeneration += 1;
      activeLoadControllers.forEach((controller) => controller.abort());
      activeLoadControllers.clear();
      activeLoadIds.clear();
      loadingPaths.value = [];
    };
    const cancelOtherLoads = (requestKey) => {
      activeLoadControllers.forEach((controller, key) => {
        if (key === requestKey)
          return;
        controller.abort();
        activeLoadControllers.delete(key);
        activeLoadIds.delete(key);
      });
      loadingPaths.value = loadingPaths.value.filter((path) => pathToken(path) === requestKey);
    };
    vue.watch(() => props.options, (options) => {
      const nextOptions = cloneOptions(options);
      revealGeneration += 1;
      invalidateLoads();
      innerOptions.value = nextOptions;
      errorPaths.value = [];
      activePath.value = closestExistingPath(activePath.value, nextOptions);
      focusedPath.value = closestExistingPath(focusedPath.value, nextOptions);
    });
    vue.watch(() => props.disabled, (disabled) => {
      if (disabled) {
        invalidateModeFocus();
        suspendVirtualLists();
        invalidateLoads();
      }
    });
    vue.watch(() => props.loadData, invalidateLoads, { flush: "sync" });
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
    const columnPrefixToken = (columnIndex) => `column-${columnIndex === 0 ? "root" : pathToken(activePath.value.slice(0, columnIndex))}`;
    const rowToken = (columnIndex, _optionIndex, option) => `${columnPrefixToken(columnIndex)}-${cascaderKeyToken(option.value)}`;
    const columnOptionLoading = (columnIndex, option) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const firstEnabledIndex = (items) => items.findIndex((option) => !option.disabled);
    const rovingIndex = (columnIndex) => {
      const column = columns.value[columnIndex] ?? [];
      const focused = rovingKeys.value[columnPrefixToken(columnIndex)] ?? focusedPath.value[columnIndex];
      const focusedIndex = focused === void 0 ? -1 : column.findIndex((option) => option.value === focused && !option.disabled && !columnOptionLoading(columnIndex, option));
      const enabled = column.filter((option) => !option.disabled && !columnOptionLoading(columnIndex, option));
      const fallback = firstEnabledIndex(enabled);
      return focusedIndex >= 0 ? focusedIndex : fallback < 0 ? -1 : column.indexOf(enabled[fallback]);
    };
    const pinnedIndexes = (columnIndex) => {
      const index = rovingIndex(columnIndex);
      return index >= 0 ? [index] : [];
    };
    const searchRovingIndex = vue.computed(() => {
      const focused = focusedSearchPath.value;
      const index = searchResults.value.findIndex((result) => samePath(result.path, focused) && !result.disabled);
      return index >= 0 ? index : firstEnabledIndex(searchResults.value.map((result) => ({ value: result.path.join("/"), label: result.labels.join(" / "), disabled: result.disabled })));
    });
    const searchPinnedIndexes = vue.computed(() => searchRovingIndex.value >= 0 ? [searchRovingIndex.value] : []);
    const attrs = vue.useAttrs();
    const resolvedAriaLabelledby = vue.computed(() => attrs["aria-labelledby"]);
    const resolvedAriaDescribedby = vue.computed(() => attrs["aria-describedby"]);
    const optionId = (columnIndex, _optionIndex, option) => {
      const fullPath = option ? [...activePath.value.slice(0, columnIndex), option.value] : [];
      return `${instanceId}-option-column-${columnIndex}-${pathToken(fullPath) || "root"}`;
    };
    const activeDescendantId = vue.computed(() => {
      var _a, _b, _c;
      if (virtualEnabled.value || !mergedOpen.value || searchText.value.trim())
        return void 0;
      const path = focusedPath.value;
      if (!path.length)
        return void 0;
      const option = ((_b = (_a = findOption(path.slice(0, -1))) == null ? void 0 : _a.children) == null ? void 0 : _b.find((item) => item.value === path.at(-1))) ?? (path.length === 1 ? innerOptions.value.find((item) => item.value === path[0]) : void 0);
      if (!option || !((_c = columns.value[path.length - 1]) == null ? void 0 : _c.includes(option)))
        return void 0;
      return optionId(path.length - 1, columns.value[path.length - 1].indexOf(option), option);
    });
    const isSelected = (columnIndex, option) => {
      const candidate = [...activePath.value.slice(0, columnIndex), option.value];
      return selectedPaths.value.some((path) => samePath(path, candidate));
    };
    const isLoading = (columnIndex, option) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const isLoadError = (columnIndex, option) => errorPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const requestOpen = (open) => {
      if (props.disabled)
        return;
      if (!open) {
        revealGeneration += 1;
        invalidateModeFocus();
      }
      openState.setState(open, { force: true });
    };
    vue.watch(mergedOpen, (open, previousOpen) => {
      if (previousOpen && !open) {
        revealGeneration += 1;
        invalidateModeFocus();
        suspendVirtualLists();
        invalidateLoads();
      }
    });
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
    const revealColumnInViewport = (columnIndex) => {
      const columns2 = columnsRef.value;
      const column = columns2 == null ? void 0 : columns2.children[columnIndex];
      if (!columns2 || !column)
        return;
      const viewport = columns2.getBoundingClientRect();
      const target = column.getBoundingClientRect();
      let nextScrollLeft = columns2.scrollLeft;
      if (target.left < viewport.left)
        nextScrollLeft += target.left - viewport.left;
      else if (target.right > viewport.right)
        nextScrollLeft += target.right - viewport.right;
      const maximum = Math.max(0, columns2.scrollWidth - columns2.clientWidth);
      nextScrollLeft = Math.min(maximum, Math.max(0, nextScrollLeft));
      if (Math.abs(nextScrollLeft - columns2.scrollLeft) < 0.5)
        return;
      const previousBehavior = columns2.style.scrollBehavior;
      columns2.style.scrollBehavior = "auto";
      columns2.scrollLeft = nextScrollLeft;
      columns2.style.scrollBehavior = previousBehavior;
    };
    const revealLastColumn = async () => {
      const generation = ++revealGeneration;
      await vue.nextTick();
      if (generation !== revealGeneration || !mergedOpen.value || props.disabled || searchText.value.trim())
        return;
      await floatingPosition.update();
      await vue.nextTick();
      if (generation !== revealGeneration || !mergedOpen.value || props.disabled || searchText.value.trim())
        return;
      revealColumnInViewport(Math.max(0, columns.value.length - 1));
    };
    const handleOption = async (option, columnIndex, owner) => {
      var _a;
      if (props.disabled || option.disabled)
        return;
      navigationVersion++;
      const path = [...activePath.value.slice(0, columnIndex), option.value];
      if (focusOwner && focusOwner !== owner)
        retire(focusOwner);
      cancelOtherLoads(pathToken(path));
      if (!isBranch(option)) {
        selectPath(path);
        return;
      }
      activePath.value = path;
      void revealLastColumn();
      if (!((_a = option.children) == null ? void 0 : _a.length) && props.loadData) {
        const requestKey = pathToken(path);
        if (activeLoadIds.has(requestKey))
          return;
        const requestId = ++loadSequence;
        const generation = loadGeneration;
        const controller = new AbortController();
        activeLoadIds.set(requestKey, requestId);
        activeLoadControllers.set(requestKey, controller);
        errorPaths.value = errorPaths.value.filter((current) => !samePath(current, path));
        loadingPaths.value = [...loadingPaths.value, path];
        try {
          const children = await props.loadData(option, { signal: controller.signal });
          if (generation !== loadGeneration || activeLoadIds.get(requestKey) !== requestId)
            return;
          if (!path.every((key, index) => activePath.value[index] === key))
            return;
          innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children));
          void revealLastColumn();
        } catch {
          if (generation === loadGeneration && activeLoadIds.get(requestKey) === requestId && path.every((key, index) => activePath.value[index] === key)) {
            errorPaths.value = [...errorPaths.value.filter((current) => !samePath(current, path)), path];
          }
        } finally {
          if (activeLoadIds.get(requestKey) === requestId) {
            activeLoadIds.delete(requestKey);
            activeLoadControllers.delete(requestKey);
            loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path));
          }
        }
      }
    };
    const handleOptionFocus = (option, columnIndex) => {
      focusedPath.value = [...activePath.value.slice(0, columnIndex), option.value];
      rovingKeys.value = { ...rovingKeys.value, [columnPrefixToken(columnIndex)]: option.value };
    };
    const handleOptionBlur = (event) => {
      var _a, _b;
      const related = event.relatedTarget;
      if (ownedRenderBlur(event))
        return;
      if (related && !((_a = rootRef.value) == null ? void 0 : _a.contains(related)) && !((_b = panelRef.value) == null ? void 0 : _b.contains(related)))
        invalidateModeFocus();
      if (!event.relatedTarget) {
        const current = event.currentTarget;
        current == null ? void 0 : current.blur();
        invalidateModeFocus();
      }
    };
    const handleSearchFocus = (path, _index) => {
      focusedSearchPath.value = [...path];
      focusedPath.value = [...path];
    };
    const handleSearchInputFocus = () => invalidateModeFocus();
    const handleSearchInputBlur = (event) => {
      if (!event.relatedTarget)
        invalidateModeFocus();
    };
    const focusColumnIndex = (columnIndex, index, cancelPendingReveal = false) => {
      var _a, _b, _c;
      if (cancelPendingReveal)
        revealGeneration += 1;
      revealColumnInViewport(columnIndex);
      const key = columnPrefixToken(columnIndex);
      const list = virtualListRefs.get(key);
      if (list)
        list.focusIndex(index);
      else {
        const target = (_c = panelRef.value) == null ? void 0 : _c.querySelector(`[data-cascader-column="${columnIndex}"][data-cascader-token="${cascaderKeyToken((_b = (_a = columns.value[columnIndex]) == null ? void 0 : _a[index]) == null ? void 0 : _b.value)}"]`);
        target == null ? void 0 : target.focus();
      }
    };
    vue.watch(searchText, (query, previousQuery) => {
      var _a, _b;
      if (!virtualEnabled.value || query === previousQuery)
        return;
      revealGeneration += 1;
      const active = (_a = searchRef.value) == null ? void 0 : _a.ownerDocument.activeElement;
      const resultWasFocused = Boolean((active == null ? void 0 : active.classList.contains("aheart-cascader__option")) && active.dataset.cascaderPath);
      const path = [...focusedSearchPath.value];
      const generation = ++modeFocusGeneration;
      cancelVirtualFocus();
      if (!query.trim() && resultWasFocused && path.length) {
        activePath.value = path.slice(0, -1);
        focusedPath.value = [...path];
        void vue.nextTick(() => void vue.nextTick(() => {
          if (generation !== modeFocusGeneration)
            return;
          const siblings = columns.value[path.length - 1] ?? [];
          const index = siblings.findIndex((option) => option.value === path.at(-1) && !option.disabled);
          if (index >= 0)
            focusColumnIndex(path.length - 1, index);
        }));
        void revealLastColumn();
      } else if (query.trim() && resultWasFocused) {
        (_b = searchRef.value) == null ? void 0 : _b.focus();
      } else if (!query.trim()) {
        void revealLastColumn();
      }
      if (query.trim()) {
        const retained = searchResults.value.some((result) => samePath(result.path, path) && !result.disabled);
        if (!retained)
          focusedSearchPath.value = [];
      }
    }, { flush: "sync" });
    const enabledIndexes = (columnIndex) => (columns.value[columnIndex] ?? []).map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled && !isLoading(columnIndex, option)).map(({ index }) => index);
    const handleSearchInputKeydown = (event) => {
      if (!virtualEnabled.value)
        return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
        return;
      const indexes = searchResults.value.map((result, index2) => ({ result, index: index2 })).filter(({ result }) => !result.disabled).map(({ index: index2 }) => index2);
      if (!indexes.length)
        return;
      event.preventDefault();
      const index = event.key === "ArrowDown" ? indexes[0] : indexes.at(-1);
      const list = virtualListRefs.get("search");
      if (list)
        list.focusIndex(index);
      else
        void vue.nextTick(() => {
          var _a, _b;
          return (_b = (_a = panelRef.value) == null ? void 0 : _a.querySelectorAll(".aheart-cascader__search-results .aheart-cascader__option")[index]) == null ? void 0 : _b.focus();
        });
    };
    const handleSearchKeydown = (event, path, index) => {
      var _a, _b;
      const indexes = searchResults.value.map((result, resultIndex) => ({ result, resultIndex })).filter(({ result }) => !result.disabled).map(({ resultIndex }) => resultIndex);
      const current = indexes.indexOf(index);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = indexes[(current + (event.key === "ArrowDown" ? 1 : -1) + indexes.length) % indexes.length];
        (_a = virtualListRefs.get("search")) == null ? void 0 : _a.focusIndex(next);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        (_b = virtualListRefs.get("search")) == null ? void 0 : _b.focusIndex(event.key === "Home" ? indexes[0] : indexes.at(-1));
      } else if (event.key === "Escape") {
        event.preventDefault();
        requestOpen(false);
        void vue.nextTick(() => {
          var _a2;
          return (_a2 = triggerRef.value) == null ? void 0 : _a2.focus();
        });
      } else if ((event.key === "Enter" || event.key === " ") && !searchResults.value[index].disabled) {
        event.preventDefault();
        selectPath(path);
      }
    };
    const ownKeyboardFocus = (source, path, request) => {
      retire(focusOwner);
      const ownerDocument = source.ownerDocument;
      const ownerWindow = ownerDocument.defaultView;
      const owner = {
        request,
        loadGeneration,
        modeFocusGeneration,
        navigationVersion,
        path: [...path],
        source,
        ownerDocument,
        sawRenderBlur: false,
        renderBlurArmed: true,
        onFocusIn: void 0,
        onPointerDown: void 0,
        onTouchStart: void 0,
        onWheel: void 0,
        onKeyDown: void 0,
        onWindowBlur: void 0,
        dispose: void 0
      };
      owner.onFocusIn = (event) => {
        const target = event.target;
        if (target && target !== source)
          retire(owner);
      };
      owner.onPointerDown = () => retire(owner);
      owner.onTouchStart = () => retire(owner);
      owner.onWheel = () => retire(owner);
      owner.onKeyDown = (event) => {
        if (event.key === "Tab" || event.key === "Escape")
          retire(owner);
      };
      owner.onWindowBlur = () => retire(owner);
      ownerDocument.addEventListener("focusin", owner.onFocusIn);
      ownerDocument.addEventListener("pointerdown", owner.onPointerDown, true);
      ownerDocument.addEventListener("touchstart", owner.onTouchStart, true);
      ownerDocument.addEventListener("wheel", owner.onWheel, true);
      ownerDocument.addEventListener("keydown", owner.onKeyDown, true);
      ownerWindow == null ? void 0 : ownerWindow.addEventListener("blur", owner.onWindowBlur);
      let disposed = false;
      owner.dispose = () => {
        var _a, _b;
        if (disposed)
          return;
        disposed = true;
        if (owner.renderRaf !== void 0)
          (_a = ownerWindow == null ? void 0 : ownerWindow.cancelAnimationFrame) == null ? void 0 : _a.call(ownerWindow, owner.renderRaf);
        if (owner.renderTimer !== void 0)
          (_b = ownerWindow == null ? void 0 : ownerWindow.clearTimeout) == null ? void 0 : _b.call(ownerWindow, owner.renderTimer);
        owner.renderRaf = void 0;
        owner.renderTimer = void 0;
        owner.renderBlurArmed = false;
        ownerDocument.removeEventListener("focusin", owner.onFocusIn);
        ownerDocument.removeEventListener("pointerdown", owner.onPointerDown, true);
        ownerDocument.removeEventListener("touchstart", owner.onTouchStart, true);
        ownerDocument.removeEventListener("wheel", owner.onWheel, true);
        ownerDocument.removeEventListener("keydown", owner.onKeyDown, true);
        ownerWindow == null ? void 0 : ownerWindow.removeEventListener("blur", owner.onWindowBlur);
      };
      focusOwner = owner;
      return owner;
    };
    const enterChildColumn = async (option, columnIndex, current) => {
      const request = ++keyboardRequest;
      const path = [...activePath.value.slice(0, columnIndex), option.value];
      const ownsActiveFocus = current.ownerDocument.activeElement === current;
      const owner = ownsActiveFocus ? ownKeyboardFocus(current, path, request) : void 0;
      try {
        const generation = loadGeneration;
        const pending = handleOption(option, columnIndex, owner);
        const navigation = navigationVersion;
        if (owner)
          owner.navigationVersion = navigation;
        const ownerWindow = current.ownerDocument.defaultView;
        if (owner && owner === focusOwner && current.isConnected && mergedOpen.value && !props.disabled && loadingPaths.value.some((loadingPath) => samePath(loadingPath, path))) {
          const canUseRaf = Boolean(ownerWindow && typeof ownerWindow.requestAnimationFrame === "function" && typeof ownerWindow.cancelAnimationFrame === "function");
          const canUseTimer = Boolean(ownerWindow && typeof ownerWindow.setTimeout === "function" && typeof ownerWindow.clearTimeout === "function");
          if (canUseRaf) {
            const closeAfterRaf = () => {
              owner.renderRaf = void 0;
              if (focusOwner !== owner) {
                owner.renderBlurArmed = false;
                return;
              }
              if (canUseTimer)
                owner.renderTimer = ownerWindow.setTimeout(() => {
                  owner.renderTimer = void 0;
                  owner.renderBlurArmed = false;
                }, 0);
              else if (canUseRaf)
                owner.renderRaf = ownerWindow.requestAnimationFrame(() => {
                  owner.renderRaf = void 0;
                  owner.renderBlurArmed = false;
                });
              else
                owner.renderBlurArmed = false;
            };
            owner.renderRaf = ownerWindow.requestAnimationFrame(closeAfterRaf);
          } else if (canUseTimer)
            owner.renderTimer = ownerWindow.setTimeout(() => {
              owner.renderTimer = void 0;
              owner.renderBlurArmed = false;
            }, 0);
          else
            owner.renderBlurArmed = false;
        }
        await pending;
        await vue.nextTick();
        const active = current.ownerDocument.activeElement;
        if (request !== keyboardRequest || generation !== loadGeneration || !current.isConnected || props.disabled || !mergedOpen.value || !samePath(activePath.value.slice(0, path.length), path))
          return;
        if (owner) {
          if (owner.modeFocusGeneration !== modeFocusGeneration || owner.navigationVersion !== navigationVersion || owner !== focusOwner)
            return;
          if (active !== current && !(active === owner.ownerDocument.body && owner.sawRenderBlur))
            return;
        }
        if (!pathHasDisabledOption(path)) {
          const nextColumn = columnIndex + 1;
          const nextIndexes = enabledIndexes(nextColumn);
          if (nextIndexes.length)
            focusColumnIndex(nextColumn, nextIndexes[0]);
          else if (current.ownerDocument.activeElement === current.ownerDocument.body && !current.disabled)
            current.focus();
        }
      } finally {
        retire(owner);
      }
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
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
    const handleOptionKeydown = (event, option, columnIndex, optionIndex = -1) => {
      var _a, _b, _c;
      const current = event.currentTarget;
      if (virtualEnabled.value) {
        const indexes = enabledIndexes(columnIndex);
        const currentIndex = optionIndex >= 0 ? indexes.indexOf(optionIndex) : indexes.findIndex((index2) => {
          var _a2;
          return ((_a2 = columns.value[columnIndex]) == null ? void 0 : _a2[index2]) === option;
        });
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (indexes.length)
            focusColumnIndex(columnIndex, indexes[(currentIndex + (event.key === "ArrowDown" ? 1 : -1) + indexes.length) % indexes.length]);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          if (indexes.length)
            focusColumnIndex(columnIndex, event.key === "Home" ? indexes[0] : indexes.at(-1));
        } else if (event.key === "Escape") {
          event.preventDefault();
          requestOpen(false);
          void vue.nextTick(() => {
            var _a2;
            return (_a2 = triggerRef.value) == null ? void 0 : _a2.focus();
          });
        } else if ((event.key === "Enter" || event.key === " ") && !option.disabled) {
          event.preventDefault();
          void enterChildColumn(option, columnIndex, current);
        } else if (event.key === "ArrowRight" && isBranch(option)) {
          event.preventDefault();
          void enterChildColumn(option, columnIndex, current);
        } else if (event.key === "ArrowLeft" && columnIndex > 0) {
          event.preventDefault();
          const parentValue = focusedPath.value[columnIndex - 1] ?? activePath.value[columnIndex - 1];
          const parentIndex = (columns.value[columnIndex - 1] ?? []).findIndex((candidate) => candidate.value === parentValue);
          if (parentIndex >= 0)
            focusColumnIndex(columnIndex - 1, parentIndex, true);
        }
        return;
      }
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
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        (_c = options[event.key === "Home" ? 0 : options.length - 1]) == null ? void 0 : _c.focus();
      } else if ((event.key === "Enter" || event.key === " ") && !option.disabled) {
        event.preventDefault();
        void enterChildColumn(option, columnIndex, current);
      } else if (event.key === "ArrowRight" && isBranch(option)) {
        event.preventDefault();
        void enterChildColumn(option, columnIndex, current);
      } else if (event.key === "ArrowLeft" && columnIndex > 0) {
        event.preventDefault();
        const parentValue = focusedPath.value[columnIndex - 1] ?? activePath.value[columnIndex - 1];
        const parentIndex = (columns.value[columnIndex - 1] ?? []).findIndex((candidate) => candidate.value === parentValue);
        if (parentIndex >= 0)
          focusColumnIndex(columnIndex - 1, parentIndex, true);
      }
    };
    vue.onBeforeUnmount(invalidateLoads);
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const teleportReady = useTeleportReady.useTeleportReady();
    const popupContainer = vue.computed(() => {
      var _a;
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return ((_a = triggerRef.value) == null ? void 0 : _a.ownerDocument.body) ?? false;
    });
    const shouldTeleport = vue.computed(() => teleportReady.value && popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => !props.disabled && motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow,
      autoUpdateOptions: { elementResize: false }
    });
    const viewportBudget = usePopupViewportBudget.usePopupViewportBudget({
      trigger: triggerRef,
      popup: panelRef,
      placement: floatingPosition.placement,
      open: vue.computed(() => virtualEnabled.value && !props.disabled && mergedOpen.value && motion.isMounted.value && motion.phase.value !== "hidden"),
      maximum: vue.computed(() => {
        var _a;
        return ((_a = virtualConfig.value) == null ? void 0 : _a.height) ?? 256;
      }),
      search: searchRef
    });
    const effectiveVirtualConfig = vue.computed(() => {
      const config = virtualConfig.value;
      if (!config)
        return { height: 0, estimateSize: 32, overscan: 0 };
      return { ...config, height: Math.max(0, viewportBudget.value.treeHeight) };
    });
    const panelClass = vue.computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`,
      { "is-virtual": virtualEnabled.value }
    ]);
    const panelStyle = vue.computed(() => [
      floatingPosition.popupStyle.value,
      virtualEnabled.value ? {
        display: "flex",
        flexDirection: "column",
        minBlockSize: "0",
        overflowY: "hidden",
        maxBlockSize: `${viewportBudget.value.popupHeight}px`
      } : void 0
    ]);
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
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
          "aria-controls": panelId,
          "aria-activedescendant": activeDescendantId.value,
          "aria-labelledby": resolvedAriaLabelledby.value,
          "aria-describedby": resolvedAriaDescribedby.value,
          "aria-haspopup": "dialog",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown
        }, [
          __props.multiple && selectedTags.value.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSelectedTags.value, (tag) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: pathToken(tag.path),
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
            id: panelId,
            "aria-labelledby": resolvedAriaLabelledby.value || void 0,
            "aria-describedby": resolvedAriaDescribedby.value || void 0,
            "aria-label": resolvedAriaLabelledby.value ? void 0 : "级联选择"
          }, [
            __props.showSearch ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
              key: 0,
              ref_key: "searchRef",
              ref: searchRef,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
              class: "aheart-cascader__search",
              type: "search",
              placeholder: "搜索",
              "aria-label": "搜索级联选项",
              onKeydown: handleSearchInputKeydown,
              onFocus: handleSearchInputFocus,
              onBlur: handleSearchInputBlur
            }, null, 544)), [
              [vue.vModelText, searchText.value]
            ]) : vue.createCommentVNode("", true),
            searchText.value.trim() && virtualEnabled.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              searchResults.value.length > 0 ? (vue.openBlock(), vue.createBlock(cascaderVirtualList_vue_vue_type_script_setup_true_lang.default, {
                key: 0,
                ref: (element) => setVirtualListRef("search", element),
                "class-name": "aheart-cascader__search-results",
                items: searchResults.value,
                config: effectiveVirtualConfig.value,
                "active-index": searchRovingIndex.value,
                "pinned-indexes": searchPinnedIndexes.value,
                enabled: virtualEnabled.value && mergedOpen.value && !__props.disabled,
                "row-key": (_index, result) => pathToken(result.path),
                "disabled-index": (_index, result) => __props.disabled || result.disabled
              }, {
                row: vue.withCtx(({ index, option: result, tabindex }) => [
                  vue.createElementVNode("button", {
                    class: "aheart-cascader__option",
                    type: "button",
                    tabindex,
                    "data-cascader-path": pathKey(result.path),
                    "data-cascader-path-token": pathToken(result.path),
                    disabled: __props.disabled || result.disabled,
                    onClick: ($event) => selectPath(result.path),
                    onFocus: ($event) => handleSearchFocus(result.path),
                    onKeydown: ($event) => handleSearchKeydown($event, result.path, index)
                  }, vue.toDisplayString(result.labels.join(" / ")), 41, _hoisted_7)
                ]),
                _: 1
              }, 8, ["items", "config", "active-index", "pinned-indexes", "enabled", "row-key", "disabled-index"])) : vue.createCommentVNode("", true),
              searchResults.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, "暂无匹配选项")) : vue.createCommentVNode("", true)
            ], 64)) : searchText.value.trim() ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(searchResults.value, (result) => {
                return vue.openBlock(), vue.createElementBlock("button", {
                  key: pathToken(result.path),
                  class: "aheart-cascader__option",
                  type: "button",
                  "data-cascader-path": pathKey(result.path),
                  "data-cascader-path-token": pathToken(result.path),
                  disabled: __props.disabled || result.disabled,
                  onClick: ($event) => selectPath(result.path)
                }, vue.toDisplayString(result.labels.join(" / ")), 9, _hoisted_10);
              }), 128)),
              searchResults.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, "暂无匹配选项")) : vue.createCommentVNode("", true)
            ])) : (vue.openBlock(), vue.createElementBlock("div", {
              key: 3,
              ref_key: "columnsRef",
              ref: columnsRef,
              class: "aheart-cascader__columns"
            }, [
              virtualEnabled.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(columns.value, (column, columnIndex) => {
                return vue.openBlock(), vue.createBlock(cascaderVirtualList_vue_vue_type_script_setup_true_lang.default, {
                  key: columnPrefixToken(columnIndex),
                  ref_for: true,
                  ref: (element) => setVirtualListRef(columnPrefixToken(columnIndex), element),
                  "class-name": "aheart-cascader__column",
                  items: column,
                  config: effectiveVirtualConfig.value,
                  "active-index": rovingIndex(columnIndex),
                  "pinned-indexes": pinnedIndexes(columnIndex),
                  enabled: virtualEnabled.value && mergedOpen.value && !__props.disabled,
                  "row-key": (optionIndex, option) => rowToken(columnIndex, optionIndex, option),
                  "disabled-index": (optionIndex, option) => __props.disabled || option.disabled || isLoading(columnIndex, option)
                }, {
                  row: vue.withCtx(({ index: optionIndex, option, tabindex }) => [
                    vue.createElementVNode("button", {
                      class: vue.normalizeClass(["aheart-cascader__option", { "is-active": activePath.value[columnIndex] === option.value, "is-selected": isSelected(columnIndex, option), "is-loading": isLoading(columnIndex, option), "is-error": isLoadError(columnIndex, option) }]),
                      type: "button",
                      tabindex,
                      "data-cascader-value": option.value,
                      "data-cascader-token": cascaderKeyToken(option.value),
                      id: optionId(columnIndex, optionIndex, option),
                      "data-cascader-column": columnIndex,
                      disabled: __props.disabled || option.disabled || isLoading(columnIndex, option),
                      "aria-busy": isLoading(columnIndex, option) ? "true" : void 0,
                      "aria-label": isLoadError(columnIndex, option) ? `${option.label}，加载失败，按回车或点击重试` : void 0,
                      onClick: ($event) => handleOption(option, columnIndex),
                      onFocus: ($event) => handleOptionFocus(option, columnIndex),
                      onBlur: handleOptionBlur,
                      onFocusout: handleOptionBlur,
                      onKeydown: ($event) => handleOptionKeydown($event, option, columnIndex, optionIndex)
                    }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(option.label), 1),
                      isLoading(columnIndex, option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 0,
                        name: "loading",
                        size: 16,
                        spin: "",
                        "aria-hidden": "true"
                      })) : isLoadError(columnIndex, option) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_13, "重试")) : isBranch(option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 2,
                        name: "chevron-right",
                        size: 16,
                        "aria-hidden": "true"
                      })) : vue.createCommentVNode("", true)
                    ], 42, _hoisted_12)
                  ]),
                  _: 2
                }, 1032, ["items", "config", "active-index", "pinned-indexes", "enabled", "row-key", "disabled-index"]);
              }), 128)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(columns.value, (column, columnIndex) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: columnIndex,
                  class: "aheart-cascader__column"
                }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(column, (option, optionIndex) => {
                    return vue.openBlock(), vue.createElementBlock("button", {
                      key: cascaderKeyToken(option.value),
                      class: vue.normalizeClass(["aheart-cascader__option", { "is-active": activePath.value[columnIndex] === option.value, "is-selected": isSelected(columnIndex, option), "is-loading": isLoading(columnIndex, option), "is-error": isLoadError(columnIndex, option) }]),
                      type: "button",
                      "data-cascader-value": option.value,
                      "data-cascader-token": cascaderKeyToken(option.value),
                      id: optionId(columnIndex, optionIndex, option),
                      "data-cascader-column": columnIndex,
                      disabled: __props.disabled || option.disabled || isLoading(columnIndex, option),
                      "aria-busy": isLoading(columnIndex, option) ? "true" : void 0,
                      "aria-label": isLoadError(columnIndex, option) ? `${option.label}，加载失败，按回车或点击重试` : void 0,
                      onClick: ($event) => handleOption(option, columnIndex),
                      onFocus: ($event) => handleOptionFocus(option, columnIndex),
                      onBlur: handleOptionBlur,
                      onFocusout: handleOptionBlur,
                      onKeydown: ($event) => handleOptionKeydown($event, option, columnIndex, optionIndex)
                    }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(option.label), 1),
                      isLoading(columnIndex, option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 0,
                        name: "loading",
                        size: 16,
                        spin: "",
                        "aria-hidden": "true"
                      })) : isLoadError(columnIndex, option) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15, "重试")) : isBranch(option) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                        key: 2,
                        name: "chevron-right",
                        size: 16,
                        "aria-hidden": "true"
                      })) : vue.createCommentVNode("", true)
                    ], 42, _hoisted_14);
                  }), 128))
                ]);
              }), 128))
            ], 512))
          ], 14, _hoisted_6)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
