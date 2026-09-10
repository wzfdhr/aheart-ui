import m from "./chat-panel.vue.js";
import n from "./actions.vue.js";
import t from "./attachments.vue.js";
import e from "./bubble.vue.js";
import r from "./conversations.vue.js";
import A from "./process.vue.js";
import s from "./prompts.vue.js";
import c from "./sender.vue.js";
import a from "./sources.vue.js";
import i from "./thought-chain.vue.js";
import I from "./welcome.vue.js";
import _ from "./form.vue.js";
import f from "./agent-workbench.vue.js";
/* empty css          */
import { AI_FORM_CONDITION_OPERATORS as W, AI_FORM_FIELD_TYPES as x, validateAIFormSchema as k } from "./form-schema.js";
import { createAIStreamReducer as D, reduceAIStreamEvent as M } from "./stream-reducer.js";
const g = {
  install(o) {
    o.component("AAIActions", n), o.component("AAIAgentWorkbench", f), o.component("AAIAttachments", t), o.component("AAIBubble", e), o.component("AAIChatPanel", m), o.component("AAIConversations", r), o.component("AAIForm", _), o.component("AAIProcess", A), o.component("AAIPrompts", s), o.component("AAISender", c), o.component("AAISources", a), o.component("AAIThoughtChain", i), o.component("AAIWelcome", I);
  }
};
export {
  n as AIActions,
  f as AIAgentWorkbench,
  t as AIAttachments,
  e as AIBubble,
  m as AIChatPanel,
  r as AIConversations,
  _ as AIForm,
  A as AIProcess,
  s as AIPrompts,
  c as AISender,
  a as AISources,
  i as AIThoughtChain,
  I as AIWelcome,
  W as AI_FORM_CONDITION_OPERATORS,
  x as AI_FORM_FIELD_TYPES,
  D as createAIStreamReducer,
  g as default,
  M as reduceAIStreamEvent,
  k as validateAIFormSchema
};
