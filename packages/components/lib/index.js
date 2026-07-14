"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$a = require("./alert/index.js");
const index$9 = require("./badge/index.js");
const index$k = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$w = require("./card/index.js");
const index$s = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$x = require("./descriptions/index.js");
const index$3 = require("./divider/index.js");
const index$d = require("./drawer/index.js");
const index$l = require("./dropdown/index.js");
const index$j = require("./empty/index.js");
const index$4 = require("./flex/index.js");
const index$A = require("./form/index.js");
const index$5 = require("./grid/index.js");
const index$6 = require("./icon/index.js");
const index$p = require("./input/index.js");
const index$r = require("./input-number/index.js");
const index$m = require("./menu/index.js");
const index$b = require("./message/index.js");
const index$c = require("./modal/index.js");
const index$y = require("./pagination/index.js");
const index$g = require("./popconfirm/index.js");
const index$f = require("./popover/index.js");
const index$t = require("./radio/index.js");
const index$z = require("./select/index.js");
const index$i = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$h = require("./spin/index.js");
const index$o = require("./steps/index.js");
const index$u = require("./switch/index.js");
const index$v = require("./splitter/index.js");
const index$B = require("./table/index.js");
const index$8 = require("./tag/index.js");
const index$n = require("./tabs/index.js");
const index$q = require("./textarea/index.js");
const index$e = require("./tooltip/index.js");
const index$7 = require("./typography/index.js");
require("./theme/index.css.js");
const service = require("./message/service.js");
const context = require("./config/context.js");
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
  index$8.CheckableTag,
  index$8.TagGroup,
  index$9.default,
  index$9.BadgeRibbon,
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
  index$l.DropdownButton,
  index$m.default,
  index$n.default,
  index$o.default,
  index$p.default,
  index$q.default,
  index$r.default,
  index$s.default,
  index$s.CheckboxGroup,
  index$t.default,
  index$t.RadioGroup,
  index$u.default,
  index$v.default,
  index$v.SplitterPanel,
  index$w.default,
  index$w.CardGrid,
  index$w.CardMeta,
  index$x.default,
  index$y.default,
  index$z.default,
  index$A.default,
  index$A.FormItem,
  index$B.default
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
exports.BadgeRibbon = index$9.BadgeRibbon;
exports.Breadcrumb = index$k.default;
exports.Button = index.default;
exports.Card = index$w.default;
exports.CardGrid = index$w.CardGrid;
exports.CardMeta = index$w.CardMeta;
exports.Checkbox = index$s.default;
exports.CheckboxGroup = index$s.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$x.default;
exports.Divider = index$3.default;
exports.Drawer = index$d.default;
exports.ADropdownButton = index$l.DropdownButton;
exports.Dropdown = index$l.default;
exports.DropdownButton = index$l.DropdownButton;
exports.Empty = index$j.default;
exports.PRESENTED_IMAGE_DEFAULT = index$j.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$j.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$4.default;
exports.Form = index$A.default;
exports.FormItem = index$A.FormItem;
exports.Col = index$5.Col;
exports.Grid = index$5.default;
exports.Row = index$5.Row;
exports.Icon = index$6.default;
exports.Input = index$p.default;
exports.InputNumber = index$r.default;
exports.Menu = index$m.default;
exports.Message = index$b.default;
exports.Modal = index$c.default;
exports.Pagination = index$y.default;
exports.Popconfirm = index$g.default;
exports.Popover = index$f.default;
exports.Radio = index$t.default;
exports.RadioGroup = index$t.RadioGroup;
exports.Select = index$z.default;
exports.Skeleton = index$i.default;
exports.Space = index$2.default;
exports.Spin = index$h.default;
exports.Steps = index$o.default;
exports.Switch = index$u.default;
exports.Splitter = index$v.default;
exports.SplitterPanel = index$v.SplitterPanel;
exports.Table = index$B.default;
exports.CheckableTag = index$8.CheckableTag;
exports.Tag = index$8.default;
exports.TagGroup = index$8.TagGroup;
exports.Tabs = index$n.default;
exports.Textarea = index$q.default;
exports.Tooltip = index$e.default;
exports.Link = index$7.Link;
exports.Paragraph = index$7.Paragraph;
exports.Text = index$7.Text;
exports.Title = index$7.Title;
exports.Typography = index$7.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
