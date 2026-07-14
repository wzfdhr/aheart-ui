"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$e = require("./alert/index.js");
const index$d = require("./badge/index.js");
const index$o = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$A = require("./card/index.js");
const index$w = require("./checkbox/index.js");
const index$1 = require("./config-provider/index.js");
const index$B = require("./descriptions/index.js");
const index$4 = require("./date-picker/index.js");
const index$3 = require("./divider/index.js");
const index$h = require("./drawer/index.js");
const index$p = require("./dropdown/index.js");
const index$n = require("./empty/index.js");
const index$8 = require("./flex/index.js");
const index$E = require("./form/index.js");
const index$9 = require("./grid/index.js");
const index$a = require("./icon/index.js");
const index$t = require("./input/index.js");
const index$v = require("./input-number/index.js");
const index$q = require("./menu/index.js");
const index$f = require("./message/index.js");
const index$g = require("./modal/index.js");
const index$C = require("./pagination/index.js");
const index$k = require("./popconfirm/index.js");
const index$j = require("./popover/index.js");
const index$x = require("./radio/index.js");
const index$D = require("./select/index.js");
const index$m = require("./skeleton/index.js");
const index$2 = require("./space/index.js");
const index$l = require("./spin/index.js");
const index$s = require("./steps/index.js");
const index$y = require("./switch/index.js");
const index$z = require("./splitter/index.js");
const index$F = require("./table/index.js");
const index$c = require("./tag/index.js");
const index$r = require("./tabs/index.js");
const index$5 = require("./time-picker/index.js");
const index$u = require("./textarea/index.js");
const index$7 = require("./tree/index.js");
const index$i = require("./tooltip/index.js");
const index$b = require("./typography/index.js");
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
  index$b.Title,
  index$b.Text,
  index$b.Paragraph,
  index$b.Link,
  index$c.default,
  index$c.CheckableTag,
  index$c.TagGroup,
  index$d.default,
  index$d.BadgeRibbon,
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
  index$p.DropdownButton,
  index$q.default,
  index$r.default,
  index$s.default,
  index$t.default,
  index$u.default,
  index$v.default,
  index$w.default,
  index$w.CheckboxGroup,
  index$x.default,
  index$x.RadioGroup,
  index$y.default,
  index$z.default,
  index$z.SplitterPanel,
  index$A.default,
  index$A.CardGrid,
  index$A.CardMeta,
  index$B.default,
  index$C.default,
  index$D.default,
  index$E.default,
  index$E.FormItem,
  index$F.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$e.default;
exports.Badge = index$d.default;
exports.BadgeRibbon = index$d.BadgeRibbon;
exports.Breadcrumb = index$o.default;
exports.Button = index.default;
exports.Card = index$A.default;
exports.CardGrid = index$A.CardGrid;
exports.CardMeta = index$A.CardMeta;
exports.Checkbox = index$w.default;
exports.CheckboxGroup = index$w.CheckboxGroup;
exports.ConfigProvider = index$1.default;
exports.Descriptions = index$B.default;
exports.DatePicker = index$4.default;
exports.Divider = index$3.default;
exports.Drawer = index$h.default;
exports.ADropdownButton = index$p.DropdownButton;
exports.Dropdown = index$p.default;
exports.DropdownButton = index$p.DropdownButton;
exports.Empty = index$n.default;
exports.PRESENTED_IMAGE_DEFAULT = index$n.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$n.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$8.default;
exports.Form = index$E.default;
exports.FormItem = index$E.FormItem;
exports.Col = index$9.Col;
exports.Grid = index$9.default;
exports.Row = index$9.Row;
exports.Icon = index$a.default;
exports.Input = index$t.default;
exports.InputNumber = index$v.default;
exports.Menu = index$q.default;
exports.Message = index$f.default;
exports.Modal = index$g.default;
exports.Pagination = index$C.default;
exports.Popconfirm = index$k.default;
exports.Popover = index$j.default;
exports.Radio = index$x.default;
exports.RadioGroup = index$x.RadioGroup;
exports.Select = index$D.default;
exports.Skeleton = index$m.default;
exports.Space = index$2.default;
exports.Spin = index$l.default;
exports.Steps = index$s.default;
exports.Switch = index$y.default;
exports.Splitter = index$z.default;
exports.SplitterPanel = index$z.SplitterPanel;
exports.Table = index$F.default;
exports.CheckableTag = index$c.CheckableTag;
exports.Tag = index$c.default;
exports.TagGroup = index$c.TagGroup;
exports.Tabs = index$r.default;
exports.TimePicker = index$5.default;
exports.Textarea = index$u.default;
exports.Tree = index$7.default;
exports.Tooltip = index$i.default;
exports.Link = index$b.Link;
exports.Paragraph = index$b.Paragraph;
exports.Text = index$b.Text;
exports.Title = index$b.Title;
exports.Typography = index$b.default;
exports.Upload = index$6.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
