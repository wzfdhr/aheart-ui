import { defineComponent, inject, computed, ref, watch, provide, onBeforeUnmount, renderSlot } from "vue";
import { useStableId } from "../utils/use-stable-id.js";
import { formInternalContextKey } from "./internal-context.js";
import { formListNameContextKey } from "./list-context.js";
import { normalizeNamePath, namePathKey, resolveNamePath, namePathSegments } from "./name-path.js";
import { formListProps } from "./types.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AFormList" },
  __name: "form-list",
  props: formListProps,
  setup(__props) {
    const props = __props;
    const form = inject(formInternalContextKey, void 0);
    const parentList = inject(formListNameContextKey, void 0);
    const instanceId = useStableId(void 0, "aheart-form-list").value;
    const fullName = computed(() => (parentList == null ? void 0 : parentList.resolveName(props.name)) ?? normalizeNamePath(props.name));
    const owner = computed(() => `${(parentList == null ? void 0 : parentList.resolveOwner(props.name)) ?? "form-root"}/list:${instanceId}`);
    const tokens = ref([]);
    let nextToken = 0;
    let previousItems = [];
    let active = false;
    let registeredName;
    let registeredOwner;
    const devWarn = (message) => {
    };
    const newToken = () => `${instanceId}-item-${nextToken++}`;
    const isReferenceValue = (value) => typeof value === "object" && value !== null || typeof value === "function";
    const resetInitialTokens = (items) => {
      tokens.value = items.map(() => newToken());
      previousItems = [...items];
    };
    const reconcileItems = (items) => {
      const oldItems = previousItems;
      const oldTokens = tokens.value;
      if (oldItems.length === items.length && oldItems.every((item, index) => Object.is(item, items[index]))) {
        previousItems = [...items];
        return void 0;
      }
      const oldIndexToNewIndex = /* @__PURE__ */ new Map();
      const nextTokens = Array(items.length);
      const usedOld = /* @__PURE__ */ new Set();
      const claim = (oldIndex, newIndex) => {
        if (usedOld.has(oldIndex) || nextTokens[newIndex] !== void 0)
          return false;
        usedOld.add(oldIndex);
        oldIndexToNewIndex.set(oldIndex, newIndex);
        nextTokens[newIndex] = oldTokens[oldIndex];
        return true;
      };
      items.forEach((item, newIndex) => {
        if (!isReferenceValue(item))
          return;
        const oldIndex = oldItems.findIndex((candidate, index) => !usedOld.has(index) && Object.is(candidate, item));
        if (oldIndex >= 0)
          claim(oldIndex, newIndex);
      });
      if (oldItems.length === items.length) {
        items.forEach((_item, index) => claim(index, index));
      } else {
        let prefix = 0;
        while (prefix < oldItems.length && prefix < items.length && Object.is(oldItems[prefix], items[prefix])) {
          claim(prefix, prefix);
          prefix += 1;
        }
        let oldSuffix = oldItems.length - 1;
        let newSuffix = items.length - 1;
        while (oldSuffix >= prefix && newSuffix >= prefix && Object.is(oldItems[oldSuffix], items[newSuffix])) {
          claim(oldSuffix, newSuffix);
          oldSuffix -= 1;
          newSuffix -= 1;
        }
      }
      tokens.value = nextTokens.map((token) => token ?? newToken());
      previousItems = [...items];
      return { oldIndexToNewIndex };
    };
    const initialized = form == null ? void 0 : form.initializeList(fullName.value, props.initialValue);
    resetInitialTokens(Array.isArray(initialized) ? initialized : []);
    const controller = {
      name: fullName.value,
      owner: owner.value,
      reconcile: reconcileItems,
      reset(items) {
        resetInitialTokens(items);
      }
    };
    watch(
      () => [fullName.value, owner.value],
      ([name, nextOwner]) => {
        if (registeredName !== void 0 && registeredOwner !== void 0) {
          form == null ? void 0 : form.unregisterList(registeredName, registeredOwner);
          form == null ? void 0 : form.unregisterOwnedField(registeredName, `${registeredOwner}/root`);
        }
        controller.name = name;
        controller.owner = nextOwner;
        active = (form == null ? void 0 : form.registerList(controller)) ?? false;
        if (active) {
          form == null ? void 0 : form.registerOwnedField(name, `${nextOwner}/root`, props.rules ?? [], false, {}, { preserve: props.preserve });
          const value = form == null ? void 0 : form.getValue(name);
          if (Array.isArray(value) && previousItems.length === 0 && tokens.value.length === 0)
            resetInitialTokens(value);
        }
        registeredName = typeof name === "string" ? name : [...name];
        registeredOwner = nextOwner;
      },
      { immediate: true }
    );
    watch(
      () => [props.rules, props.preserve],
      ([rules, preserve]) => {
        if (active)
          form == null ? void 0 : form.registerOwnedField(fullName.value, `${owner.value}/root`, rules ?? [], false, {}, { preserve });
      },
      { deep: true }
    );
    let warnedInvalidValue = Symbol("initial-invalid-list-value");
    watch(
      () => form == null ? void 0 : form.getValue(fullName.value),
      (value) => {
        if (value !== void 0 && !Array.isArray(value) && value !== warnedInvalidValue) {
          warnedInvalidValue = value;
          devWarn(`model path ${namePathKey(fullName.value)} must contain an array`);
        }
      },
      { immediate: true }
    );
    const currentItems = computed(() => {
      const value = form == null ? void 0 : form.getValue(fullName.value);
      return Array.isArray(value) ? value : [];
    });
    const fields = computed(() => currentItems.value.map((_item, index) => ({
      key: tokens.value[index] ?? `${instanceId}-pending-${index}`,
      fieldKey: tokens.value[index] ?? `${instanceId}-pending-${index}`,
      name: index
    })));
    const errors = computed(() => (form == null ? void 0 : form.getFieldErrors(fullName.value)) ?? []);
    const validInsertIndex = (value, length) => Number.isInteger(value) && value >= 0 && value <= length;
    const validItemIndex = (value, length) => Number.isInteger(value) && value >= 0 && value < length;
    const add = (defaultValue, insertIndex) => {
      const raw = form == null ? void 0 : form.getValue(fullName.value);
      if (raw !== void 0 && !Array.isArray(raw)) {
        return;
      }
      const length = Array.isArray(raw) ? raw.length : 0;
      const index = insertIndex ?? length;
      if (!validInsertIndex(index, length)) {
        return;
      }
      const oldIndexToNewIndex = /* @__PURE__ */ new Map();
      for (let oldIndex = 0; oldIndex < length; oldIndex += 1)
        oldIndexToNewIndex.set(oldIndex, oldIndex < index ? oldIndex : oldIndex + 1);
      const token = newToken();
      form == null ? void 0 : form.mutateList(fullName.value, owner.value, oldIndexToNewIndex, (items) => {
        items.splice(index, 0, defaultValue);
        tokens.value.splice(index, 0, token);
        previousItems = [...items];
      });
    };
    const remove = (input) => {
      const raw = form == null ? void 0 : form.getValue(fullName.value);
      if (!Array.isArray(raw)) {
        return;
      }
      const requested = Array.isArray(input) ? [...input] : [input];
      const valid = [...new Set(requested.filter((index) => validItemIndex(index, raw.length)))].sort((left, right) => left - right);
      if (valid.length === 0)
        return;
      const removed = new Set(valid);
      const oldIndexToNewIndex = /* @__PURE__ */ new Map();
      let nextIndex = 0;
      for (let oldIndex = 0; oldIndex < raw.length; oldIndex += 1) {
        if (!removed.has(oldIndex))
          oldIndexToNewIndex.set(oldIndex, nextIndex++);
      }
      form == null ? void 0 : form.mutateList(fullName.value, owner.value, oldIndexToNewIndex, (items) => {
        for (const index of [...valid].sort((left, right) => right - left)) {
          items.splice(index, 1);
          tokens.value.splice(index, 1);
        }
        previousItems = [...items];
      });
    };
    const move = (from, to) => {
      const raw = form == null ? void 0 : form.getValue(fullName.value);
      if (!Array.isArray(raw)) {
        return;
      }
      if (!validItemIndex(from, raw.length) || !validItemIndex(to, raw.length)) {
        return;
      }
      if (from === to)
        return;
      const order = Array.from({ length: raw.length }, (_item, index) => index);
      const [movedIndex] = order.splice(from, 1);
      order.splice(to, 0, movedIndex);
      const oldIndexToNewIndex = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]));
      form == null ? void 0 : form.mutateList(fullName.value, owner.value, oldIndexToNewIndex, (items) => {
        const [item] = items.splice(from, 1);
        items.splice(to, 0, item);
        const [token] = tokens.value.splice(from, 1);
        tokens.value.splice(to, 0, token);
        previousItems = [...items];
      });
    };
    provide(formListNameContextKey, {
      prefix: fullName,
      resolveName: (name) => resolveNamePath(fullName.value, name),
      resolveOwner: (name) => {
        const segments = namePathSegments(name);
        const index = segments[0];
        const token = typeof index === "number" ? tokens.value[index] : void 0;
        const tail = typeof index === "number" ? segments.slice(1) : segments;
        return token ? `${owner.value}/item:${token}/field:${JSON.stringify(tail)}` : `${owner.value}/field:${namePathKey(name)}`;
      }
    });
    onBeforeUnmount(() => {
      if (registeredName !== void 0 && registeredOwner !== void 0) {
        form == null ? void 0 : form.unregisterList(registeredName, registeredOwner);
        form == null ? void 0 : form.unregisterOwnedField(registeredName, `${registeredOwner}/root`);
      }
    });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default", {
        fields: fields.value,
        errors: errors.value,
        add,
        remove,
        move
      });
    };
  }
});
export {
  _sfc_main as default
};
