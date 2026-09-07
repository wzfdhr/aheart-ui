import { defineComponent, useId, computed, openBlock, createElementBlock, createElementVNode, toDisplayString, createCommentVNode, Fragment, createVNode, unref, withCtx, createTextVNode, renderSlot, normalizeClass, normalizeStyle, createBlock, renderList } from "vue";
import { Button } from "aheart-ui";
import { SortableList } from "@aheart-ui/dnd";
import { getSafeUrl } from "./safe-markdown.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const executionId = `aheart-agent-execution-${useId().replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
    const sortableTasks = computed(() => props.tasks);
    const selectedArtifact = computed(
      () => props.artifacts.find((artifact) => artifact.id === props.activeArtifact) ?? props.artifacts[0]
    );
    const priorityApproval = computed(
      () => props.tasks.find((task) => task.approval && (!task.approval.status || task.approval.status === "pending")) ?? props.tasks.find((task) => task.approval)
    );
    const priorityArtifact = computed(
      () => props.artifacts.find((artifact) => {
        var _a, _b;
        return artifact.id === ((_b = (_a = priorityApproval.value) == null ? void 0 : _a.approval) == null ? void 0 : _b.artifactId);
      }) ?? selectedArtifact.value
    );
    const priorityLabel = computed(() => {
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
      return openBlock(), createElementBlock("div", _hoisted_1, [
        priorityApproval.value || selectedArtifact.value ? (openBlock(), createElementBlock("section", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            createElementVNode("span", _hoisted_4, toDisplayString(priorityLabel.value), 1),
            priorityApproval.value ? (openBlock(), createElementBlock("strong", _hoisted_5, toDisplayString((_a = priorityApproval.value.approval) == null ? void 0 : _a.title), 1)) : (openBlock(), createElementBlock("strong", _hoisted_6, "查看当前产物"))
          ]),
          priorityApproval.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
            ((_b = priorityApproval.value.approval) == null ? void 0 : _b.description) ? (openBlock(), createElementBlock("p", _hoisted_8, toDisplayString(priorityApproval.value.approval.description), 1)) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_9, [
              !((_c = priorityApproval.value.approval) == null ? void 0 : _c.status) || priorityApproval.value.approval.status === "pending" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createVNode(unref(Button), {
                  "data-action": "approve",
                  type: "primary",
                  disabled: __props.disabled,
                  onClick: _cache[0] || (_cache[0] = ($event) => emit("approve", priorityApproval.value))
                }, {
                  default: withCtx(() => [..._cache[4] || (_cache[4] = [
                    createTextVNode("批准", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                createVNode(unref(Button), {
                  "data-action": "reject",
                  danger: "",
                  disabled: __props.disabled,
                  onClick: _cache[1] || (_cache[1] = ($event) => emit("reject", priorityApproval.value))
                }, {
                  default: withCtx(() => [..._cache[5] || (_cache[5] = [
                    createTextVNode("拒绝", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ], 64)) : (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(priorityApproval.value.approval.status === "approved" ? "已批准" : "已拒绝"), 1))
            ])
          ])) : createCommentVNode("", true),
          priorityArtifact.value ? (openBlock(), createElementBlock("button", {
            key: 1,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "approval",
            "aria-label": priorityArtifact.value.title,
            onClick: _cache[2] || (_cache[2] = ($event) => emit("select-artifact", priorityArtifact.value))
          }, [
            createElementVNode("span", null, toDisplayString(((_e = (_d = priorityApproval.value) == null ? void 0 : _d.approval) == null ? void 0 : _e.artifactId) ? "审批对象" : "当前产物"), 1),
            createElementVNode("strong", null, toDisplayString(priorityArtifact.value.title), 1),
            priorityArtifact.value.description ? (openBlock(), createElementBlock("small", _hoisted_12, toDisplayString(priorityArtifact.value.description), 1)) : createCommentVNode("", true)
          ], 8, _hoisted_11)) : createCommentVNode("", true),
          selectedArtifact.value && selectedArtifact.value.id !== ((_f = priorityArtifact.value) == null ? void 0 : _f.id) ? (openBlock(), createElementBlock("button", {
            key: 2,
            type: "button",
            class: "aheart-ai-workbench__priority-artifact",
            "data-artifact-role": "current",
            "aria-label": selectedArtifact.value.title,
            onClick: _cache[3] || (_cache[3] = ($event) => emit("select-artifact", selectedArtifact.value))
          }, [
            _cache[6] || (_cache[6] = createElementVNode("span", null, "当前产物", -1)),
            createElementVNode("strong", null, toDisplayString(selectedArtifact.value.title), 1),
            selectedArtifact.value.description ? (openBlock(), createElementBlock("small", _hoisted_14, toDisplayString(selectedArtifact.value.description), 1)) : createCommentVNode("", true)
          ], 8, _hoisted_13)) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createElementVNode("section", {
          class: "aheart-ai-workbench__tasks",
          "aria-labelledby": taskHeadingId
        }, [
          createElementVNode("div", _hoisted_15, [
            createElementVNode("div", null, [
              _cache[7] || (_cache[7] = createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "执行流程", -1)),
              createElementVNode("h2", { id: taskHeadingId }, "执行时间线")
            ]),
            createElementVNode("span", null, toDisplayString(__props.tasks.length) + " 项", 1)
          ]),
          createElementVNode("div", _hoisted_16, [
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
                  var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h;
                  return [
                    createElementVNode("article", {
                      "data-task-id": asTask(item).id,
                      class: normalizeClass(["aheart-ai-workbench__timeline-item", [`is-${effectiveStatus(asTask(item))}`, { "has-approval-summary": Boolean(asTask(item).approval) }]])
                    }, [
                      _cache[15] || (_cache[15] = createElementVNode("span", {
                        class: "aheart-ai-workbench__timeline-marker",
                        "aria-hidden": "true"
                      }, null, -1)),
                      createElementVNode("div", _hoisted_18, [
                        createElementVNode("header", _hoisted_19, [
                          createElementVNode("div", null, [
                            createElementVNode("strong", null, toDisplayString(asTask(item).label), 1),
                            asTask(item).toolName ? (openBlock(), createElementBlock("span", _hoisted_20, toDisplayString(asTask(item).toolName), 1)) : createCommentVNode("", true)
                          ]),
                          createElementVNode("span", _hoisted_21, toDisplayString(effectiveStatusLabel(asTask(item))), 1)
                        ]),
                        asTask(item).detail ? (openBlock(), createElementBlock("p", _hoisted_22, toDisplayString(asTask(item).detail), 1)) : createCommentVNode("", true),
                        asTask(item).progress !== void 0 ? (openBlock(), createElementBlock("div", _hoisted_23, [
                          createElementVNode("div", {
                            role: "progressbar",
                            "aria-label": "任务进度",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            "aria-valuenow": normalizedProgress(asTask(item).progress)
                          }, [
                            createElementVNode("span", {
                              style: normalizeStyle({ inlineSize: `${normalizedProgress(asTask(item).progress)}%` })
                            }, null, 4)
                          ], 8, _hoisted_24),
                          createElementVNode("small", null, toDisplayString(normalizedProgress(asTask(item).progress)) + "%", 1)
                        ])) : createCommentVNode("", true),
                        asTask(item).startedAt || asTask(item).completedAt ? (openBlock(), createElementBlock("div", _hoisted_25, [
                          asTask(item).startedAt ? (openBlock(), createElementBlock("span", _hoisted_26, "开始 " + toDisplayString(asTask(item).startedAt), 1)) : createCommentVNode("", true),
                          asTask(item).completedAt ? (openBlock(), createElementBlock("span", _hoisted_27, "完成 " + toDisplayString(asTask(item).completedAt), 1)) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        asTask(item).error ? (openBlock(), createElementBlock("details", _hoisted_28, [
                          _cache[8] || (_cache[8] = createElementVNode("summary", null, "查看错误详情", -1)),
                          createElementVNode("p", null, toDisplayString(asTask(item).error), 1)
                        ])) : createCommentVNode("", true),
                        createElementVNode("div", _hoisted_29, [
                          asTask(item).status === "running" ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            "data-action": "cancel",
                            type: "text",
                            disabled: __props.disabled,
                            onClick: ($event) => emit("cancel", asTask(item))
                          }, {
                            default: withCtx(() => [..._cache[9] || (_cache[9] = [
                              createTextVNode("取消", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])) : createCommentVNode("", true),
                          asTask(item).status === "error" ? (openBlock(), createBlock(unref(Button), {
                            key: 1,
                            "data-action": "retry",
                            type: "text",
                            disabled: __props.disabled,
                            onClick: ($event) => emit("retry", asTask(item))
                          }, {
                            default: withCtx(() => [..._cache[10] || (_cache[10] = [
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
                            default: withCtx(() => [..._cache[11] || (_cache[11] = [
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
                            default: withCtx(() => [..._cache[12] || (_cache[12] = [
                              createTextVNode("下移", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"])
                        ]),
                        asTask(item).approval ? (openBlock(), createElementBlock("div", {
                          key: 4,
                          "data-approval-id": (_a2 = asTask(item).approval) == null ? void 0 : _a2.id,
                          class: normalizeClass(["aheart-ai-workbench__approval", `is-${((_b2 = asTask(item).approval) == null ? void 0 : _b2.status) ?? "pending"}`])
                        }, [
                          createElementVNode("div", null, [
                            createElementVNode("strong", null, toDisplayString((_c2 = asTask(item).approval) == null ? void 0 : _c2.title), 1),
                            ((_d2 = asTask(item).approval) == null ? void 0 : _d2.description) ? (openBlock(), createElementBlock("p", _hoisted_31, toDisplayString((_e2 = asTask(item).approval) == null ? void 0 : _e2.description), 1)) : createCommentVNode("", true)
                          ]),
                          !((_f2 = asTask(item).approval) == null ? void 0 : _f2.status) || ((_g = asTask(item).approval) == null ? void 0 : _g.status) === "pending" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                            createVNode(unref(Button), {
                              "data-action": "approve",
                              type: "primary",
                              disabled: __props.disabled,
                              onClick: ($event) => emit("approve", asTask(item))
                            }, {
                              default: withCtx(() => [..._cache[13] || (_cache[13] = [
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
                              default: withCtx(() => [..._cache[14] || (_cache[14] = [
                                createTextVNode("拒绝", -1)
                              ])]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ], 64)) : (openBlock(), createElementBlock("span", _hoisted_32, toDisplayString(((_h = asTask(item).approval) == null ? void 0 : _h.status) === "approved" ? "已批准" : "已拒绝"), 1))
                        ], 10, _hoisted_30)) : createCommentVNode("", true)
                      ])
                    ], 10, _hoisted_17)
                  ];
                })
              ]),
              _: 3
            }, 8, ["items", "disabled"])
          ]),
          !__props.tasks.length ? (openBlock(), createElementBlock("p", _hoisted_33, "尚无执行任务。")) : createCommentVNode("", true)
        ]),
        createElementVNode("section", {
          class: "aheart-ai-workbench__artifacts",
          "aria-labelledby": artifactHeadingId
        }, [
          createElementVNode("div", _hoisted_34, [
            createElementVNode("div", null, [
              _cache[16] || (_cache[16] = createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "产物输出", -1)),
              createElementVNode("h2", { id: artifactHeadingId }, "产物")
            ]),
            createElementVNode("span", null, toDisplayString(__props.artifacts.length) + " 项", 1)
          ]),
          __props.artifacts.length ? (openBlock(), createElementBlock("ul", _hoisted_35, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.artifacts, (artifact) => {
              var _a2, _b2;
              return openBlock(), createElementBlock("li", {
                key: artifact.id,
                "data-artifact-id": artifact.id,
                class: normalizeClass({ "is-active": artifact.id === ((_a2 = selectedArtifact.value) == null ? void 0 : _a2.id) })
              }, [
                createElementVNode("button", {
                  type: "button",
                  "aria-pressed": artifact.id === ((_b2 = selectedArtifact.value) == null ? void 0 : _b2.id),
                  onClick: ($event) => emit("select-artifact", artifact)
                }, [
                  renderSlot(_ctx.$slots, "artifact", { artifact }, () => [
                    createElementVNode("span", null, toDisplayString(artifact.title), 1),
                    artifact.description ? (openBlock(), createElementBlock("small", _hoisted_38, toDisplayString(artifact.description), 1)) : createCommentVNode("", true)
                  ])
                ], 8, _hoisted_37)
              ], 10, _hoisted_36);
            }), 128))
          ])) : (openBlock(), createElementBlock("p", _hoisted_39, "任务完成后，产物会出现在这里。")),
          selectedArtifact.value ? (openBlock(), createElementBlock("section", _hoisted_40, [
            renderSlot(_ctx.$slots, "artifact-preview", { artifact: selectedArtifact.value }, () => [
              createElementVNode("div", _hoisted_41, [
                createElementVNode("div", null, [
                  createElementVNode("span", null, toDisplayString(selectedArtifact.value.type ?? "文件"), 1),
                  createElementVNode("h3", null, toDisplayString(selectedArtifact.value.title), 1)
                ]),
                unref(getSafeUrl)(selectedArtifact.value.url) ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  href: unref(getSafeUrl)(selectedArtifact.value.url),
                  target: "_blank",
                  rel: "noreferrer"
                }, "打开产物", 8, _hoisted_42)) : createCommentVNode("", true)
              ]),
              createElementVNode("p", null, toDisplayString(selectedArtifact.value.description ?? "业务层可通过 artifact-preview 插槽提供自定义预览。"), 1),
              selectedArtifact.value.updatedAt ? (openBlock(), createElementBlock("small", _hoisted_43, "更新于 " + toDisplayString(selectedArtifact.value.updatedAt), 1)) : createCommentVNode("", true)
            ])
          ])) : createCommentVNode("", true)
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
