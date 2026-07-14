import { defineComponent, ref, computed, openBlock, createElementBlock, createElementVNode, createVNode, unref, withCtx, toDisplayString, createCommentVNode, createTextVNode, createBlock, renderSlot, createSlots } from "vue";
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
const _hoisted_2 = { class: "aheart-ai-workbench__desktop" };
const _hoisted_3 = { class: "aheart-ai-workbench__sidebar" };
const _hoisted_4 = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
};
const _hoisted_5 = ["data-context-id"];
const _hoisted_6 = { key: 0 };
const _hoisted_7 = { class: "aheart-ai-workbench__move-actions" };
const _hoisted_8 = { class: "aheart-ai-workbench__chat" };
const _hoisted_9 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_10 = {
  class: "aheart-ai-workbench__execution",
  "aria-label": "执行与产物"
};
const _hoisted_11 = { class: "aheart-ai-workbench__mobile" };
const _hoisted_12 = {
  key: 0,
  class: "aheart-ai-workbench__mobile-panel"
};
const _hoisted_13 = {
  key: 0,
  class: "aheart-ai-workbench__context",
  "aria-label": "上下文"
};
const _hoisted_14 = ["data-context-id"];
const _hoisted_15 = { key: 0 };
const _hoisted_16 = { class: "aheart-ai-workbench__move-actions" };
const _hoisted_17 = {
  key: 1,
  class: "aheart-ai-workbench__mobile-panel"
};
const _hoisted_18 = {
  key: 1,
  class: "aheart-ai-workbench__empty"
};
const _hoisted_19 = {
  key: 2,
  class: "aheart-ai-workbench__mobile-panel"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIAgentWorkbench" },
  __name: "agent-workbench",
  props: {
    panelSizes: { default: () => [240, "auto", 320] },
    conversations: { default: () => [] },
    activeConversation: { default: void 0 },
    messages: { default: () => [] },
    transport: { default: void 0 },
    tasks: { default: () => [] },
    contextItems: { default: () => [] },
    sources: { default: () => [] },
    attachments: { default: () => [] },
    artifacts: { default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:panelSizes", "update:activeConversation", "update:messages", "update:tasks", "update:contextItems", "approve", "reject", "cancel", "retry", "move-task", "move-context", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const mobileView = ref("chat");
    const executionDrawerOpen = ref(false);
    const mobileTabs = [
      { key: "conversations", label: "会话" },
      { key: "chat", label: "对话" },
      { key: "execution", label: "执行" }
    ];
    const sortableContext = computed(() => props.contextItems);
    const asContext = (item) => item;
    const reorder = (items, index, offset) => {
      const destination = index + offset;
      if (destination < 0 || destination >= items.length) return items;
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(destination, 0, item);
      return next;
    };
    const moveContext = (index, offset) => {
      if (props.disabled) return;
      const item = props.contextItems[index];
      if (!item || index + offset < 0 || index + offset >= props.contextItems.length) return;
      emit("update:contextItems", reorder(props.contextItems, index, offset));
      emit("move-context", item.id, offset < 0 ? "up" : "down");
    };
    const updateContext = (items) => {
      if (!props.disabled) emit("update:contextItems", items);
    };
    const forwardMoveTask = (id, direction) => emit("move-task", id, direction);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(Splitter), {
            sizes: __props.panelSizes,
            "default-sizes": [240, "auto", 320],
            "onUpdate:sizes": _cache[8] || (_cache[8] = ($event) => emit("update:panelSizes", $event))
          }, {
            default: withCtx(() => [
              createVNode(unref(SplitterPanel), {
                min: 180,
                collapsible: ""
              }, {
                default: withCtx(() => [
                  createElementVNode("aside", _hoisted_3, [
                    _cache[23] || (_cache[23] = createElementVNode("h2", null, "会话", -1)),
                    createVNode(_sfc_main$1, {
                      "model-value": __props.activeConversation,
                      conversations: __props.conversations,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:activeConversation", $event))
                    }, null, 8, ["model-value", "conversations"]),
                    __props.contextItems.length ? (openBlock(), createElementBlock("section", _hoisted_4, [
                      _cache[22] || (_cache[22] = createElementVNode("h3", null, "上下文", -1)),
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
                            asContext(item).description ? (openBlock(), createElementBlock("small", _hoisted_6, toDisplayString(asContext(item).description), 1)) : createCommentVNode("", true),
                            createElementVNode("div", _hoisted_7, [
                              createVNode(unref(Button), {
                                type: "text",
                                disabled: __props.disabled || index === 0,
                                onClick: ($event) => moveContext(index, -1)
                              }, {
                                default: withCtx(() => [..._cache[20] || (_cache[20] = [
                                  createTextVNode("上移", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled", "onClick"]),
                              createVNode(unref(Button), {
                                type: "text",
                                disabled: __props.disabled || index === __props.contextItems.length - 1,
                                onClick: ($event) => moveContext(index, 1)
                              }, {
                                default: withCtx(() => [..._cache[21] || (_cache[21] = [
                                  createTextVNode("下移", -1)
                                ])]),
                                _: 1
                              }, 8, ["disabled", "onClick"])
                            ])
                          ], 8, _hoisted_5)
                        ]),
                        _: 1
                      }, 8, ["items", "disabled"])
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(SplitterPanel), { min: 320 }, {
                default: withCtx(() => [
                  createElementVNode("main", _hoisted_8, [
                    __props.transport ? (openBlock(), createBlock(_sfc_main$2, {
                      key: 0,
                      messages: __props.messages,
                      transport: __props.transport,
                      "conversation-id": __props.activeConversation,
                      disabled: __props.disabled,
                      "onUpdate:messages": _cache[1] || (_cache[1] = ($event) => emit("update:messages", $event)),
                      onError: _cache[2] || (_cache[2] = ($event) => emit("error", $event))
                    }, null, 8, ["messages", "transport", "conversation-id", "disabled"])) : (openBlock(), createElementBlock("p", _hoisted_9, "业务层尚未提供对话传输适配器。")),
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
                min: 240,
                collapsible: ""
              }, {
                default: withCtx(() => [
                  createElementVNode("aside", _hoisted_10, [
                    createVNode(_sfc_main$5, {
                      tasks: __props.tasks,
                      artifacts: __props.artifacts,
                      disabled: __props.disabled,
                      "onUpdate:tasks": _cache[3] || (_cache[3] = ($event) => emit("update:tasks", $event)),
                      onApprove: _cache[4] || (_cache[4] = ($event) => emit("approve", $event)),
                      onReject: _cache[5] || (_cache[5] = ($event) => emit("reject", $event)),
                      onCancel: _cache[6] || (_cache[6] = ($event) => emit("cancel", $event)),
                      onRetry: _cache[7] || (_cache[7] = ($event) => emit("retry", $event)),
                      onMoveTask: forwardMoveTask
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
                      } : void 0
                    ]), 1032, ["tasks", "artifacts", "disabled"])
                  ])
                ]),
                _: 3
              })
            ]),
            _: 3
          }, 8, ["sizes"])
        ]),
        createElementVNode("div", _hoisted_11, [
          createVNode(unref(Tabs), {
            items: mobileTabs,
            "active-key": mobileView.value,
            "onUpdate:activeKey": _cache[9] || (_cache[9] = ($event) => mobileView.value = $event)
          }, null, 8, ["active-key"]),
          mobileView.value === "conversations" ? (openBlock(), createElementBlock("section", _hoisted_12, [
            createVNode(_sfc_main$1, {
              "model-value": __props.activeConversation,
              conversations: __props.conversations,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => emit("update:activeConversation", $event))
            }, null, 8, ["model-value", "conversations"]),
            __props.contextItems.length ? (openBlock(), createElementBlock("section", _hoisted_13, [
              _cache[26] || (_cache[26] = createElementVNode("h3", null, "上下文", -1)),
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
                    asContext(item).description ? (openBlock(), createElementBlock("small", _hoisted_15, toDisplayString(asContext(item).description), 1)) : createCommentVNode("", true),
                    createElementVNode("div", _hoisted_16, [
                      createVNode(unref(Button), {
                        type: "text",
                        disabled: __props.disabled || index === 0,
                        onClick: ($event) => moveContext(index, -1)
                      }, {
                        default: withCtx(() => [..._cache[24] || (_cache[24] = [
                          createTextVNode("上移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"]),
                      createVNode(unref(Button), {
                        type: "text",
                        disabled: __props.disabled || index === __props.contextItems.length - 1,
                        onClick: ($event) => moveContext(index, 1)
                      }, {
                        default: withCtx(() => [..._cache[25] || (_cache[25] = [
                          createTextVNode("下移", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled", "onClick"])
                    ])
                  ], 8, _hoisted_14)
                ]),
                _: 1
              }, 8, ["items", "disabled"])
            ])) : createCommentVNode("", true)
          ])) : mobileView.value === "chat" ? (openBlock(), createElementBlock("section", _hoisted_17, [
            __props.transport ? (openBlock(), createBlock(_sfc_main$2, {
              key: 0,
              messages: __props.messages,
              transport: __props.transport,
              "conversation-id": __props.activeConversation,
              disabled: __props.disabled,
              "onUpdate:messages": _cache[11] || (_cache[11] = ($event) => emit("update:messages", $event)),
              onError: _cache[12] || (_cache[12] = ($event) => emit("error", $event))
            }, null, 8, ["messages", "transport", "conversation-id", "disabled"])) : (openBlock(), createElementBlock("p", _hoisted_18, "业务层尚未提供对话传输适配器。")),
            renderSlot(_ctx.$slots, "sources", { sources: __props.sources }, () => [
              createVNode(_sfc_main$3, { sources: __props.sources }, null, 8, ["sources"])
            ]),
            renderSlot(_ctx.$slots, "attachments", { attachments: __props.attachments }, () => [
              createVNode(_sfc_main$4, { items: __props.attachments }, null, 8, ["items"])
            ])
          ])) : (openBlock(), createElementBlock("section", _hoisted_19, [
            createVNode(unref(Button), {
              "data-action": "open-execution-drawer",
              type: "primary",
              onClick: _cache[13] || (_cache[13] = ($event) => executionDrawerOpen.value = true)
            }, {
              default: withCtx(() => [..._cache[27] || (_cache[27] = [
                createTextVNode("查看执行与产物", -1)
              ])]),
              _: 1
            })
          ])),
          createVNode(unref(Drawer), {
            open: executionDrawerOpen.value,
            "onUpdate:open": _cache[19] || (_cache[19] = ($event) => executionDrawerOpen.value = $event),
            title: "执行与产物",
            "get-container": false,
            placement: "right"
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$5, {
                tasks: __props.tasks,
                artifacts: __props.artifacts,
                disabled: __props.disabled,
                "onUpdate:tasks": _cache[14] || (_cache[14] = ($event) => emit("update:tasks", $event)),
                onApprove: _cache[15] || (_cache[15] = ($event) => emit("approve", $event)),
                onReject: _cache[16] || (_cache[16] = ($event) => emit("reject", $event)),
                onCancel: _cache[17] || (_cache[17] = ($event) => emit("cancel", $event)),
                onRetry: _cache[18] || (_cache[18] = ($event) => emit("retry", $event)),
                onMoveTask: forwardMoveTask
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
                } : void 0
              ]), 1032, ["tasks", "artifacts", "disabled"])
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
