"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$a = require("./alert/index.js");
const index$9 = require("./badge/index.js");
const index$d = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$o = require("./card/index.js");
const index$l = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$p = require("./descriptions/index.js");
const index$3 = require("./divider/index.js");
const index$e = require("./dropdown/index.js");
const index$c = require("./empty/index.js");
const index$4 = require("./flex/index.js");
const index$s = require("./form/index.js");
const index$5 = require("./grid/index.js");
const index$6 = require("./icon/index.js");
const index$i = require("./input/index.js");
const index$k = require("./input-number/index.js");
const index$f = require("./menu/index.js");
const index$q = require("./pagination/index.js");
const index$m = require("./radio/index.js");
const index$r = require("./select/index.js");
const index$2 = require("./space/index.js");
const index$b = require("./spin/index.js");
const index$h = require("./steps/index.js");
const index$n = require("./switch/index.js");
const index$t = require("./table/index.js");
const index$8 = require("./tag/index.js");
const index$g = require("./tabs/index.js");
const index$j = require("./textarea/index.js");
const index$7 = require("./typography/index.js");
require("./theme/index.css.js");
const components = [
  index.default,
  index$1.default,
  index$2.default,
  index$3.default,
  index$4.default,
  index$5.default,
  index$6.default,
  index$7.default,
  index$7.Title,
  index$7.Text,
  index$7.Paragraph,
  index$7.Link,
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$d.default,
  index$e.default,
  index$f.default,
  index$g.default,
  index$h.default,
  index$i.default,
  index$j.default,
  index$k.default,
  index$l.default,
  index$m.default,
  index$n.default,
  index$o.default,
  index$p.default,
  index$q.default,
  index$r.default,
  index$s.default,
  index$s.FormItem,
  index$t.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$a.default;
exports.Badge = index$9.default;
exports.Breadcrumb = index$d.default;
exports.Button = index.default;
exports.Card = index$o.default;
exports.Checkbox = index$l.default;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$p.default;
exports.Divider = index$3.default;
exports.Dropdown = index$e.default;
exports.Empty = index$c.default;
exports.Flex = index$4.default;
exports.Form = index$s.default;
exports.FormItem = index$s.FormItem;
exports.Col = index$5.Col;
exports.Grid = index$5.default;
exports.Row = index$5.Row;
exports.Icon = index$6.default;
exports.Input = index$i.default;
exports.InputNumber = index$k.default;
exports.Menu = index$f.default;
exports.Pagination = index$q.default;
exports.Radio = index$m.default;
exports.Select = index$r.default;
exports.Space = index$2.default;
exports.Spin = index$b.default;
exports.Steps = index$h.default;
exports.Switch = index$n.default;
exports.Table = index$t.default;
exports.Tag = index$8.default;
exports.Tabs = index$g.default;
exports.Textarea = index$j.default;
exports.Link = index$7.Link;
exports.Paragraph = index$7.Paragraph;
exports.Text = index$7.Text;
exports.Title = index$7.Title;
exports.Typography = index$7.default;
exports.default = AheartUI;
