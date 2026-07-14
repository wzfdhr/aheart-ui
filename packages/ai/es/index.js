import _sfc_main$4 from "./chat-panel.vue.js";
import _sfc_main from "./actions.vue.js";
import _sfc_main$2 from "./attachments.vue.js";
import _sfc_main$3 from "./bubble.vue.js";
import _sfc_main$5 from "./conversations.vue.js";
import _sfc_main$7 from "./process.vue.js";
import _sfc_main$8 from "./prompts.vue.js";
import _sfc_main$9 from "./sender.vue.js";
import _sfc_main$a from "./sources.vue.js";
import _sfc_main$b from "./thought-chain.vue.js";
import _sfc_main$c from "./welcome.vue.js";
import _sfc_main$6 from "./form.vue.js";
import _sfc_main$1 from "./agent-workbench.vue.js";
/* empty css          */
import { AI_FORM_CONDITION_OPERATORS, AI_FORM_FIELD_TYPES, validateAIFormSchema } from "./form-schema.js";
const AheartAI = {
  install(app) {
    app.component("AAIActions", _sfc_main);
    app.component("AAIAgentWorkbench", _sfc_main$1);
    app.component("AAIAttachments", _sfc_main$2);
    app.component("AAIBubble", _sfc_main$3);
    app.component("AAIChatPanel", _sfc_main$4);
    app.component("AAIConversations", _sfc_main$5);
    app.component("AAIForm", _sfc_main$6);
    app.component("AAIProcess", _sfc_main$7);
    app.component("AAIPrompts", _sfc_main$8);
    app.component("AAISender", _sfc_main$9);
    app.component("AAISources", _sfc_main$a);
    app.component("AAIThoughtChain", _sfc_main$b);
    app.component("AAIWelcome", _sfc_main$c);
  }
};
export {
  _sfc_main as AIActions,
  _sfc_main$1 as AIAgentWorkbench,
  _sfc_main$2 as AIAttachments,
  _sfc_main$3 as AIBubble,
  _sfc_main$4 as AIChatPanel,
  _sfc_main$5 as AIConversations,
  _sfc_main$6 as AIForm,
  _sfc_main$7 as AIProcess,
  _sfc_main$8 as AIPrompts,
  _sfc_main$9 as AISender,
  _sfc_main$a as AISources,
  _sfc_main$b as AIThoughtChain,
  _sfc_main$c as AIWelcome,
  AI_FORM_CONDITION_OPERATORS,
  AI_FORM_FIELD_TYPES,
  AheartAI as default,
  validateAIFormSchema
};
