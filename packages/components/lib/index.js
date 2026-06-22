"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index = require("./button/index.js");
const index$1 = require("./config-provider/index.js");
require("./theme/index.css.js");
const components = [index.default, index$1.default];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Button = index.default;
exports.ConfigProvider = index$1.default;
exports.default = AheartUI;
