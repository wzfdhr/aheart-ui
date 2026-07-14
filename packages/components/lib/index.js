"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$f = require("./alert/index.js");
const index$e = require("./badge/index.js");
const index$p = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$B = require("./card/index.js");
const index$x = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$C = require("./descriptions/index.js");
const index$4 = require("./date-picker/index.js");
const index$3 = require("./divider/index.js");
const index$i = require("./drawer/index.js");
const index$q = require("./dropdown/index.js");
const index$o = require("./empty/index.js");
const index$9 = require("./flex/index.js");
const index$F = require("./form/index.js");
const index$a = require("./grid/index.js");
const index$b = require("./icon/index.js");
const index$u = require("./input/index.js");
const index$w = require("./input-number/index.js");
const index$r = require("./menu/index.js");
const index$g = require("./message/index.js");
const index$h = require("./modal/index.js");
const index$D = require("./pagination/index.js");
const index$l = require("./popconfirm/index.js");
const index$k = require("./popover/index.js");
const index$y = require("./radio/index.js");
const index$E = require("./select/index.js");
const index$n = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$m = require("./spin/index.js");
const index$t = require("./steps/index.js");
const index$z = require("./switch/index.js");
const index$A = require("./splitter/index.js");
const index$G = require("./table/index.js");
const index$d = require("./tag/index.js");
const index$s = require("./tabs/index.js");
const index$5 = require("./time-picker/index.js");
const index$v = require("./textarea/index.js");
const index$7 = require("./tree/index.js");
const index$8 = require("./tree-select/index.js");
const index$j = require("./tooltip/index.js");
const index$c = require("./typography/index.js");
const index$6 = require("./upload/index.js");
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
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$c.Title,
  index$c.Text,
  index$c.Paragraph,
  index$c.Link,
  index$d.default,
  index$d.CheckableTag,
  index$d.TagGroup,
  index$e.default,
  index$e.BadgeRibbon,
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
  index$q.DropdownButton,
  index$r.default,
  index$s.default,
  index$t.default,
  index$u.default,
  index$v.default,
  index$w.default,
  index$x.default,
  index$x.CheckboxGroup,
  index$y.default,
  index$y.RadioGroup,
  index$z.default,
  index$A.default,
  index$A.SplitterPanel,
  index$B.default,
  index$B.CardGrid,
  index$B.CardMeta,
  index$C.default,
  index$D.default,
  index$E.default,
  index$F.default,
  index$F.FormItem,
  index$G.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$f.default;
exports.Badge = index$e.default;
exports.BadgeRibbon = index$e.BadgeRibbon;
exports.Breadcrumb = index$p.default;
exports.Button = index.default;
exports.Card = index$B.default;
exports.CardGrid = index$B.CardGrid;
exports.CardMeta = index$B.CardMeta;
exports.Checkbox = index$x.default;
exports.CheckboxGroup = index$x.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$C.default;
exports.DatePicker = index$4.default;
exports.Divider = index$3.default;
exports.Drawer = index$i.default;
exports.ADropdownButton = index$q.DropdownButton;
exports.Dropdown = index$q.default;
exports.DropdownButton = index$q.DropdownButton;
exports.Empty = index$o.default;
exports.PRESENTED_IMAGE_DEFAULT = index$o.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$o.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$9.default;
exports.Form = index$F.default;
exports.FormItem = index$F.FormItem;
exports.Col = index$a.Col;
exports.Grid = index$a.default;
exports.Row = index$a.Row;
exports.Icon = index$b.default;
exports.Input = index$u.default;
exports.InputNumber = index$w.default;
exports.Menu = index$r.default;
exports.Message = index$g.default;
exports.Modal = index$h.default;
exports.Pagination = index$D.default;
exports.Popconfirm = index$l.default;
exports.Popover = index$k.default;
exports.Radio = index$y.default;
exports.RadioGroup = index$y.RadioGroup;
exports.Select = index$E.default;
exports.Skeleton = index$n.default;
exports.Space = index$2.default;
exports.Spin = index$m.default;
exports.Steps = index$t.default;
exports.Switch = index$z.default;
exports.Splitter = index$A.default;
exports.SplitterPanel = index$A.SplitterPanel;
exports.Table = index$G.default;
exports.CheckableTag = index$d.CheckableTag;
exports.Tag = index$d.default;
exports.TagGroup = index$d.TagGroup;
exports.Tabs = index$s.default;
exports.TimePicker = index$5.default;
exports.Textarea = index$v.default;
exports.Tree = index$7.default;
exports.TreeSelect = index$8.default;
exports.Tooltip = index$j.default;
exports.Link = index$c.Link;
exports.Paragraph = index$c.Paragraph;
exports.Text = index$c.Text;
exports.Title = index$c.Title;
exports.Typography = index$c.default;
exports.Upload = index$6.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
