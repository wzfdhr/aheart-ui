"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index = require("./button/index.js");
const index$1 = require("./config-provider/index.js");
const index$3 = require("./divider/index.js");
const index$4 = require("./flex/index.js");
const index$5 = require("./icon/index.js");
const index$2 = require("./space/index.js");
const index$6 = require("./typography/index.js");
require("./theme/index.css.js");
const components = [index.default, index$1.default, index$2.default, index$3.default, index$4.default, index$5.default, index$6.default, index$6.Title, index$6.Text, index$6.Paragraph, index$6.Link];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Button = index.default;
exports.ConfigProvider = index$1.default;
exports.Divider = index$3.default;
exports.Flex = index$4.default;
exports.Icon = index$5.default;
exports.Space = index$2.default;
exports.Link = index$6.Link;
exports.Paragraph = index$6.Paragraph;
exports.Text = index$6.Text;
exports.Title = index$6.Title;
exports.Typography = index$6.default;
exports.default = AheartUI;
