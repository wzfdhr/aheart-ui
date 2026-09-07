"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const aheartUi = require("aheart-ui");
const dnd = require("@aheart-ui/dnd");
const safeMarkdown = require("./safe-markdown.js");
const _hoisted_1 = { class: "aheart-ai-workbench__execution-content" };
const _hoisted_2 = {
  key: 0,
  class: "aheart-ai-workbench__mobile-priority",
  role: "region",
  "aria-label": "移动端优先处理"
};
const _hoisted_3 = { class: "aheart-ai-workbench__priority-heading" };
const _hoisted_4 = { class: "aheart-ai-workbench__eyebrow" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = { key: 1 };
const _hoisted_7 = {
  key: 0,
  class: "aheart-ai-workbench__priority-approval"
};
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { class: "aheart-ai-workbench__priority-actions" };
const _hoisted_10 = {
  key: 1,
  class: "aheart-ai-workbench__approval-result"
};
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = { key: 0 };
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = { key: 0 };
const _hoisted_15 = { class: "aheart-ai-workbench__section-heading" };
const _hoisted_16 = { class: "aheart-ai-workbench__timeline" };
const _hoisted_17 = ["data-task-id"];
const _hoisted_18 = { class: "aheart-ai-workbench__task-body" };
const _hoisted_19 = { class: "aheart-ai-workbench__task-summary" };
const _hoisted_20 = {
  key: 0,
  class: "aheart-ai-workbench__tool-name"
};
const _hoisted_21 = { class: "aheart-ai-workbench__task-status" };
const _hoisted_22 = {
  key: 0,
  class: "aheart-ai-workbench__task-detail"
};
const _hoisted_23 = {
  key: 1,
  class: "aheart-ai-workbench__task-progress"
};
const _hoisted_24 = ["aria-valuenow"];
const _hoisted_25 = {
  key: 2,
  class: "aheart-ai-workbench__task-time"
};
const _hoisted_26 = { key: 0 };
const _hoisted_27 = { key: 1 };
const _hoisted_28 = {
  key: 3,
  class: "aheart-ai-workbench__task-error"
};
const _hoisted_29 = { class: "aheart-ai-workbench__task-actions" };
const _hoisted_30 = ["data-approval-id"];
const _hoisted_31 = { key: 0 };
const _hoisted_32 = {
  key: 1,
  class: "aheart-ai-workbench__approval-result"
};
const _hoisted_33 = {
  key: 0,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_34 = { class: "aheart-ai-workbench__section-heading" };
const _hoisted_35 = {
  key: 0,
  class: "aheart-ai-workbench__artifact-list"
};
const _hoisted_36 = ["data-artifact-id"];
const _hoisted_37 = ["aria-pressed", "onClick"];
const _hoisted_38 = { key: 0 };
const _hoisted_39 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_40 = {
  key: 2,
  class: "aheart-ai-workbench__artifact-preview",
  "aria-label": "产物预览"
};
const _hoisted_41 = { class: "aheart-ai-workbench__artifact-preview-header" };
const _hoisted_42 = ["href"];
const _hoisted_43 = { key: 0 };
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
    const executionId = `aheart-agent-execution-${vue.useId().replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const taskHeadingId = `${executionId}-tasks`;
    const artifactHeadingId = `${executionId}-artifacts`;
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
    const priorityApproval = vue.computed(
      () => props.tasks.find((task) => task.approval && (!task.approval.status || task.approval.status === "pending")) ?? props.tasks.find((task) => task.approval)
    );
    const priorityArtifact = vue.computed(
      () => props.artifacts.find((artifact) => {
        var _a, _b;
        return artifact.id === ((_b = (_a = priorityApproval.value) == null ? void 0 : _a.approval) == null ? void 0 : _b.artifactId);
      }) ?? selectedArtifact.value
    );
    const priorityLabel = vue.computed(() => {
      var _a;
      if (((_a = priorityApproval.value) == null ? void 0 : _a.approval) && (!priorityApproval.value.approval.status || priorityApproval.value.approval.status === "pending")) return "等待审批";
      return priorityApproval.value ? "审批结果" : "当前产物";
    });
    const asTask = (item) => item;
    const statusLabel = (status) => statusLabels[status];
    const effectiveStatus = (task) => {
      var _a, _b;
      if (((_a = task.approval) == null ? void 0 : _a.status) === "approved") return "complete";
      if (((_b = task.approval) == null ? void 0 : _b.status) === "rejected") return "cancelled";
      return task.status;
    };
    const effectiveStatusLabel = (task) => {
      var _a, _b;
      if (((_a = task.approval) == null ? void 0 : _a.status) === "approved") return "已批准";
      if (((_b = task.approval) == null ? void 0 : _b.status) === "rejected") return "已拒绝";
      return statusLabel(task.status);
    };
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
      var _a, _b, _c, _d, _e, _f;
      return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        priorityApproval.value || selectedArtifact.value ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_2, [
          vue.createElementVNode("div", _hoisted_3, [
            vue.createElementVNode("span", _hoisted_4, vue.toDisplayString(priorityLabel.value), 1),
            priorityApproval.value ? (vue.openBlock(), vue.createElementBlock("strong", _hoisted_5, vue.toDisplayString((_a = priorityApproval.value.approval) == null ? void 0 : _a.title), 1)) : (vue.openBlock(), vue.createElementBlock("strong", _hoisted_6, "查看当前产物"))
          ]),
          priorityApproval.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
            ((_b = priorityApproval.value.approval) == null ? void 0 : _b.description) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_8, vue.toDisplayString(priorityApproval.value.approval.description), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_9, [
              !((_c = priorityApproval.value.approval) == null ? void 0 : _c.status) || priorityApproval.value.approval.status === "pending" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createVNode(vue.unref(aheartUi.Button), {
                  "data-action": "approve",
                  type: "primary",
                  disabled: __props.disabled,
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("approve", priorityApproval.value))
                }, {
                  default: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
                    vue.createTextVNode("批准", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                vue.createVNode(vue.unref(aheartUi.Button), {
                  "data-action": "reject",
                  danger: "",
                  disabled: __props.disabled,
                  onClick: _cache[1] || (_cache[1] = ($event) => emit("reject", priorityApproval.value))
                }, {
                  default: vue.withCtx(() => [..._cache[5] || (_cache[5] = [
                    vue.createTextVNode("拒绝", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ], 64)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_10, vue.toDisplayString(priorityApproval.value.approval.status === "approved" ? "已批准" : "已拒绝"), 1))
            ])
          ])) : vue.createCommentVNode("", true),
          priorityArtifact.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "approval",
            "aria-label": priorityArtifact.value.title,
            onClick: _cache[2] || (_cache[2] = ($event) => emit("select-artifact", priorityArtifact.value))
          }, [
            vue.createElementVNode("span", null, vue.toDisplayString(((_e = (_d = priorityApproval.value) == null ? void 0 : _d.approval) == null ? void 0 : _e.artifactId) ? "审批对象" : "当前产物"), 1),
            vue.createElementVNode("strong", null, vue.toDisplayString(priorityArtifact.value.title), 1),
            priorityArtifact.value.description ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_12, vue.toDisplayString(priorityArtifact.value.description), 1)) : vue.createCommentVNode("", true)
          ], 8, _hoisted_11)) : vue.createCommentVNode("", true),
          selectedArtifact.value && selectedArtifact.value.id !== ((_f = priorityArtifact.value) == null ? void 0 : _f.id) ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "current",
            "aria-label": selectedArtifact.value.title,
            onClick: _cache[3] || (_cache[3] = ($event) => emit("select-artifact", selectedArtifact.value))
          }, [
            _cache[6] || (_cache[6] = vue.createElementVNode("span", null, "当前产物", -1)),
            vue.createElementVNode("strong", null, vue.toDisplayString(selectedArtifact.value.title), 1),
            selectedArtifact.value.description ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_14, vue.toDisplayString(selectedArtifact.value.description), 1)) : vue.createCommentVNode("", true)
          ], 8, _hoisted_13)) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("section", {
          class: "aheart-ai-workbench__tasks",
          "aria-labelledby": taskHeadingId
        }, [
          vue.createElementVNode("div", _hoisted_15, [
            vue.createElementVNode("div", null, [
              _cache[7] || (_cache[7] = vue.createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "执行流程", -1)),
              vue.createElementVNode("h2", { id: taskHeadingId }, "执行时间线")
            ]),
            vue.createElementVNode("span", null, vue.toDisplayString(__props.tasks.length) + " 项", 1)
          ]),
          vue.createElementVNode("div", _hoisted_16, [
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
                  var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h;
                  return [
                    vue.createElementVNode("article", {
                      "data-task-id": asTask(item).id,
                      class: vue.normalizeClass(["aheart-ai-workbench__timeline-item", [`is-${effectiveStatus(asTask(item))}`, { "has-approval-summary": Boolean(asTask(item).approval) }]])
                    }, [
                      _cache[15] || (_cache[15] = vue.createElementVNode("span", {
                        class: "aheart-ai-workbench__timeline-marker",
                        "aria-hidden": "true"
                      }, null, -1)),
                      vue.createElementVNode("div", _hoisted_18, [
                        vue.createElementVNode("header", _hoisted_19, [
                          vue.createElementVNode("div", null, [
                            vue.createElementVNode("strong", null, vue.toDisplayString(asTask(item).label), 1),
                            asTask(item).toolName ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_20, vue.toDisplayString(asTask(item).toolName), 1)) : vue.createCommentVNode("", true)
                          ]),
                          vue.createElementVNode("span", _hoisted_21, vue.toDisplayString(effectiveStatusLabel(asTask(item))), 1)
                        ]),
                        asTask(item).detail ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_22, vue.toDisplayString(asTask(item).detail), 1)) : vue.createCommentVNode("", true),
                        asTask(item).progress !== void 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_23, [
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
                          ], 8, _hoisted_24),
                          vue.createElementVNode("small", null, vue.toDisplayString(normalizedProgress(asTask(item).progress)) + "%", 1)
                        ])) : vue.createCommentVNode("", true),
                        asTask(item).startedAt || asTask(item).completedAt ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_25, [
                          asTask(item).startedAt ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_26, "开始 " + vue.toDisplayString(asTask(item).startedAt), 1)) : vue.createCommentVNode("", true),
                          asTask(item).completedAt ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_27, "完成 " + vue.toDisplayString(asTask(item).completedAt), 1)) : vue.createCommentVNode("", true)
                        ])) : vue.createCommentVNode("", true),
                        asTask(item).error ? (vue.openBlock(), vue.createElementBlock("details", _hoisted_28, [
                          _cache[8] || (_cache[8] = vue.createElementVNode("summary", null, "查看错误详情", -1)),
                          vue.createElementVNode("p", null, vue.toDisplayString(asTask(item).error), 1)
                        ])) : vue.createCommentVNode("", true),
                        vue.createElementVNode("div", _hoisted_29, [
                          asTask(item).status === "running" ? (vue.openBlock(), vue.createBlock(vue.unref(aheartUi.Button), {
                            key: 0,
                            "data-action": "cancel",
                            type: "text",
                            disabled: __props.disabled,
                            onClick: ($event) => emit("cancel", asTask(item))
                          }, {
                            default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
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
                            default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
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
                            default: vue.withCtx(() => [..._cache[11] || (_cache[11] = [
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
                            default: vue.withCtx(() => [..._cache[12] || (_cache[12] = [
                              vue.createTextVNode("下移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])
                        ]),
                        asTask(item).approval ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 4,
                          "data-approval-id": (_a2 = asTask(item).approval) == null ? void 0 : _a2.id,
                          class: vue.normalizeClass(["aheart-ai-workbench__approval", `is-${((_b2 = asTask(item).approval) == null ? void 0 : _b2.status) ?? "pending"}`])
                        }, [
                          vue.createElementVNode("div", null, [
                            vue.createElementVNode("strong", null, vue.toDisplayString((_c2 = asTask(item).approval) == null ? void 0 : _c2.title), 1),
                            ((_d2 = asTask(item).approval) == null ? void 0 : _d2.description) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_31, vue.toDisplayString((_e2 = asTask(item).approval) == null ? void 0 : _e2.description), 1)) : vue.createCommentVNode("", true)
                          ]),
                          !((_f2 = asTask(item).approval) == null ? void 0 : _f2.status) || ((_g = asTask(item).approval) == null ? void 0 : _g.status) === "pending" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                            vue.createVNode(vue.unref(aheartUi.Button), {
                              "data-action": "approve",
                              type: "primary",
                              disabled: __props.disabled,
                              onClick: ($event) => emit("approve", asTask(item))
                            }, {
                              default: vue.withCtx(() => [..._cache[13] || (_cache[13] = [
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
                              default: vue.withCtx(() => [..._cache[14] || (_cache[14] = [
                                vue.createTextVNode("拒绝", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ], 64)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_32, vue.toDisplayString(((_h = asTask(item).approval) == null ? void 0 : _h.status) === "approved" ? "已批准" : "已拒绝"), 1))
                        ], 10, _hoisted_30)) : vue.createCommentVNode("", true)
                      ])
                    ], 10, _hoisted_17)
                  ];
                })
              ]),
              _: 3
            }, 8, ["items", "disabled"])
          ]),
          !__props.tasks.length ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_33, "尚无执行任务。")) : vue.createCommentVNode("", true)
        ]),
        vue.createElementVNode("section", {
          class: "aheart-ai-workbench__artifacts",
          "aria-labelledby": artifactHeadingId
        }, [
          vue.createElementVNode("div", _hoisted_34, [
            vue.createElementVNode("div", null, [
              _cache[16] || (_cache[16] = vue.createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "产物输出", -1)),
              vue.createElementVNode("h2", { id: artifactHeadingId }, "产物")
            ]),
            vue.createElementVNode("span", null, vue.toDisplayString(__props.artifacts.length) + " 项", 1)
          ]),
          __props.artifacts.length ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_35, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.artifacts, (artifact) => {
              var _a2, _b2;
              return vue.openBlock(), vue.createElementBlock("li", {
                key: artifact.id,
                "data-artifact-id": artifact.id,
                class: vue.normalizeClass({ "is-active": artifact.id === ((_a2 = selectedArtifact.value) == null ? void 0 : _a2.id) })
              }, [
                vue.createElementVNode("button", {
                  type: "button",
                  "aria-pressed": artifact.id === ((_b2 = selectedArtifact.value) == null ? void 0 : _b2.id),
                  onClick: ($event) => emit("select-artifact", artifact)
                }, [
                  vue.renderSlot(_ctx.$slots, "artifact", { artifact }, () => [
                    vue.createElementVNode("span", null, vue.toDisplayString(artifact.title), 1),
                    artifact.description ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_38, vue.toDisplayString(artifact.description), 1)) : vue.createCommentVNode("", true)
                  ])
                ], 8, _hoisted_37)
              ], 10, _hoisted_36);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("p", _hoisted_39, "任务完成后，产物会出现在这里。")),
          selectedArtifact.value ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_40, [
            vue.renderSlot(_ctx.$slots, "artifact-preview", { artifact: selectedArtifact.value }, () => [
              vue.createElementVNode("div", _hoisted_41, [
                vue.createElementVNode("div", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(selectedArtifact.value.type ?? "文件"), 1),
                  vue.createElementVNode("h3", null, vue.toDisplayString(selectedArtifact.value.title), 1)
                ]),
                vue.unref(safeMarkdown.getSafeUrl)(selectedArtifact.value.url) ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 0,
                  href: vue.unref(safeMarkdown.getSafeUrl)(selectedArtifact.value.url),
                  target: "_blank",
                  rel: "noreferrer"
                }, "打开产物", 8, _hoisted_42)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("p", null, vue.toDisplayString(selectedArtifact.value.description ?? "业务层可通过 artifact-preview 插槽提供自定义预览。"), 1),
              selectedArtifact.value.updatedAt ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_43, "更新于 " + vue.toDisplayString(selectedArtifact.value.updatedAt), 1)) : vue.createCommentVNode("", true)
            ])
          ])) : vue.createCommentVNode("", true)
        ])
      ]);
    };
  }
});
exports.default = _sfc_main;
