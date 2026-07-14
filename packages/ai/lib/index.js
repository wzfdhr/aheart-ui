"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const chatPanel_vue_vue_type_script_setup_true_lang = require("./chat-panel.vue.js");
const actions_vue_vue_type_script_setup_true_lang = require("./actions.vue.js");
const attachments_vue_vue_type_script_setup_true_lang = require("./attachments.vue.js");
const bubble_vue_vue_type_script_setup_true_lang = require("./bubble.vue.js");
const conversations_vue_vue_type_script_setup_true_lang = require("./conversations.vue.js");
const process_vue_vue_type_script_setup_true_lang = require("./process.vue.js");
const prompts_vue_vue_type_script_setup_true_lang = require("./prompts.vue.js");
const sender_vue_vue_type_script_setup_true_lang = require("./sender.vue.js");
const sources_vue_vue_type_script_setup_true_lang = require("./sources.vue.js");
const thoughtChain_vue_vue_type_script_setup_true_lang = require("./thought-chain.vue.js");
const welcome_vue_vue_type_script_setup_true_lang = require("./welcome.vue.js");
;/* empty css           */
const AheartAI = {
  install(app) {
    app.component("AAIActions", actions_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIAttachments", attachments_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIBubble", bubble_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIChatPanel", chatPanel_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIConversations", conversations_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIProcess", process_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIPrompts", prompts_vue_vue_type_script_setup_true_lang.default);
    app.component("AAISender", sender_vue_vue_type_script_setup_true_lang.default);
    app.component("AAISources", sources_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIThoughtChain", thoughtChain_vue_vue_type_script_setup_true_lang.default);
    app.component("AAIWelcome", welcome_vue_vue_type_script_setup_true_lang.default);
  }
};
exports.AIChatPanel = chatPanel_vue_vue_type_script_setup_true_lang.default;
exports.AIActions = actions_vue_vue_type_script_setup_true_lang.default;
exports.AIAttachments = attachments_vue_vue_type_script_setup_true_lang.default;
exports.AIBubble = bubble_vue_vue_type_script_setup_true_lang.default;
exports.AIConversations = conversations_vue_vue_type_script_setup_true_lang.default;
exports.AIProcess = process_vue_vue_type_script_setup_true_lang.default;
exports.AIPrompts = prompts_vue_vue_type_script_setup_true_lang.default;
exports.AISender = sender_vue_vue_type_script_setup_true_lang.default;
exports.AISources = sources_vue_vue_type_script_setup_true_lang.default;
exports.AIThoughtChain = thoughtChain_vue_vue_type_script_setup_true_lang.default;
exports.AIWelcome = welcome_vue_vue_type_script_setup_true_lang.default;
exports.default = AheartAI;
