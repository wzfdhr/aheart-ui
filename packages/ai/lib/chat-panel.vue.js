"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const attachments_vue_vue_type_script_setup_true_lang = require("./attachments.vue.js");
const bubble_vue_vue_type_script_setup_true_lang = require("./bubble.vue.js");
const conversations_vue_vue_type_script_setup_true_lang = require("./conversations.vue.js");
const prompts_vue_vue_type_script_setup_true_lang = require("./prompts.vue.js");
const sender_vue_vue_type_script_setup_true_lang = require("./sender.vue.js");
const welcome_vue_vue_type_script_setup_true_lang = require("./welcome.vue.js");
const _hoisted_1 = {
  class: "aheart-ai-chat-panel",
  "aria-label": "AI 对话"
};
const _hoisted_2 = { class: "aheart-ai-chat-panel__surface" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-ai-chat-panel__messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
};
const _hoisted_4 = {
  class: "aheart-ai-chat-panel__message-actions",
  "aria-label": "消息操作"
};
const _hoisted_5 = ["aria-label", "onClick"];
const _hoisted_6 = ["disabled", "onClick"];
const _hoisted_7 = ["disabled", "onClick"];
const _hoisted_8 = ["disabled", "onClick"];
const _hoisted_9 = {
  key: 1,
  class: "aheart-ai-chat-panel__empty"
};
const _hoisted_10 = { class: "aheart-ai-chat-panel__composer" };
const _hoisted_11 = {
  key: 0,
  class: "aheart-ai-chat-panel__editing",
  role: "status"
};
const _hoisted_12 = {
  class: "aheart-ai-visually-hidden",
  role: "status",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIChatPanel" },
  __name: "chat-panel",
  props: {
    messages: { default: () => [] },
    defaultMessages: { default: () => [] },
    transport: {},
    conversationId: { default: void 0 },
    conversations: { default: () => [] },
    activeConversation: { default: void 0 },
    prompts: { default: () => [] },
    attachments: { default: () => [] },
    welcomeTitle: { default: "你好，我能为你做些什么？" },
    welcomeDescription: { default: "描述目标、补充上下文，或从建议任务开始。" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:messages", "update:activeConversation", "update:attachments", "send", "stop", "retry", "regenerate", "edit", "copy", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const instance = vue.getCurrentInstance();
    const hasProp = (name) => Object.prototype.hasOwnProperty.call((instance == null ? void 0 : instance.vnode.props) ?? {}, name);
    const hasMessagesProp = vue.ref(hasProp("messages"));
    vue.onBeforeUpdate(() => {
      hasMessagesProp.value = hasProp("messages");
    });
    const isMessagesControlled = () => hasMessagesProp.value;
    const localMessages = vue.ref([...props.defaultMessages]);
    const workingMessages = vue.ref(isMessagesControlled() ? [...props.messages] : [...localMessages.value]);
    const draft = vue.ref("");
    const sending = vue.ref(false);
    const controller = vue.ref();
    const activeAssistantId = vue.ref();
    const editingMessage = vue.ref();
    const latestDelta = vue.ref("");
    let sequence = 0;
    const currentMessages = vue.computed(() => isMessagesControlled() ? props.messages : localMessages.value);
    const resolvedConversationId = vue.computed(() => props.conversationId ?? props.activeConversation);
    const announcement = vue.computed(() => {
      if (sending.value && latestDelta.value) return `AI 回复：${latestDelta.value}`;
      const message = [...currentMessages.value].reverse().find((item) => item.role === "assistant");
      if (!message) return "";
      if (message.status === "streaming") return "正在生成";
      if (message.status === "stopped") return "已停止生成";
      if (message.status === "error") return "生成失败";
      return message.status === "complete" ? "已完成生成" : "";
    });
    vue.watch(
      () => props.messages,
      (messages) => {
        if (isMessagesControlled() && !sending.value) workingMessages.value = [...messages];
      },
      { deep: true }
    );
    const createId = (prefix) => `${prefix}-${Date.now()}-${sequence++}`;
    const publish = (messages) => {
      workingMessages.value = messages;
      if (!isMessagesControlled()) localMessages.value = messages;
      emit("update:messages", messages);
    };
    const updateAssistant = (assistantId, update) => {
      publish(workingMessages.value.map((message) => message.id === assistantId ? { ...message, ...update } : message));
    };
    const settleProcess = (items, status, detail) => items == null ? void 0 : items.map((item) => item.status === "pending" || item.status === "running" ? { ...item, status, ...detail && !item.detail ? { detail } : {} } : item);
    const finishAssistant = (assistantId, status, error) => {
      const assistant = workingMessages.value.find((message) => message.id === assistantId);
      if (!assistant) return;
      const processStatus = status === "complete" ? "complete" : status === "stopped" ? "stopped" : "error";
      updateAssistant(assistantId, {
        status,
        ...error ? { error } : {},
        process: settleProcess(assistant.process, processStatus, error)
      });
    };
    const applyEvent = (assistantId, event) => {
      const assistant = workingMessages.value.find((message) => message.id === assistantId);
      if (!assistant) return false;
      if (event.type === "text-delta") {
        latestDelta.value = event.delta;
        updateAssistant(assistantId, { content: `${assistant.content}${event.delta}` });
      } else if (event.type === "process") {
        const process = [...(assistant.process ?? []).filter((item) => item.id !== event.item.id), event.item];
        updateAssistant(assistantId, { process });
      } else if (event.type === "sources") {
        updateAssistant(assistantId, { sources: event.sources });
      } else if (event.type === "done") {
        finishAssistant(assistantId, "complete");
        return true;
      } else if (event.type === "cancelled") {
        finishAssistant(assistantId, "stopped");
        return true;
      } else if (event.type === "error") {
        finishAssistant(assistantId, "error", event.error);
        emit("error", event.error);
        return true;
      }
      return false;
    };
    const streamResponse = async (requestMessages, options = {}) => {
      const assistant = {
        id: createId("assistant"),
        role: "assistant",
        content: "",
        status: "streaming"
      };
      const activeController = new AbortController();
      sending.value = true;
      controller.value = activeController;
      activeAssistantId.value = assistant.id;
      latestDelta.value = "";
      publish([...requestMessages, assistant]);
      try {
        for await (const event of props.transport.send(
          {
            conversationId: resolvedConversationId.value,
            messages: requestMessages,
            ...options.action && { action: options.action },
            ...options.messageId && { messageId: options.messageId }
          },
          activeController.signal
        )) {
          if (activeController.signal.aborted) break;
          if (applyEvent(assistant.id, event)) break;
        }
        const message = workingMessages.value.find((item) => item.id === assistant.id);
        if ((message == null ? void 0 : message.status) === "streaming") finishAssistant(assistant.id, "complete");
      } catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        if (activeController.signal.aborted) {
          finishAssistant(assistant.id, "stopped");
        } else {
          finishAssistant(assistant.id, "error", message);
          emit("error", message);
        }
      } finally {
        if (controller.value === activeController) {
          sending.value = false;
          controller.value = void 0;
          activeAssistantId.value = void 0;
          workingMessages.value = [...currentMessages.value];
        }
      }
    };
    const submit = async (submittedContent) => {
      const content = (submittedContent ?? draft.value).trim();
      if (!content || sending.value || props.disabled) return;
      if (editingMessage.value) {
        const original = editingMessage.value;
        const source = [...currentMessages.value];
        const index = source.findIndex((message) => message.id === original.id);
        if (index < 0) return;
        const edited = { ...original, content, status: "complete" };
        draft.value = "";
        editingMessage.value = void 0;
        emit("edit", original, content);
        await streamResponse([...source.slice(0, index), edited], { action: "edit", messageId: original.id });
        return;
      }
      const user = {
        id: createId("user"),
        role: "user",
        content,
        status: "complete",
        ...props.attachments.length && { attachments: [...props.attachments] }
      };
      const requestMessages = [...currentMessages.value, user];
      draft.value = "";
      emit("send", content);
      if (props.attachments.length) emit("update:attachments", []);
      await streamResponse(requestMessages);
    };
    const rerunAssistant = async (message, action) => {
      if (sending.value || props.disabled) return;
      const source = [...currentMessages.value];
      const index = source.findIndex((candidate) => candidate.id === message.id);
      if (index < 1) return;
      const requestMessages = source.slice(0, index);
      const lastUser = [...requestMessages].reverse().find((candidate) => candidate.role === "user");
      if (!lastUser) return;
      if (action === "retry") emit("retry", message);
      else emit("regenerate", message);
      await streamResponse(requestMessages, { action, messageId: message.id });
    };
    const retryMessage = (message) => rerunAssistant(message, "retry");
    const regenerateMessage = (message) => rerunAssistant(message, "regenerate");
    const beginEdit = (message) => {
      if (sending.value || props.disabled) return;
      editingMessage.value = message;
      draft.value = message.content;
    };
    const cancelEdit = () => {
      editingMessage.value = void 0;
      draft.value = "";
    };
    const copyMessage = (message) => {
      var _a, _b;
      void ((_b = (_a = globalThis.navigator) == null ? void 0 : _a.clipboard) == null ? void 0 : _b.writeText(message.content));
      emit("copy", message);
    };
    const removeAttachment = (attachment) => {
      emit("update:attachments", props.attachments.filter((item) => item.id !== attachment.id));
    };
    const stop = () => {
      var _a;
      if (activeAssistantId.value) finishAssistant(activeAssistantId.value, "stopped");
      (_a = controller.value) == null ? void 0 : _a.abort();
      emit("stop");
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
        __props.conversations.length ? (vue.openBlock(), vue.createBlock(conversations_vue_vue_type_script_setup_true_lang.default, {
          key: 0,
          "model-value": __props.activeConversation,
          conversations: __props.conversations,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:activeConversation", $event))
        }, null, 8, ["model-value", "conversations"])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2, [
          currentMessages.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(currentMessages.value, (message) => {
              return vue.openBlock(), vue.createBlock(bubble_vue_vue_type_script_setup_true_lang.default, {
                key: message.id,
                "data-message-id": message.id,
                message
              }, {
                actions: vue.withCtx(() => [
                  vue.createElementVNode("div", _hoisted_4, [
                    message.content ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      type: "button",
                      "data-action": "copy",
                      "aria-label": `复制${message.role === "user" ? "问题" : "回答"}`,
                      onClick: ($event) => copyMessage(message)
                    }, " 复制 ", 8, _hoisted_5)) : vue.createCommentVNode("", true),
                    message.role === "user" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      type: "button",
                      "data-action": "edit",
                      disabled: __props.disabled || sending.value,
                      onClick: ($event) => beginEdit(message)
                    }, " 编辑 ", 8, _hoisted_6)) : vue.createCommentVNode("", true),
                    message.role === "assistant" && (message.status === "error" || message.status === "stopped") ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 2,
                      type: "button",
                      "data-action": "retry",
                      disabled: __props.disabled || sending.value,
                      onClick: ($event) => retryMessage(message)
                    }, " 重试 ", 8, _hoisted_7)) : vue.createCommentVNode("", true),
                    message.role === "assistant" && message.status === "complete" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 3,
                      type: "button",
                      "data-action": "regenerate",
                      disabled: __props.disabled || sending.value,
                      onClick: ($event) => regenerateMessage(message)
                    }, " 重新生成 ", 8, _hoisted_8)) : vue.createCommentVNode("", true)
                  ])
                ]),
                _: 2
              }, 1032, ["data-message-id", "message"]);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
            vue.createVNode(welcome_vue_vue_type_script_setup_true_lang.default, {
              title: __props.welcomeTitle,
              description: __props.welcomeDescription
            }, null, 8, ["title", "description"]),
            vue.createVNode(prompts_vue_vue_type_script_setup_true_lang.default, {
              prompts: __props.prompts,
              disabled: __props.disabled || sending.value,
              onSelect: _cache[1] || (_cache[1] = ($event) => submit($event.label))
            }, null, 8, ["prompts", "disabled"])
          ])),
          vue.createElementVNode("div", _hoisted_10, [
            editingMessage.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
              _cache[3] || (_cache[3] = vue.createElementVNode("span", null, "正在编辑已发送的问题", -1)),
              vue.createElementVNode("button", {
                type: "button",
                onClick: cancelEdit
              }, "取消编辑")
            ])) : vue.createCommentVNode("", true),
            vue.createVNode(attachments_vue_vue_type_script_setup_true_lang.default, {
              items: __props.attachments,
              removable: "",
              onRemove: removeAttachment
            }, null, 8, ["items"]),
            vue.createVNode(sender_vue_vue_type_script_setup_true_lang.default, {
              modelValue: draft.value,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => draft.value = $event),
              disabled: __props.disabled,
              loading: sending.value,
              onSubmit: submit,
              onStop: stop
            }, null, 8, ["modelValue", "disabled", "loading"])
          ])
        ]),
        vue.createElementVNode("p", _hoisted_12, vue.toDisplayString(announcement.value), 1)
      ]);
    };
  }
});
exports.default = _sfc_main;
