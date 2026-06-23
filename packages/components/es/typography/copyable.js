import { defineComponent, ref, computed } from "vue";
const getCopyableConfig = (copyable) => {
  if (!copyable) {
    return void 0;
  }
  return typeof copyable === "object" ? copyable : {};
};
const toText = (value) => {
  if (value === void 0 || value === null || value === false) {
    return void 0;
  }
  return typeof value === "string" || typeof value === "number" ? String(value) : void 0;
};
const TypographyRenderNode = defineComponent({
  name: "ATypographyRenderNode",
  props: {
    node: {
      type: null,
      default: void 0
    }
  },
  setup(props) {
    return () => props.node;
  }
});
const useTypographyCopyable = (copyable, contentRef, disabled) => {
  const copied = ref(false);
  const copyableConfig = computed(() => getCopyableConfig(copyable.value));
  const isCopyable = computed(() => Boolean(copyableConfig.value));
  const copyTabIndex = computed(() => {
    var _a;
    return ((_a = copyableConfig.value) == null ? void 0 : _a.tabIndex) ?? 0;
  });
  const copyIcon = computed(() => {
    var _a;
    const icon = (_a = copyableConfig.value) == null ? void 0 : _a.icon;
    if (Array.isArray(icon)) {
      return copied.value ? icon[1] : icon[0];
    }
    return icon ?? (copied.value ? "copied" : "copy");
  });
  const copyTitle = computed(() => {
    var _a;
    const tooltips = (_a = copyableConfig.value) == null ? void 0 : _a.tooltips;
    if (tooltips === false) {
      return void 0;
    }
    const title = Array.isArray(tooltips) ? copied.value ? tooltips[1] : tooltips[0] : copied.value ? "Copied" : "Copy";
    return toText(title);
  });
  const resolveCopyText = async () => {
    var _a, _b;
    const text = (_a = copyableConfig.value) == null ? void 0 : _a.text;
    if (typeof text === "function") {
      return text();
    }
    return text ?? ((_b = contentRef.value) == null ? void 0 : _b.textContent) ?? "";
  };
  const writeClipboardText = async (text) => {
    var _a, _b, _c, _d;
    if (((_a = copyableConfig.value) == null ? void 0 : _a.format) === "text/html" && ((_b = navigator.clipboard) == null ? void 0 : _b.write) && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([text], { type: "text/html" })
        })
      ]);
      return;
    }
    await ((_d = (_c = navigator.clipboard) == null ? void 0 : _c.writeText) == null ? void 0 : _d.call(_c, text));
  };
  const handleCopy = async (event) => {
    var _a, _b;
    event.preventDefault();
    event.stopPropagation();
    if (!isCopyable.value || disabled.value) {
      return;
    }
    const text = await resolveCopyText();
    await writeClipboardText(text);
    copied.value = true;
    (_b = (_a = copyableConfig.value) == null ? void 0 : _a.onCopy) == null ? void 0 : _b.call(_a, event);
  };
  return {
    copied,
    isCopyable,
    copyIcon,
    copyTitle,
    copyTabIndex,
    handleCopy
  };
};
export {
  TypographyRenderNode,
  useTypographyCopyable
};
