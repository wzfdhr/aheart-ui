"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const message_vue_vue_type_script_setup_true_lang = require("./message.vue.js");
const install = require("../utils/install.js");
const service = require("./service.js");
const Message = install.withInstall(message_vue_vue_type_script_setup_true_lang.default, "AMessage");
exports.message = service.message;
exports.default = Message;
