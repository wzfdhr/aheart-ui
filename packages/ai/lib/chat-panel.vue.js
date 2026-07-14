"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const bubble_vue_vue_type_script_setup_true_lang = require("./bubble.vue.js");
const sender_vue_vue_type_script_setup_true_lang = require("./sender.vue.js");
const _hoisted_1 = {
  class: "aheart-ai-chat-panel",
  "aria-label": "AI 对话"
};
const _hoisted_2 = {
  class: "aheart-ai-chat-panel__messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
};
const _hoisted_3 = {
  class: "aheart-ai-visually-hidden",
  role: "status",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIChatPanel" },
  __name: "chat-panel",
  props: {
    messages: { default: () => [] },
    transport: {},
    conversationId: { default: void 0 },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:messages", "send", "stop", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const workingMessages = vue.ref([...props.messages]);
    const draft = vue.ref("");
    const sending = vue.ref(false);
    const controller = vue.ref();
    const activeAssistantId = vue.ref();
    const latestDelta = vue.ref("");
    let sequence = 0;
    const currentMessages = vue.computed(() => props.messages);
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
        if (!sending.value) workingMessages.value = [...messages];
      }
    );
    const createId = (prefix) => `${prefix}-${Date.now()}-${sequence++}`;
    const publish = (messages) => {
      workingMessages.value = messages;
      emit("update:messages", messages);
    };
    const updateAssistant = (assistantId, update) => {
      publish(workingMessages.value.map((message) => message.id === assistantId ? { ...message, ...update } : message));
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
        updateAssistant(assistantId, { status: "complete" });
        return true;
      } else if (event.type === "cancelled") {
        updateAssistant(assistantId, { status: "stopped" });
        return true;
      } else if (event.type === "error") {
        updateAssistant(assistantId, { status: "error", error: event.error });
        emit("error", event.error);
        return true;
      }
      return false;
    };
    const submit = async (submittedContent) => {
      var _a;
      const content = (submittedContent ?? draft.value).trim();
      if (!content || sending.value || props.disabled) return;
      const user = { id: createId("user"), role: "user", content, status: "complete" };
      const assistant = { id: createId("assistant"), role: "assistant", content: "", status: "streaming" };
      const requestMessages = [...workingMessages.value, user];
      draft.value = "";
      sending.value = true;
      controller.value = new AbortController();
      activeAssistantId.value = assistant.id;
      latestDelta.value = "";
      publish([...requestMessages, assistant]);
      emit("send", content);
      try {
        for await (const event of props.transport.send({ conversationId: props.conversationId, messages: requestMessages }, controller.value.signal)) {
          if (controller.value.signal.aborted) break;
          if (applyEvent(assistant.id, event)) break;
        }
        const message = workingMessages.value.find((item) => item.id === assistant.id);
        if ((message == null ? void 0 : message.status) === "streaming") updateAssistant(assistant.id, { status: "complete" });
      } catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        if ((_a = controller.value) == null ? void 0 : _a.signal.aborted) {
          updateAssistant(assistant.id, { status: "stopped" });
        } else {
          updateAssistant(assistant.id, { status: "error", error: message });
          emit("error", message);
        }
      } finally {
        sending.value = false;
        controller.value = void 0;
        activeAssistantId.value = void 0;
        workingMessages.value = [...props.messages];
      }
    };
    const stop = () => {
      var _a;
      if (activeAssistantId.value) updateAssistant(activeAssistantId.value, { status: "stopped" });
      (_a = controller.value) == null ? void 0 : _a.abort();
      emit("stop");
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
        vue.createElementVNode("div", _hoisted_2, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(currentMessages.value, (message) => {
            return vue.openBlock(), vue.createBlock(bubble_vue_vue_type_script_setup_true_lang.default, {
              key: message.id,
              message
            }, null, 8, ["message"]);
          }), 128))
        ]),
        vue.createVNode(sender_vue_vue_type_script_setup_true_lang.default, {
          modelValue: draft.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => draft.value = $event),
          disabled: __props.disabled,
          loading: sending.value,
          onSubmit: submit,
          onStop: stop
        }, null, 8, ["modelValue", "disabled", "loading"]),
        vue.createElementVNode("p", _hoisted_3, vue.toDisplayString(announcement.value), 1)
      ]);
    };
  }
});
exports.default = _sfc_main;
