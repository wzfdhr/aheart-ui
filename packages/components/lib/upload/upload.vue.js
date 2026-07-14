"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-upload__trigger" };
const _hoisted_2 = ["disabled", "multiple"];
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
  ...{ name: "AUpload" },
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
    const internalFileList = vue.ref([...props.defaultFileList]);
    const mergedFileList = vue.computed(() => props.fileList ?? internalFileList.value);
    const readyFiles = vue.computed(() => mergedFileList.value.filter((file) => file.status === "ready"));
    const latestFileList = vue.ref([...props.fileList ?? props.defaultFileList]);
    let uid = 0;
    const activeUploadUids = /* @__PURE__ */ new Set();
    vue.watch(() => props.fileList, (fileList) => {
      if (fileList !== void 0)
        latestFileList.value = [...fileList];
    }, { deep: true });
    const updateFileList = (files) => {
      latestFileList.value = files;
      if (props.fileList === void 0)
        internalFileList.value = files;
      emit("update:fileList", files);
      emit("change", files);
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
      const files = Array.from(event.target.files ?? []);
      const remaining = Math.max(0, props.maxCount - latestFileList.value.length);
      let nextFiles = latestFileList.value;
      for (const rawFile of files.slice(0, remaining)) {
        const uploadFile = toUploadFile(rawFile);
        const shouldUpload = await ((_a = props.beforeUpload) == null ? void 0 : _a.call(props, rawFile, [...nextFiles, uploadFile]));
        nextFiles = [...nextFiles, uploadFile];
        updateFileList(nextFiles);
        if (shouldUpload !== false)
          nextFiles = await upload(uploadFile, nextFiles);
      }
      event.target.value = "";
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
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-upload", { "is-disabled": __props.disabled }])
      }, [
        vue.createElementVNode("label", _hoisted_1, [
          vue.createElementVNode("input", {
            type: "file",
            disabled: __props.disabled,
            multiple: __props.multiple,
            onChange: handleChange
          }, null, 40, _hoisted_2),
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            _cache[0] || (_cache[0] = vue.createElementVNode("span", null, "Select file", -1))
          ])
        ]),
        readyFiles.value.length ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "aheart-upload__start",
          type: "button",
          disabled: __props.disabled,
          onClick: uploadReadyFiles
        }, "Upload", 8, _hoisted_3)) : vue.createCommentVNode("", true),
        mergedFileList.value.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_4, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(mergedFileList.value, (file) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: file.uid,
              class: vue.normalizeClass(["aheart-upload__item", `is-${file.status ?? "ready"}`])
            }, [
              vue.createElementVNode("span", null, vue.toDisplayString(file.name), 1),
              file.status === "uploading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, vue.toDisplayString(file.percent ?? 0) + "%", 1)) : file.status === "done" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, "Done")) : file.status === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, "Failed")) : vue.createCommentVNode("", true),
              vue.createElementVNode("button", {
                class: "aheart-upload__remove",
                type: "button",
                disabled: __props.disabled,
                "aria-label": `Remove ${file.name}`,
                onClick: ($event) => removeFile(file.uid)
              }, "Remove", 8, _hoisted_8)
            ], 2);
          }), 128))
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
