"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$a = require("./alert/index.js");
const index$9 = require("./badge/index.js");
const index$f = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$q = require("./card/index.js");
const index$n = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$r = require("./descriptions/index.js");
const index$3 = require("./divider/index.js");
const index$g = require("./dropdown/index.js");
const index$e = require("./empty/index.js");
const index$4 = require("./flex/index.js");
const index$u = require("./form/index.js");
const index$5 = require("./grid/index.js");
const index$6 = require("./icon/index.js");
const index$k = require("./input/index.js");
const index$m = require("./input-number/index.js");
const index$h = require("./menu/index.js");
const index$b = require("./message/index.js");
const index$s = require("./pagination/index.js");
const index$o = require("./radio/index.js");
const index$t = require("./select/index.js");
const index$d = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$c = require("./spin/index.js");
const index$j = require("./steps/index.js");
const index$p = require("./switch/index.js");
const index$v = require("./table/index.js");
const index$8 = require("./tag/index.js");
const index$i = require("./tabs/index.js");
const index$l = require("./textarea/index.js");
const index$7 = require("./typography/index.js");
require("./theme/index.css.js");
const service = require("./message/service.js");
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
  index$t.default,
  index$u.default,
  index$u.FormItem,
  index$v.default
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
exports.Breadcrumb = index$f.default;
exports.Button = index.default;
exports.Card = index$q.default;
exports.Checkbox = index$n.default;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$r.default;
exports.Divider = index$3.default;
exports.Dropdown = index$g.default;
exports.Empty = index$e.default;
exports.Flex = index$4.default;
exports.Form = index$u.default;
exports.FormItem = index$u.FormItem;
exports.Col = index$5.Col;
exports.Grid = index$5.default;
exports.Row = index$5.Row;
exports.Icon = index$6.default;
exports.Input = index$k.default;
exports.InputNumber = index$m.default;
exports.Menu = index$h.default;
exports.Message = index$b.default;
exports.Pagination = index$s.default;
exports.Radio = index$o.default;
exports.Select = index$t.default;
exports.Skeleton = index$d.default;
exports.Space = index$2.default;
exports.Spin = index$c.default;
exports.Steps = index$j.default;
exports.Switch = index$p.default;
exports.Table = index$v.default;
exports.Tag = index$8.default;
exports.Tabs = index$i.default;
exports.Textarea = index$l.default;
exports.Link = index$7.Link;
exports.Paragraph = index$7.Paragraph;
exports.Text = index$7.Text;
exports.Title = index$7.Title;
exports.Typography = index$7.default;
exports.message = service.message;
exports.default = AheartUI;
