import { defineComponent, useAttrs, computed, ref, watch, onBeforeUnmount, openBlock, createElementBlock, mergeProps, unref, createElementVNode, renderSlot, toDisplayString, createCommentVNode, Fragment, renderList, normalizeClass } from "vue";
import { useFormControl, mergeAriaIds, formAriaInvalid } from "../form/control-context.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import "./style.css.js";
import { useAheartConfig } from "../config/context.js";
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
const _hoisted_8 = { key: 3 };
const _hoisted_9 = ["disabled", "aria-label", "onClick"];
const _hoisted_10 = ["disabled", "aria-label", "onClick"];
const _hoisted_11 = ["disabled", "aria-label", "onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AUpload", inheritAttrs: false },
  __name: "upload",
  props: {
    fileList: {},
    defaultFileList: { default: () => [] },
    beforeUpload: {},
    customRequest: {},
    maxCount: { default: Infinity },
    timeout: { default: 0 },
    disabled: { type: Boolean },
    multiple: { type: Boolean }
  },
  emits: ["update:fileList", "change", "remove", "cancel", "retry"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const attrs = useAttrs();
    const inputAttribute = (key) => key === "id" || key === "name" || key === "accept" || key === "capture" || key.startsWith("aria-");
    const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => inputAttribute(key))));
    const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !inputAttribute(key))));
    const formControl = useFormControl();
    const rootRef = ref(null);
    const resolvedId = computed(() => attrs.id ?? (formControl == null ? void 0 : formControl.controlId.value));
    const resolvedAriaLabelledby = computed(() => mergeAriaIds(attrs["aria-labelledby"], formControl == null ? void 0 : formControl.labelledBy.value));
    const resolvedAriaDescribedby = computed(() => mergeAriaIds(attrs["aria-describedby"], formControl == null ? void 0 : formControl.describedBy.value));
    const resolvedAriaInvalid = computed(() => formAriaInvalid(attrs["aria-invalid"], formControl == null ? void 0 : formControl.status.value));
    const defaultUploadCopy = {
      selectFile: "选择文件",
      upload: "上传",
      done: "已完成",
      failed: "上传失败",
      cancelled: "已取消",
      validationFailed: "校验失败",
      timeout: "上传超时",
      removeAction: "移除",
      cancelAction: "取消",
      retryAction: "重试",
      remove: (name) => `移除 ${name}`,
      cancel: (name) => `取消上传 ${name}`,
      retry: (name) => `重试 ${name}`
    };
    const copy = computed(() => {
      var _a;
      return { ...defaultUploadCopy, ...(_a = config.value.locale) == null ? void 0 : _a.upload };
    });
    const failureCopy = (file) => file.failureReason === "validation" ? copy.value.validationFailed : file.failureReason === "timeout" ? copy.value.timeout : copy.value.failed;
    const isFileListControlled = usePropPresence("fileList", "file-list");
    const fileListState = useControllableState({
      controlled: () => props.fileList,
      isControlled: isFileListControlled,
      defaultValue: () => [...props.defaultFileList],
      onChange: (files) => emit("update:fileList", files ?? [])
    });
    const mergedFileList = computed(() => fileListState.state.value ?? []);
    const readyFiles = computed(() => mergedFileList.value.filter((file) => file.status === "ready"));
    const latestFileList = ref([...props.fileList ?? props.defaultFileList]);
    let uid = 0;
    let taskSequence = 0;
    const activeTasks = /* @__PURE__ */ new Map();
    const ownerWindow = () => {
      var _a;
      return (_a = rootRef.value) == null ? void 0 : _a.ownerDocument.defaultView;
    };
    const callAbortHandle = (task) => {
      if (task.abortHandleCalled || !task.abortHandle)
        return;
      task.abortHandleCalled = true;
      try {
        task.abortHandle();
      } catch {
      }
    };
    const clearTaskTimer = (task) => {
      var _a;
      if (task.timeoutId !== void 0)
        (_a = ownerWindow()) == null ? void 0 : _a.clearTimeout(task.timeoutId);
      task.timeoutId = void 0;
    };
    const isCurrentTask = (task) => {
      var _a;
      return ((_a = activeTasks.get(task.uid)) == null ? void 0 : _a.id) === task.id && !task.controller.signal.aborted;
    };
    const finishTask = (task, abort = false) => {
      var _a;
      if (((_a = activeTasks.get(task.uid)) == null ? void 0 : _a.id) !== task.id)
        return false;
      activeTasks.delete(task.uid);
      clearTaskTimer(task);
      if (abort && !task.controller.signal.aborted)
        task.controller.abort();
      if (abort)
        callAbortHandle(task);
      return true;
    };
    const abortTask = (uid2) => {
      const task = activeTasks.get(uid2);
      if (task)
        finishTask(task, true);
    };
    const abortAllTasks = () => Array.from(activeTasks.keys()).forEach(abortTask);
    watch(() => props.fileList, (fileList) => {
      if (!isFileListControlled.value)
        return;
      const nextFiles = [...fileList ?? []];
      activeTasks.forEach((task, taskUid) => {
        const next = nextFiles.find((file) => file.uid === taskUid);
        if (!next || next.originFile !== task.originFile || next.status !== "uploading")
          abortTask(taskUid);
      });
      latestFileList.value = nextFiles;
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
    const updateFile = (file, patch) => {
      const current = latestFileList.value.find((candidate) => candidate.uid === file.uid) ?? file;
      return replaceFile({ ...current, ...patch });
    };
    const toUploadFile = (file) => ({
      uid: `${Date.now()}-${uid += 1}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "ready",
      originFile: file
    });
    const upload = (file, files = latestFileList.value) => {
      var _a, _b;
      if (!file.originFile || file.status === "uploading" || activeTasks.has(file.uid))
        return files;
      const AbortControllerConstructor = ((_a = ownerWindow()) == null ? void 0 : _a.AbortController) ?? AbortController;
      const task = {
        id: `${file.name}-${Date.now()}-${taskSequence += 1}`,
        uid: file.uid,
        originFile: file.originFile,
        controller: new AbortControllerConstructor(),
        abortHandleCalled: false
      };
      activeTasks.set(file.uid, task);
      let currentFiles = updateFile(file, { status: "uploading", percent: 0, response: void 0, error: void 0, failureReason: void 0 });
      const onProgress = (percent) => {
        if (!isCurrentTask(task))
          return;
        currentFiles = updateFile(file, { status: "uploading", percent: Math.max(0, Math.min(100, percent)), response: void 0, error: void 0, failureReason: void 0 });
      };
      const onSuccess = (response) => {
        if (!isCurrentTask(task) || !finishTask(task))
          return;
        currentFiles = updateFile(file, { status: "done", percent: 100, response, error: void 0, failureReason: void 0 });
      };
      const onError = (error, failureReason = "request") => {
        if (!isCurrentTask(task) || !finishTask(task, failureReason === "timeout"))
          return;
        currentFiles = updateFile(file, { status: "error", error, failureReason });
      };
      const onCancel = () => {
        if (!isCurrentTask(task) || !finishTask(task))
          return;
        const cancelled = { ...file, status: "cancelled", percent: void 0, error: void 0, failureReason: "cancelled" };
        currentFiles = replaceFile(cancelled);
        emit("cancel", cancelled);
      };
      try {
        if (props.customRequest) {
          const result = props.customRequest({ file, signal: task.controller.signal, taskId: task.id, onProgress, onSuccess, onError, onCancel });
          void Promise.resolve(result).then((handle) => {
            if (handle && typeof handle.abort === "function") {
              task.abortHandle = handle.abort;
              if (task.controller.signal.aborted)
                callAbortHandle(task);
            }
          }, onError);
        } else {
          onSuccess();
        }
      } catch (error) {
        onError(error);
      }
      const timeout = Number.isFinite(props.timeout) ? Math.max(0, props.timeout) : 0;
      if (timeout > 0 && isCurrentTask(task)) {
        task.timeoutId = (_b = ownerWindow()) == null ? void 0 : _b.setTimeout(() => {
          const error = Object.assign(new Error(copy.value.timeout), { name: "UploadTimeoutError" });
          onError(error, "timeout");
        }, timeout);
      }
      return currentFiles;
    };
    const uploadReadyFiles = () => {
      let files = latestFileList.value;
      for (const file of files.filter((current) => current.status === "ready")) {
        files = upload(file, files);
      }
    };
    const validateAndUpload = async (uploadFile, currentFiles, addWhenMissing) => {
      var _a;
      let shouldUpload;
      try {
        shouldUpload = await ((_a = props.beforeUpload) == null ? void 0 : _a.call(props, uploadFile.originFile, addWhenMissing ? [...currentFiles, uploadFile] : [...currentFiles]));
      } catch (error) {
        const failed = { ...uploadFile, status: "error", error, failureReason: "validation" };
        if (addWhenMissing)
          updateFileList([...currentFiles, failed]);
        else
          replaceFile(failed);
        return latestFileList.value;
      }
      const latest = isFileListControlled.value ? [...props.fileList ?? []] : latestFileList.value;
      if (addWhenMissing) {
        if (latest.length >= props.maxCount)
          return latest;
        updateFileList([...latest, uploadFile]);
      } else {
        updateFile(uploadFile, { status: "ready", error: void 0, response: void 0, percent: void 0, failureReason: void 0 });
      }
      if (shouldUpload === false)
        return latestFileList.value;
      return upload({ ...uploadFile, status: "ready", error: void 0, response: void 0, percent: void 0, failureReason: void 0 }, latestFileList.value);
    };
    const handleChange = async (event) => {
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
        const currentFiles = isFileListControlled.value ? [...props.fileList ?? []] : latestFileList.value;
        if (currentFiles.length >= props.maxCount)
          continue;
        if (!props.beforeUpload) {
          updateFileList([...currentFiles, uploadFile]);
          nextFiles = upload(uploadFile, latestFileList.value);
          continue;
        }
        nextFiles = await validateAndUpload(uploadFile, currentFiles, true);
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
      abortTask(uid2);
      updateFileList(mergedFileList.value.filter((current) => current.uid !== uid2));
      emit("remove", file);
    };
    const cancelFile = (file) => {
      if (props.disabled || file.status !== "uploading")
        return;
      abortTask(file.uid);
      const cancelled = { ...file, status: "cancelled", percent: void 0, error: void 0, failureReason: "cancelled" };
      replaceFile(cancelled);
      emit("cancel", cancelled);
    };
    const retryFile = async (file) => {
      if (props.disabled || file.status !== "error" && file.status !== "cancelled" || !file.originFile)
        return;
      abortTask(file.uid);
      emit("retry", file);
      await validateAndUpload({ ...file, status: "ready", error: void 0, response: void 0, percent: void 0, failureReason: void 0 }, latestFileList.value, false);
    };
    onBeforeUnmount(abortAllTasks);
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock("div", mergeProps({
        ref_key: "rootRef",
        ref: rootRef
      }, rootAttrs.value, {
        class: ["aheart-upload", { "is-disabled": __props.disabled, "is-error": (_a = unref(formControl)) == null ? void 0 : _a.invalid.value }],
        onFocusout: handleFocusOut
      }), [
        createElementVNode("label", _hoisted_1, [
          createElementVNode("input", mergeProps(inputAttrs.value, {
            id: resolvedId.value,
            type: "file",
            "aria-labelledby": resolvedAriaLabelledby.value,
            "aria-describedby": resolvedAriaDescribedby.value,
            "aria-invalid": resolvedAriaInvalid.value,
            disabled: __props.disabled,
            multiple: __props.multiple,
            onChange: handleChange
          }), null, 16, _hoisted_2),
          renderSlot(_ctx.$slots, "default", {}, () => [
            createElementVNode("span", null, toDisplayString(copy.value.selectFile), 1)
          ])
        ]),
        readyFiles.value.length ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "aheart-upload__start",
          type: "button",
          disabled: __props.disabled,
          onClick: uploadReadyFiles
        }, toDisplayString(copy.value.upload), 9, _hoisted_3)) : createCommentVNode("", true),
        mergedFileList.value.length ? (openBlock(), createElementBlock("ul", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(mergedFileList.value, (file) => {
            return openBlock(), createElementBlock("li", {
              key: file.uid,
              class: normalizeClass(["aheart-upload__item", `is-${file.status ?? "ready"}`])
            }, [
              createElementVNode("span", null, toDisplayString(file.name), 1),
              file.status === "uploading" ? (openBlock(), createElementBlock("span", _hoisted_5, toDisplayString(file.percent ?? 0) + "%", 1)) : file.status === "done" ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(copy.value.done), 1)) : file.status === "error" ? (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(failureCopy(file)), 1)) : file.status === "cancelled" ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(copy.value.cancelled), 1)) : createCommentVNode("", true),
              file.status === "uploading" ? (openBlock(), createElementBlock("button", {
                key: 4,
                "data-upload-cancel": "",
                class: "aheart-upload__cancel",
                type: "button",
                disabled: __props.disabled,
                "aria-label": copy.value.cancel(file.name),
                onClick: ($event) => cancelFile(file)
              }, toDisplayString(copy.value.cancelAction), 9, _hoisted_9)) : createCommentVNode("", true),
              file.status === "error" || file.status === "cancelled" ? (openBlock(), createElementBlock("button", {
                key: 5,
                "data-upload-retry": "",
                class: "aheart-upload__retry",
                type: "button",
                disabled: __props.disabled,
                "aria-label": copy.value.retry(file.name),
                onClick: ($event) => retryFile(file)
              }, toDisplayString(copy.value.retryAction), 9, _hoisted_10)) : createCommentVNode("", true),
              createElementVNode("button", {
                class: "aheart-upload__remove",
                type: "button",
                disabled: __props.disabled,
                "aria-label": copy.value.remove(file.name),
                onClick: ($event) => removeFile(file.uid)
              }, toDisplayString(copy.value.removeAction), 9, _hoisted_11)
            ], 2);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 16);
    };
  }
});
export {
  _sfc_main as default
};
