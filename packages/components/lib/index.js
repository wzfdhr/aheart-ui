"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$9 = require("./alert/index.js");
const index$8 = require("./badge/index.js");
const index$c = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$1 = require("./config-provider/index.js");
const index$3 = require("./divider/index.js");
const index$b = require("./empty/index.js");
const index$4 = require("./flex/index.js");
const index$5 = require("./icon/index.js");
const index$2 = require("./space/index.js");
const index$a = require("./spin/index.js");
const index$e = require("./steps/index.js");
const index$7 = require("./tag/index.js");
const index$d = require("./tabs/index.js");
const index$6 = require("./typography/index.js");
require("./theme/index.css.js");
const components = [
  index.default,
  index$1.default,
  index$2.default,
  index$3.default,
  index$4.default,
  index$5.default,
  index$6.default,
  index$6.Title,
  index$6.Text,
  index$6.Paragraph,
  index$6.Link,
  index$7.default,
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$d.default,
  index$e.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$9.default;
exports.Badge = index$8.default;
exports.Breadcrumb = index$c.default;
exports.Button = index.default;
exports.ConfigProvider = index$1.default;
exports.Divider = index$3.default;
exports.Empty = index$b.default;
exports.Flex = index$4.default;
exports.Icon = index$5.default;
exports.Space = index$2.default;
exports.Spin = index$a.default;
exports.Steps = index$e.default;
exports.Tag = index$7.default;
exports.Tabs = index$d.default;
exports.Link = index$6.Link;
exports.Paragraph = index$6.Paragraph;
exports.Text = index$6.Text;
exports.Title = index$6.Title;
exports.Typography = index$6.default;
exports.default = AheartUI;
