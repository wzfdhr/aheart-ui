"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$a = require("./alert/index.js");
const index$9 = require("./badge/index.js");
const index$h = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$s = require("./card/index.js");
const index$p = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$t = require("./descriptions/index.js");
const index$3 = require("./divider/index.js");
const index$d = require("./drawer/index.js");
const index$i = require("./dropdown/index.js");
const index$g = require("./empty/index.js");
const index$4 = require("./flex/index.js");
const index$w = require("./form/index.js");
const index$5 = require("./grid/index.js");
const index$6 = require("./icon/index.js");
const index$m = require("./input/index.js");
const index$o = require("./input-number/index.js");
const index$j = require("./menu/index.js");
const index$b = require("./message/index.js");
const index$c = require("./modal/index.js");
const index$u = require("./pagination/index.js");
const index$q = require("./radio/index.js");
const index$v = require("./select/index.js");
const index$f = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$e = require("./spin/index.js");
const index$l = require("./steps/index.js");
const index$r = require("./switch/index.js");
const index$x = require("./table/index.js");
const index$8 = require("./tag/index.js");
const index$k = require("./tabs/index.js");
const index$n = require("./textarea/index.js");
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
  index$v.default,
  index$w.default,
  index$w.FormItem,
  index$x.default
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
exports.Breadcrumb = index$h.default;
exports.Button = index.default;
exports.Card = index$s.default;
exports.Checkbox = index$p.default;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$t.default;
exports.Divider = index$3.default;
exports.Drawer = index$d.default;
exports.Dropdown = index$i.default;
exports.Empty = index$g.default;
exports.Flex = index$4.default;
exports.Form = index$w.default;
exports.FormItem = index$w.FormItem;
exports.Col = index$5.Col;
exports.Grid = index$5.default;
exports.Row = index$5.Row;
exports.Icon = index$6.default;
exports.Input = index$m.default;
exports.InputNumber = index$o.default;
exports.Menu = index$j.default;
exports.Message = index$b.default;
exports.Modal = index$c.default;
exports.Pagination = index$u.default;
exports.Radio = index$q.default;
exports.Select = index$v.default;
exports.Skeleton = index$f.default;
exports.Space = index$2.default;
exports.Spin = index$e.default;
exports.Steps = index$l.default;
exports.Switch = index$r.default;
exports.Table = index$x.default;
exports.Tag = index$8.default;
exports.Tabs = index$k.default;
exports.Textarea = index$n.default;
exports.Link = index$7.Link;
exports.Paragraph = index$7.Paragraph;
exports.Text = index$7.Text;
exports.Title = index$7.Title;
exports.Typography = index$7.default;
exports.message = service.message;
exports.default = AheartUI;
