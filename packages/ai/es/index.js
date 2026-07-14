import _sfc_main$3 from "./chat-panel.vue.js";
import _sfc_main from "./actions.vue.js";
import _sfc_main$1 from "./attachments.vue.js";
import _sfc_main$2 from "./bubble.vue.js";
import _sfc_main$4 from "./conversations.vue.js";
import _sfc_main$6 from "./process.vue.js";
import _sfc_main$7 from "./prompts.vue.js";
import _sfc_main$8 from "./sender.vue.js";
import _sfc_main$9 from "./sources.vue.js";
import _sfc_main$a from "./thought-chain.vue.js";
import _sfc_main$b from "./welcome.vue.js";
import _sfc_main$5 from "./form.vue.js";
/* empty css          */
import { AI_FORM_CONDITION_OPERATORS, AI_FORM_FIELD_TYPES, validateAIFormSchema } from "./form-schema.js";
const AheartAI = {
  install(app) {
    app.component("AAIActions", _sfc_main);
    app.component("AAIAttachments", _sfc_main$1);
    app.component("AAIBubble", _sfc_main$2);
    app.component("AAIChatPanel", _sfc_main$3);
    app.component("AAIConversations", _sfc_main$4);
    app.component("AAIForm", _sfc_main$5);
    app.component("AAIProcess", _sfc_main$6);
    app.component("AAIPrompts", _sfc_main$7);
    app.component("AAISender", _sfc_main$8);
    app.component("AAISources", _sfc_main$9);
    app.component("AAIThoughtChain", _sfc_main$a);
    app.component("AAIWelcome", _sfc_main$b);
  }
};
export {
  _sfc_main as AIActions,
  _sfc_main$1 as AIAttachments,
  _sfc_main$2 as AIBubble,
  _sfc_main$3 as AIChatPanel,
  _sfc_main$4 as AIConversations,
  _sfc_main$5 as AIForm,
  _sfc_main$6 as AIProcess,
  _sfc_main$7 as AIPrompts,
  _sfc_main$8 as AISender,
  _sfc_main$9 as AISources,
  _sfc_main$a as AIThoughtChain,
  _sfc_main$b as AIWelcome,
  AI_FORM_CONDITION_OPERATORS,
  AI_FORM_FIELD_TYPES,
  AheartAI as default,
  validateAIFormSchema
};
