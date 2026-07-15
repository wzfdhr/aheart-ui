"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const index$g = require("./alert/index.js");
const index$f = require("./badge/index.js");
const index$q = require("./breadcrumb/index.js");
const index = require("./button/index.js");
const index$C = require("./card/index.js");
const index$1 = require("./cascader/index.js");
const index$y = require("./checkbox/index.js");
const index$2 = require("./config-provider/index.js");
const index$D = require("./descriptions/index.js");
const index$5 = require("./date-picker/index.js");
const index$4 = require("./divider/index.js");
const index$j = require("./drawer/index.js");
const index$r = require("./dropdown/index.js");
const index$p = require("./empty/index.js");
const index$a = require("./flex/index.js");
const index$G = require("./form/index.js");
const index$b = require("./grid/index.js");
const index$c = require("./icon/index.js");
const index$v = require("./input/index.js");
const index$x = require("./input-number/index.js");
const index$s = require("./menu/index.js");
const index$h = require("./message/index.js");
const index$i = require("./modal/index.js");
const index$E = require("./pagination/index.js");
const index$m = require("./popconfirm/index.js");
const index$l = require("./popover/index.js");
const index$z = require("./radio/index.js");
const index$F = require("./select/index.js");
const index$o = require("./skeleton/index.js");
const index$3 = require("./space/index.js");
const index$n = require("./spin/index.js");
const index$u = require("./steps/index.js");
const index$A = require("./switch/index.js");
const index$B = require("./splitter/index.js");
const index$H = require("./table/index.js");
const index$e = require("./tag/index.js");
const index$t = require("./tabs/index.js");
const index$6 = require("./time-picker/index.js");
const index$w = require("./textarea/index.js");
const index$8 = require("./tree/index.js");
const index$9 = require("./tree-select/index.js");
const index$k = require("./tooltip/index.js");
const index$d = require("./typography/index.js");
const index$7 = require("./upload/index.js");
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
  index$5.DateRangePicker,
  index$6.default,
  index$6.TimeRangePicker,
  index$7.default,
  index$8.default,
  index$9.default,
  index$a.default,
  index$b.default,
  index$c.default,
  index$d.default,
  index$d.Title,
  index$d.Text,
  index$d.Paragraph,
  index$d.Link,
  index$e.default,
  index$e.CheckableTag,
  index$e.TagGroup,
  index$f.default,
  index$f.BadgeRibbon,
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
  index$r.DropdownButton,
  index$s.default,
  index$t.default,
  index$u.default,
  index$v.default,
  index$w.default,
  index$x.default,
  index$y.default,
  index$y.CheckboxGroup,
  index$z.default,
  index$z.RadioGroup,
  index$A.default,
  index$B.default,
  index$B.SplitterPanel,
  index$C.default,
  index$C.CardGrid,
  index$C.CardMeta,
  index$D.default,
  index$E.default,
  index$F.default,
  index$G.default,
  index$G.FormItem,
  index$H.default
];
const AheartUI = {
  install(app) {
    components.forEach((component) => {
      app.use(component);
    });
  }
};
exports.Alert = index$g.default;
exports.Badge = index$f.default;
exports.BadgeRibbon = index$f.BadgeRibbon;
exports.Breadcrumb = index$q.default;
exports.Button = index.default;
exports.Card = index$C.default;
exports.CardGrid = index$C.CardGrid;
exports.CardMeta = index$C.CardMeta;
exports.Cascader = index$1.default;
exports.Checkbox = index$y.default;
exports.CheckboxGroup = index$y.CheckboxGroup;
exports.ConfigProvider = index$2.default;
exports.Descriptions = index$D.default;
exports.DatePicker = index$5.default;
exports.DateRangePicker = index$5.DateRangePicker;
exports.Divider = index$4.default;
exports.Drawer = index$j.default;
exports.ADropdownButton = index$r.DropdownButton;
exports.Dropdown = index$r.default;
exports.DropdownButton = index$r.DropdownButton;
exports.Empty = index$p.default;
exports.PRESENTED_IMAGE_DEFAULT = index$p.PRESENTED_IMAGE_DEFAULT;
exports.PRESENTED_IMAGE_SIMPLE = index$p.PRESENTED_IMAGE_SIMPLE;
exports.Flex = index$a.default;
exports.Form = index$G.default;
exports.FormItem = index$G.FormItem;
exports.Col = index$b.Col;
exports.Grid = index$b.default;
exports.Row = index$b.Row;
exports.Icon = index$c.default;
exports.Input = index$v.default;
exports.InputNumber = index$x.default;
exports.Menu = index$s.default;
exports.Message = index$h.default;
exports.Modal = index$i.default;
exports.Pagination = index$E.default;
exports.Popconfirm = index$m.default;
exports.Popover = index$l.default;
exports.Radio = index$z.default;
exports.RadioGroup = index$z.RadioGroup;
exports.Select = index$F.default;
exports.Skeleton = index$o.default;
exports.Space = index$3.default;
exports.Spin = index$n.default;
exports.Steps = index$u.default;
exports.Switch = index$A.default;
exports.Splitter = index$B.default;
exports.SplitterPanel = index$B.SplitterPanel;
exports.Table = index$H.default;
exports.CheckableTag = index$e.CheckableTag;
exports.Tag = index$e.default;
exports.TagGroup = index$e.TagGroup;
exports.Tabs = index$t.default;
exports.TimePicker = index$6.default;
exports.TimeRangePicker = index$6.TimeRangePicker;
exports.Textarea = index$w.default;
exports.Tree = index$8.default;
exports.TreeSelect = index$9.default;
exports.Tooltip = index$k.default;
exports.Link = index$d.Link;
exports.Paragraph = index$d.Paragraph;
exports.Text = index$d.Text;
exports.Title = index$d.Title;
exports.Typography = index$d.default;
exports.Upload = index$7.default;
exports.message = service.message;
exports.enUS = context.enUS;
exports.zhCN = context.zhCN;
exports.default = AheartUI;
