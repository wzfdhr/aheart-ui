import { defineComponent, ref, getCurrentInstance, onBeforeUpdate, computed, openBlock, createElementBlock, createElementVNode, toDisplayString, createCommentVNode, normalizeClass, createVNode, unref, withCtx, createTextVNode, createBlock, mergeProps, renderSlot, createSlots } from "vue";
import { Splitter, SplitterPanel, Button, Tabs, Drawer } from "aheart-ui";
import { SortableList } from "@aheart-ui/dnd";
import _sfc_main$4 from "./attachments.vue.js";
import _sfc_main$2 from "./chat-panel.vue.js";
import _sfc_main$1 from "./conversations.vue.js";
import _sfc_main$3 from "./sources.vue.js";
import _sfc_main$5 from "./agent-execution.vue.js";
const _hoisted_1 = {
  class: "aheart-ai-workbench",
  "aria-label": "Agent 工作台"
};
const _hoisted_2 = { class: "aheart-ai-workbench__header" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { class: "aheart-ai-workbench__header-status" };
const _hoisted_5 = { class: "aheart-ai-workbench__progress" };
const _hoisted_6 = { class: "aheart-ai-workbench__desktop" };
const _hoisted_7 = { class: "aheart-ai-workbench__sidebar" };
const _hoisted_8 = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
};
const _hoisted_9 = ["data-context-id"];
const _hoisted_10 = { key: 0 };
const _hoisted_11 = { class: "aheart-ai-workbench__move-actions" };
const _hoisted_12 = { class: "aheart-ai-workbench__chat" };
const _hoisted_13 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_14 = {
  class: "aheart-ai-workbench__execution",
  "aria-label": "执行与产物"
};
const _hoisted_15 = { class: "aheart-ai-workbench__mobile" };
const _hoisted_16 = {
  key: 0,
  class: "aheart-ai-workbench__mobile-panel"
};
const _hoisted_17 = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
};
const _hoisted_18 = ["data-context-id"];
const _hoisted_19 = { key: 0 };
const _hoisted_20 = { class: "aheart-ai-workbench__move-actions" };
const _hoisted_21 = {
  key: 1,
  class: "aheart-ai-workbench__mobile-panel"
};
const _hoisted_22 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_23 = {
  key: 2,
  class: "aheart-ai-workbench__mobile-panel"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIAgentWorkbench" },
  __name: "agent-workbench",
  props: {
    title: { default: "Agent 工作台" },
    description: { default: "编排对话、任务、审批与产物。" },
    panelSizes: { default: () => [150, "auto", 200] },
    conversations: { default: () => [] },
    activeConversation: { default: void 0 },
    messages: { default: () => [] },
    prompts: { default: () => [] },
    transport: { default: void 0 },
    tasks: { default: () => [] },
    contextItems: { default: () => [] },
    sources: { default: () => [] },
    attachments: { default: () => [] },
    artifacts: { default: () => [] },
    activeArtifact: { default: void 0 },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:panelSizes", "update:activeConversation", "update:messages", "update:activeArtifact", "update:tasks", "update:contextItems", "approve", "reject", "cancel", "retry", "move-task", "move-context", "stop", "chat-retry", "chat-regenerate", "chat-edit", "chat-copy", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const mobileView = ref("chat");
    const executionDrawerOpen = ref(false);
    const instance = getCurrentInstance();
    const readMessagesPresence = () => Object.prototype.hasOwnProperty.call((instance == null ? void 0 : instance.vnode.props) ?? {}, "messages");
    const hasMessagesProp = ref(readMessagesPresence());
    onBeforeUpdate(() => {
      hasMessagesProp.value = readMessagesPresence();
    });
    const chatMessageProps = computed(() => hasMessagesProp.value ? { messages: props.messages } : { defaultMessages: props.messages });
    const mobileTabs = [
      { key: "conversations", label: "会话" },
      { key: "chat", label: "对话" },
      { key: "execution", label: "执行" }
    ];
    const sortableContext = computed(() => props.contextItems);
    const completedTaskCount = computed(() => props.tasks.filter((task) => task.status === "complete").length);
    const workbenchStatus = computed(() => {
      if (props.tasks.some((task) => task.status === "error")) return { key: "error", label: "需要处理" };
      if (props.tasks.some((task) => task.status === "waiting-approval")) return { key: "waiting", label: "等待人工审批" };
      if (props.tasks.some((task) => task.status === "running")) return { key: "running", label: "执行中" };
      if (props.tasks.length && completedTaskCount.value === props.tasks.length) return { key: "complete", label: "已完成" };
      return { key: "idle", label: "待开始" };
    });
    const asContext = (item) => item;
    const reorder = (items, index, offset) => {
      const destination = index + offset;
      if (destination < 0 || destination >= items.length) return items;
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(destination, 0, item);
      return next;
    };
    const isContextMoveDisabled = (index, offset) => {
      var _a, _b;
      const destination = index + offset;
      return Boolean(
        props.disabled || destination < 0 || destination >= props.contextItems.length || ((_a = props.contextItems[index]) == null ? void 0 : _a.disabled) || ((_b = props.contextItems[destination]) == null ? void 0 : _b.disabled)
      );
    };
    const moveContext = (index, offset) => {
      if (isContextMoveDisabled(index, offset)) return;
      const item = props.contextItems[index];
      if (!item || index + offset < 0 || index + offset >= props.contextItems.length) return;
      emit("update:contextItems", reorder(props.contextItems, index, offset));
      emit("move-context", item.id, offset < 0 ? "up" : "down");
    };
    const updateContext = (items) => {
      if (props.disabled) return;
      const nextItems = items;
      const movedLockedItem = props.contextItems.some((item, index) => {
        var _a;
        return item.disabled && ((_a = nextItems[index]) == null ? void 0 : _a.id) !== item.id;
      });
      if (!movedLockedItem) emit("update:contextItems", nextItems);
    };
    const forwardMoveTask = (id, direction) => emit("move-task", id, direction);
    const forwardChatEdit = (message, content) => emit("chat-edit", message, content);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createElementVNode("header", _hoisted_2, [
          createElementVNode("div", null, [
            _cache[30] || (_cache[30] = createElementVNode("span", { class: "aheart-ai-workbench__eyebrow" }, "AGENT WORKSPACE", -1)),
            createElementVNode("h2", null, toDisplayString(__props.title), 1),
            __props.description ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(__props.description), 1)) : createCommentVNode("", true)
          ]),
          createElementVNode("div", _hoisted_4, [
            createElementVNode("span", {
              "data-workbench-status": "",
              class: normalizeClass(`is-${workbenchStatus.value.key}`)
            }, toDisplayString(workbenchStatus.value.label), 3),
            createElementVNode("small", _hoisted_5, toDisplayString(completedTaskCount.value) + " / " + toDisplayString(__props.tasks.length) + " 已完成", 1)
          ])
        ]),
        createElementVNode("div", _hoisted_6, [
          createVNode(unref(Splitter), {
            sizes: __props.panelSizes,
            "default-sizes": [150, "auto", 200],
            "onUpdate:sizes": _cache[13] || (_cache[13] = ($event) => emit("update:panelSizes", $event))
          }, {
            default: withCtx(() => [
              createVNode(unref(SplitterPanel), {
                min: 140,
                collapsible: ""
              }, {
                default: withCtx(() => [
                  createElementVNode("aside", _hoisted_7, [
                    _cache[34] || (_cache[34] = createElementVNode("h2", null, "会话", -1)),
                    createVNode(_sfc_main$1, {
                      "model-value": __props.activeConversation,
                      conversations: __props.conversations,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:activeConversation", $event))
                    }, null, 8, ["model-value", "conversations"]),
                    __props.contextItems.length ? (openBlock(), createElementBlock("section", _hoisted_8, [
                      _cache[33] || (_cache[33] = createElementVNode("h3", null, "上下文", -1)),
                      createVNode(unref(SortableList), {
                        items: sortableContext.value,
                        "item-key": "id",
                        group: "agent-context",
                        disabled: __props.disabled,
                        "onUpdate:items": updateContext
                      }, {
                        item: withCtx(({ item, index }) => [
                          createElementVNode("div", {
                            class: "aheart-ai-workbench__context-item",
                            "data-context-id": asContext(item).id
                          }, [
                            createElementVNode("span", null, toDisplayString(asContext(item).label), 1),
                            asContext(item).description ? (openBlock(), createElementBlock("small", _hoisted_10, toDisplayString(asContext(item).description), 1)) : createCommentVNode("", true),
                            createElementVNode("div", _hoisted_11, [
                              createVNode(unref(Button), {
                                type: "text",
                                disabled: isContextMoveDisabled(index, -1),
                                onClick: ($event) => moveContext(index, -1)
                              }, {
                                default: withCtx(() => [..._cache[31] || (_cache[31] = [
                                  createTextVNode("上移", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled", "onClick"]),
                              createVNode(unref(Button), {
                                type: "text",
                                disabled: isContextMoveDisabled(index, 1),
                                onClick: ($event) => moveContext(index, 1)
                              }, {
                                default: withCtx(() => [..._cache[32] || (_cache[32] = [
                                  createTextVNode("下移", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled", "onClick"])
                            ])
                          ], 8, _hoisted_9)
                        ]),
                        _: 1
                      }, 8, ["items", "disabled"])
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(SplitterPanel), { min: 240 }, {
                default: withCtx(() => [
                  createElementVNode("main", _hoisted_12, [
                    __props.transport ? (openBlock(), createBlock(_sfc_main$2, mergeProps({ key: 0 }, chatMessageProps.value, {
                      transport: __props.transport,
                      "conversation-id": __props.activeConversation,
                      prompts: __props.prompts,
                      disabled: __props.disabled,
                      "onUpdate:messages": _cache[1] || (_cache[1] = ($event) => emit("update:messages", $event)),
                      onError: _cache[2] || (_cache[2] = ($event) => emit("error", $event)),
                      onStop: _cache[3] || (_cache[3] = ($event) => emit("stop")),
                      onRetry: _cache[4] || (_cache[4] = ($event) => emit("chat-retry", $event)),
                      onRegenerate: _cache[5] || (_cache[5] = ($event) => emit("chat-regenerate", $event)),
                      onEdit: forwardChatEdit,
                      onCopy: _cache[6] || (_cache[6] = ($event) => emit("chat-copy", $event))
                    }), null, 16, ["transport", "conversation-id", "prompts", "disabled"])) : (openBlock(), createElementBlock("p", _hoisted_13, "业务层尚未提供对话传输适配器。")),
                    renderSlot(_ctx.$slots, "sources", { sources: __props.sources }, () => [
                      createVNode(_sfc_main$3, { sources: __props.sources }, null, 8, ["sources"])
                    ]),
                    renderSlot(_ctx.$slots, "attachments", { attachments: __props.attachments }, () => [
                      createVNode(_sfc_main$4, { items: __props.attachments }, null, 8, ["items"])
                    ])
                  ])
                ]),
                _: 3
              }),
              createVNode(unref(SplitterPanel), {
                min: 190,
                collapsible: ""
              }, {
                default: withCtx(() => [
                  createElementVNode("aside", _hoisted_14, [
                    createVNode(_sfc_main$5, {
                      tasks: __props.tasks,
                      artifacts: __props.artifacts,
                      "active-artifact": __props.activeArtifact,
                      disabled: __props.disabled,
                      "onUpdate:tasks": _cache[7] || (_cache[7] = ($event) => emit("update:tasks", $event)),
                      onApprove: _cache[8] || (_cache[8] = ($event) => emit("approve", $event)),
                      onReject: _cache[9] || (_cache[9] = ($event) => emit("reject", $event)),
                      onCancel: _cache[10] || (_cache[10] = ($event) => emit("cancel", $event)),
                      onRetry: _cache[11] || (_cache[11] = ($event) => emit("retry", $event)),
                      onMoveTask: forwardMoveTask,
                      onSelectArtifact: _cache[12] || (_cache[12] = ($event) => emit("update:activeArtifact", $event.id))
                    }, createSlots({ _: 2 }, [
                      _ctx.$slots.task ? {
                        name: "task",
                        fn: withCtx(({ task, index }) => [
                          renderSlot(_ctx.$slots, "task", {
                            task,
                            index
                          })
                        ]),
                        key: "0"
                      } : void 0,
                      _ctx.$slots.artifact ? {
                        name: "artifact",
                        fn: withCtx(({ artifact }) => [
                          renderSlot(_ctx.$slots, "artifact", { artifact })
                        ]),
                        key: "1"
                      } : void 0,
                      _ctx.$slots["artifact-preview"] ? {
                        name: "artifact-preview",
                        fn: withCtx(({ artifact }) => [
                          renderSlot(_ctx.$slots, "artifact-preview", { artifact })
                        ]),
                        key: "2"
                      } : void 0
                    ]), 1032, ["tasks", "artifacts", "active-artifact", "disabled"])
                  ])
                ]),
                _: 3
              })
            ]),
            _: 3
          }, 8, ["sizes"])
        ]),
        createElementVNode("div", _hoisted_15, [
          createVNode(unref(Tabs), {
            items: mobileTabs,
            "active-key": mobileView.value,
            "onUpdate:activeKey": _cache[14] || (_cache[14] = ($event) => mobileView.value = $event)
          }, null, 8, ["active-key"]),
          mobileView.value === "conversations" ? (openBlock(), createElementBlock("section", _hoisted_16, [
            createVNode(_sfc_main$1, {
              "model-value": __props.activeConversation,
              conversations: __props.conversations,
              "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => emit("update:activeConversation", $event))
            }, null, 8, ["model-value", "conversations"]),
            __props.contextItems.length ? (openBlock(), createElementBlock("section", _hoisted_17, [
              _cache[37] || (_cache[37] = createElementVNode("h3", null, "上下文", -1)),
              createVNode(unref(SortableList), {
                items: sortableContext.value,
                "item-key": "id",
                group: "agent-context",
                disabled: __props.disabled,
                "onUpdate:items": updateContext
              }, {
                item: withCtx(({ item, index }) => [
                  createElementVNode("div", {
                    class: "aheart-ai-workbench__context-item",
                    "data-context-id": asContext(item).id
                  }, [
                    createElementVNode("span", null, toDisplayString(asContext(item).label), 1),
                    asContext(item).description ? (openBlock(), createElementBlock("small", _hoisted_19, toDisplayString(asContext(item).description), 1)) : createCommentVNode("", true),
                    createElementVNode("div", _hoisted_20, [
                      createVNode(unref(Button), {
                        type: "text",
                        disabled: isContextMoveDisabled(index, -1),
                        onClick: ($event) => moveContext(index, -1)
                      }, {
                        default: withCtx(() => [..._cache[35] || (_cache[35] = [
                          createTextVNode("上移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(unref(Button), {
                        type: "text",
                        disabled: isContextMoveDisabled(index, 1),
                        onClick: ($event) => moveContext(index, 1)
                      }, {
                        default: withCtx(() => [..._cache[36] || (_cache[36] = [
                          createTextVNode("下移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])
                    ])
                  ], 8, _hoisted_18)
                ]),
                _: 1
              }, 8, ["items", "disabled"])
            ])) : createCommentVNode("", true)
          ])) : mobileView.value === "chat" ? (openBlock(), createElementBlock("section", _hoisted_21, [
            __props.transport ? (openBlock(), createBlock(_sfc_main$2, mergeProps({ key: 0 }, chatMessageProps.value, {
              transport: __props.transport,
              "conversation-id": __props.activeConversation,
              prompts: __props.prompts,
              disabled: __props.disabled,
              "onUpdate:messages": _cache[16] || (_cache[16] = ($event) => emit("update:messages", $event)),
              onError: _cache[17] || (_cache[17] = ($event) => emit("error", $event)),
              onStop: _cache[18] || (_cache[18] = ($event) => emit("stop")),
              onRetry: _cache[19] || (_cache[19] = ($event) => emit("chat-retry", $event)),
              onRegenerate: _cache[20] || (_cache[20] = ($event) => emit("chat-regenerate", $event)),
              onEdit: forwardChatEdit,
              onCopy: _cache[21] || (_cache[21] = ($event) => emit("chat-copy", $event))
            }), null, 16, ["transport", "conversation-id", "prompts", "disabled"])) : (openBlock(), createElementBlock("p", _hoisted_22, "业务层尚未提供对话传输适配器。")),
            renderSlot(_ctx.$slots, "sources", { sources: __props.sources }, () => [
              createVNode(_sfc_main$3, { sources: __props.sources }, null, 8, ["sources"])
            ]),
            renderSlot(_ctx.$slots, "attachments", { attachments: __props.attachments }, () => [
              createVNode(_sfc_main$4, { items: __props.attachments }, null, 8, ["items"])
            ])
          ])) : (openBlock(), createElementBlock("section", _hoisted_23, [
            createVNode(unref(Button), {
              "data-action": "open-execution-drawer",
              type: "primary",
              onClick: _cache[22] || (_cache[22] = ($event) => executionDrawerOpen.value = true)
            }, {
              default: withCtx(() => [..._cache[38] || (_cache[38] = [
                createTextVNode("查看执行与产物", -1)
              ])]),
              _: 1
            })
          ])),
          createVNode(unref(Drawer), {
            open: executionDrawerOpen.value,
            "onUpdate:open": _cache[29] || (_cache[29] = ($event) => executionDrawerOpen.value = $event),
            title: "执行与产物",
            "get-container": false,
            placement: "right"
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$5, {
                tasks: __props.tasks,
                artifacts: __props.artifacts,
                "active-artifact": __props.activeArtifact,
                disabled: __props.disabled,
                "onUpdate:tasks": _cache[23] || (_cache[23] = ($event) => emit("update:tasks", $event)),
                onApprove: _cache[24] || (_cache[24] = ($event) => emit("approve", $event)),
                onReject: _cache[25] || (_cache[25] = ($event) => emit("reject", $event)),
                onCancel: _cache[26] || (_cache[26] = ($event) => emit("cancel", $event)),
                onRetry: _cache[27] || (_cache[27] = ($event) => emit("retry", $event)),
                onMoveTask: forwardMoveTask,
                onSelectArtifact: _cache[28] || (_cache[28] = ($event) => emit("update:activeArtifact", $event.id))
              }, createSlots({ _: 2 }, [
                _ctx.$slots.task ? {
                  name: "task",
                  fn: withCtx(({ task, index }) => [
                    renderSlot(_ctx.$slots, "task", {
                      task,
                      index
                    })
                  ]),
                  key: "0"
                } : void 0,
                _ctx.$slots.artifact ? {
                  name: "artifact",
                  fn: withCtx(({ artifact }) => [
                    renderSlot(_ctx.$slots, "artifact", { artifact })
                  ]),
                  key: "1"
                } : void 0,
                _ctx.$slots["artifact-preview"] ? {
                  name: "artifact-preview",
                  fn: withCtx(({ artifact }) => [
                    renderSlot(_ctx.$slots, "artifact-preview", { artifact })
                  ]),
                  key: "2"
                } : void 0
              ]), 1032, ["tasks", "artifacts", "active-artifact", "disabled"])
            ]),
            _: 3
          }, 8, ["open"])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
