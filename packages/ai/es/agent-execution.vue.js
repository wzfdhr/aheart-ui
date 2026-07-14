import { defineComponent, computed, openBlock, createElementBlock, createElementVNode, createVNode, unref, withCtx, renderSlot, normalizeClass, toDisplayString, createCommentVNode, createBlock, createTextVNode, Fragment, renderList } from "vue";
import { Button } from "aheart-ui";
import { SortableList } from "@aheart-ui/dnd";
import { getSafeUrl } from "./safe-markdown.js";
const _hoisted_1 = { class: "aheart-ai-workbench__execution-content" };
const _hoisted_2 = { class: "aheart-ai-workbench__tasks" };
const _hoisted_3 = ["data-task-id"];
const _hoisted_4 = { class: "aheart-ai-workbench__task-summary" };
const _hoisted_5 = {
  key: 0,
  class: "aheart-ai-workbench__task-error"
};
const _hoisted_6 = { class: "aheart-ai-workbench__task-actions" };
const _hoisted_7 = ["data-approval-id"];
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { class: "aheart-ai-workbench__artifacts" };
const _hoisted_10 = ["href"];
const _hoisted_11 = { key: 1 };
const _hoisted_12 = { key: 2 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AIAgentWorkbenchExecution" },
  __name: "agent-execution",
  props: {
    tasks: { default: () => [] },
    artifacts: { default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:tasks", "approve", "reject", "cancel", "retry", "move-task"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const sortableTasks = computed(() => props.tasks);
    const asTask = (item) => item;
    const updateTasks = (tasks) => {
      if (!props.disabled) emit("update:tasks", tasks);
    };
    const moveTask = (index, offset) => {
      if (props.disabled || index + offset < 0 || index + offset >= props.tasks.length) return;
      const next = [...props.tasks];
      const [task] = next.splice(index, 1);
      next.splice(index + offset, 0, task);
      emit("update:tasks", next);
      emit("move-task", task.id, offset < 0 ? "up" : "down");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("section", _hoisted_2, [
          _cache[6] || (_cache[6] = createElementVNode("h2", null, "执行任务", -1)),
          createVNode(unref(SortableList), {
            items: sortableTasks.value,
            "item-key": "id",
            group: "agent-tasks",
            disabled: __props.disabled,
            "onUpdate:items": updateTasks
          }, {
            item: withCtx(({ item, index }) => [
              renderSlot(_ctx.$slots, "task", {
                task: asTask(item),
                index
              }, () => {
                var _a, _b, _c, _d, _e, _f;
                return [
                  createElementVNode("div", {
                    "data-task-id": asTask(item).id,
                    class: normalizeClass(`is-${asTask(item).status}`)
                  }, [
                    createElementVNode("div", _hoisted_4, [
                      createElementVNode("strong", null, toDisplayString(asTask(item).label), 1),
                      createElementVNode("small", null, toDisplayString(asTask(item).detail ?? asTask(item).status), 1)
                    ]),
                    asTask(item).error ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString(asTask(item).error), 1)) : createCommentVNode("", true),
                    createElementVNode("div", _hoisted_6, [
                      asTask(item).status === "running" ? (openBlock(), createBlock(unref(Button), {
                        key: 0,
                        type: "text",
                        disabled: __props.disabled,
                        onClick: ($event) => emit("cancel", asTask(item))
                      }, {
                        default: withCtx(() => [..._cache[0] || (_cache[0] = [
                          createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])) : createCommentVNode("", true),
                      asTask(item).status === "error" ? (openBlock(), createBlock(unref(Button), {
                        key: 1,
                        type: "text",
                        disabled: __props.disabled,
                        onClick: ($event) => emit("retry", asTask(item))
                      }, {
                        default: withCtx(() => [..._cache[1] || (_cache[1] = [
                          createTextVNode("重试", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])) : createCommentVNode("", true),
                      createVNode(unref(Button), {
                        "data-action": "move-up",
                        type: "text",
                        disabled: __props.disabled || index === 0,
                        onClick: ($event) => moveTask(index, -1)
                      }, {
                        default: withCtx(() => [..._cache[2] || (_cache[2] = [
                          createTextVNode("上移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(unref(Button), {
                        "data-action": "move-down",
                        type: "text",
                        disabled: __props.disabled || index === __props.tasks.length - 1,
                        onClick: ($event) => moveTask(index, 1)
                      }, {
                        default: withCtx(() => [..._cache[3] || (_cache[3] = [
                          createTextVNode("下移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])
                    ]),
                    asTask(item).approval && ((_a = asTask(item).approval) == null ? void 0 : _a.status) !== "approved" && ((_b = asTask(item).approval) == null ? void 0 : _b.status) !== "rejected" ? (openBlock(), createElementBlock("div", {
                      key: 1,
                      "data-approval-id": (_c = asTask(item).approval) == null ? void 0 : _c.id,
                      class: "aheart-ai-workbench__approval"
                    }, [
                      createElementVNode("strong", null, toDisplayString((_d = asTask(item).approval) == null ? void 0 : _d.title), 1),
                      ((_e = asTask(item).approval) == null ? void 0 : _e.description) ? (openBlock(), createElementBlock("p", _hoisted_8, toDisplayString((_f = asTask(item).approval) == null ? void 0 : _f.description), 1)) : createCommentVNode("", true),
                      createVNode(unref(Button), {
                        "data-action": "approve",
                        type: "primary",
                        disabled: __props.disabled,
                        onClick: ($event) => emit("approve", asTask(item))
                      }, {
                        default: withCtx(() => [..._cache[4] || (_cache[4] = [
                          createTextVNode("批准", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(unref(Button), {
                        "data-action": "reject",
                        danger: "",
                        disabled: __props.disabled,
                        onClick: ($event) => emit("reject", asTask(item))
                      }, {
                        default: withCtx(() => [..._cache[5] || (_cache[5] = [
                          createTextVNode("拒绝", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])
                    ], 8, _hoisted_7)) : createCommentVNode("", true)
                  ], 10, _hoisted_3)
                ];
              })
            ]),
            _: 3
          }, 8, ["items", "disabled"])
        ]),
        createElementVNode("section", _hoisted_9, [
          _cache[7] || (_cache[7] = createElementVNode("h2", null, "产物", -1)),
          createElementVNode("ul", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.artifacts, (artifact) => {
              return openBlock(), createElementBlock("li", {
                key: artifact.id
              }, [
                renderSlot(_ctx.$slots, "artifact", { artifact }, () => [
                  unref(getSafeUrl)(artifact.url) ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: unref(getSafeUrl)(artifact.url),
                    target: "_blank",
                    rel: "noreferrer"
                  }, toDisplayString(artifact.title), 9, _hoisted_10)) : (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(artifact.title), 1)),
                  artifact.description ? (openBlock(), createElementBlock("small", _hoisted_12, toDisplayString(artifact.description), 1)) : createCommentVNode("", true)
                ])
              ]);
            }), 128))
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
