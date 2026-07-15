"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const aheartUi = require("aheart-ui");
const dnd = require("@aheart-ui/dnd");
const safeMarkdown = require("./safe-markdown.js");
const _hoisted_1 = { class: "aheart-ai-workbench__execution-content" };
const _hoisted_2 = {
  class: "aheart-ai-workbench__tasks",
  "aria-labelledby": "agent-tasks-title"
};
const _hoisted_3 = { class: "aheart-ai-workbench__section-heading" };
const _hoisted_4 = { class: "aheart-ai-workbench__timeline" };
const _hoisted_5 = ["data-task-id"];
const _hoisted_6 = { class: "aheart-ai-workbench__task-body" };
const _hoisted_7 = { class: "aheart-ai-workbench__task-summary" };
const _hoisted_8 = {
  key: 0,
  class: "aheart-ai-workbench__tool-name"
};
const _hoisted_9 = { class: "aheart-ai-workbench__task-status" };
const _hoisted_10 = {
  key: 0,
  class: "aheart-ai-workbench__task-detail"
};
const _hoisted_11 = {
  key: 1,
  class: "aheart-ai-workbench__task-progress"
};
const _hoisted_12 = ["aria-valuenow"];
const _hoisted_13 = {
  key: 2,
  class: "aheart-ai-workbench__task-time"
};
const _hoisted_14 = { key: 0 };
const _hoisted_15 = { key: 1 };
const _hoisted_16 = {
  key: 3,
  class: "aheart-ai-workbench__task-error"
};
const _hoisted_17 = { class: "aheart-ai-workbench__task-actions" };
const _hoisted_18 = ["data-approval-id"];
const _hoisted_19 = { key: 0 };
const _hoisted_20 = {
  key: 1,
  class: "aheart-ai-workbench__approval-result"
};
const _hoisted_21 = {
  key: 0,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_22 = {
  class: "aheart-ai-workbench__artifacts",
  "aria-labelledby": "agent-artifacts-title"
};
const _hoisted_23 = { class: "aheart-ai-workbench__section-heading" };
const _hoisted_24 = {
  key: 0,
  class: "aheart-ai-workbench__artifact-list"
};
const _hoisted_25 = ["data-artifact-id"];
const _hoisted_26 = ["aria-pressed", "onClick"];
const _hoisted_27 = { key: 0 };
const _hoisted_28 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_29 = {
  key: 2,
  class: "aheart-ai-workbench__artifact-preview",
  "aria-label": "产物预览"
};
const _hoisted_30 = { class: "aheart-ai-workbench__artifact-preview-header" };
const _hoisted_31 = ["href"];
const _hoisted_32 = { key: 0 };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AIAgentWorkbenchExecution" },
  __name: "agent-execution",
  props: {
    tasks: { default: () => [] },
    artifacts: { default: () => [] },
    activeArtifact: { default: void 0 },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:tasks", "approve", "reject", "cancel", "retry", "move-task", "select-artifact"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const statusLabels = {
      pending: "等待执行",
      running: "执行中",
      "waiting-approval": "等待审批",
      complete: "已完成",
      error: "执行失败",
      cancelled: "已取消"
    };
    const sortableTasks = vue.computed(() => props.tasks);
    const selectedArtifact = vue.computed(
      () => props.artifacts.find((artifact) => artifact.id === props.activeArtifact) ?? props.artifacts[0]
    );
    const asTask = (item) => item;
    const statusLabel = (status) => statusLabels[status];
    const normalizedProgress = (progress) => Math.min(100, Math.max(0, Math.round(progress ?? 0)));
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
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        vue.createElementVNode("section", _hoisted_2, [
          vue.createElementVNode("div", _hoisted_3, [
            _cache[0] || (_cache[0] = vue.createElementVNode("div", null, [
              vue.createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "执行流程"),
              vue.createElementVNode("h2", { id: "agent-tasks-title" }, "执行时间线")
            ], -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(__props.tasks.length) + " 项", 1)
          ]),
          vue.createElementVNode("div", _hoisted_4, [
            vue.createVNode(vue.unref(dnd.SortableList), {
              items: sortableTasks.value,
              "item-key": "id",
              group: "agent-tasks",
              disabled: __props.disabled,
              "onUpdate:items": updateTasks
            }, {
              item: vue.withCtx(({ item, index }) => [
                vue.renderSlot(_ctx.$slots, "task", {
                  task: asTask(item),
                  index
                }, () => {
                  var _a, _b, _c, _d, _e, _f, _g, _h;
                  return [
                    vue.createElementVNode("article", {
                      "data-task-id": asTask(item).id,
                      class: vue.normalizeClass(["aheart-ai-workbench__timeline-item", `is-${asTask(item).status}`])
                    }, [
                      _cache[8] || (_cache[8] = vue.createElementVNode("span", {
                        class: "aheart-ai-workbench__timeline-marker",
                        "aria-hidden": "true"
                      }, null, -1)),
                      vue.createElementVNode("div", _hoisted_6, [
                        vue.createElementVNode("header", _hoisted_7, [
                          vue.createElementVNode("div", null, [
                            vue.createElementVNode("strong", null, vue.toDisplayString(asTask(item).label), 1),
                            asTask(item).toolName ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8, vue.toDisplayString(asTask(item).toolName), 1)) : vue.createCommentVNode("", true)
                          ]),
                          vue.createElementVNode("span", _hoisted_9, vue.toDisplayString(statusLabel(asTask(item).status)), 1)
                        ]),
                        asTask(item).detail ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_10, vue.toDisplayString(asTask(item).detail), 1)) : vue.createCommentVNode("", true),
                        asTask(item).progress !== void 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
                          vue.createElementVNode("div", {
                            role: "progressbar",
                            "aria-label": "任务进度",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            "aria-valuenow": normalizedProgress(asTask(item).progress)
                          }, [
                            vue.createElementVNode("span", {
                              style: vue.normalizeStyle({ inlineSize: `${normalizedProgress(asTask(item).progress)}%` })
                            }, null, 4)
                          ], 8, _hoisted_12),
                          vue.createElementVNode("small", null, vue.toDisplayString(normalizedProgress(asTask(item).progress)) + "%", 1)
                        ])) : vue.createCommentVNode("", true),
                        asTask(item).startedAt || asTask(item).completedAt ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
                          asTask(item).startedAt ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_14, "开始 " + vue.toDisplayString(asTask(item).startedAt), 1)) : vue.createCommentVNode("", true),
                          asTask(item).completedAt ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15, "完成 " + vue.toDisplayString(asTask(item).completedAt), 1)) : vue.createCommentVNode("", true)
                        ])) : vue.createCommentVNode("", true),
                        asTask(item).error ? (vue.openBlock(), vue.createElementBlock("details", _hoisted_16, [
                          _cache[1] || (_cache[1] = vue.createElementVNode("summary", null, "查看错误详情", -1)),
                          vue.createElementVNode("p", null, vue.toDisplayString(asTask(item).error), 1)
                        ])) : vue.createCommentVNode("", true),
                        vue.createElementVNode("div", _hoisted_17, [
                          asTask(item).status === "running" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Button), {
                            key: 0,
                            "data-action": "cancel",
                            type: "text",
                            disabled: __props.disabled,
                            onClick: ($event) => emit("cancel", asTask(item))
                          }, {
                            default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [
                              vue.createTextVNode("取消", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])) : vue.createCommentVNode("", true),
                          asTask(item).status === "error" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Button), {
                            key: 1,
                            "data-action": "retry",
                            type: "text",
                            disabled: __props.disabled,
                            onClick: ($event) => emit("retry", asTask(item))
                          }, {
                            default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [
                              vue.createTextVNode("重试", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])) : vue.createCommentVNode("", true),
                          vue.createVNode(vue.unref(aheartUi.Button), {
                            "data-action": "move-up",
                            type: "text",
                            disabled: __props.disabled || index === 0,
                            onClick: ($event) => moveTask(index, -1)
                          }, {
                            default: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
                              vue.createTextVNode("上移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"]),
                          vue.createVNode(vue.unref(aheartUi.Button), {
                            "data-action": "move-down",
                            type: "text",
                            disabled: __props.disabled || index === __props.tasks.length - 1,
                            onClick: ($event) => moveTask(index, 1)
                          }, {
                            default: vue.withCtx(() => [..._cache[5] || (_cache[5] = [
                              vue.createTextVNode("下移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])
                        ]),
                        asTask(item).approval ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 4,
                          "data-approval-id": (_a = asTask(item).approval) == null ? void 0 : _a.id,
                          class: vue.normalizeClass(["aheart-ai-workbench__approval", `is-${((_b = asTask(item).approval) == null ? void 0 : _b.status) ?? "pending"}`])
                        }, [
                          vue.createElementVNode("div", null, [
                            vue.createElementVNode("strong", null, vue.toDisplayString((_c = asTask(item).approval) == null ? void 0 : _c.title), 1),
                            ((_d = asTask(item).approval) == null ? void 0 : _d.description) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_19, vue.toDisplayString((_e = asTask(item).approval) == null ? void 0 : _e.description), 1)) : vue.createCommentVNode("", true)
                          ]),
                          !((_f = asTask(item).approval) == null ? void 0 : _f.status) || ((_g = asTask(item).approval) == null ? void 0 : _g.status) === "pending" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                            vue.createVNode(vue.unref(aheartUi.Button), {
                              "data-action": "approve",
                              type: "primary",
                              disabled: __props.disabled,
                              onClick: ($event) => emit("approve", asTask(item))
                            }, {
                              default: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
                                vue.createTextVNode("批准", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"]),
                            vue.createVNode(vue.unref(aheartUi.Button), {
                              "data-action": "reject",
                              danger: "",
                              disabled: __props.disabled,
                              onClick: ($event) => emit("reject", asTask(item))
                            }, {
                              default: vue.withCtx(() => [..._cache[7] || (_cache[7] = [
                                vue.createTextVNode("拒绝", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ], 64)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_20, vue.toDisplayString(((_h = asTask(item).approval) == null ? void 0 : _h.status) === "approved" ? "已批准" : "已拒绝"), 1))
                        ], 10, _hoisted_18)) : vue.createCommentVNode("", true)
                      ])
                    ], 10, _hoisted_5)
                  ];
                })
              ]),
              _: 3
            }, 8, ["items", "disabled"])
          ]),
          !__props.tasks.length ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_21, "尚无执行任务。")) : vue.createCommentVNode("", true)
        ]),
        vue.createElementVNode("section", _hoisted_22, [
          vue.createElementVNode("div", _hoisted_23, [
            _cache[9] || (_cache[9] = vue.createElementVNode("div", null, [
              vue.createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "产物输出"),
              vue.createElementVNode("h2", { id: "agent-artifacts-title" }, "产物")
            ], -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(__props.artifacts.length) + " 项", 1)
          ]),
          __props.artifacts.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_24, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.artifacts, (artifact) => {
              var _a, _b;
              return vue.openBlock(), vue.createElementBlock("li", {
                key: artifact.id,
                "data-artifact-id": artifact.id,
                class: vue.normalizeClass({ "is-active": artifact.id === ((_a = selectedArtifact.value) == null ? void 0 : _a.id) })
              }, [
                vue.createElementVNode("button", {
                  type: "button",
                  "aria-pressed": artifact.id === ((_b = selectedArtifact.value) == null ? void 0 : _b.id),
                  onClick: ($event) => emit("select-artifact", artifact)
                }, [
                  vue.renderSlot(_ctx.$slots, "artifact", { artifact }, () => [
                    vue.createElementVNode("span", null, vue.toDisplayString(artifact.title), 1),
                    artifact.description ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_27, vue.toDisplayString(artifact.description), 1)) : vue.createCommentVNode("", true)
                  ])
                ], 8, _hoisted_26)
              ], 10, _hoisted_25);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("p", _hoisted_28, "任务完成后，产物会出现在这里。")),
          selectedArtifact.value ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_29, [
            vue.renderSlot(_ctx.$slots, "artifact-preview", { artifact: selectedArtifact.value }, () => [
              vue.createElementVNode("div", _hoisted_30, [
                vue.createElementVNode("div", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(selectedArtifact.value.type ?? "文件"), 1),
                  vue.createElementVNode("h3", null, vue.toDisplayString(selectedArtifact.value.title), 1)
                ]),
                vue.unref(safeMarkdown.getSafeUrl)(selectedArtifact.value.url) ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 0,
                  href: vue.unref(safeMarkdown.getSafeUrl)(selectedArtifact.value.url),
                  target: "_blank",
                  rel: "noreferrer"
                }, "打开产物", 8, _hoisted_31)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("p", null, vue.toDisplayString(selectedArtifact.value.description ?? "业务层可通过 artifact-preview 插槽提供自定义预览。"), 1),
              selectedArtifact.value.updatedAt ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_32, "更新于 " + vue.toDisplayString(selectedArtifact.value.updatedAt), 1)) : vue.createCommentVNode("", true)
            ])
          ])) : vue.createCommentVNode("", true)
        ])
      ]);
    };
  }
});
exports.default = _sfc_main;
