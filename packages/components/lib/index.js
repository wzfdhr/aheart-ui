"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index = require("./button/index.js");
require("./theme/index.css.js");
const components = [index.default];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Button = index.default;
exports.default = AheartUI;
