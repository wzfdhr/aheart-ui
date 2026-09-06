"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const controlContext = require("../form/control-context.js");
const useControllableState = require("../utils/use-controllable-state.js");
const usePropPresence = require("../utils/use-prop-presence.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = { class: "aheart-upload__trigger" };
const _hoisted_2 = ["id", "aria-labelledby", "aria-describedby", "aria-invalid", "disabled", "multiple"];
const _hoisted_3 = ["disabled"];
const _hoisted_4 = {
  key: 1,
  class: "aheart-upload__list"
};
const _hoisted_5 = { key: 0 };
const _hoisted_6 = { key: 1 };
const _hoisted_7 = { key: 2 };
const _hoisted_8 = ["disabled", "aria-label", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AUpload", inheritAttrs: false },
  __name: "upload",
  props: {
    fileList: {},
    defaultFileList: { default: () => [] },
    beforeUpload: {},
    customRequest: {},
    maxCount: { default: Infinity },
    disabled: { type: Boolean },
    multiple: { type: Boolean }
  },
  emits: ["update:fileList", "change", "remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const attrs = vue.useAttrs();
    const inputAttribute = (key) => key === "id" || key === "name" || key === "accept" || key === "capture" || key.startsWith("aria-");
    const inputAttrs = vue.computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => inputAttribute(key))));
    const rootAttrs = vue.computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !inputAttribute(key))));
    const formControl = controlContext.useFormControl();
    const rootRef = vue.ref(null);
    const resolvedId = vue.computed(() => attrs.id ?? (formControl == null ? void 0 : formControl.controlId.value));
    const resolvedAriaLabelledby = vue.computed(() => controlContext.mergeAriaIds(attrs["aria-labelledby"], formControl == null ? void 0 : formControl.labelledBy.value));
    const resolvedAriaDescribedby = vue.computed(() => controlContext.mergeAriaIds(attrs["aria-describedby"], formControl == null ? void 0 : formControl.describedBy.value));
    const resolvedAriaInvalid = vue.computed(() => controlContext.formAriaInvalid(attrs["aria-invalid"], formControl == null ? void 0 : formControl.status.value));
    const copy = vue.computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.datePicker) == null ? void 0 : _b.locale) === "en-US" ? { selectFile: "Select file", upload: "Upload", done: "Done", failed: "Failed", removeAction: "Remove", remove: (name) => `Remove ${name}` } : { selectFile: "选择文件", upload: "上传", done: "已完成", failed: "上传失败", removeAction: "移除", remove: (name) => `移除 ${name}` };
    });
    const isFileListControlled = usePropPresence.usePropPresence("fileList", "file-list");
    const fileListState = useControllableState.useControllableState({
      controlled: () => props.fileList,
      isControlled: isFileListControlled,
      defaultValue: () => [...props.defaultFileList],
      onChange: (files) => emit("update:fileList", files ?? [])
    });
    const mergedFileList = vue.computed(() => fileListState.state.value ?? []);
    const readyFiles = vue.computed(() => mergedFileList.value.filter((file) => file.status === "ready"));
    const latestFileList = vue.ref([...props.fileList ?? props.defaultFileList]);
    let uid = 0;
    const activeUploadUids = /* @__PURE__ */ new Set();
    vue.watch(() => props.fileList, (fileList) => {
      if (isFileListControlled.value)
        latestFileList.value = [...fileList ?? []];
    }, { deep: true });
    const updateFileList = (files) => {
      latestFileList.value = files;
      fileListState.setState(files);
      emit("change", files);
      formControl == null ? void 0 : formControl.change();
    };
    const replaceFile = (file) => {
      const nextFiles = latestFileList.value.map((current) => current.uid === file.uid ? file : current);
      updateFileList(nextFiles);
      return nextFiles;
    };
    const toUploadFile = (file) => ({
      uid: `${Date.now()}-${uid += 1}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "ready",
      originFile: file
    });
    const upload = async (file, files) => {
      if (!file.originFile || file.status === "uploading" || activeUploadUids.has(file.uid))
        return files;
      activeUploadUids.add(file.uid);
      let currentFiles = replaceFile({ ...file, status: "uploading", percent: 0 });
      const onProgress = (percent) => {
        if (!activeUploadUids.has(file.uid))
          return;
        currentFiles = replaceFile({ ...file, status: "uploading", percent: Math.max(0, Math.min(100, percent)) });
      };
      const onSuccess = (response) => {
        if (!activeUploadUids.delete(file.uid))
          return;
        currentFiles = replaceFile({ ...file, status: "done", percent: 100, response });
      };
      const onError = (error) => {
        if (!activeUploadUids.delete(file.uid))
          return;
        currentFiles = replaceFile({ ...file, status: "error", error });
      };
      try {
        if (props.customRequest) {
          await props.customRequest({ file, onProgress, onSuccess, onError });
        } else {
          onSuccess();
        }
      } catch (error) {
        onError(error);
      }
      return currentFiles;
    };
    const uploadReadyFiles = async () => {
      let files = latestFileList.value;
      for (const file of files.filter((current) => current.status === "ready")) {
        files = await upload(file, files);
      }
    };
    const handleChange = async (event) => {
      var _a;
      if (props.disabled)
        return;
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";
      let nextFiles = isFileListControlled.value ? [...props.fileList ?? []] : latestFileList.value;
      latestFileList.value = nextFiles;
      for (const rawFile of files) {
        if (nextFiles.length >= props.maxCount)
          break;
        const uploadFile = toUploadFile(rawFile);
        const shouldUpload = await ((_a = props.beforeUpload) == null ? void 0 : _a.call(props, rawFile, [...nextFiles, uploadFile]));
        const currentFiles = isFileListControlled.value ? [...props.fileList ?? []] : latestFileList.value;
        if (currentFiles.length >= props.maxCount)
          continue;
        nextFiles = [...currentFiles, uploadFile];
        updateFileList(nextFiles);
        if (shouldUpload !== false)
          nextFiles = await upload(uploadFile, nextFiles);
      }
    };
    const handleFocusOut = () => {
      void Promise.resolve().then(() => {
        var _a, _b;
        const active = ((_a = rootRef.value) == null ? void 0 : _a.ownerDocument.activeElement) ?? null;
        if (!((_b = rootRef.value) == null ? void 0 : _b.contains(active)))
          formControl == null ? void 0 : formControl.blur();
      });
    };
    const removeFile = (uid2) => {
      const file = mergedFileList.value.find((current) => current.uid === uid2);
      if (!file)
        return;
      activeUploadUids.delete(uid2);
      updateFileList(mergedFileList.value.filter((current) => current.uid !== uid2));
      emit("remove", file);
    };
    return (_ctx, _cache) => {
      var _a;
      return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
        ref_key: "rootRef",
        ref: rootRef
      }, rootAttrs.value, {
        class: ["aheart-upload", { "is-disabled": __props.disabled, "is-error": (_a = vue.unref(formControl)) == null ? void 0 : _a.invalid.value }],
        onFocusout: handleFocusOut
      }), [
        vue.createElementVNode("label", _hoisted_1, [
          vue.createElementVNode("input", vue.mergeProps(inputAttrs.value, {
            id: resolvedId.value,
            type: "file",
            "aria-labelledby": resolvedAriaLabelledby.value,
            "aria-describedby": resolvedAriaDescribedby.value,
            "aria-invalid": resolvedAriaInvalid.value,
            disabled: __props.disabled,
            multiple: __props.multiple,
            onChange: handleChange
          }), null, 16, _hoisted_2),
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(copy.value.selectFile), 1)
          ])
        ]),
        readyFiles.value.length ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "aheart-upload__start",
          type: "button",
          disabled: __props.disabled,
          onClick: uploadReadyFiles
        }, vue.toDisplayString(copy.value.upload), 9, _hoisted_3)) : vue.createCommentVNode("", true),
        mergedFileList.value.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_4, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(mergedFileList.value, (file) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: file.uid,
              class: vue.normalizeClass(["aheart-upload__item", `is-${file.status ?? "ready"}`])
            }, [
              vue.createElementVNode("span", null, vue.toDisplayString(file.name), 1),
              file.status === "uploading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, vue.toDisplayString(file.percent ?? 0) + "%", 1)) : file.status === "done" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, vue.toDisplayString(copy.value.done), 1)) : file.status === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, vue.toDisplayString(copy.value.failed), 1)) : vue.createCommentVNode("", true),
              vue.createElementVNode("button", {
                class: "aheart-upload__remove",
                type: "button",
                disabled: __props.disabled,
                "aria-label": copy.value.remove(file.name),
                onClick: ($event) => removeFile(file.uid)
              }, vue.toDisplayString(copy.value.removeAction), 9, _hoisted_8)
            ], 2);
          }), 128))
        ])) : vue.createCommentVNode("", true)
      ], 16);
    };
  }
});
exports.default = _sfc_main;
